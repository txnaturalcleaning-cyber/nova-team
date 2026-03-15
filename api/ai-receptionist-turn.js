// api/ai-receptionist-turn.js
export default async function handler(req, res) {
  const { SpeechResult, CallSid, From } = req.body || {};
  const baseUrl      = 'https://nova-team-omega.vercel.app';
  const fbBase       = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth       = process.env.FIREBASE_DB_SECRET;
  const fbSuffix     = fbAuth ? `?auth=${fbAuth}` : '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  console.log('AI Turn received:', { CallSid, speech: SpeechResult?.slice(0,80), hasKey: !!anthropicKey });

  const turnUrl = `${baseUrl}/api/ai-receptionist-turn`;

  // No speech detected
  if (!SpeechResult?.trim()) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST" speechTimeout="3" language="en-US" timeout="10">
    <Say voice="Polly.Joanna">I am sorry, I did not catch that. Could you please repeat?</Say>
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
  } catch(e) { console.log('Session load error:', e.message); }

  const cfg   = session.config || {};
  const lang  = cfg.language || 'en';
  const isRu  = lang === 'ru';
  const v     = lang === 'ru' ? 'Polly.Tatyana' : lang === 'es' ? 'Polly.Lupe' : 'Polly.Joanna';
  const lc    = lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-US' : 'en-US';

  // Load booking slots if partner connected
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
          if (free > 0) slots.push(`${d.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'})}: ${free} available`);
        }
        if (slots.length) slotsText = '\nAVAILABLE: ' + slots.join(', ');
      }
    } catch(e) {}
  }

  // Build system prompt
  const systemPrompt = `You are an AI receptionist for ${cfg.companyName || 'a cleaning company'}.
Services: ${cfg.services || 'Standard cleaning, Deep cleaning, Move-in/out'}
Min price: $${cfg.minPrice || '120'} | Area: ${cfg.serviceArea || 'Local'} | Hours: ${cfg.businessHours || 'Mon-Fri 9am-5pm'}${slotsText}
${cfg.customPrompt ? 'NOTE: ' + cfg.customPrompt : ''}

Collect step by step (ONE question at a time, keep responses to 1-2 SHORT sentences for voice):
1. Intent (new booking / question / existing)
2. Service type
3. Address or zip
4. Date preference (use slots above if available)
5. Name + callback number

When you have name + address + service + date, say you are creating the request and add at the END:
[BOOKING:{"name":"X","address":"X","serviceType":"X","date":"X"}]

Rules:
- 1-2 sentences max per response — this is voice
- Language: ${isRu ? 'RESPOND IN RUSSIAN' : 'respond in English'}
- If caller wants human: say someone will call back within 1 hour
- Never invent availability

Collected so far: ${JSON.stringify(session.collectedInfo || {})}`;

  // Add user message
  session.history = (session.history || []).concat({ role: 'user', content: SpeechResult });

  let aiResponse = '';
  let bookingData = null;

  if (!anthropicKey) {
    console.error('ANTHROPIC_API_KEY is missing!');
    aiResponse = isRu
      ? 'Извините, у нас технические проблемы. Пожалуйста, перезвоните нам.'
      : 'I am sorry, we are experiencing technical difficulties. Please call us back.';
  } else {
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
          max_tokens: 200,
          system: systemPrompt,
          messages: session.history.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await r.json();
      console.log('Claude response status:', r.status, 'type:', data?.type, 'error:', data?.error?.message);

      if (data.error) {
        console.error('Claude API error:', JSON.stringify(data.error));
        aiResponse = isRu ? 'Извините, у нас технические проблемы.' : 'I am sorry, technical issue. Please try again.';
      } else {
        aiResponse = data.content?.[0]?.text || (isRu ? 'Извините, произошла ошибка.' : 'I am sorry, an error occurred.');
      }

      // Extract booking
      const m = aiResponse.match(/\[BOOKING:([\s\S]*?)\]/);
      if (m) {
        try { bookingData = JSON.parse(m[1]); } catch(e) {}
        aiResponse = aiResponse.replace(/\[BOOKING:[\s\S]*?\]/, '').trim();
      }
    } catch(e) {
      console.error('Fetch error:', e.message);
      aiResponse = isRu ? 'Извините, ошибка соединения.' : 'I am sorry, connection error. Please call back.';
    }
  }

  // Add AI response to history
  session.history.push({ role: 'assistant', content: aiResponse });

  // Save lead if booking collected
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
      // SMS confirmation
      if (cfg.confirmSms !== false && From && bookingData.name) {
        const msg = isRu
          ? `${bookingData.name}, спасибо! Ваша заявка принята. Мы свяжемся с вами в течение часа. — ${cfg.companyName}`
          : `Hi ${bookingData.name}! Your request is received. We will call you within 1 hour to confirm. — ${cfg.companyName}`;
        await fetch(`${baseUrl}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: From, message: msg, fromNumber: session.to }),
        }).catch(() => {});
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

  const spoken    = x(aiResponse);
  const shouldEnd = bookingData || session.history.length > 20;

  if (shouldEnd) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${v}" language="${lc}">${spoken}</Say>
  <Say voice="${v}">${isRu ? 'Хорошего дня! До свидания!' : 'Have a wonderful day! Goodbye!'}</Say>
  <Hangup/>
</Response>`);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="3" language="${lc}" timeout="10">
    <Say voice="${v}" language="${lc}">${spoken}</Say>
  </Gather>
  <Say voice="${v}">${isRu ? 'Не слышу ответа. Спасибо за звонок! До свидания.' : 'I did not hear a response. Thank you for calling. Goodbye!'}</Say>
  <Hangup/>
</Response>`);
}

function x(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
