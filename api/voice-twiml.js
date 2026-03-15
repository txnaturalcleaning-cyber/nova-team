// api/voice-twiml.js
// Inbound:  Direction=inbound → ring browser client → fallback to AI receptionist
// Outbound: SDK dials external number

import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(req, res) {
  const twiml = new VoiceResponse();

  try {
    const { To, From, Direction } = req.body || {};
    const baseUrl  = 'https://nova-team-omega.vercel.app';
    const identity = process.env.TWILIO_CLIENT_IDENTITY || 'nce_agent';

    console.log('voice-twiml:', { Direction, To, From, identity });

    // ── INBOUND: ring browser, fallback to AI receptionist ──
    if (Direction === 'inbound') {
      console.log(`Inbound from ${From} → trying client:${identity}, fallback to AI`);

      const dial = twiml.dial({
        callerId:                      From,
        record:                        'record-from-answer',
        recordingStatusCallback:       `${baseUrl}/api/recording-webhook`,
        recordingStatusCallbackMethod: 'POST',
        recordingStatusCallbackEvent:  'completed',
        trim:                          'trim-silence',
        timeout:                       20, // ring for 20s then AI takes over
        action: `${baseUrl}/api/elevenlabs-inbound`, // ← our redirect to ElevenLabs
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
