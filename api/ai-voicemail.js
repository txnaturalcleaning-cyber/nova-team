// api/ai-voicemail.js
// Saves voicemail recording when caller doesn't respond to AI

export default async function handler(req, res) {
  const { CallSid, From, RecordingUrl, RecordingDuration } = req.body || {};
  const fbBase  = 'https://nova-launch-system-default-rtdb.firebaseio.com/ai_leads';
  const fbAuth  = process.env.FIREBASE_DB_SECRET;
  const fbSuffix = fbAuth ? `?auth=${fbAuth}` : '';

  console.log('Voicemail received:', { CallSid, From, RecordingDuration });

  if (RecordingUrl) {
    try {
      const leadId = 'vm_' + Date.now();
      await fetch(`${fbBase}/${leadId}.json${fbSuffix}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          callSid: CallSid,
          phone: From,
          type: 'voicemail',
          recordingUrl: RecordingUrl + '.mp3',
          duration: parseInt(RecordingDuration) || 0,
          createdAt: new Date().toISOString(),
          status: 'new_lead',
        }),
      });
    } catch(e) { console.log('Voicemail save error:', e.message); }
  }

  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thank you for your message. We will call you back as soon as possible. Have a great day!</Say>
  <Hangup/>
</Response>`);
}
