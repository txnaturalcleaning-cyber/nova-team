// api/voice-twiml.js
// Handles BOTH inbound and outbound calls
// Inbound: Direction=inbound (from Twilio Phone Number webhook)
// Outbound: no Direction, has To= (from TwiML App / SDK)

import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(req, res) {
  const twiml = new VoiceResponse();

  try {
    const { To, From, Direction } = req.body || {};
    const baseUrl  = 'https://nova-team-omega.vercel.app';
    const identity = process.env.TWILIO_CLIENT_IDENTITY || 'nce_agent';

    console.log('voice-twiml called:', { To, From, Direction, identity });

    // INBOUND: Twilio sends Direction=inbound when someone calls our number
    if (Direction === 'inbound') {
      console.log(`Inbound from ${From} → client:${identity}`);
      const dial = twiml.dial({
        callerId:                      From,
        record:                        'record-from-answer',
        recordingStatusCallback:       `${baseUrl}/api/recording-webhook`,
        recordingStatusCallbackMethod: 'POST',
        recordingStatusCallbackEvent:  'completed',
        trim:                          'trim-silence',
        timeout:                       30,
      });
      dial.client(identity);
      res.setHeader('Content-Type', 'text/xml');
      return res.send(twiml.toString());
    }

    // OUTBOUND: SDK dials an external number
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
    twiml.say({ voice: 'alice' }, 'We are unable to take your call. Please try again later.');
    res.setHeader('Content-Type', 'text/xml');
    res.send(twiml.toString());
  }
}
