// api/voice-twiml.js
// Inbound:  Direction=inbound → check enabled (max 1.5s) → ring browser → fallback to AI
// Outbound: SDK dials external number

import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

// Fetch with timeout — if Firebase is slow, return null and proceed normally
async function fetchConfigWithTimeout(url, ms = 1500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const r = await fetch(url, { signal: controller.signal });
    const d = await r.json();
    return d;
  } catch(e) {
    console.log('Config fetch timeout/error:', e.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  const twiml = new VoiceResponse();

  try {
    const { To, From, Direction } = req.body || {};
    const baseUrl  = 'https://nova-team-omega.vercel.app';
    const identity = process.env.TWILIO_CLIENT_IDENTITY || 'nce_agent';
    const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
    const fbAuth   = process.env.FIREBASE_DB_SECRET;
    const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

    console.log('voice-twiml:', { Direction, To, From, identity });

    // ── INBOUND ──
    if (Direction === 'inbound') {

      // Check enabled flag — max 1.5s, on timeout we proceed normally
      let aiDisabled = false;
      let disabledCfg = null;
      try {
        const phoneKey = (To || '').replace(/[^0-9]/g, '');
        if (phoneKey) {
          const cfg = await fetchConfigWithTimeout(
            `${fbBase}/ai_receptionist_config/${phoneKey}.json${fbSuffix}`,
            1500
          );
          if (cfg && cfg.enabled === false) {
            aiDisabled = true;
            disabledCfg = cfg;
          }
          console.log('Config check:', { enabled: cfg?.enabled, company: cfg?.companyName });
        }
      } catch(e) {
        console.log('Config check error (proceeding normally):', e.message);
      }

      // AI is OFF — tell caller and hang up
      if (aiDisabled && disabledCfg) {
        const voice = disabledCfg.language === 'ru' ? 'Polly.Tatyana' : 'Polly.Joanna';
        const lang  = disabledCfg.language === 'ru' ? 'ru-RU' : 'en-US';
        const msg   = disabledCfg.language === 'ru'
          ? `Здравствуйте! Вы позвонили в ${disabledCfg.companyName || 'нашу компанию'}. Все операторы сейчас доступны. Пожалуйста, перезвоните позже.`
          : `Thank you for calling ${disabledCfg.companyName || 'us'}. Our agents are currently available. Please call back shortly. Goodbye!`;
        console.log('AI DISABLED — hanging up');
        twiml.say({ voice, language: lang }, msg);
        twiml.hangup();
        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());
      }

      // AI is ON (or config not found / timeout) — ring browser, fallback to ElevenLabs
      console.log(`Inbound from ${From} → ringing client:${identity}, fallback to AI`);
      const dial = twiml.dial({
        callerId:                      From,
        record:                        'record-from-answer',
        recordingStatusCallback:       `${baseUrl}/api/recording-webhook`,
        recordingStatusCallbackMethod: 'POST',
        recordingStatusCallbackEvent:  'completed',
        trim:                          'trim-silence',
        timeout:                       20,
        action:                        'https://nova-team-9gbc.onrender.com/elevenlabs-inbound',
        method:                        'POST',
      });
      dial.client(identity);

      res.setHeader('Content-Type', 'text/xml');
      return res.send(twiml.toString());
    }

    // ── OUTBOUND ──
    if (!To) {
      res.status(400).json({ error: 'Missing To parameter' });
      return;
    }

    console.log(`Outbound to ${To} from ${From}`);
    const dial = twiml.dial({
      callerId:                      From || process.env.TWILIO_PHONE_NUMBER,
      record:                        'record-from-answer',
      recordingStatusCallback:       `${baseUrl}/api/recording-webhook`,
      recordingStatusCallbackMethod: 'POST',
      recordingStatusCallbackEvent:  'completed',
      trim:                          'trim-silence',
    });
    dial.number(To);

    res.setHeader('Content-Type', 'text/xml');
    res.send(twiml.toString());

  } catch(e) {
    console.error('voice-twiml error:', e.message);
    twiml.say({ voice: 'Polly.Joanna' }, 'We are unable to take your call right now. Please try again later.');
    res.setHeader('Content-Type', 'text/xml');
    res.send(twiml.toString());
  }
}
