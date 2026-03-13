// api/voice-twiml.js — TwiML webhook, использует номер партнёра
export default async function handler(req, res) {
  const to   = req.body?.To   || req.query?.To   || '';
  const from = req.body?.From || req.query?.From || process.env.TWILIO_PHONE_NUMBER || '';

  const cleanTo = to.replace(/[^+\d]/g, '');

  res.setHeader('Content-Type', 'text/xml');

  if (!cleanTo) {
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response><Say>No destination number provided.</Say></Response>`);
  }

  if (/^[+\d]/.test(cleanTo)) {
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${from}" record="record-from-ringing" recordingStatusCallback="/api/recording-status">
    <Number>${cleanTo}</Number>
  </Dial>
</Response>`);
  }

  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${from}">
    <Client>${cleanTo}</Client>
  </Dial>
</Response>`);
}
