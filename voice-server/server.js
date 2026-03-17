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
const VERCEL_URL = 'https://nova-team-omega.vercel.app';

// ─── Audio conversion ────────────────────────────────────────────────────────

function mulawToLinear(u) {
  u = ~u & 0xFF;
  const sign = u & 0x80;
  const exp  = (u >> 4) & 0x07;
  const mant = u & 0x0F;
  let s = ((mant << 1) + 33) << (exp + 2);
  return sign ? -s : s;
}

function linearToMulaw(sample) {
  const BIAS = 33;
  let sign = 0;
  if (sample < 0) { sign = 0x80; sample = -sample; }
  if (sample > 32767) sample = 32767;
  sample += BIAS;
  let exp = 7;
  for (let mask = 0x4000; (sample & mask) === 0 && exp > 0; exp--, mask >>= 1) {}
  const mant = (sample >> (exp + 3)) & 0x0F;
  return (~(sign | (exp << 4) | mant)) & 0xFF;
}

function mulawToPcm16(base64Mulaw) {
  const src = Buffer.from(base64Mulaw, 'base64');
  const dst = Buffer.alloc(src.length * 4);
  for (let i = 0; i < src.length; i++) {
    const pcm = mulawToLinear(src[i]);
    dst.writeInt16LE(pcm, i * 4);
    dst.writeInt16LE(pcm, i * 4 + 2);
  }
  return dst.toString('base64');
}

function pcm16ToMulaw(base64Pcm) {
  const src = Buffer.from(base64Pcm, 'base64');
  const n   = Math.floor(src.length / 4);
  const dst = Buffer.alloc(n);
  for (let i = 0; i < n; i++) {
    dst[i] = linearToMulaw(src.readInt16LE(i * 4));
  }
  return dst.toString('base64');
}

// ─── Business hours check ────────────────────────────────────────────────────
// Parses "Monday-Friday 8am-6pm, Saturday 9am-3pm" style strings

function isWithinBusinessHours(businessHoursStr) {
  if (!businessHoursStr) return true; // no config = always open
  try {
    const now     = new Date();
    const dayIdx  = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
    const curMins = now.getHours() * 60 + now.getMinutes();

    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const curDay   = dayNames[dayIdx];

    const parts = businessHoursStr.toLowerCase().split(',');
    for (const part of parts) {
      const m = part.trim().match(/([a-z]+)(?:-([a-z]+))?\s+(\d+(?::\d+)?)(am|pm)?-(\d+(?::\d+)?)(am|pm)?/);
      if (!m) continue;
      const [, d1, d2, h1, ap1, h2, ap2] = m;
      const i1 = dayNames.indexOf(d1);
      const i2 = d2 ? dayNames.indexOf(d2) : i1;
      if (i1 < 0) continue;

      // Check if today is in range
      const inRange = i1 <= i2
        ? (dayIdx >= i1 && dayIdx <= i2)
        : (dayIdx >= i1 || dayIdx <= i2); // wraps around week
      if (!inRange) continue;

      // Parse hours
      const parseTime = (h, ap) => {
        let [hh, mm] = h.split(':').map(Number);
        mm = mm || 0;
        if (ap === 'pm' && hh !== 12) hh += 12;
        if (ap === 'am' && hh === 12) hh = 0;
        return hh * 60 + mm;
      };

      const start = parseTime(h1, ap1 || (parseInt(h1) < 8 ? 'pm' : 'am'));
      const end   = parseTime(h2, ap2 || 'pm');
      if (curMins >= start && curMins < end) return true;
    }
    return false;
  } catch(e) {
    console.log('Hours parse error:', e.message);
    return true; // on error assume open
  }
}

// ─── Twilio call redirect ────────────────────────────────────────────────────

async function redirectCallToHuman(callSid, toPhone, fromPhone, accountSid, authToken) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Please hold, connecting you to an agent.</Say>
  <Dial callerId="${fromPhone}">${toPhone}</Dial>
</Response>`;

  // Save TwiML to Vercel endpoint, then redirect call
  const auth = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const url   = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls/${callSid}.json`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      Twiml: twiml,
    }).toString(),
  });
  const d = await r.json();
  console.log('Twilio redirect:', r.status, d.status || d.message);
  return r.ok;
}

// ─── Save AI booking to Firebase ─────────────────────────────────────────────

async function saveAiBooking({ partnerId, name, phone, address, serviceType, date, notes, callSid }) {
  try {
    const bookingId = 'ai_' + Date.now();
    const booking = {
      id:          bookingId,
      callSid,
      clientName:  name || '',
      phone:       phone || '',
      address:     address || '',
      serviceType: serviceType || 'Cleaning',
      date:        date || '',
      notes:       notes || '',
      status:      'pending_confirmation',
      source:      'AI Receptionist',
      aiGenerated: true,
      color:       'pink',          // ← calendar renders this bright pink
      createdAt:   new Date().toISOString(),
    };

    // Save to partner workspace bookings
    if (partnerId) {
      await fetch(`${FB_BASE}/partners/${partnerId}/workspace/bookings/${bookingId}.json${FB_SUFFIX}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
    }

    // Also save to ai_leads for the leads panel
    await fetch(`${FB_BASE}/ai_leads/${bookingId}.json${FB_SUFFIX}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...booking, status: 'new_lead' }),
    });

    console.log('AI booking saved:', bookingId, 'partner:', partnerId);
    return bookingId;
  } catch(e) {
    console.error('Save booking error:', e.message);
    return null;
  }
}

// ─── Server ──────────────────────────────────────────────────────────────────

fastify.get('/', async () => ({
  status: 'ok', service: 'Corex Voice Server', version: '4.0'
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

  // Check if currently within business hours
  const isOpen = isWithinBusinessHours(cfg.businessHours);
  console.log('Business hours open:', isOpen, '|', cfg.businessHours);

  global._calls = global._calls || {};
  global._calls[CallSid] = { cfg, From, To, isOpen };

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
  let callData     = null;
  let pendingAudio = [];

  function connectElevenLabs(data) {
    if (elWs) return;
    callData = data;
    console.log('Connecting to ElevenLabs... API key:', EL_API_KEY ? '✅ set' : '❌ MISSING');

    const url = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;
    const wsOptions = EL_API_KEY ? { headers: { 'xi-api-key': EL_API_KEY } } : {};
    elWs = new WebSocket(url, wsOptions);

    elWs.on('open', () => {
      console.log('ElevenLabs OPEN ✅');
      const cfg    = data?.cfg || {};
      const isOpen = data?.isOpen !== false;

      const systemContext = [
        `You are Clara, a warm AI receptionist for ${cfg.companyName || 'Natural Cleaning Experts'}.`,
        `Services: ${cfg.services || 'Standard, Deep, Move-in/out, Recurring cleaning'}`,
        `Prices from: $${cfg.minPrice || '120'}`,
        `Service area: ${cfg.serviceArea || 'Austin TX and Miami FL'}`,
        `Business hours: ${cfg.businessHours || 'Monday-Friday 8am-6pm'}`,
        cfg.customPrompt ? `Special instructions: ${cfg.customPrompt}` : '',
        isOpen
          ? 'Operators are currently AVAILABLE. If caller wants to speak with a human, use transfer_to_human tool.'
          : 'It is currently OUTSIDE business hours. Operators are NOT available. If caller wants human, apologize and offer to take their booking instead.',
        'When you have name, address, service type, and preferred date — use create_booking tool.',
        'Be warm, concise, natural. Max 1-2 sentences per response.',
      ].filter(Boolean).join('\n');

      elWs.send(JSON.stringify({
        type: 'conversation_initiation_client_data',
        dynamic_variables: {
          company_name:    cfg.companyName   || 'Natural Cleaning Experts',
          services:        cfg.services       || 'Standard cleaning, Deep cleaning',
          min_price:       String(cfg.minPrice || '120'),
          service_area:    cfg.serviceArea    || 'Austin TX and Miami FL',
          business_hours:  cfg.businessHours  || 'Mon-Fri 8am-6pm',
          transfer_phone:  cfg.transferPhone  || '',
          is_open:         isOpen ? 'yes' : 'no',
          custom_notes:    cfg.customPrompt   || '',
          system_context:  systemContext,
        },
      }));

      console.log('Sending', pendingAudio.length, 'buffered audio packets');
      for (const chunk of pendingAudio) {
        elWs.send(JSON.stringify({ user_audio_chunk: mulawToPcm16(chunk) }));
      }
      pendingAudio = [];
    });

    elWs.on('message', async (rawData) => {
      try {
        const msg = JSON.parse(rawData);

        // ── Audio: PCM 16kHz → mulaw 8kHz → Twilio ──
        if (msg.type === 'audio') {
          const pcm = msg.audio_event?.audio_base_64
            || msg.audio?.chunk
            || (typeof msg.audio === 'string' ? msg.audio : null);
          if (pcm && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'media', streamSid, media: { payload: pcm16ToMulaw(pcm) } }));
          }

        // ── Tool call: transfer_to_human ──
        } else if (msg.type === 'client_tool_call' && msg.client_tool_call?.tool_name === 'transfer_to_human') {
          const cfg    = callData?.cfg || {};
          const isOpen = callData?.isOpen !== false;
          console.log('Tool: transfer_to_human | open:', isOpen, '| phone:', cfg.transferPhone);

          let result;
          if (isOpen && cfg.transferPhone) {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken  = process.env.TWILIO_AUTH_TOKEN;
            const ok = await redirectCallToHuman(callSid, cfg.transferPhone, callData?.From || '', accountSid, authToken);
            result = ok
              ? { success: true,  message: 'Transferring now' }
              : { success: false, message: 'Transfer failed, please try again' };
          } else if (!isOpen) {
            result = { success: false, message: 'Outside business hours — offer to take booking' };
          } else {
            result = { success: false, message: 'No transfer number configured' };
          }

          elWs.send(JSON.stringify({
            type:            'client_tool_result',
            tool_call_id:    msg.client_tool_call?.tool_call_id,
            result:          JSON.stringify(result),
            is_error:        !result.success,
          }));

        // ── Tool call: create_booking ──
        } else if (msg.type === 'client_tool_call' && msg.client_tool_call?.tool_name === 'create_booking') {
          const params = msg.client_tool_call?.parameters || {};
          const cfg    = callData?.cfg || {};
          console.log('Tool: create_booking |', params);

          const bookingId = await saveAiBooking({
            partnerId:   cfg.partnerId,
            name:        params.name,
            phone:       callData?.From,
            address:     params.address,
            serviceType: params.service_type,
            date:        params.preferred_date,
            notes:       params.notes || '',
            callSid,
          });

          // Send SMS confirmation
          if (callData?.From && params.name) {
            fetch(`${VERCEL_URL}/api/send-sms`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to:      callData.From,
                message: `Hi ${params.name}! Your ${params.service_type || 'cleaning'} request at ${params.address || 'your location'} on ${params.preferred_date || 'your preferred date'} is received. Our manager will call you to confirm details. — ${cfg.companyName}`,
                fromNumber: callData.To,
              }),
            }).catch(() => {});
          }

          elWs.send(JSON.stringify({
            type:         'client_tool_result',
            tool_call_id: msg.client_tool_call?.tool_call_id,
            result:       JSON.stringify({ success: !!bookingId, booking_id: bookingId }),
            is_error:     !bookingId,
          }));

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
        const cd  = global._calls?.[callSid];
        console.log('callSid:', callSid, '| callData:', !!cd);
        connectElevenLabs(cd);

      } else if (msg.event === 'media') {
        if (!streamSid) streamSid = msg.streamSid;
        if (!started) {
          started = true;
          callSid = callSid || 'unknown';
          connectElevenLabs(null);
        }
        const payload = msg.media?.payload;
        if (payload) {
          if (elWs?.readyState === WebSocket.OPEN) {
            elWs.send(JSON.stringify({ user_audio_chunk: mulawToPcm16(payload) }));
          } else {
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
    businessHours: 'Monday-Friday 8am-6pm, Saturday 9am-3pm',
    transferPhone: '',
    customPrompt:  '',
    partnerId:     null,
  };
}

process.on('uncaughtException',  (e) => console.error('Uncaught:', e.message));
process.on('unhandledRejection', (e) => console.error('Rejection:', e?.message || e));

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`✅ Corex Voice Server v4.0 running on port ${PORT}`);
} catch(e) {
  console.error(e);
  process.exit(1);
}
