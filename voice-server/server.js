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

// ─── Audio conversion helpers ───────────────────────────────────────────────

// mulaw → 16-bit PCM linear
function mulawToLinear(u) {
  u = ~u & 0xFF;
  const sign     = u & 0x80;
  const exponent = (u >> 4) & 0x07;
  const mantissa = u & 0x0F;
  let sample = ((mantissa << 1) + 33) << (exponent + 2);
  return sign ? -sample : sample;
}

// 16-bit PCM linear → mulaw
function linearToMulaw(sample) {
  const BIAS = 33;
  let sign = 0;
  if (sample < 0) { sign = 0x80; sample = -sample; }
  if (sample > 32767) sample = 32767;
  sample += BIAS;
  let exp = 7;
  for (let mask = 0x4000; (sample & mask) === 0 && exp > 0; exp--, mask >>= 1) {}
  const mantissa = (sample >> (exp + 3)) & 0x0F;
  return (~(sign | (exp << 4) | mantissa)) & 0xFF;
}

// Twilio → ElevenLabs: mulaw 8kHz → PCM 16kHz (upsample 1:2)
function mulawToElevenLabs(base64Mulaw) {
  const src = Buffer.from(base64Mulaw, 'base64');
  const dst = Buffer.alloc(src.length * 4); // 8kHz mulaw → 16kHz 16-bit PCM = 4x bytes
  for (let i = 0; i < src.length; i++) {
    const pcm = mulawToLinear(src[i]);
    dst.writeInt16LE(pcm, i * 4);
    dst.writeInt16LE(pcm, i * 4 + 2); // duplicate sample for 8k→16k
  }
  return dst.toString('base64');
}

// ElevenLabs → Twilio: PCM 16kHz → mulaw 8kHz (downsample 2:1)
function elevenLabsToMulaw(base64Pcm) {
  const src = Buffer.from(base64Pcm, 'base64');
  const numSamples = Math.floor(src.length / 4); // 16-bit samples, take every other (16k→8k)
  const dst = Buffer.alloc(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const sample = src.readInt16LE(i * 4); // every other 16-bit sample
    dst[i] = linearToMulaw(sample);
  }
  return dst.toString('base64');
}

// ─── Server ─────────────────────────────────────────────────────────────────

fastify.get('/', async () => ({
  status: 'ok', service: 'Corex Voice Server', version: '3.5'
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
      if (d?.companyName) { cfg = { ...cfg, ...d }; console.log('Config loaded:', cfg.companyName); }
    }
  } catch(e) { console.log('Config error:', e.message); }

  global._calls = global._calls || {};
  global._calls[CallSid] = { cfg, From, To };

  res.header('Content-Type', 'text/xml');
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://nova-team-9gbc.onrender.com/media-stream">
      <Parameter name="callSid" value="${CallSid}"/>
    </Stream>
  </Connect>
</Response>`;
});

fastify.get('/media-stream', { websocket: true }, (connection, req) => {
  const ws = connection.socket;
  console.log('=== NEW TWILIO CONNECTION ===');

  let elWs         = null;
  let started      = false;
  let streamSid    = null;
  let callSid      = null;
  let pendingAudio = [];

  function connectElevenLabs(callData) {
    if (elWs) return;
    console.log('Connecting to ElevenLabs... API key:', EL_API_KEY ? '✅ set' : '❌ MISSING');

    const url = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
    const wsOptions = EL_API_KEY ? { headers: { 'xi-api-key': EL_API_KEY } } : {};
    elWs = new WebSocket(url, wsOptions);

    elWs.on('open', () => {
      console.log('ElevenLabs OPEN ✅');
      const cfg = callData?.cfg || {};

      // ✅ No audio format override — ElevenLabs uses PCM 16kHz by default
      // We convert both directions in this server
      elWs.send(JSON.stringify({
        type: 'conversation_initiation_client_data',
        dynamic_variables: {
          company_name:    cfg.companyName   || 'Natural Cleaning Experts',
          services:        cfg.services       || 'Standard cleaning, Deep cleaning',
          min_price:       cfg.minPrice       || '120',
          service_area:    cfg.serviceArea    || 'Austin TX and Miami FL',
          business_hours:  cfg.businessHours  || 'Mon-Fri 8am-6pm',
          available_slots: 'Contact us for availability',
          custom_notes:    cfg.customPrompt   || '',
        },
      }));

      // Send buffered caller audio (converted mulaw→PCM)
      console.log('Sending', pendingAudio.length, 'buffered audio packets');
      for (const chunk of pendingAudio) {
        const converted = mulawToElevenLabs(chunk);
        elWs.send(JSON.stringify({ user_audio_chunk: converted }));
      }
      pendingAudio = [];
    });

    elWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data);

        if (msg.type === 'audio') {
          // ElevenLabs sends PCM 16kHz → convert to mulaw 8kHz for Twilio
          const pcmBase64 = msg.audio_event?.audio_base_64
            || msg.audio?.chunk
            || (typeof msg.audio === 'string' ? msg.audio : null);

          if (pcmBase64 && ws.readyState === WebSocket.OPEN) {
            const mulawBase64 = elevenLabsToMulaw(pcmBase64);
            ws.send(JSON.stringify({ event: 'media', streamSid, media: { payload: mulawBase64 } }));
          }

        } else if (msg.type === 'ping') {
          elWs.send(JSON.stringify({ type: 'pong', event_id: msg.ping_event?.event_id }));

        } else if (msg.type === 'interruption') {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'clear', streamSid }));
          }

        } else if (msg.type === 'conversation_initiation_metadata') {
          console.log('EL conversation started ✅ id:', msg.conversation_initiation_metadata_event?.conversation_id);

        } else {
          console.log('EL:', msg.type);
        }

      } catch(e) { console.error('EL parse error:', e.message); }
    });

    elWs.on('error', (e) => console.error('EL error:', e.message));
    elWs.on('close', (code, reason) => {
      console.log(`EL closed: ${code} ${reason?.toString() || ''}`);
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
          started = true;
          callSid = callSid || 'unknown';
          console.log('No start event — initializing on first media');
          connectElevenLabs(null);
        }
        const payload = msg.media?.payload;
        if (payload) {
          if (elWs?.readyState === WebSocket.OPEN) {
            // Convert mulaw 8kHz → PCM 16kHz for ElevenLabs
            const converted = mulawToElevenLabs(payload);
            elWs.send(JSON.stringify({ user_audio_chunk: converted }));
          } else {
            // Buffer raw mulaw — will convert when ElevenLabs opens
            pendingAudio.push(payload);
            if (pendingAudio.length > 100) pendingAudio.shift();
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
    companyName:   'Natural Cleaning Experts',
    services:      'Standard cleaning, Deep cleaning, Move-in/out, Recurring',
    minPrice:      '120',
    serviceArea:   'Austin TX and Miami FL',
    businessHours: 'Monday-Friday 8am-6pm',
    customPrompt:  '',
    partnerId:     null,
  };
}

process.on('uncaughtException',  (e) => console.error('Uncaught:', e.message));
process.on('unhandledRejection', (e) => console.error('Rejection:', e?.message || e));

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`✅ Corex Voice Server v3.5 running on port ${PORT}`);
} catch(e) {
  console.error(e);
  process.exit(1);
}
