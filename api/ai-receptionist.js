// api/ai-receptionist.js
// Entry point: greets caller, saves greeting to history so turn.js knows context

export default async function handler(req, res) {
  const { To, From, CallSid, DialCallStatus } = req.body || {};
  const baseUrl  = 'https://nova-team-omega.vercel.app';
  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  console.log('AI Receptionist:', { CallSid, From, To, DialCallStatus });

  // Caller hung up while ringing
  if (DialCallStatus === 'completed') {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
  }

  // Load per-partner config by called number (To)
  let cfg = defaultCfg();
  try {
    const phoneKey = (To || '').replace(/[^0-9]/g, '');
    if (phoneKey) {
      const r = await fetch(`${fbBase}/ai_receptionist_config/${phoneKey}.json${fbSuffix}`);
      const d = await r.json();
      if (d && d.companyName) {
        cfg = { ...cfg, ...d };
        console.log('Config loaded:', cfg.companyName, '| lang:', cfg.language, '| partner:', cfg.partnerId);
      } else {
        console.log('No config found for key:', phoneKey, '— using defaults');
      }
    }
  } catch(e) { console.log('Config load error:', e.message); }

  if (cfg.enabled === false) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${vx(cfg.language)}">${x(`Thank you for calling ${cfg.companyName}. We are currently unavailable. Please call back during business hours.`)}</Say>
  <Hangup/>
</Response>`);
  }

  const isRu     = cfg.language === 'ru';
  const greeting = cfg.greeting ||
    (isRu
      ? `Здравствуйте! Вы позвонили в ${cfg.companyName}. Меня зовут Клара, я AI-ассистент компании. Чем могу помочь — запись на уборку или вопрос по заказу?`
      : `Hi there! You have reached ${cfg.companyName}. My name is Clara, I am the AI assistant here. Are you looking to schedule a cleaning, or do you have a question?`);

  // Save session WITH greeting already in history
  // This way turn.js knows the context and won't re-greet
  try {
    await fetch(`${fbBase}/ai_calls/${CallSid}.json${fbSuffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callSid: CallSid,
        from:    From,
        to:      To,
        startedAt: new Date().toISOString(),
        status:  'active',
        config:  cfg,
        collectedInfo: {},
        // ✅ Save greeting as first assistant message so Claude knows what was already said
        history: [
          { role: 'assistant', content: greeting }
        ],
      }),
    });
  } catch(e) { console.log('Session save error:', e.message); }

  const v    = vx(cfg.language);
  const lang = lc(cfg.language);
  const turnUrl = `${baseUrl}/api/ai-receptionist-turn`;

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${turnUrl}" method="POST"
    speechTimeout="auto" language="${lang}" timeout="12"
    enhanced="true" speechModel="phone_call">
    <Say voice="${v}" language="${lang}">${x(greeting)}</Say>
  </Gather>
  <Say voice="${v}">${x(isRu ? 'Не слышу ответа. Перезвоните, пожалуйста. До свидания!' : 'I did not hear a response. Please call us back. Goodbye!')}</Say>
  <Hangup/>
</Response>`);
}

function defaultCfg() {
  return {
    companyName:   'Natural Cleaning Experts',
    language:      'en',
    minPrice:      '120',
    services:      'Standard cleaning, Deep cleaning, Move-in/out, Recurring',
    serviceArea:   'Austin TX and Miami FL',
    businessHours: 'Monday-Friday 8am-6pm, Saturday 9am-3pm',
    greeting:      '',
    enabled:       true,
    partnerId:     null,
    transferPhone: '',
    customPrompt:  '',
    collectBooking: true,
    confirmSms:    true,
  };
}
function x(s)   { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function vx(l)  { return l==='ru'?'Polly.Tatyana':l==='es'?'Polly.Lupe':'Polly.Joanna'; }
function lc(l)  { return l==='ru'?'ru-RU':l==='es'?'es-US':'en-US'; }
