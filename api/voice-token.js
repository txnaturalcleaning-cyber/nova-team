// api/voice-token.js — generates Twilio Access Token for browser calling
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const accountSid   = process.env.TWILIO_ACCOUNT_SID;
  const authToken    = process.env.TWILIO_AUTH_TOKEN;
  const twimlAppSid  = process.env.TWILIO_TWIML_APP_SID;

  if (!accountSid || !authToken || !twimlAppSid) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  try {
    // Generate Access Token using Twilio REST API approach
    // We use a simple JWT approach compatible with Twilio Voice SDK
    const { identity } = req.body || {};
    const clientIdentity = (identity || 'nova_user').replace(/[^a-zA-Z0-9_]/g, '_');

    // Create JWT header
    const header = { alg: 'HS256', typ: 'JWT', cty: 'twilio-fpa;v=1' };

    const now = Math.floor(Date.now() / 1000);
    const jti = `${accountSid}-${now}`;

    // Grant payload
    const payload = {
      jti,
      iss: accountSid,
      sub: accountSid,
      exp: now + 3600,
      grants: {
        identity: clientIdentity,
        voice: {
          incoming: { allow: true },
          outgoing: { application_sid: twimlAppSid }
        }
      }
    };

    // Simple base64url encode
    function base64url(str) {
      return Buffer.from(str).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    const h = base64url(JSON.stringify(header));
    const p = base64url(JSON.stringify(payload));
    const signingInput = `${h}.${p}`;

    // HMAC-SHA256 signature
    const crypto = await import('crypto');
    const sig = crypto.default.createHmac('sha256', authToken)
      .update(signingInput).digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const token = `${signingInput}.${sig}`;

    return res.status(200).json({ token, identity: clientIdentity });
  } catch (err) {
    console.error('Token error:', err);
    return res.status(500).json({ error: err.message });
  }
}
