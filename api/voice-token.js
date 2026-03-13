// api/voice-token.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const accountSid   = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid    = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const twimlAppSid  = process.env.TWILIO_TWIML_APP_SID;

  if (!accountSid || !apiKeySid || !apiKeySecret || !twimlAppSid) {
    return res.status(500).json({ error: 'Missing credentials' });
  }

  try {
    const twilio = await import('twilio');
    const AccessToken = twilio.default.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const { identity, partnerPhone } = req.body || {};
    const clientIdentity = (identity || 'nova_user')
      .replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 121);

    const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
      identity: clientIdentity,
      ttl: 3600
    });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    });
    token.addGrant(voiceGrant);

    return res.status(200).json({
      token: token.toJwt(),
      identity: clientIdentity,
      partnerPhone: partnerPhone || process.env.TWILIO_PHONE_NUMBER || null
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
