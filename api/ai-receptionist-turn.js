// api/ai-receptionist-turn.js
export default async function handler(req, res) {
  const { SpeechResult, CallSid, From, CallStatus } = req.body || {};
  const baseUrl      = 'https://nova-team-omega.vercel.app';
  const fbBase       = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth       = process.env.FIREBASE_DB_SECRET;
  const fbSuffix     = fbAuth ? `?auth=${fbAuth}` : '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const turnUrl      = `${baseUrl}/api/ai-receptionist-turn`;

  console.log('AI Turn:', { CallSid, speech: SpeechResult?.slice(0,80) });

  // No speech
  if (!SpeechResult?.trim()) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="auto" language="en-US" timeout="10"
    enhanced="true" speechModel="phone_call">
    <Say voice="Polly.Joanna">I did not quite catch that. Could you please repeat?</Say>
  </Gather>
  <Hangup/>
</Response>`);
  }

  // Load session
  let session = { history: [], collectedInfo: {}, config: {}, from: From };
  try {
    const r = await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`);
    const d = await r.json();
    if (d && d.callSid) session = d;
  } catch(e) {}

  const cfg  = session.config || {};
  const lang = cfg.language || 'en';
  const isRu = lang === 'ru';
  const v    = lang === 'ru' ? 'Polly.Tatyana' : 'Polly.Joanna';
  const lc   = lang === 'ru' ? 'ru-RU' : 'en-US';

  // Ignore if speech looks like AI echo (very short or common filler)
  const echoWords = ['sorry', 'hello', 'hi', 'thank you', 'thanks', 'okay', 'ok', 'yes', 'goodbye'];
  const speechLower = SpeechResult.toLowerCase().trim();
  const isEcho = SpeechResult.trim().split(' ').length <= 3 &&
    echoWords.some(w => speechLower.includes(w)) &&
    session.history.length > 0 &&
    session.history[session.history.length - 1]?.role === 'assistant';

  if (isEcho) {
    console.log('Echo detected, ignoring:', SpeechResult);
    // Just re-ask the last question
    const lastAI = session.history.filter(h => h.role === 'assistant').pop();
    const spoken = x(lastAI?.content || (isRu ? 'Пожалуйста, повторите.' : 'Could you please say that again?'));
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="auto" language="${lc}" timeout="12"
    enhanced="true" speechModel="phone_call">
    <Say voice="${v}" language="${lc}">${spoken}</Say>
  </Gather>
  <Hangup/>
</Response>`);
  }

  // Load booking slots
  let slotsText = '';
  if (cfg.partnerId && cfg.collectBooking !== false) {
    try {
      const r = await fetch(`${fbBase}/partners/${cfg.partnerId}/workspace.json${fbSuffix}`);
      const ws = await r.json();
      if (ws) {
        const today    = new Date();
        const bookings = ws.bookings || [];
        const emps     = (ws.employees || []).filter(e => e.role === 'cleaner' || e.role === 'Cleaner');
        const slots    = [];
        for (let i = 1; i <= 7; i++) {
          const d  = new Date(today);
          d.setDate(today.getDate() + i);
          const ds   = d.toISOString().split('T')[0];
          const busy = bookings.filter(b => b.date === ds && b.status !== 'cancelled').length;
          const free = emps.length - busy;
          if (free > 0) slots.push(`${d.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'})}: ${free} open`);
        }
        if (slots.length) slotsText = '\nAVAILABLE SLOTS: ' + slots.join(' | ');
      }
    } catch(e) {}
  }

  // System prompt
  const systemPrompt = `You are a friendly, natural-sounding AI receptionist for ${cfg.companyName || 'a cleaning company'}.
You are on a PHONE CALL. Keep every response to ONE short sentence (max 15 words).
Be conversational, warm, and human — not robotic.

Company: ${cfg.companyName || 'cleaning company'}
Services: ${cfg.services || 'Standard, Deep, Move-in/out'}
Min price: $${cfg.minPrice || '120'}
Area: ${cfg.serviceArea || 'local area'}
Hours: ${cfg.businessHours || 'Mon-Fri 9am-5pm'}${slotsText}
${cfg.customPrompt ? 'NOTES: ' + cfg.customPrompt : ''}

YOUR GOAL: Collect name, address, service type, and preferred date.
Ask ONE thing at a time. When you have all 4, confirm and add [BOOKING:{"name":"X","address":"X","serviceType":"X","date":"X"}]

RULES:
- ONE sentence per response, max 15 words
- Sound human and warm, not like a robot
- ${isRu ? 'Speak Russian' : 'Speak English'}
- Never repeat what the caller just said

Already collected: ${JSON.stringify(session.collectedInfo || {})}`;

  // Add user message
  session.history = (session.history || []).concat({ role: 'user', content: SpeechResult });

  // Keep history short to avoid confusion (last 8 messages)
  if (session.history.length > 8) {
    session.history = session.history.slice(-8);
  }

  let aiResponse = '';
  let bookingData = null;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 100,
        system: systemPrompt,
        messages: session.history.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await r.json();
    console.log('Claude status:', r.status, 'error:', data?.error?.message || 'none');

    if (data.error) {
      aiResponse = isRu ? 'Секунду, уточню.' : 'One moment please.';
    } else {
      aiResponse = data.content?.[0]?.text || 'One moment please.';
    }

    // Extract booking
    const m = aiResponse.match(/\[BOOKING:([\s\S]*?)\]/);
    if (m) {
      try { bookingData = JSON.parse(m[1]); } catch(e) {}
      aiResponse = aiResponse.replace(/\[BOOKING:[\s\S]*?\]/, '').trim();
    }
  } catch(e) {
    console.error('Claude error:', e.message);
    aiResponse = isRu ? 'Секунду.' : 'One moment.';
  }

  session.history.push({ role: 'assistant', content: aiResponse });

  // Save booking lead
  if (bookingData) {
    session.collectedInfo = { ...session.collectedInfo, ...bookingData };
    session.status = 'booked';
    try {
      const leadId = 'ai_' + Date.now();
      await fetch(`${fbBase}/ai_leads/${leadId}.json${fbSuffix}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId, callSid: CallSid, phone: From,
          partnerId: cfg.partnerId, source: 'AI Receptionist',
          ...bookingData, createdAt: new Date().toISOString(), status: 'new_lead',
        }),
      });
      if (cfg.confirmSms !== false && From && bookingData.name) {
        const msg = isRu
          ? `${bookingData.name}, заявка принята! Перезвоним в течение часа. — ${cfg.companyName}`
          : `Hi ${bookingData.name}! Request received. We will call you within 1 hour. — ${cfg.companyName}`;
        await fetch(`${baseUrl}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: From, message: msg, fromNumber: session.to }),
        }).catch(() => {});
      }
    } catch(e) {}
  }

  // Update session
  try {
    await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: session.history,
        collectedInfo: session.collectedInfo,
        status: session.status
      }),
    });
  } catch(e) {}

  const spoken    = x(aiResponse);
  const shouldEnd = bookingData || session.history.length > 16;

  if (shouldEnd) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${v}" language="${lc}">${spoken}</Say>
  <Pause length="1"/>
  <Say voice="${v}">${isRu ? 'Хорошего дня!' : 'Have a great day! Goodbye!'}</Say>
  <Hangup/>
</Response>`);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="auto" language="${lc}" timeout="12"
    enhanced="true" speechModel="phone_call">
    <Say voice="${v}" language="${lc}">${spoken}</Say>
  </Gather>
  <Say voice="${v}">${isRu ? 'Спасибо за звонок. До свидания!' : 'Thank you for calling. Goodbye!'}</Say>
  <Hangup/>
</Response>`);
}

function x(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
