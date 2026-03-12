// api/confirm-phone-purchase.js — After Stripe payment confirmed, buy Twilio number
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { intentId, phoneNumber, partnerId } = req.body || {};
  if (!intentId || !phoneNumber || !partnerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stripeSecret  = process.env.STRIPE_SECRET_KEY;
  const accountSid    = process.env.TWILIO_ACCOUNT_SID;
  const authToken     = process.env.TWILIO_AUTH_TOKEN;

  if (!stripeSecret || !accountSid || !authToken) {
    return res.status(500).json({ error: 'Credentials not configured' });
  }

  try {
    // 1. Verify Stripe payment was successful
    const stripeRes = await fetch(`https://api.stripe.com/v1/payment_intents/${intentId}`, {
      headers: { 'Authorization': `Bearer ${stripeSecret}` }
    });
    const intent = await stripeRes.json();

    if (intent.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment not completed. Status: ${intent.status}` });
    }

    // 2. Purchase the Twilio number on main account
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          PhoneNumber:  phoneNumber,
          FriendlyName: `Partner_${partnerId}`,
          // Webhooks for SMS and Voice
          SmsUrl:    `${process.env.VERCEL_URL ? 'https://'+process.env.VERCEL_URL : ''}/api/sms-webhook`,
          VoiceUrl:  `${process.env.VERCEL_URL ? 'https://'+process.env.VERCEL_URL : ''}/api/voice-twiml`,
        }).toString(),
      }
    );

    const twilioData = await twilioRes.json();

    if (!twilioRes.ok) {
      return res.status(400).json({ error: twilioData.message || 'Twilio purchase failed' });
    }

    return res.status(200).json({
      success: true,
      number: {
        phoneNumber:  twilioData.phone_number,
        friendlyName: twilioData.friendly_name,
        sid:          twilioData.sid,
        purchasedAt:  new Date().toISOString(),
        paidAmount:   900, // cents
        partnerId,
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
