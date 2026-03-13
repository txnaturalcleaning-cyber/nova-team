// api/get-recording.js
// GET ?callSid=xxx  → returns recording metadata
// GET ?recordingSid=xxx&audio=1  → proxies MP3 audio from Twilio
// POST { callSid, transcript }  → saves manual transcript

if (!global._recordings) global._recordings = {};

export default async function handler(req, res) {
  // Save manual transcript
  if (req.method === 'POST') {
    const { callSid, transcript } = req.body;
    if (!callSid || !transcript) {
      return res.status(400).json({ error: 'callSid and transcript required' });
    }
    if (global._recordings[callSid]) {
      global._recordings[callSid].transcript = transcript;
      global._recordings[callSid].transcribedAt = new Date().toISOString();
    }
    return res.json({ success: true });
  }

  if (req.method !== 'GET') return res.status(405).end();

  const { callSid, recordingSid, audio } = req.query;

  // Proxy audio file with Twilio auth
  if (audio === '1' && recordingSid) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken  = process.env.TWILIO_AUTH_TOKEN;
      const audioUrl   = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`;

      const response = await fetch(audioUrl, {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        },
      });

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

  // Get recording metadata by callSid
  if (callSid) {
    const recording = global._recordings[callSid] || null;
    return res.json({ success: !!recording, recording });
  }

  // List all recordings
  const recordings = Object.values(global._recordings)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 50);
  return res.json({ success: true, recordings });
}
