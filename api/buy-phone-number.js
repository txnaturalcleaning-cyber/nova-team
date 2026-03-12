// api/buy-phone-number.js — Create Stripe PaymentIntent for phone number purchase
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phoneNumber, partnerId } = req.body || {};
  if (!phoneNumber || !partnerId) {
    return res.status(400).json({ error: 'Missing phoneNumber or partnerId' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    // Create Stripe PaymentIntent for $9.00 (first month)
    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: '900',           // $9.00 in cents
        currency: 'usd',
        'automatic_payment_methods[enabled]': 'true',
        description: `Phone number ${phoneNumber} - 1 month`,
        'metadata[phoneNumber]': phoneNumber,
        'metadata[partnerId]':   partnerId,
      }).toString(),
    });

    const intent = await stripeRes.json();
    if (!stripeRes.ok) {
      return res.status(400).json({ error: intent.error?.message || 'Stripe error' });
    }

    return res.status(200).json({
      success: true,
      clientSecret: intent.client_secret,
      intentId:     intent.id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
