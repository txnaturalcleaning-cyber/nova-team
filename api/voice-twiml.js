// api/voice-twiml.js
// Inbound logic:
//   AI ON  → ring browser 20s → if no answer → ElevenLabs AI takes over
//   AI OFF → ring browser 20s → if no answer → simple voicemail message (no AI)
// Outbound: SDK dials external number

import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

async function fetchConfigWithTimeout(url, ms = 1500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const r = await fetch(url, { signal: controller.signal });
    return await r.json();
  } catch(e) {
    console.log('Config fetch error:', e.message);
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

    console.log('voice-twiml:', { Direction, To, From });

    // ── INBOUND ──
    if (Direction === 'inbound') {

      // Read AI config (1.5s timeout — on fail, treat as AI ON)
      let aiEnabled = true;
      let cfg = null;
      try {
        const phoneKey = (To || '').replace(/[^0-9]/g, '');
        if (phoneKey) {
          cfg = await fetchConfigWithTimeout(
            `${fbBase}/ai_receptionist_config/${phoneKey}.json${fbSuffix}`
          );
          // If config exists and explicitly disabled, turn AI off
          if (cfg && cfg.enabled === false) aiEnabled = false;
          console.log('AI enabled:', aiEnabled, '| company:', cfg?.companyName);
        }
      } catch(e) {
        console.log('Config error (defaulting to AI ON):', e.message);
      }

      if (aiEnabled) {
        // AI ON: ring browser → if no answer → ElevenLabs takes over
        console.log(`AI ON → ringing ${identity}, fallback to ElevenLabs`);
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
      } else {
        // AI OFF: ring browser → if no answer → simple message (manager mode)
        console.log(`AI OFF → ringing ${identity}, no AI fallback`);
        const dial = twiml.dial({
          callerId:                      From,
          record:                        'record-from-answer',
          recordingStatusCallback:       `${baseUrl}/api/recording-webhook`,
          recordingStatusCallbackMethod: 'POST',
          recordingStatusCallbackEvent:  'completed',
          trim:                          'trim-silence',
          timeout:                       30,
          action:                        `${baseUrl}/api/voice-twiml-fallback`,
          method:                        'POST',
        });
        dial.client(identity);
      }

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
