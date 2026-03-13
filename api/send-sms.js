// api/send-sms.js — партнёрский номер передаётся из фронтенда
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, message, fromNumber } = req.body;
  if (!to || !message) return res.status(400).json({ error: 'Missing to or message' });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  // Используем номер партнёра если передан, иначе fallback на env
  const from = fromNumber || process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: to, From: from, Body: message }).toString(),
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.message || 'Twilio error', code: data.code });

    return res.status(200).json({ success: true, sid: data.sid, status: data.status, to: data.to, from: data.from });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
