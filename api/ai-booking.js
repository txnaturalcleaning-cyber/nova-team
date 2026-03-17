// api/ai-booking.js
// Called by server.js (Render) to save AI-generated bookings to Firebase
// These bookings appear PINK in the calendar so manager knows to follow up

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    partnerId, name, phone, address,
    serviceType, date, notes, callSid,
  } = req.body || {};

  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  const bookingId = 'ai_' + Date.now();

  const booking = {
    id:          bookingId,
    callSid:     callSid     || '',
    clientName:  name        || '',
    phone:       phone       || '',
    address:     address     || '',
    serviceType: serviceType || 'Cleaning',
    date:        date        || '',
    notes:       notes       || '',
    status:      'pending_confirmation',  // manager needs to confirm
    source:      'AI Receptionist',
    aiGenerated: true,
    color:       'pink',                  // ← bright pink in calendar
    createdAt:   new Date().toISOString(),
  };

  try {
    const saves = [];

    // 1. Save to partner workspace/bookings (shows in calendar)
    if (partnerId) {
      saves.push(
        fetch(`${fbBase}/partners/${partnerId}/workspace/bookings/${bookingId}.json${fbSuffix}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking),
        })
      );
    }

    // 2. Save to ai_leads (shows in Leads panel)
    saves.push(
      fetch(`${fbBase}/ai_leads/${bookingId}.json${fbSuffix}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, status: 'new_lead' }),
      })
    );

    await Promise.all(saves);

    console.log('AI booking saved:', bookingId, 'partner:', partnerId);
    return res.status(200).json({ success: true, bookingId });

  } catch(e) {
    console.error('AI booking error:', e.message);
    return res.status(500).json({ success: false, error: e.message });
  }
}
