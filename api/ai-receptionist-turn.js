// api/ai-receptionist-turn.js
// Each conversation turn: speech → Claude → voice response
// Uses per-partner config + real booking data

export default async function handler(req, res) {
  const { SpeechResult, CallSid, From, Confidence } = req.body || {};
  const baseUrl      = 'https://nova-team-omega.vercel.app';
  const fbBase       = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth       = process.env.FIREBASE_DB_SECRET;
  const fbSuffix     = fbAuth ? `?auth=${fbAuth}` : '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  console.log('AI Turn:', { CallSid, speech: SpeechResult?.slice(0,50) });

  if (!SpeechResult?.trim()) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${baseUrl}/api/ai-receptionist-turn" method="POST"
    speechTimeout="3" language="en-US" timeout="10">
    <Say voice="Polly.Joanna">I'm sorry, I didn't catch that. Could you please repeat?</Say>
  </Gather>
  <Hangup/>
</Response>`);
  }

  // ── Load session (includes config) ──
  let session = { history:[], collectedInfo:{}, config:{}, from:From };
  try {
    const r = await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`);
    const d = await r.json();
    if (d) session = d;
  } catch(e) {}

  const cfg = session.config || {};
  const lang = cfg.language || 'en';
  const partnerId = cfg.partnerId;

  // ── Load real booking availability if partner connected ──
  let availabilityText = '';
  if (partnerId && cfg.collectBooking) {
    try {
      const r = await fetch(`${fbBase}/partners/${partnerId}/workspace.json${fbSuffix}`);
      const ws = await r.json();

      if (ws) {
        const today = new Date();
        const bookings = ws.bookings || [];
        const employees = (ws.employees || []).filter(e => e.role === 'cleaner' || e.role === 'Cleaner' || e.sections?.includes('schedule'));
        const schedule = ws.schedule || [];

        // Get next 7 days availability
        const slots = [];
        for (let i = 1; i <= 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          const dayName = date.toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'});
          const dayBookings = bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
          const availableCleaners = employees.length - dayBookings.length;

          if (availableCleaners > 0) {
            slots.push(`${dayName}: ${availableCleaners} cleaner${availableCleaners>1?'s':''} available`);
          }
        }

        if (slots.length > 0) {
          availabilityText = `\nAVAILABLE SLOTS (next 7 days):\n${slots.join('\n')}`;
        } else {
          availabilityText = '\nAVAILABILITY: Fully booked for next 7 days';
        }
      }
    } catch(e) {
      console.log('Booking data error:', e.message);
    }
  }

  // ── Build Claude system prompt ──
  const isRu = lang === 'ru';

  const systemPrompt = `You are an AI receptionist for ${cfg.companyName || 'a cleaning company'}. 
You answer phone calls when the team is unavailable.

COMPANY INFO:
- Company: ${cfg.companyName || 'Cleaning Company'}
- Services: ${cfg.services || 'Standard cleaning, Deep cleaning, Move-in/out'}
- Minimum price: $${cfg.minPrice || '120'}
- Service area: ${cfg.serviceArea || 'Local area'}
- Business hours: ${cfg.businessHours || 'Monday-Friday 9am-5pm'}
${availabilityText}
${cfg.customPrompt ? '\nSPECIAL INSTRUCTIONS:\n' + cfg.customPrompt : ''}

YOUR GOAL - collect this info step by step (ONE question at a time, keep answers SHORT for voice):
1. Intent: new booking / question about existing / pricing info
2. Service type: which cleaning service
3. Address or zip code
4. Preferred date (use real availability above if available)
5. Name + phone/email for confirmation

RULES:
- Keep responses to 1-2 SHORT sentences — this is a voice call
- Be warm, professional, helpful
- If they ask price: give the range (from $${cfg.minPrice || '120'}) and say final depends on home size
- If they want a human: say "I'll have our team call you back within 1 hour"
${cfg.transferPhone ? `- If urgent or they insist: say "Let me transfer you to our team" and include [TRANSFER] in your response` : ''}
- When you have name + address + service + date: say "Perfect, I'm creating your booking request now" and include [BOOKING:{"name":"...","address":"...","serviceType":"...","date":"...","intent":"new"}] at end
- Language: ${lang === 'ru' ? 'Respond in RUSSIAN' : lang === 'es' ? 'Respond in SPANISH' : 'Respond in ENGLISH'}
- NEVER make up availability — use the slots listed above

COLLECTED SO FAR: ${JSON.stringify(session.collectedInfo)}`;

  // Add user message
  session.history = session.history || [];
  session.history.push({ role: 'user', content: SpeechResult });

  let aiResponse = '';
  let bookingData = null;
  let shouldTransfer = false;

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 250,
        system: systemPrompt,
        messages: session.history.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    const claudeData = await claudeRes.json();
    aiResponse = claudeData.content?.[0]?.text || (isRu ? 'Извините, произошла ошибка.' : "I'm sorry, I had a technical issue.");

    // Extract booking data
    const bookingMatch = aiResponse.match(/\[BOOKING:(.*?)\]/s);
    if (bookingMatch) {
      try { bookingData = JSON.parse(bookingMatch[1]); } catch(e) {}
      aiResponse = aiResponse.replace(/\[BOOKING:.*?\]/s, '').trim();
    }

    // Check transfer
    if (aiResponse.includes('[TRANSFER]')) {
      shouldTransfer = true;
      aiResponse = aiResponse.replace('[TRANSFER]', '').trim();
    }
  } catch(e) {
    console.error('Claude error:', e.message);
    aiResponse = isRu ? 'Извините, технические проблемы. Пожалуйста, перезвоните.' : "Sorry, technical difficulties. Please call back.";
  }

  // Add AI response
  session.history.push({ role: 'assistant', content: aiResponse });

  // Save booking lead if collected
  if (bookingData) {
    session.collectedInfo = { ...session.collectedInfo, ...bookingData };
    session.status = 'booking_created';
    try {
      const leadId = 'ai_' + Date.now();
      await fetch(`${fbBase}/ai_leads/${leadId}.json${fbSuffix}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId, callSid: CallSid, phone: From,
          partnerId, source: 'AI Receptionist',
          ...bookingData, createdAt: new Date().toISOString(), status: 'new_lead',
        }),
      });

      // SMS confirmation
      if (cfg.confirmSms && From && bookingData.name) {
        const smsMsg = isRu
          ? `${bookingData.name}, спасибо за обращение в ${cfg.companyName}! Заявка принята. Наш менеджер свяжется с вами в течение часа для подтверждения. — ${cfg.companyName}`
          : `Hi ${bookingData.name}! Thanks for contacting ${cfg.companyName}. Your booking request is received. We'll call you within 1 hour to confirm. — ${cfg.companyName}`;

        await fetch(`${baseUrl}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: From, message: smsMsg, fromNumber: session.to }),
        }).catch(()=>{});
      }
    } catch(e) { console.log('Lead save error:', e.message); }
  }

  // Update session
  try {
    await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: session.history, collectedInfo: session.collectedInfo, status: session.status }),
    });
  } catch(e) {}

  const voice = lang === 'ru' ? 'Polly.Tatyana' : lang === 'es' ? 'Polly.Lupe' : 'Polly.Joanna';
  const langCode = lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-US' : 'en-US';
  const spoken = escapeXml(aiResponse);
  const shouldEnd = bookingData || shouldTransfer || session.history.length > 22;

  if (shouldTransfer && cfg.transferPhone) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="${langCode}">${spoken}</Say>
  <Dial callerId="${session.to}">${cfg.transferPhone}</Dial>
</Response>`);
  }

  if (shouldEnd) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="${langCode}">${spoken}</Say>
  <Say voice="${voice}">${isRu ? 'Хорошего дня! До свидания!' : 'Have a wonderful day! Goodbye!'}</Say>
  <Hangup/>
</Response>`);
  }

  const hints = isRu
    ? 'да, нет, адрес, имя, утром, днём, стандартная, генеральная, завтра, понедельник'
    : 'yes, no, address, name, morning, afternoon, standard, deep, tomorrow, Monday';

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${baseUrl}/api/ai-receptionist-turn" method="POST"
    speechTimeout="3" language="${langCode}" timeout="10" hints="${hints}">
    <Say voice="${voice}" language="${langCode}">${spoken}</Say>
  </Gather>
  <Say voice="${voice}">${isRu ? 'Не слышу ответа. Спасибо за звонок! До свидания.' : "I didn't hear a response. Thank you for calling. Goodbye!"}</Say>
  <Hangup/>
</Response>`);
}

function escapeXml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
