// api/ai-receptionist-turn.js
export default async function handler(req, res) {
  const { SpeechResult, CallSid, From } = req.body || {};
  const baseUrl  = 'https://nova-team-omega.vercel.app';
  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';
  const apiKey   = process.env.ANTHROPIC_API_KEY;
  const turnUrl  = `${baseUrl}/api/ai-receptionist-turn`;

  console.log('Turn:', { CallSid, speech: SpeechResult?.slice(0, 70) });

  // No speech
  if (!SpeechResult?.trim()) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="auto" language="en-US" timeout="10" enhanced="true" speechModel="phone_call">
    <Say voice="Polly.Joanna">Sorry, could you repeat that?</Say>
  </Gather><Hangup/>
</Response>`);
  }

  // Load session
  let session = { history: [], collectedInfo: {}, config: {}, from: From, to: '' };
  try {
    const r = await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`);
    const d = await r.json();
    if (d && d.callSid) session = { ...session, ...d };
  } catch(e) { console.log('Session load error:', e.message); }

  const cfg  = session.config || {};
  const isRu = (cfg.language || 'en') === 'ru';
  const v    = isRu ? 'Polly.Tatyana' : 'Polly.Joanna';
  const lang = isRu ? 'ru-RU' : 'en-US';

  // Load booking slots
  let slotsText = '';
  if (cfg.partnerId && cfg.collectBooking !== false) {
    try {
      const r  = await fetch(`${fbBase}/partners/${cfg.partnerId}/workspace.json${fbSuffix}`);
      const ws = await r.json();
      if (ws) {
        const today    = new Date();
        const bookings = ws.bookings || [];
        const emps     = (ws.employees || []).filter(e => ['cleaner','Cleaner'].includes(e.role));
        const slots    = [];
        for (let i = 1; i <= 7; i++) {
          const d  = new Date(today); d.setDate(today.getDate() + i);
          const ds = d.toISOString().split('T')[0];
          const busy = bookings.filter(b => b.date === ds && b.status !== 'cancelled').length;
          const free = Math.max(0, emps.length - busy);
          if (free > 0) slots.push(
            `${d.toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'})}: ${free} open`
          );
        }
        slotsText = slots.length
          ? '\n\nAVAILABLE THIS WEEK:\n' + slots.join('\n')
          : '\n\nSchedule: Fully booked this week, offer next week';
      }
    } catch(e) { console.log('Slots error:', e.message); }
  }

  // Build what we know / still need
  const info     = session.collectedInfo || {};
  const known    = Object.entries({
    'name':    info.name,
    'address': info.address,
    'service': info.serviceType,
    'date':    info.date,
  }).filter(([,v]) => v).map(([k,v]) => `${k}="${v}"`).join(', ');
  const stillNeed = [
    !info.name        && 'name',
    !info.address     && 'address or zip',
    !info.serviceType && 'service type',
    !info.date        && 'preferred date',
  ].filter(Boolean);

  // System prompt
  const systemPrompt = `You are Clara, a warm receptionist at ${cfg.companyName || 'Natural Cleaning Experts'}.
This is a real phone call. Be natural, friendly, concise — like a real human.

COMPANY:
- Services: ${cfg.services || 'Standard, Deep cleaning, Move-in/out, Recurring'}
- Price from: $${cfg.minPrice || '120'}
- Service area: ${cfg.serviceArea || 'Austin TX and Miami FL'}
- Hours: ${cfg.businessHours || 'Mon-Fri 8am-6pm, Sat 9am-3pm'}
${cfg.customPrompt ? '- Note: ' + cfg.customPrompt : ''}${slotsText}

ALREADY COLLECTED: ${known || 'nothing yet'}
STILL NEED: ${stillNeed.length ? stillNeed.join(', ') : '✅ All info collected — confirm and create booking!'}

RULES:
- MAX 1 short sentence per response (10-15 words)
- NEVER re-greet, NEVER say "Hello" or "Hi" again — you already greeted them
- NEVER re-ask what you already know (see ALREADY COLLECTED above)
- Ask ONLY the next missing piece from STILL NEED
- Use real schedule above when suggesting dates
- Sound warm and human — contractions, casual
- ${isRu ? 'Speak Russian' : 'Speak English'}

When you have ALL 4 pieces → confirm warmly in one sentence, then on a NEW LINE add:
[BOOKING:{"name":"X","address":"X","serviceType":"X","date":"X"}]`;

  // Add user turn — keep last 12 messages
  const history = [...(session.history || []).slice(-12), { role: 'user', content: SpeechResult }];

  // Update collectedInfo from user speech
  extractInfo(info, SpeechResult);

  let aiText = '';
  let bookingData = null;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system:     systemPrompt,
        messages:   history.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await r.json();
    console.log('Claude:', r.status, data?.error?.message || 'ok');

    aiText = data.error
      ? (isRu ? 'Одну секунду.' : 'One moment.')
      : (data.content?.[0]?.text || '');

    // Extract booking marker
    const bm = aiText.match(/\[BOOKING:([\s\S]*?)\]/);
    if (bm) {
      try { bookingData = JSON.parse(bm[1]); } catch(e) {}
      aiText = aiText.replace(/\[BOOKING:[\s\S]*?\]/, '').trim();
    }
  } catch(e) {
    console.error('Claude error:', e.message);
    aiText = isRu ? 'Секунду.' : 'One moment.';
  }

  // Update history
  history.push({ role: 'assistant', content: aiText });
  if (bookingData) {
    session.collectedInfo = { ...info, ...bookingData };
    session.status = 'booked';
  } else {
    session.collectedInfo = info;
  }

  // Save lead if booking complete
  if (bookingData) {
    try {
      const leadId = 'ai_' + Date.now();
      await fetch(`${fbBase}/ai_leads/${leadId}.json${fbSuffix}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId, callSid: CallSid, phone: From,
          partnerId: cfg.partnerId || null,
          source: 'AI Receptionist',
          name:        bookingData.name || '',
          address:     bookingData.address || '',
          serviceType: bookingData.serviceType || '',
          preferredDate: bookingData.date || '',
          createdAt: new Date().toISOString(),
          status: 'new_lead',
        }),
      });
      // SMS confirmation
      if (cfg.confirmSms !== false && From && bookingData.name) {
        const msg = isRu
          ? `${bookingData.name}, заявка принята! Перезвоним в течение часа. — ${cfg.companyName}`
          : `Hi ${bookingData.name}! Your request for ${bookingData.serviceType || 'cleaning'} at ${bookingData.address || 'your location'} is received. We will confirm within 1 hour! — ${cfg.companyName || 'Natural Cleaning Experts'}`;
        fetch(`${baseUrl}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: From, message: msg, fromNumber: session.to }),
        }).catch(() => {});
      }
    } catch(e) { console.log('Lead error:', e.message); }
  }

  // Save session
  try {
    await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: history.slice(-14),
        collectedInfo: session.collectedInfo,
        status: session.status || 'active',
        config: cfg,
      }),
    });
  } catch(e) {}

  const spoken    = x(aiText);
  const shouldEnd = !!bookingData || history.length > 20;

  if (shouldEnd) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${v}" language="${lang}">${spoken}</Say>
  <Pause length="1"/>
  <Say voice="${v}">${x(isRu ? 'Хорошего дня!' : 'Have a great day! Goodbye!')}</Say>
  <Hangup/>
</Response>`);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="auto" language="${lang}" timeout="12"
    enhanced="true" speechModel="phone_call">
    <Say voice="${v}" language="${lang}">${spoken}</Say>
  </Gather>
  <Say voice="${v}">${x(isRu ? 'Спасибо за звонок! До свидания.' : 'Thanks for calling! Goodbye.')}</Say>
  <Hangup/>
</Response>`);
}

// Extract info from user speech automatically
function extractInfo(info, speech) {
  const u = (speech || '').toLowerCase();
  if (!info.serviceType) {
    if (u.includes('deep'))                              info.serviceType = 'Deep cleaning';
    else if (u.includes('move') || u.includes('moving')) info.serviceType = 'Move-in/out';
    else if (u.includes('recurring') || u.includes('weekly') || u.includes('every week')) info.serviceType = 'Recurring';
    else if (u.includes('standard') || u.includes('regular')) info.serviceType = 'Standard cleaning';
  }
  if (!info.date) {
    if (u.includes('tomorrow'))       info.date = 'Tomorrow';
    else if (u.includes('today'))     info.date = 'Today';
    else if (u.includes('monday'))    info.date = 'Monday';
    else if (u.includes('tuesday'))   info.date = 'Tuesday';
    else if (u.includes('wednesday')) info.date = 'Wednesday';
    else if (u.includes('thursday'))  info.date = 'Thursday';
    else if (u.includes('friday'))    info.date = 'Friday';
    else if (u.includes('saturday'))  info.date = 'Saturday';
    else if (u.includes('next week')) info.date = 'Next week';
  }
}

function x(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
