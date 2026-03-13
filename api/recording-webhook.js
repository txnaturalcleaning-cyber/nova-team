// api/recording-webhook.js
// Twilio POSTs here when recording is done.
// Saves to Firebase REST API - no Admin SDK needed.

export default async function handler(req, res) {
  // Always respond 200 immediately so Twilio doesn't retry
  res.status(200).send('OK');

  if (req.method !== 'POST') return;

  const {
    CallSid, RecordingSid, RecordingUrl,
    RecordingDuration, RecordingStatus, From, To,
  } = req.body || {};

  console.log('Recording webhook:', { CallSid, RecordingSid, RecordingStatus, RecordingDuration });

  if (RecordingStatus !== 'completed' || !RecordingSid) return;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  // Find the parent CallSid via Twilio API (recording is on child call)
  let parentCallSid = CallSid;
  try {
    const callUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls/${CallSid}.json`;
    const auth = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const callRes = await fetch(callUrl, { headers: { Authorization: auth } });
    const callData = await callRes.json();
    // If this call has a parent, use that as the key
    if (callData.parent_call_sid) {
      parentCallSid = callData.parent_call_sid;
      console.log(`Child call ${CallSid} → parent ${parentCallSid}`);
    }
  } catch(e) {
    console.log('Could not fetch parent call:', e.message);
  }

  const recording = {
    callSid:      CallSid,
    parentCallSid,
    recordingSid: RecordingSid,
    recordingUrl: RecordingUrl,
    audioUrl:     `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${RecordingSid}.mp3`,
    duration:     parseInt(RecordingDuration) || 0,
    from:         From || '',
    to:           To || '',
    createdAt:    new Date().toISOString(),
  };

  // Save to Firebase under BOTH callSid and parentCallSid so we can find it either way
  const fbBase = `https://nova-launch-system-default-rtdb.firebaseio.com/recordings`;
  const fbAuth = process.env.FIREBASE_DB_SECRET; // set in Vercel env vars
  const suffix = fbAuth ? `?auth=${fbAuth}` : '';

  try {
    await fetch(`${fbBase}/${RecordingSid}.json${suffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recording),
    });
    // Also index by parentCallSid for easy lookup
    await fetch(`${fbBase}_by_call/${parentCallSid}.json${suffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordingSid: RecordingSid, duration: recording.duration }),
    });
    console.log(`Saved recording ${RecordingSid} for call ${parentCallSid}`);
  } catch(e) {
    console.error('Firebase save error:', e.message);
  }
}
