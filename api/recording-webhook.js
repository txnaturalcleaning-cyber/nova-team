// api/recording-webhook.js
// Twilio posts here when recording completes.
// We don't store anything here — recordings are fetched directly
// from Twilio API via get-recording.js

export default function handler(req, res) {
  const { CallSid, RecordingSid, RecordingDuration, RecordingStatus } = req.body || {};
  console.log('Recording webhook:', { CallSid, RecordingSid, RecordingStatus, RecordingDuration });
  // Always respond 200 so Twilio doesn't retry
  res.status(200).send('OK');
}
