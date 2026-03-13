// api/get-recording.js
// Fetches recording directly from Twilio API by CallSid - no storage needed

export default async function handler(req, res) {

  // Save manual transcript (store in Twilio call metadata isn't possible,
  // so we return success and frontend stores it locally in state)
  if (req.method === 'POST') {
    return res.json({ success: true });
  }

  if (req.method !== 'GET') return res.status(405).end();

  const { callSid, recordingSid, audio } = req.query;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  // ── Proxy audio file ──
  if (audio === '1' && recordingSid) {
    try {
      const audioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`;
      const response = await fetch(audioUrl, { headers: { Authorization: authHeader } });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Recording not ready yet' });
      }
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      const buffer = await response.arrayBuffer();
      return res.send(Buffer.from(buffer));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── Get recording by CallSid — query Twilio directly ──
  if (callSid) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings.json?CallSid=${callSid}`;
      const response = await fetch(url, { headers: { Authorization: authHeader } });
      const data = await response.json();

      if (!response.ok) {
        return res.json({ success: false, recording: null, error: data.message });
      }

      const recordings = data.recordings || [];
      if (recordings.length === 0) {
        return res.json({ success: false, recording: null }); // not ready yet
      }

      // Take most recent recording for this call
      const rec = recordings[0];
      return res.json({
        success: true,
        recording: {
          callSid:      rec.call_sid,
          recordingSid: rec.sid,
          recordingUrl: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${rec.sid}`,
          audioUrl:     `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${rec.sid}.mp3`,
          duration:     parseInt(rec.duration) || 0,
          createdAt:    rec.date_created,
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.json({ success: false, error: 'callSid required' });
}
