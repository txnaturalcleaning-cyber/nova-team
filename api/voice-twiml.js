// api/voice-twiml.js
// Generates TwiML for outbound calls via Twilio Voice SDK
// Now with call recording + recording status webhook

import twilio from 'twilio';
const { VoiceResponse } = twilio.twiml;

export default function handler(req, res) {
  const { To, From } = req.body;

  if (!To) {
    res.status(400).json({ error: 'Missing To parameter' });
    return;
  }

  const twiml = new VoiceResponse();

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://nova-team-omega.vercel.app';

  // Dial with recording enabled
  const dial = twiml.dial({
    callerId: From || process.env.TWILIO_PHONE_NUMBER,
    // Record from when the other party answers
    record: 'record-from-answer-as-mp3',
    // Twilio will POST to this URL when recording is complete
    recordingStatusCallback: `${baseUrl}/api/recording-webhook`,
    recordingStatusCallbackMethod: 'POST',
    recordingStatusCallbackEvent: ['completed'],
    // Trim silence from beginning/end
    trim: 'trim-silence',
  });

  dial.number(To);

  res.setHeader('Content-Type', 'text/xml');
  res.send(twiml.toString());
}
