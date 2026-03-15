// api/ai-receptionist-turn.js — полностью переписан
export default async function handler(req, res) {
  const { SpeechResult, CallSid, From } = req.body || {};
  const baseUrl  = 'https://nova-team-omega.vercel.app';
  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';
  const apiKey   = process.env.ANTHROPIC_API_KEY;
  const turnUrl  = `${baseUrl}/api/ai-receptionist-turn`;

  console.log('Turn:', { CallSid, speech: SpeechResult?.slice(0,60) });

  const v  = 'Polly.Joanna';
  const lc = 'en-US';

  // No speech
  if (!SpeechResult?.trim()) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST" speechTimeout="auto" language="en-US" timeout="10" enhanced="true" speechModel="phone_call">
    <Say voice="${v}">I did not catch that. Could you say that again?</Say>
  </Gather><Hangup/>
</Response>`);
  }

  // Load session from Firebase
  let session = { history:[], collectedInfo:{}, config:{}, from:From };
  try {
    const r = await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`);
    const d = await r.json();
    if (d && d.callSid) session = { ...session, ...d };
  } catch(e) { console.log('Session load error:', e.message); }

  // Re-load fresh config from Firebase (in case it changed)
  let cfg = session.config || {};
  if (cfg.companyName && cfg.companyName !== 'Natural Cleaning Experts') {
    // already have real config
  } else {
    try {
      const phoneKey = (session.to || '').replace(/[^0-9]/g,'');
      if (phoneKey) {
        const r = await fetch(`${fbBase}/ai_receptionist_config/${phoneKey}.json${fbSuffix}`);
        const d = await r.json();
        if (d && d.companyName) { cfg = d; session.config = cfg; }
      }
    } catch(e) {}
  }

  const isRu = (cfg.language || 'en') === 'ru';
  const voice = isRu ? 'Polly.Tatyana' : 'Polly.Joanna';
  const lang  = isRu ? 'ru-RU' : 'en-US';

  // Load real booking availability
  let slotsInfo = 'No availability data';
  if (cfg.partnerId) {
    try {
      const r = await fetch(`${fbBase}/partners/${cfg.partnerId}/workspace.json${fbSuffix}`);
      const ws = await r.json();
      if (ws) {
        const today    = new Date();
        const bookings = ws.bookings || [];
        const emps     = (ws.employees||[]).filter(e=>['cleaner','Cleaner'].includes(e.role));
        const slots    = [];
        for (let i=1; i<=7; i++) {
          const d = new Date(today); d.setDate(today.getDate()+i);
          const ds   = d.toISOString().split('T')[0];
          const busy = bookings.filter(b=>b.date===ds&&b.status!=='cancelled').length;
          const free = Math.max(0, emps.length - busy);
          if (free>0) slots.push(`${d.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}: ${free} cleaner${free>1?'s':''} available`);
        }
        slotsInfo = slots.length ? slots.join('\n') : 'Fully booked this week';
      }
    } catch(e) { slotsInfo = 'Unable to load schedule'; }
  }

  // What we already know
  const info = session.collectedInfo || {};
  const known = [];
  if (info.name)        known.push(`name: "${info.name}"`);
  if (info.address)     known.push(`address: "${info.address}"`);
  if (info.serviceType) known.push(`service: "${info.serviceType}"`);
  if (info.date)        known.push(`date: "${info.date}"`);

  // What we still need
  const stillNeed = [];
  if (!info.name)        stillNeed.push('their name');
  if (!info.address)     stillNeed.push('their address or zip code');
  if (!info.serviceType) stillNeed.push('which type of cleaning they want');
  if (!info.date)        stillNeed.push('their preferred date');

  const systemPrompt = `You are Clara, a warm and friendly receptionist at ${cfg.companyName||'Natural Cleaning Experts'}.
You are on a real phone call. Sound like a real human — natural, conversational, never robotic.

COMPANY INFO:
- Services offered: ${cfg.services||'Standard cleaning, Deep cleaning, Move-in/out, Recurring'}
- Starting price: $${cfg.minPrice||'120'}
- Service area: ${cfg.serviceArea||'Austin TX'}
- Hours: ${cfg.businessHours||'Mon-Fri 8am-6pm'}
${cfg.customPrompt ? '- Special notes: '+cfg.customPrompt : ''}

REAL SCHEDULE THIS WEEK:
${slotsInfo}

WHAT YOU KNOW SO FAR: ${known.length ? known.join(', ') : 'nothing yet'}
WHAT YOU STILL NEED: ${stillNeed.length ? stillNeed.join(', ') : 'everything — ready to confirm!'}

INSTRUCTIONS:
- Speak naturally, like a real person — contractions, casual warmth
- ONE question per response, max 2 short sentences
- Do NOT re-ask anything already collected above
- Use the real schedule above when suggesting dates
- When you have name + address + service + date → confirm it warmly, then output on its own line: [BOOKING:{"name":"X","address":"X","serviceType":"X","date":"X"}]
- If they ask price → give the starting price and mention final depends on home size
- Language: ${isRu ? 'Russian only' : 'English'}`;

  // Build message history - keep last 10 turns only
  session.history = (session.history||[]).slice(-10);
  session.history.push({ role:'user', content:SpeechResult });

  let aiText = '';
  let bookingData = null;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key': apiKey,
        'anthropic-version':'2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        system: systemPrompt,
        messages: session.history.map(m=>({role:m.role, content:m.content})),
      }),
    });
    const data = await r.json();
    console.log('Claude:', r.status, data?.error?.message||'ok');

    if (data.error) {
      console.error('Claude error:', JSON.stringify(data.error));
      aiText = isRu ? 'Одну секунду.' : 'One moment, please.';
    } else {
      aiText = data.content?.[0]?.text || '';
    }

    // Extract booking marker
    const bm = aiText.match(/\[BOOKING:([\s\S]*?)\]/);
    if (bm) {
      try { bookingData = JSON.parse(bm[1]); } catch(e){}
      aiText = aiText.replace(/\[BOOKING:[\s\S]*?\]/, '').trim();
    }

    // Extract collected info from Claude's response using simple heuristics
    // Also try to update collectedInfo from conversation
    extractAndUpdateInfo(session, SpeechResult, aiText);

  } catch(e) {
    console.error('Fetch error:', e.message);
    aiText = isRu ? 'Секунду.' : 'One moment.';
  }

  session.history.push({ role:'assistant', content:aiText });

  // Save lead if booking complete
  if (bookingData) {
    session.collectedInfo = { ...(session.collectedInfo||{}), ...bookingData };
    session.status = 'booked';
    try {
      const leadId = 'ai_' + Date.now();
      await fetch(`${fbBase}/ai_leads/${leadId}.json${fbSuffix}`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          id:leadId, callSid:CallSid, phone:From,
          partnerId:cfg.partnerId||null,
          source:'AI Receptionist',
          name:bookingData.name||'',
          address:bookingData.address||'',
          serviceType:bookingData.serviceType||'',
          preferredDate:bookingData.date||'',
          createdAt: new Date().toISOString(),
          status:'new_lead',
        }),
      });
      // SMS to caller
      if (cfg.confirmSms!==false && From && bookingData.name) {
        const msg = isRu
          ? `${bookingData.name}, ваша заявка принята! Перезвоним в течение часа. — ${cfg.companyName}`
          : `Hi ${bookingData.name}! Got your booking request for ${bookingData.serviceType||'cleaning'} at ${bookingData.address}. We will confirm within 1 hour! — ${cfg.companyName||'Natural Cleaning Experts'}`;
        fetch(`${baseUrl}/api/send-sms`,{
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({to:From, message:msg, fromNumber:session.to}),
        }).catch(()=>{});
      }
    } catch(e){ console.log('Lead error:', e.message); }
  }

  // Save session
  try {
    await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        history: session.history.slice(-12),
        collectedInfo: session.collectedInfo,
        status: session.status||'active',
        config: cfg,
      }),
    });
  } catch(e) {}

  const spoken    = x(aiText);
  const shouldEnd = !!bookingData || session.history.length > 18;

  if (shouldEnd) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}" language="${lang}">${spoken}</Say>
  <Pause length="1"/>
  <Say voice="${voice}">${isRu?'Хорошего дня!':'Have a great day! Goodbye!'}</Say>
  <Hangup/>
</Response>`);
  }

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="auto" language="${lang}" timeout="12"
    enhanced="true" speechModel="phone_call">
    <Say voice="${voice}" language="${lang}">${spoken}</Say>
  </Gather>
  <Say voice="${voice}">${isRu?'Спасибо за звонок! До свидания.':'Thanks for calling! Goodbye.'}</Say>
  <Hangup/>
</Response>`);
}

// Simple info extractor — updates collectedInfo from conversation
function extractAndUpdateInfo(session, userSpeech, aiText) {
  const info = session.collectedInfo = session.collectedInfo || {};
  const u = userSpeech.toLowerCase();

  // Service type keywords
  if (!info.serviceType) {
    if (u.includes('deep clean') || u.includes('deep')) info.serviceType = 'Deep cleaning';
    else if (u.includes('move') || u.includes('moving')) info.serviceType = 'Move-in/out';
    else if (u.includes('recurring') || u.includes('weekly') || u.includes('regular')) info.serviceType = 'Recurring';
    else if (u.includes('standard') || u.includes('regular clean')) info.serviceType = 'Standard cleaning';
  }

  // Date keywords
  if (!info.date) {
    const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    const tomorrow = u.includes('tomorrow');
    const today_ = u.includes('today');
    if (tomorrow) info.date = 'Tomorrow';
    else if (today_) info.date = 'Today';
    else {
      const day = days.find(d => u.includes(d));
      if (day) info.date = day.charAt(0).toUpperCase()+day.slice(1);
    }
    // Next week
    if (u.includes('next week')) info.date = 'Next week';
  }
}

function x(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
