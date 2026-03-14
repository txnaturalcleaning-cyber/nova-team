// api/voice-twiml.js
// Inbound:  Direction=inbound → connect to browser client (with fallback message)
// Outbound: SDK sends To=+1... → dial that number

import twilio from 'twilio';
const { VoiceResponse } = twilio.twiml;

export default async function handler(req, res) {
  const { To, From, Called, Direction } = req.body || {};
  const baseUrl  = 'https://nova-team-omega.vercel.app';
  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  const twiml = new VoiceResponse();

  // ── INBOUND ──
  if (Direction === 'inbound') {
    let identity = 'nova_user';

    try {
      const calledNumber = Called || To;
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

    console.log(`Inbound from ${From} → client:${identity}`);

    // Ring browser client for 25s, then play a message if no answer
    const dial = twiml.dial({
      callerId:                      From,
      record:                        'record-from-answer',
      recordingStatusCallback:       `${baseUrl}/api/recording-webhook`,
      recordingStatusCallbackMethod: 'POST',
      recordingStatusCallbackEvent:  'completed',
      trim:                          'trim-silence',
      timeout:                       25,
      action:                        `${baseUrl}/api/voice-twiml-fallback`,
      method:                        'POST',
    });
    dial.client(identity);

    res.setHeader('Content-Type', 'text/xml');
    return res.send(twiml.toString());
  }

  // ── OUTBOUND ──
  if (!To) {
    res.status(400).json({ error: 'Missing To parameter' });
    return;
  }

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
