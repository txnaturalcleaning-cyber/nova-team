// api/voice-twiml.js
// OUTBOUND ONLY — used by Twilio SDK via TwiML App
// Do NOT change this file for inbound — see voice-inbound.js

import twilio from 'twilio';
const { VoiceResponse } = twilio.twiml;

export default function handler(req, res) {
  const { To, From } = req.body || {};

  if (!To) {
    res.status(400).json({ error: 'Missing To parameter' });
    return;
  }

  const twiml = new VoiceResponse();
  const baseUrl = 'https://nova-team-omega.vercel.app';

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
}
