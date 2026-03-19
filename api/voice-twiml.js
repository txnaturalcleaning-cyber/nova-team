// api/voice-twiml.js
// Inbound:  ring browser 20s → Render handles AI/no-AI logic
// Outbound: SDK dials external number
// NOTE: enabled check happens in Render /elevenlabs-inbound, not here

import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(req, res) {
  const twiml = new VoiceResponse();

  try {
    const { To, From, Direction } = req.body || {};
    const baseUrl  = 'https://nova-team-omega.vercel.app';
    const identity = process.env.TWILIO_CLIENT_IDENTITY || 'nce_agent';

    console.log('voice-twiml:', { Direction, To, From, identity });

    // ── INBOUND: ring browser, Render handles fallback logic ──
    if (Direction === 'inbound') {
      console.log(`Inbound from ${From} → ringing client:${identity}`);

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
