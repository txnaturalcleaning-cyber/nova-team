// api/voice-twiml.js — TwiML webhook for outgoing calls
export default async function handler(req, res) {
  const to   = req.body?.To || req.query?.To || '';
  const from = process.env.TWILIO_PHONE_NUMBER || '';

  // Sanitize phone number
  const cleanTo = to.replace(/[^+\d]/g, '');

  res.setHeader('Content-Type', 'text/xml');

  if (!cleanTo) {
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response><Say>No destination number provided.</Say></Response>`);
  }

  // If calling a phone number (starts with + or digit)
  if (/^[\+\d]/.test(cleanTo)) {
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${from}" record="record-from-ringing" recordingStatusCallback="/api/recording-status">
    <Number>${cleanTo}</Number>
  </Dial>
</Response>`);
  }

  // If calling another client
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${from}">
    <Client>${cleanTo}</Client>
  </Dial>
</Response>`);
}
