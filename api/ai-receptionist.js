// api/ai-receptionist.js
// Called after Dial timeout — AI takes over the call

export default async function handler(req, res) {
  const { To, From, CallSid, DialCallStatus } = req.body || {};
  const baseUrl  = 'https://nova-team-omega.vercel.app';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  console.log('AI Receptionist:', { CallSid, From, To, DialCallStatus });

  // Only skip if the browser DID answer (completed = answered)
  // no-answer, busy, failed, canceled → AI should respond
  if (DialCallStatus === 'completed') {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
  }

  // Load per-partner config by phone number
  let cfg = {
    companyName: 'Natural Cleaning Experts',
    language: 'en',
    minPrice: '120',
    services: 'Standard cleaning, Deep cleaning, Move-in/out, Recurring',
    serviceArea: 'Austin TX, Miami FL',
    businessHours: 'Monday-Friday 8am-6pm, Saturday 9am-3pm',
    greeting: '',
    enabled: true,
    partnerId: null,
  };

  try {
    const phoneKey = (To || '').replace(/[^0-9]/g, '');
    if (phoneKey) {
      const r = await fetch(
        `https://nova-launch-system-default-rtdb.firebaseio.com/ai_receptionist_config/${phoneKey}.json${fbSuffix}`
      );
      const d = await r.json();
      if (d && d.companyName) {
        cfg = { ...cfg, ...d };
        console.log('Config loaded for:', cfg.companyName);
      }
    }
  } catch(e) { console.log('Config load error:', e.message); }

  if (cfg.enabled === false) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${x(`Thank you for calling ${cfg.companyName}. We are currently unavailable. Please call back during business hours. Goodbye!`)}</Say>
  <Hangup/>
</Response>`);
  }

  // Save session to Firebase
  try {
    await fetch(
      `https://nova-launch-system-default-rtdb.firebaseio.com/ai_calls/${CallSid}.json${fbSuffix}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callSid: CallSid, from: From, to: To,
          startedAt: new Date().toISOString(),
          status: 'active', history: [], config: cfg,
          collectedInfo: { intent: null, name: null, address: null, serviceType: null, date: null },
        }),
      }
    );
  } catch(e) { console.log('Session save error:', e.message); }

  const v    = voice(cfg.language);
  const lang = langCode(cfg.language);

  const greeting = cfg.greeting ||
    (cfg.language === 'ru'
      ? `Здравствуйте! Вы позвонили в ${cfg.companyName}. Наши специалисты сейчас недоступны, но я AI-ассистент и готова помочь. Вы хотите записаться на уборку или у вас вопрос?`
      : `Hello! Thank you for calling ${cfg.companyName}. Our team is currently unavailable, but I am your AI assistant and I am here to help. Are you calling to schedule a cleaning, or do you have a question about an existing appointment?`);

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${baseUrl}/api/ai-receptionist-turn" method="POST"
    speechTimeout="3" language="${lang}" timeout="12">
    <Say voice="${v}" language="${lang}">${x(greeting)}</Say>
  </Gather>
  <Say voice="${v}">${cfg.language === 'ru' ? 'Не слышу ответа. Пожалуйста, перезвоните. До свидания!' : 'I did not hear a response. Please call us back. Goodbye!'}</Say>
  <Hangup/>
</Response>`);
}

function x(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function voice(lang) {
  if (lang === 'ru') return 'Polly.Tatyana';
  if (lang === 'es') return 'Polly.Lupe';
  return 'Polly.Joanna';
}
function langCode(lang) {
  if (lang === 'ru') return 'ru-RU';
  if (lang === 'es') return 'es-US';
  return 'en-US';
}
