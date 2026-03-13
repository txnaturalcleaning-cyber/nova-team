// api/recording-webhook.js
// Twilio POSTs here when recording is complete

// Simple in-memory store (persists within Vercel function warm instance)
if (!global._recordings) global._recordings = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      CallSid,
      RecordingSid,
      RecordingUrl,
      RecordingDuration,
      RecordingStatus,
      From,
      To,
    } = req.body;

    console.log('Recording webhook:', { CallSid, RecordingSid, RecordingStatus, RecordingDuration });

    if (RecordingStatus !== 'completed' || !RecordingUrl || !CallSid) {
      return res.status(200).send('OK');
    }

    global._recordings[CallSid] = {
      callSid:      CallSid,
      recordingSid: RecordingSid,
      recordingUrl: RecordingUrl,
      audioUrl:     RecordingUrl + '.mp3',
      duration:     parseInt(RecordingDuration) || 0,
      from:         From || '',
      to:           To || '',
      transcript:   null,
      createdAt:    new Date().toISOString(),
    };

    console.log(`Recording saved: ${CallSid} (${RecordingDuration}s)`);
    res.status(200).send('OK');

  } catch (err) {
    console.error('Recording webhook error:', err);
    res.status(200).send('OK');
  }
}
