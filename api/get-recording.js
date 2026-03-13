// api/get-recording.js

export default async function handler(req, res) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const twAuth     = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const fbBase     = 'https://nova-launch-system-default-rtdb.firebaseio.com/recordings';
  const fbAuth     = process.env.FIREBASE_DB_SECRET;
  const fbSuffix   = fbAuth ? `?auth=${fbAuth}` : '';

  // ── POST: save transcript ──
  if (req.method === 'POST') {
    const { recordingSid, transcript } = req.body || {};
    if (!recordingSid) return res.json({ success: false });
    try {
      await fetch(`${fbBase}/${recordingSid}/transcript.json${fbSuffix}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transcript),
      });
    } catch(e) {}
    return res.json({ success: true });
  }

  if (req.method !== 'GET') return res.status(405).end();

  const { callSid, recordingSid, audio } = req.query;

  // ── Proxy audio ──
  if (audio === '1' && recordingSid) {
    const audioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`;
    const r = await fetch(audioUrl, { headers: { Authorization: twAuth } });
    if (!r.ok) return res.status(r.status).json({ error: 'Not ready' });
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(Buffer.from(await r.arrayBuffer()));
  }

  // ── Look up recording by callSid ──
  if (callSid) {
    // 1. Check Firebase index (fastest)
    try {
      const fbRes = await fetch(`${fbBase}_by_call/${callSid}.json${fbSuffix}`);
      const fbData = await fbRes.json();
      if (fbData && fbData.recordingSid) {
        // Get full recording details
        const fullRes = await fetch(`${fbBase}/${fbData.recordingSid}.json${fbSuffix}`);
        const full = await fullRes.json();
        if (full && full.recordingSid) {
          return res.json({ success: true, recording: full });
        }
      }
    } catch(e) {}

    // 2. Fallback: query Twilio directly for recordings on this call
    try {
      const twRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings.json?CallSid=${callSid}`,
        { headers: { Authorization: twAuth } }
      );
      const twData = await twRes.json();
      const recs = twData.recordings || [];
      if (recs.length > 0) {
        const rec = recs[0];
        const recording = {
          callSid,
          recordingSid: rec.sid,
          audioUrl: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${rec.sid}.mp3`,
          duration: parseInt(rec.duration) || 0,
          createdAt: rec.date_created,
        };
        return res.json({ success: true, recording });
      }
    } catch(e) {}

    return res.json({ success: false, recording: null });
  }

  return res.json({ success: false, error: 'callSid required' });
}
