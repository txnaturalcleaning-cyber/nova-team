// api/elevenlabs-inbound.js
// Twilio Phone Number webhook → this endpoint
// Connects inbound call to ElevenLabs agent via WebSocket stream

export default async function handler(req, res) {
  const { To, From, CallSid } = req.body || {};
  const baseUrl    = 'https://nova-team-omega.vercel.app';
  const agentId    = process.env.ELEVENLABS_AGENT_ID || 'agent_2201kksb8516fgmvbecpydj82qcr';
  const fbBase     = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth     = process.env.FIREBASE_DB_SECRET;
  const fbSuffix   = fbAuth ? `?auth=${fbAuth}` : '';

  console.log('ElevenLabs inbound:', { CallSid, From, To });

  // Load per-partner config by called number
  let cfg = {
    companyName:   'Natural Cleaning Experts',
    services:      'Standard cleaning, Deep cleaning, Move-in/out, Recurring',
    minPrice:      '120',
    serviceArea:   'Austin TX and Miami FL',
    businessHours: 'Monday-Friday 8am-6pm, Saturday 9am-3pm',
    customPrompt:  '',
    partnerId:     null,
  };

  try {
    const phoneKey = (To || '').replace(/[^0-9]/g, '');
    if (phoneKey) {
      const r = await fetch(`${fbBase}/ai_receptionist_config/${phoneKey}.json${fbSuffix}`);
      const d = await r.json();
      if (d && d.companyName) {
        cfg = { ...cfg, ...d };
        console.log('Config loaded for:', cfg.companyName);
      }
    }
  } catch(e) { console.log('Config load error:', e.message); }

  // Load booking slots
  let availableSlots = 'No schedule data available';
  if (cfg.partnerId) {
    try {
      const r  = await fetch(`${fbBase}/partners/${cfg.partnerId}/workspace.json${fbSuffix}`);
      const ws = await r.json();
      if (ws) {
        const today    = new Date();
        const bookings = ws.bookings || [];
        const emps     = (ws.employees || []).filter(e => ['cleaner','Cleaner'].includes(e.role));
        const slots    = [];
        for (let i = 1; i <= 7; i++) {
          const d    = new Date(today); d.setDate(today.getDate() + i);
          const ds   = d.toISOString().split('T')[0];
          const busy = bookings.filter(b => b.date === ds && b.status !== 'cancelled').length;
          const free = Math.max(0, emps.length - busy);
          if (free > 0) slots.push(
            `${d.toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric'})}: ${free} cleaner${free>1?'s':''} available`
          );
        }
        availableSlots = slots.length ? slots.join(', ') : 'Fully booked this week, can offer next week';
      }
    } catch(e) {}
  }

  // Save call session to Firebase for later tracking
  try {
    await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callSid: CallSid, from: From, to: To,
        source: 'ElevenLabs',
        startedAt: new Date().toISOString(),
        status: 'active',
        config: cfg,
        history: [],
        collectedInfo: {},
      }),
    });
  } catch(e) {}

  // Build dynamic variables for ElevenLabs agent
  // These replace {{variable}} placeholders in the agent's system prompt
  const dynamicVars = {
    company_name:    cfg.companyName,
    services:        cfg.services,
    min_price:       cfg.minPrice,
    service_area:    cfg.serviceArea,
    business_hours:  cfg.businessHours,
    custom_notes:    cfg.customPrompt || 'No special notes',
    available_slots: availableSlots,
  };

  // TwiML: Connect call to ElevenLabs via WebSocket stream
  // Pass dynamic variables as custom parameters
  const customParams = Object.entries(dynamicVars)
    .map(([k, v]) => `<Parameter name="${k}" value="${escXml(String(v))}"/>`)
    .join('\n    ');

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://api.elevenlabs.io/v1/convai/twilio?agent_id=${agentId}">
    ${customParams}
    </Stream>
  </Connect>
</Response>`);
}

function escXml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
