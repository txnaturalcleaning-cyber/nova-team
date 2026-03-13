// api/voice-token.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const accountSid   = process.env.TWILIO_ACCOUNT_SID;   // AC2fc1...
  const authToken    = process.env.TWILIO_AUTH_TOKEN;
  const apiKeySid    = process.env.TWILIO_API_KEY_SID;   // SKbeae...
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const twimlAppSid  = process.env.TWILIO_TWIML_APP_SID;

  if (!accountSid || !twimlAppSid) {
    return res.status(500).json({ error: 'Missing credentials', accountSid: !!accountSid, twimlAppSid: !!twimlAppSid });
  }

  const useApiKey     = !!(apiKeySid && apiKeySecret);
  const signingId     = useApiKey ? apiKeySid    : accountSid;
  const signingSecret = useApiKey ? apiKeySecret : authToken;

  try {
    const { identity, partnerPhone } = req.body || {};
    const clientIdentity = (identity || 'nova_user').replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 121);
    const crypto = (await import('crypto')).default;

    function base64url(obj) {
      const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
      return Buffer.from(str, 'utf8').toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    const now = Math.floor(Date.now() / 1000);

    // Build header string manually to ensure kid is included
    const headerObj = { alg: 'HS256', typ: 'JWT', cty: 'twilio-fpa;v=1' };
    if (useApiKey) headerObj.kid = apiKeySid;
    
    const payloadObj = {
      jti: `${signingId}-${now}`,
      iss: signingId,
      sub: accountSid,  // MUST be Account SID (AC...)
      exp: now + 3600,
      grants: {
        identity: clientIdentity,
        voice: {
          incoming: { allow: true },
          outgoing: { application_sid: twimlAppSid }
        }
      }
    };

    const h = base64url(headerObj);
    const p = base64url(payloadObj);
    const sig = crypto.createHmac('sha256', signingSecret)
      .update(`${h}.${p}`).digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    return res.status(200).json({
      token: `${h}.${p}.${sig}`,
      identity: clientIdentity,
      partnerPhone: partnerPhone || process.env.TWILIO_PHONE_NUMBER || null,
      debug: { useApiKey, accountSid: accountSid?.slice(0,6), sub: payloadObj.sub?.slice(0,6) }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
