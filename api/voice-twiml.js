// api/voice-twiml.js
// Handles BOTH outbound calls (To = phone number) and inbound calls (no To / Direction=inbound)
// Inbound: Twilio POSTs here when someone calls your number → connects to browser client

import twilio from 'twilio';
const { VoiceResponse } = twilio.twiml;

export default async function handler(req, res) {
  const { To, From, Called, Direction } = req.body || {};
  const baseUrl    = 'https://nova-team-omega.vercel.app';
  const fbBase     = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth     = process.env.FIREBASE_DB_SECRET;
  const fbSuffix   = fbAuth ? `?auth=${fbAuth}` : '';

  const twiml = new VoiceResponse();

  // ── Detect INBOUND vs OUTBOUND ──
  // Outbound SDK calls send To = external phone number (digits)
  // Inbound Twilio calls send Called = our Twilio number, To = our number
  const isInbound = Direction === 'inbound' || (Called && !To?.match(/^\+?[\d\s()-]+$/));

  // ── INBOUND: someone called our Twilio number ──
  if (isInbound) {
    let identity = 'nova_user'; // fallback identity

    // Look up which browser client is registered for this Twilio number
    try {
      const calledNumber = Called || process.env.TWILIO_PHONE_NUMBER;
      const fbRes = await fetch(`${fbBase}/active_identities.json${fbSuffix}`);
      const identities = await fbRes.json();
      if (identities && typeof identities === 'object') {
        const match = Object.entries(identities).find(([, data]) =>
          data?.phone === calledNumber
        );
        if (match) identity = match[0];
      }
    } catch(e) {
      console.log('Identity lookup failed, using fallback:', e.message);
    }

    console.log(`Inbound from ${From} → browser client: ${identity}`);

    const dial = twiml.dial({
      callerId:                    From,
      record:                      'record-from-answer',
      recordingStatusCallback:     `${baseUrl}/api/recording-webhook`,
      recordingStatusCallbackMethod: 'POST',
      recordingStatusCallbackEvent:  'completed',
      trim:                        'trim-silence',
      timeout:                     30,
    });
    dial.client(identity);

    res.setHeader('Content-Type', 'text/xml');
    return res.send(twiml.toString());
  }

  // ── OUTBOUND: SDK dials an external number ──
  if (!To) {
    res.status(400).json({ error: 'Missing To parameter' });
    return;
  }

  const dial = twiml.dial({
    callerId:                    From || process.env.TWILIO_PHONE_NUMBER,
    record:                      'record-from-answer',
    recordingStatusCallback:     `${baseUrl}/api/recording-webhook`,
    recordingStatusCallbackMethod: 'POST',
    recordingStatusCallbackEvent:  'completed',
    trim:                        'trim-silence',
  });
  dial.number(To);

  res.setHeader('Content-Type', 'text/xml');
  res.send(twiml.toString());
}
