// api/buy-phone-number.js — Create AND confirm Stripe PaymentIntent
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
  if (!stripeSecret) return res.status(500).json({ error: 'Stripe not configured' });

  const isTest = stripeSecret.startsWith('sk_test_');

  try {
    // Step 1: Create PaymentIntent
    const createRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: '900',
        currency: 'usd',
        description: `Phone number ${phoneNumber} - 1 month`,
        'metadata[phoneNumber]': phoneNumber,
        'metadata[partnerId]': partnerId,
      }).toString(),
    });

    const intent = await createRes.json();
    if (!createRes.ok) return res.status(400).json({ error: intent.error?.message || 'Stripe error' });

    // Step 2: In test mode — confirm with test card automatically
    if (isTest) {
      const confirmRes = await fetch(`https://api.stripe.com/v1/payment_intents/${intent.id}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecret}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          payment_method: 'pm_card_visa',
        }).toString(),
      });

      const confirmed = await confirmRes.json();
      if (!confirmRes.ok) return res.status(400).json({ error: confirmed.error?.message || 'Confirmation failed' });

      return res.status(200).json({ success: true, intentId: confirmed.id, status: confirmed.status });
    }

    // Production: return clientSecret for Stripe.js frontend confirmation
    return res.status(200).json({ success: true, clientSecret: intent.client_secret, intentId: intent.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
