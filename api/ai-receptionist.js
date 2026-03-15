// api/ai-receptionist.js
// Called when browser client doesn't answer
// Loads per-partner config from Firebase, greets caller

export default async function handler(req, res) {
  const { To, From, CallSid, DialCallStatus } = req.body || {};
  const baseUrl  = 'https://nova-team-omega.vercel.app';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  if (DialCallStatus === 'completed') {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
  }

  console.log('AI Receptionist started:', { CallSid, From, To, DialCallStatus });

  // ── Load per-partner config using called number (To) ──
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
      const r = await fetch(`https://nova-launch-system-default-rtdb.firebaseio.com/ai_receptionist_config/${phoneKey}.json${fbSuffix}`);
      const d = await r.json();
      if (d && d.companyName) {
        cfg = { ...cfg, ...d };
        console.log('Loaded config for:', cfg.companyName, 'partner:', cfg.partnerId);
      }
    }
  } catch(e) {
    console.log('Config load error:', e.message);
  }

  // If AI receptionist disabled — say a simple message
  if (!cfg.enabled) {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thank you for calling ${escapeXml(cfg.companyName)}. We are currently unavailable. Please call back during business hours. Goodbye!</Say>
  <Hangup/>
</Response>`);
  }

  // Save session with config
  try {
    await fetch(`https://nova-launch-system-default-rtdb.firebaseio.com/ai_calls/${CallSid}.json${fbSuffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callSid: CallSid, from: From, to: To,
        startedAt: new Date().toISOString(),
        status: 'active', history: [],
        config: cfg,
        collectedInfo: { intent:null, name:null, address:null, serviceType:null, date:null, time:null },
      }),
    });
  } catch(e) { console.log('Session save error:', e.message); }

  // Generate greeting
  const lang = cfg.language === 'ru' ? 'ru-RU' : cfg.language === 'es' ? 'es-US' : 'en-US';
  const voice = cfg.language === 'ru' ? 'Polly.Tatyana' : cfg.language === 'es' ? 'Polly.Lupe' : 'Polly.Joanna';

  const greeting = cfg.greeting
    ? cfg.greeting
    : cfg.language === 'ru'
      ? `Здравствуйте! Вы позвонили в ${cfg.companyName}. Наши специалисты сейчас недоступны, но я AI-ассистент и готова помочь вам прямо сейчас. Вы хотите записаться на уборку или у вас вопрос по существующему заказу?`
      : `Hello! Thank you for calling ${cfg.companyName}. Our team is currently unavailable, but I'm your AI assistant and I'm here to help. Are you calling to schedule a cleaning, or do you have a question about an existing appointment?`;

  const hints = cfg.language === 'ru'
    ? 'уборка, записаться, цена, стоимость, расписание, вопрос, отмена, перенос'
    : 'cleaning, schedule, book, price, cost, cancel, reschedule, question, existing';

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${baseUrl}/api/ai-receptionist-turn" method="POST"
    speechTimeout="3" language="${lang}" timeout="10" hints="${hints}">
    <Say voice="${voice}" language="${lang}">${escapeXml(greeting)}</Say>
  </Gather>
  <Say voice="${voice}">${cfg.language === 'ru' ? 'Не слышу ответа. Пожалуйста, перезвоните нам. До свидания!' : "I didn't hear a response. Please call us back. Goodbye!"}</Say>
  <Hangup/>
</Response>`);
}

function escapeXml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
