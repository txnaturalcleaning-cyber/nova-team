import Fastify from 'fastify';
import FastifyWS from '@fastify/websocket';
import FastifyFormBody from '@fastify/formbody';
import WebSocket from 'ws';
import fetch from 'node-fetch';

const fastify = Fastify({ logger: false });
await fastify.register(FastifyFormBody);
await fastify.register(FastifyWS);

const PORT       = process.env.PORT || 3000;
const AGENT_ID   = process.env.ELEVENLABS_AGENT_ID || 'agent_2201kksb8516fgmvbecpydj82qcr';
const EL_API_KEY = process.env.ELEVENLABS_API_KEY;
const FB_BASE    = 'https://nova-launch-system-default-rtdb.firebaseio.com';
const FB_AUTH    = process.env.FIREBASE_DB_SECRET;
const FB_SUFFIX  = FB_AUTH ? `?auth=${FB_AUTH}` : '';

fastify.get('/', async () => ({
  status: 'ok', service: 'Corex Voice Server', version: '3.0'
}));

fastify.post('/elevenlabs-inbound', async (req, res) => {
  const { To, From, CallSid, DialCallStatus } = req.body || {};
  console.log('INBOUND:', { CallSid, From, To, DialCallStatus });

  if (DialCallStatus === 'completed') {
    res.header('Content-Type', 'text/xml');
    return `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`;
  }

  let cfg = defaultCfg();
  try {
    const key = (To || '').replace(/[^0-9]/g, '');
    if (key) {
      const r = await fetch(`${FB_BASE}/ai_receptionist_config/${key}.json${FB_SUFFIX}`);
      const d = await r.json();
      if (d?.companyName) { cfg = { ...cfg, ...d }; console.log('Config:', cfg.companyName); }
    }
  } catch(e) {}

  global._calls = global._calls || {};
  global._calls[CallSid] = { cfg, From, To };

  const wsUrl = `wss://nova-team-9gbc.onrender.com/media-stream`;

  res.header('Content-Type', 'text/xml');
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}">
      <Parameter name="callSid" value="${CallSid}"/>
    </Stream>
  </Connect>
</Response>`;
});

fastify.get('/media-stream', { websocket: true }, (connection, req) => {
  const ws = connection.socket;
  console.log('=== NEW TWILIO CONNECTION ===');

  let elWs       = null;
  let started    = false;
  let streamSid  = null;
  let callSid    = null;
  let pendingAudio = [];

  function connectElevenLabs(callData) {
    if (elWs) return;
    console.log('Connecting to ElevenLabs...');

    const url = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
    elWs = new WebSocket(url);

    elWs.on('open', () => {
      console.log('ElevenLabs OPEN ✅');
      const cfg = callData?.cfg || {};
      elWs.send(JSON.stringify({
        type: 'conversation_initiation_client_data',
        dynamic_variables: {
          company_name:    cfg.companyName    || 'Natural Cleaning Experts',
          services:        cfg.services        || 'Standard cleaning, Deep cleaning',
          min_price:       cfg.minPrice        || '120',
          service_area:    cfg.serviceArea     || 'Austin TX and Miami FL',
          business_hours:  cfg.businessHours   || 'Mon-Fri 8am-6pm',
          available_slots: 'Contact us for availability',
          custom_notes:    cfg.customPrompt    || '',
        },
      }));
      // Send any buffered audio
      console.log('Sending', pendingAudio.length, 'buffered audio packets');
      for (const chunk of pendingAudio) {
        elWs.send(JSON.stringify({ user_audio_chunk: chunk }));
      }
      pendingAudio = [];
    });

    elWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data);
        console.log('EL:', msg.type);
        if (msg.type === 'ping') {
          elWs.send(JSON.stringify({ type: 'pong', event_id: msg.ping_event?.event_id }));
        } else if (msg.type === 'audio') {
          const chunk = msg.audio?.chunk || msg.audio;
          if (chunk && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'media', streamSid, media: { payload: chunk } }));
          }
        } else if (msg.type === 'interruption') {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'clear', streamSid }));
          }
        }
      } catch(e) { console.error('EL parse error:', e.message); }
    });

    elWs.on('error', (e) => console.error('EL error:', e.message));
    elWs.on('close', (code) => {
      console.log('EL closed:', code);
      elWs = null;
    });
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.event === 'connected') {
        console.log('Twilio connected');
      } else if (msg.event === 'start') {
        console.log('Twilio START:', JSON.stringify(msg.start).slice(0, 200));
        streamSid = msg.start?.streamSid;
        callSid   = msg.start?.customParameters?.callSid || msg.start?.callSid;
        started   = true;
        const callData = global._calls?.[callSid];
        console.log('callSid:', callSid, '| callData:', !!callData);
        connectElevenLabs(callData);
      } else if (msg.event === 'media') {
        if (!streamSid) streamSid = msg.streamSid;
        if (!started) {
          // Start event not received — init on first media
          started = true;
          callSid = callSid || 'unknown';
          console.log('No start event — initializing on first media');
          connectElevenLabs(null);
        }
        const payload = msg.media?.payload;
        if (payload) {
          if (elWs?.readyState === WebSocket.OPEN) {
            elWs.send(JSON.stringify({ user_audio_chunk: payload }));
          } else {
            // Buffer audio until ElevenLabs connects
            pendingAudio.push(payload);
            if (pendingAudio.length > 100) pendingAudio.shift(); // keep last 100
          }
        }
      } else if (msg.event === 'stop') {
        console.log('Twilio STOP');
        if (elWs?.readyState === WebSocket.OPEN) elWs.close();
      }
    } catch(e) { console.error('WS parse error:', e.message); }
  });

  ws.on('close', (code) => {
    console.log('Twilio WS closed:', code);
    if (elWs?.readyState === WebSocket.OPEN) elWs.close();
  });

  ws.on('error', (e) => console.error('Twilio WS error:', e.message));
});

function defaultCfg() {
  return {
    companyName: 'Natural Cleaning Experts',
    services: 'Standard cleaning, Deep cleaning, Move-in/out, Recurring',
    minPrice: '120', serviceArea: 'Austin TX and Miami FL',
    businessHours: 'Monday-Friday 8am-6pm', customPrompt: '', partnerId: null,
  };
}

process.on('uncaughtException', (e) => console.error('Uncaught:', e.message));
process.on('unhandledRejection', (e) => console.error('Rejection:', e?.message || e));

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`✅ Corex Voice Server v3.0 running on port ${PORT}`);
} catch(e) {
  console.error(e);
  process.exit(1);
}
