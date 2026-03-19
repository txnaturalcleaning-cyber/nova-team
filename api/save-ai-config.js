// api/save-ai-config.js
// Saves AI receptionist config to Firebase (called from browser)
// Writes to TWO paths:
// 1. ai_receptionist_config/{phoneKey} — read by server.js (Render) on each call
// 2. partners/{partnerId}/aiReceptionist — read by UI on page load

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phoneNumber, config } = req.body || {};
  if (!phoneNumber || !config) return res.status(400).json({ error: 'Missing phoneNumber or config' });

  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';
  const phoneKey = phoneNumber.replace(/[^0-9]/g, '');

  if (!phoneKey) return res.status(400).json({ error: 'Invalid phone number' });

  const payload = { ...config, phone: phoneNumber, updatedAt: new Date().toISOString() };

  try {
    const saves = [
      // Path 1: by phone key — server.js reads this on every inbound call
      fetch(
        `${fbBase}/ai_receptionist_config/${phoneKey}.json${fbSuffix}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      ),
    ];

    // Path 2: by partnerId — UI reads this on page load
    if (config.partnerId) {
      saves.push(
        fetch(
          `${fbBase}/partners/${config.partnerId}/aiReceptionist.json${fbSuffix}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        )
      );
    }

    const results = await Promise.all(saves);
    console.log('Config saved | phoneKey:', phoneKey, '| partnerId:', config.partnerId,
      '| paths ok:', results.map(r => r.ok));

    res.json({ ok: true, key: phoneKey });
  } catch(e) {
    console.error('Save config error:', e.message);
    res.status(500).json({ error: e.message });
  }
}
