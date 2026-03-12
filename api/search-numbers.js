// api/search-numbers.js — Search available Twilio phone numbers
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { areaCode, state } = req.body || {};

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    
    // Build search URL
    let url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?Limit=10&VoiceEnabled=true&SmsEnabled=true`;
    if (areaCode) url += `&AreaCode=${areaCode}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || 'Twilio error' });
    }

    const numbers = (data.available_phone_numbers || []).map(n => ({
      phoneNumber:  n.phone_number,
      friendlyName: n.friendly_name,
      locality:     n.locality || '',
      region:       n.region || '',
      postalCode:   n.postal_code || '',
    }));

    return res.status(200).json({ success: true, numbers });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
