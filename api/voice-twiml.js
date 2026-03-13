// api/voice-twiml.js
// Generates TwiML for outbound calls via Twilio Voice SDK
// Call recording enabled with correct Twilio record attribute

import twilio from 'twilio';
const { VoiceResponse } = twilio.twiml;

export default function handler(req, res) {
  const { To, From } = req.body;

  if (!To) {
    res.status(400).json({ error: 'Missing To parameter' });
    return;
  }

  const twiml = new VoiceResponse();

  // Always use production URL for webhooks so Twilio can reach us
  const baseUrl = 'https://nova-team-omega.vercel.app';

  // Dial with recording enabled
  // ✅ FIX: 'record-from-answer-as-mp3' is NOT a valid Twilio value —
  //    Twilio silently ignores it and skips recording entirely.
  //    Valid values: 'record-from-answer' | 'record-from-ringing' | 'do-not-record'
  const dial = twiml.dial({
    callerId: From || process.env.TWILIO_PHONE_NUMBER,
    record: 'record-from-answer',
    recordingStatusCallback: `${baseUrl}/api/recording-webhook`,
    recordingStatusCallbackMethod: 'POST',
    recordingStatusCallbackEvent: 'completed',
    trim: 'trim-silence',
  });

  dial.number(To);

  res.setHeader('Content-Type', 'text/xml');
  res.send(twiml.toString());
}
