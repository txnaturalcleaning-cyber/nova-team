// api/save-ai-config.js
// Saves AI receptionist config to Firebase (called from browser)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phoneNumber, config } = req.body || {};
  if (!phoneNumber || !config) return res.status(400).json({ error: 'Missing phoneNumber or config' });

  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';
  const phoneKey = phoneNumber.replace(/[^0-9]/g, '');

  if (!phoneKey) return res.status(400).json({ error: 'Invalid phone number' });

  try {
    const r = await fetch(
      `https://nova-launch-system-default-rtdb.firebaseio.com/ai_receptionist_config/${phoneKey}.json${fbSuffix}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, phone: phoneNumber, updatedAt: new Date().toISOString() }),
      }
    );
    const data = await r.json();
    console.log('Config saved for:', phoneNumber, 'key:', phoneKey);
    res.json({ ok: true, key: phoneKey });
  } catch(e) {
    console.error('Save config error:', e.message);
    res.status(500).json({ error: e.message });
  }
}
