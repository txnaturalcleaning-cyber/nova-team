// api/recording-status.js — webhook called by Twilio when recording is ready
export default async function handler(req, res) {
  const {
    RecordingUrl,
    RecordingSid,
    CallSid,
    RecordingDuration,
  } = req.body || {};

  console.log('Recording ready:', { RecordingUrl, RecordingSid, CallSid, RecordingDuration });

  // TODO: Save recording URL to Firebase linked to the contact
  // For now just acknowledge
  res.status(200).json({ received: true, recordingUrl: RecordingUrl });
}
