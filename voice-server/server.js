// server.js — Railway WebSocket server for ElevenLabs + Twilio
// Handles real-time audio bridging between Twilio and ElevenLabs

import Fastify from 'fastify';
import FastifyWS from '@fastify/websocket';
import FastifyFormBody from '@fastify/formbody';
import WebSocket from 'ws';
import fetch from 'node-fetch';

const fastify = Fastify({ logger: true });
await fastify.register(FastifyFormBody);
await fastify.register(FastifyWS);

const PORT       = process.env.PORT || 3000;
const AGENT_ID   = process.env.ELEVENLABS_AGENT_ID || 'agent_2201kksb8516fgmvbecpydj82qcr';
const EL_API_KEY = process.env.ELEVENLABS_API_KEY;
const FB_BASE    = 'https://nova-launch-system-default-rtdb.firebaseio.com';
const FB_AUTH    = process.env.FIREBASE_DB_SECRET;
const FB_SUFFIX  = FB_AUTH ? `?auth=${FB_AUTH}` : '';

// ── Health check ──────────────────────────────────────────────
fastify.get('/', async (req, res) => {
  return { status: 'ok', service: 'Corex Voice Server', version: '1.0' };
});

// ── Twilio inbound webhook ────────────────────────────────────
// Called when browser doesn't answer (action from voice-twiml.js)
fastify.post('/elevenlabs-inbound', async (req, res) => {
  console.log('=== INBOUND REQUEST ===');
  console.log('Headers:', JSON.stringify(req.headers).slice(0,200));
  console.log('Body:', JSON.stringify(req.body).slice(0,300));
  
  const { To, From, CallSid, DialCallStatus } = req.body || {};
  console.log('Inbound call:', { CallSid, From, To, DialCallStatus });

  if (DialCallStatus === 'completed') {
    res.header('Content-Type', 'text/xml');
    return `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`;
  }

  // Load per-partner config
  let cfg = defaultCfg();
  try {
    const phoneKey = (To || '').replace(/[^0-9]/g, '');
    if (phoneKey) {
      const r = await fetch(`${FB_BASE}/ai_receptionist_config/${phoneKey}.json${FB_SUFFIX}`);
      const d = await r.json();
      if (d && d.companyName) {
        cfg = { ...cfg, ...d };
        console.log('Config loaded for:', cfg.companyName);
      }
    }
  } catch(e) { console.log('Config error:', e.message); }

  // Load booking slots
  let slots = await loadSlots(cfg);

  // Save session
  try {
    await fetch(`${FB_BASE}/ai_calls/${CallSid}.json${FB_SUFFIX}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callSid: CallSid, from: From, to: To,
        source: 'ElevenLabs', startedAt: new Date().toISOString(),
        status: 'active', config: cfg, history: [], collectedInfo: {},
      }),
    });
  } catch(e) {}

  // Get signed URL from ElevenLabs with dynamic variables
  let wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
  
  if (EL_API_KEY) {
    try {
      const r = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`, {
        headers: { 'xi-api-key': EL_API_KEY }
      });
      const d = await r.json();
      if (d.signed_url) wsUrl = d.signed_url;
    } catch(e) { console.log('Signed URL error:', e.message); }
  }

  // Build server URL for WebSocket
  const serverUrl = `wss://nova-team-9gbc.onrender.com`;

  // Store config for this call (WebSocket handler will read it)
  global._callConfigs = global._callConfigs || {};
  global._callConfigs[CallSid] = { cfg, slots, From, To };

  res.header('Content-Type', 'text/xml');
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${serverUrl}/media-stream">
      <Parameter name="call_sid" value="${CallSid}"/>
      <Parameter name="company_name" value="${escXml(cfg.companyName)}"/>
      <Parameter name="services" value="${escXml(cfg.services)}"/>
      <Parameter name="min_price" value="${escXml(cfg.minPrice)}"/>
      <Parameter name="service_area" value="${escXml(cfg.serviceArea)}"/>
      <Parameter name="business_hours" value="${escXml(cfg.businessHours)}"/>
      <Parameter name="available_slots" value="${escXml(slots)}"/>
      <Parameter name="custom_notes" value="${escXml(cfg.customPrompt||'')}"/>
    </Stream>
  </Connect>
</Response>`;
});

// ── WebSocket media stream ────────────────────────────────────
fastify.get('/media-stream', { websocket: true }, (connection, req) => {
  const twilioWs = connection.socket;
  console.log('Twilio WebSocket connected, readyState:', twilioWs.readyState);

  let elevenWs = null;
  let streamSid = null;
  let callSid   = null;
  let callCfg   = null;

  console.log('WebSocket readyState after connect:', twilioWs.readyState);
  
  twilioWs.on('message', async (data) => {
    try {
      console.log('RAW message received, length:', data?.length);
      const msg = JSON.parse(data);
      console.log('Twilio msg event:', msg.event, '| keys:', Object.keys(msg).join(','));

      switch (msg.event) {
        case 'connected': {
          console.log('Twilio stream connected, protocol:', msg.protocol);
          break;
        }
        case 'start': {
          streamSid = msg.start.streamSid;
          callSid   = msg.start.customParameters?.call_sid || msg.start.callSid;
          callCfg   = global._callConfigs?.[callSid] || {};

          console.log('Stream started:', { streamSid, callSid, company: callCfg?.cfg?.companyName });

          // Build dynamic variables for ElevenLabs
          const dynVars = {
            company_name:    callCfg?.cfg?.companyName    || 'Natural Cleaning Experts',
            services:        callCfg?.cfg?.services        || 'Standard cleaning, Deep cleaning',
            min_price:       callCfg?.cfg?.minPrice        || '120',
            service_area:    callCfg?.cfg?.serviceArea     || 'Austin TX and Miami FL',
            business_hours:  callCfg?.cfg?.businessHours   || 'Mon-Fri 8am-6pm',
            available_slots: callCfg?.slots                || 'Contact us for availability',
            custom_notes:    callCfg?.cfg?.customPrompt    || '',
          };

          // Connect to ElevenLabs
          console.log('EL_API_KEY present:', !!EL_API_KEY, '| AGENT_ID:', AGENT_ID?.slice(0,20));
          const elUrl = EL_API_KEY
            ? await getSignedUrl()
            : `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
          console.log('ElevenLabs URL:', elUrl.slice(0, 80));

          console.log('Connecting to ElevenLabs:', elUrl.slice(0, 80));
          elevenWs = new WebSocket(elUrl);

          elevenWs.on('open', () => {
            console.log('ElevenLabs connected ✅');
            // Send conversation init with dynamic variables
            elevenWs.send(JSON.stringify({
              type: 'conversation_initiation_client_data',
              dynamic_variables: dynVars,
            }));
          });

          elevenWs.on('message', (elData) => {
            try {
              const elMsg = JSON.parse(elData);

              if (elMsg.type === 'audio') {
                // Send audio back to Twilio
                if (twilioWs.readyState === WebSocket.OPEN) {
                  twilioWs.send(JSON.stringify({
                    event: 'media',
                    streamSid,
                    media: { payload: elMsg.audio?.chunk || elMsg.audio },
                  }));
                }
              } else if (elMsg.type === 'interruption') {
                // Clear Twilio audio buffer
                if (twilioWs.readyState === WebSocket.OPEN) {
                  twilioWs.send(JSON.stringify({ event: 'clear', streamSid }));
                }
              } else if (elMsg.type === 'agent_response') {
                console.log('Agent:', elMsg.agent_response_event?.agent_response?.slice(0, 80));
              } else if (elMsg.type === 'conversation_end' || elMsg.type === 'end_call') {
                console.log('ElevenLabs ended conversation');
                saveConversation(callSid, callCfg);
              }
            } catch(e) {}
          });

          elevenWs.on('error', (e) => console.error('ElevenLabs WS error:', e.message));
          elevenWs.on('close', () => {
            console.log('ElevenLabs WS closed');
            if (twilioWs.readyState === WebSocket.OPEN) twilioWs.close();
          });
          break;
        }

        case 'media': {
          // If start was missed, init ElevenLabs now
          if (!elevenWs) {
            streamSid = msg.streamSid || streamSid;
            callSid = callSid || msg.streamSid;
            console.log('Start missed! Initializing ElevenLabs on first media packet');
            // Twilio uses mulaw 8000Hz — must tell ElevenLabs
          const baseElUrl = EL_API_KEY
              ? await getSignedUrl()
              : `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
          const elUrl = baseElUrl.includes('?')
              ? baseElUrl + '&input_format=mulaw_8000&output_format=mulaw_8000'
              : baseElUrl + '?input_format=mulaw_8000&output_format=mulaw_8000';
            console.log('ElevenLabs URL:', elUrl.slice(0,100));
            elevenWs = new WebSocket(elUrl);
            const cfgData = global._callConfigs?.[callSid] || {};
            elevenWs.on('open', () => {
              console.log('ElevenLabs connected (fallback) ✅');
              elevenWs.send(JSON.stringify({
                type: 'conversation_initiation_client_data',
                dynamic_variables: {
                  company_name:    cfgData?.cfg?.companyName    || 'Natural Cleaning Experts',
                  services:        cfgData?.cfg?.services        || 'Standard cleaning, Deep cleaning',
                  min_price:       cfgData?.cfg?.minPrice        || '120',
                  service_area:    cfgData?.cfg?.serviceArea     || 'Austin TX and Miami FL',
                  business_hours:  cfgData?.cfg?.businessHours   || 'Mon-Fri 8am-6pm',
                  available_slots: cfgData?.slots                || 'Contact us for availability',
                  custom_notes:    cfgData?.cfg?.customPrompt    || '',
                },
              }));
            });
            elevenWs.on('message', (elData) => {
              try {
                const elMsg = JSON.parse(elData);
                console.log('EL msg type:', elMsg.type);
                
                if (elMsg.type === 'ping') {
                  // Must respond to ping or ElevenLabs closes with 1002
                  elevenWs.send(JSON.stringify({
                    type: 'pong',
                    event_id: elMsg.ping_event?.event_id,
                  }));
                } else if (elMsg.type === 'audio') {
                  const audioChunk = elMsg.audio?.chunk || elMsg.audio;
                  if (audioChunk && twilioWs.readyState === WebSocket.OPEN) {
                    twilioWs.send(JSON.stringify({
                      event: 'media',
                      streamSid,
                      media: { payload: audioChunk },
                    }));
                  }
                } else if (elMsg.type === 'interruption') {
                  if (twilioWs.readyState === WebSocket.OPEN) {
                    twilioWs.send(JSON.stringify({ event: 'clear', streamSid }));
                  }
                } else if (elMsg.type === 'conversation_initiation_metadata') {
                  console.log('ElevenLabs conversation started! ID:', elMsg.conversation_initiation_metadata_event?.conversation_id);
                }
              } catch(e) { console.error('EL message error:', e.message); }
            });
            elevenWs.on('error', (e) => console.error('ElevenLabs error:', e.message));
            elevenWs.on('close', (c) => console.log('ElevenLabs closed:', c));
          }
          // Forward caller audio to ElevenLabs
          if (elevenWs?.readyState === WebSocket.OPEN) {
            elevenWs.send(JSON.stringify({
              user_audio_chunk: msg.media.payload,
            }));
          }
          break;
        }

        case 'stop': {
          console.log('Stream stopped');
          if (elevenWs?.readyState === WebSocket.OPEN) elevenWs.close();
          saveConversation(callSid, callCfg);
          break;
        }
      }
    } catch(e) { console.error('Message error:', e.message); }
  });

  twilioWs.on('close', (code, reason) => {
    console.log('Twilio WS closed:', code, reason?.toString());
    if (elevenWs?.readyState === WebSocket.OPEN) elevenWs.close();
  });

  twilioWs.on('error', (e) => console.error('Twilio WS error:', e.message));
});

// ── ElevenLabs post-call webhook ──────────────────────────────
fastify.post('/elevenlabs-webhook', async (req, res) => {
  // Verify webhook signature
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (secret) {
    try {
      const { createHmac } = await import('crypto');
      const signature = req.headers['elevenlabs-signature'] || '';
      const timestamp = req.headers['elevenlabs-timestamp'] || '';
      const body      = JSON.stringify(req.body);
      const expected  = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
      if (!signature.includes(expected)) {
        fastify.log.warn('Invalid ElevenLabs webhook signature');
        return res.status(401).send({ error: 'Invalid signature' });
      }
    } catch(e) { fastify.log.error('Signature error:', e.message); }
  }

  const { conversation_id, call_duration_secs, transcript, data_collection, metadata } = req.body || {};

  console.log('Post-call webhook:', { conversation_id, duration: call_duration_secs });

  const callerPhone = metadata?.caller_id || '';
  const col         = data_collection || {};
  const name        = col.customer_name?.value || '';
  const address     = col.address?.value || '';
  const serviceType = col.service_type?.value || '';
  const date        = col.preferred_date?.value || '';

  const history = (transcript || []).map(t => ({
    role: t.role, content: t.message, ts: t.time_in_call_secs,
  }));

  try {
    const leadId = 'el_' + Date.now();
    await fetch(`${FB_BASE}/ai_leads/${leadId}.json${FB_SUFFIX}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: leadId, conversationId: conversation_id,
        source: 'ElevenLabs AI', phone: callerPhone,
        name, address, serviceType, preferredDate: date,
        duration: call_duration_secs || 0, transcript: history,
        createdAt: new Date().toISOString(),
        status: name && address ? 'qualified_lead' : 'new_lead',
      }),
    });
  } catch(e) { console.log('Lead save error:', e.message); }

  return { ok: true };
});

// ── Helpers ───────────────────────────────────────────────────
async function getSignedUrl() {
  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
      { headers: { 'xi-api-key': EL_API_KEY } }
    );
    const d = await r.json();
    return d.signed_url || `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
  } catch(e) {
    return `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
  }
}

async function loadSlots(cfg) {
  if (!cfg.partnerId) return 'Contact us for availability';
  try {
    const r  = await fetch(`${FB_BASE}/partners/${cfg.partnerId}/workspace.json${FB_SUFFIX}`);
    const ws = await r.json();
    if (!ws) return 'Contact us for availability';
    const today    = new Date();
    const bookings = ws.bookings || [];
    const emps     = (ws.employees||[]).filter(e=>['cleaner','Cleaner'].includes(e.role));
    const slots    = [];
    for (let i = 1; i <= 7; i++) {
      const d    = new Date(today); d.setDate(today.getDate()+i);
      const ds   = d.toISOString().split('T')[0];
      const busy = bookings.filter(b=>b.date===ds&&b.status!=='cancelled').length;
      const free = Math.max(0, emps.length - busy);
      if (free > 0) slots.push(
        `${d.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}: ${free} available`
      );
    }
    return slots.length ? slots.join(', ') : 'Fully booked this week';
  } catch(e) { return 'Contact us for availability'; }
}

async function saveConversation(callSid, callCfg) {
  if (!callSid) return;
  try {
    await fetch(`${FB_BASE}/ai_calls/${callSid}.json${FB_SUFFIX}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });
    if (global._callConfigs) delete global._callConfigs[callSid];
  } catch(e) {}
}

function defaultCfg() {
  return {
    companyName:   'Natural Cleaning Experts',
    services:      'Standard cleaning, Deep cleaning, Move-in/out, Recurring',
    minPrice:      '120',
    serviceArea:   'Austin TX and Miami FL',
    businessHours: 'Monday-Friday 8am-6pm, Saturday 9am-3pm',
    customPrompt:  '',
    partnerId:     null,
  };
}

function escXml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Process error handlers (prevent crashes) ─────────────────
process.on('uncaughtException', (e) => {
  console.error('Uncaught exception:', e.message);
});
process.on('unhandledRejection', (e) => {
  console.error('Unhandled rejection:', e?.message || e);
});

// ── Start server ──────────────────────────────────────────────
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`✅ Corex Voice Server running on port ${PORT}`);
} catch(e) {
  fastify.log.error(e);
  process.exit(1);
}
