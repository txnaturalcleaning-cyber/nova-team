// api/get-ai-bookings.js
// Returns AI bookings for a partner from Realtime Database
// Called by App.jsx sync hook — browser can't access RTDB directly (needs secret)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { partnerId } = req.query;
  if (!partnerId) return res.status(400).json({ error: 'Missing partnerId' });

  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  try {
    const r = await fetch(`${fbBase}/partners/${partnerId}/workspace/bookings.json${fbSuffix}`);
    const d = await r.json();

    if (!d || typeof d !== 'object' || d.error) {
      return res.json({ bookings: [] });
    }

    const bookings = Object.values(d)
      .filter(b => b && b.aiGenerated === true)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ bookings });
  } catch(e) {
    console.error('get-ai-bookings error:', e.message);
    return res.status(500).json({ error: e.message, bookings: [] });
  }
}
