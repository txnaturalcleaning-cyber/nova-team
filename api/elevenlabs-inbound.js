// api/elevenlabs-webhook.js
// ElevenLabs calls this after conversation ends
// Saves transcript + creates lead in Firebase

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Verify ElevenLabs webhook signature
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers['elevenlabs-signature'] || '';
    const timestamp = req.headers['elevenlabs-timestamp'] || '';
    try {
      const { createHmac } = await import('crypto');
      const body    = JSON.stringify(req.body);
      const toSign  = `${timestamp}.${body}`;
      const expected = createHmac('sha256', secret).update(toSign).digest('hex');
      if (!signature.includes(expected)) {
        console.warn('Invalid ElevenLabs signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } catch(e) { console.log('Signature check error:', e.message); }
  }

  const { conversation_id, call_duration_secs, transcript, data_collection, metadata } = req.body || {};
  const fbBase   = 'https://nova-launch-system-default-rtdb.firebaseio.com';
  const fbAuth   = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  console.log('ElevenLabs webhook:', { conversation_id, duration: call_duration_secs });

  const callerPhone = metadata?.caller_id || '';

  // Extract collected data
  const col         = data_collection || {};
  const name        = col.customer_name?.value || '';
  const address     = col.address?.value || '';
  const serviceType = col.service_type?.value || '';
  const date        = col.preferred_date?.value || '';

  // Clean transcript
  const history = (transcript || []).map(t => ({
    role:    t.role,
    content: t.message,
    ts:      t.time_in_call_secs,
  }));

  // Save lead
  try {
    const leadId = 'el_' + Date.now();
    await fetch(`${fbBase}/ai_leads/${leadId}.json${fbSuffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: leadId,
        conversationId: conversation_id,
        source:        'ElevenLabs AI',
        phone:         callerPhone,
        name, address, serviceType,
        preferredDate: date,
        duration:      call_duration_secs || 0,
        transcript:    history,
        createdAt:     new Date().toISOString(),
        status:        name && address ? 'qualified_lead' : 'new_lead',
      }),
    });
    console.log('Lead saved | name:', name, '| address:', address);
  } catch(e) { console.log('Lead error:', e.message); }

  // Update call session
  try {
    await fetch(`${fbBase}/ai_calls/${conversation_id}.json${fbSuffix}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        collectedInfo: { name, address, serviceType, date },
        status: 'completed',
        duration: call_duration_secs,
      }),
    });
  } catch(e) {}

  // SMS confirmation
  if (name && callerPhone && address) {
    try {
      await fetch('https://nova-team-omega.vercel.app/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: callerPhone,
          message: `Hi ${name}! Your request for ${serviceType||'cleaning'} at ${address} is received. We will call you within 1 hour to confirm!`,
        }),
      });
    } catch(e) {}
  }

  res.json({ ok: true });
}
