// api/voice-twiml.js
// Inbound:  Direction=inbound → check enabled → ring browser → fallback to AI
// Outbound: SDK dials external number

import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

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

    // ── INBOUND: check enabled flag first ──
    if (Direction === 'inbound') {

      // Read config for this phone number
      let cfg = null;
      try {
        const phoneKey = (To || '').replace(/[^0-9]/g, '');
        if (phoneKey) {
          const r = await fetch(`${fbBase}/ai_receptionist_config/${phoneKey}.json${fbSuffix}`);
          cfg = await r.json();
        }
      } catch(e) { console.log('Config read error:', e.message); }

      // ✅ If AI is disabled — play message and hang up immediately (no ringing)
      if (cfg && cfg.enabled === false) {
        console.log('AI Receptionist DISABLED — playing unavailable message');
        const voice = cfg.language === 'ru' ? 'Polly.Tatyana' : 'Polly.Joanna';
        const lang  = cfg.language === 'ru' ? 'ru-RU' : 'en-US';
        const msg   = cfg.language === 'ru'
          ? `Здравствуйте! Вы позвонили в ${cfg.companyName || 'нашу компанию'}. Все операторы сейчас доступны. Пожалуйста, перезвоните позже. До свидания!`
          : `Thank you for calling ${cfg.companyName || 'us'}. All agents are currently available. Please call back shortly. Goodbye!`;
        twiml.say({ voice, language: lang }, msg);
        twiml.hangup();
        res.setHeader('Content-Type', 'text/xml');
        return res.send(twiml.toString());
      }

      // AI enabled (or no config found) — ring browser, fallback to AI
      console.log(`Inbound from ${From} → trying client:${identity}, fallback to AI`);
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

    // ── OUTBOUND: SDK dialing external number ──
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
