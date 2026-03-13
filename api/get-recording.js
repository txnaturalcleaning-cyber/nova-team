// api/recording-webhook.js
// Twilio POSTs here when a call recording is complete
// Saves recording metadata to Firebase + optionally triggers transcription

import admin from 'firebase-admin';

// Init Firebase Admin (reuse across invocations)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID   || 'nova-launch-system',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  // Twilio sends POST with form-encoded body
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      CallSid,
      RecordingSid,
      RecordingUrl,
      RecordingDuration,  // seconds
      RecordingStatus,
      From,
      To,
      Direction,
    } = req.body;

    console.log('Recording webhook:', { CallSid, RecordingSid, RecordingStatus, RecordingDuration });

    if (RecordingStatus !== 'completed' || !RecordingUrl) {
      return res.status(200).send('OK'); // ignore non-completed events
    }

    // Twilio recording URL format: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Recordings/{RecordingSid}
    // Append .mp3 for audio
    const audioUrl = RecordingUrl + '.mp3';

    // Save to Firebase callRecordings collection
    const docRef = db.collection('callRecordings').doc(CallSid);
    await docRef.set({
      callSid:          CallSid,
      recordingSid:     RecordingSid,
      recordingUrl:     RecordingUrl,
      audioUrl:         audioUrl,
      duration:         parseInt(RecordingDuration) || 0,
      from:             From || '',
      to:               To || '',
      direction:        Direction || 'outbound',
      status:           'recorded',
      transcript:       null,
      transcriptStatus: 'pending',
      createdAt:        admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`Recording saved: ${CallSid} → ${RecordingSid} (${RecordingDuration}s)`);

    // Respond 200 immediately to Twilio
    res.status(200).send('OK');

    // Attempt auto-transcription via Twilio's Intelligence API (optional, async)
    // This runs after we've already responded to Twilio
    try {
      await triggerTranscription(CallSid, RecordingSid, RecordingUrl);
    } catch (transcriptErr) {
      console.log('Auto-transcription not available:', transcriptErr.message);
      // Not critical — user can manually transcribe via the UI button
    }

  } catch (err) {
    console.error('Recording webhook error:', err);
    res.status(200).send('OK'); // Always 200 to Twilio to avoid retries
  }
}

async function triggerTranscription(callSid, recordingSid, recordingUrl) {
  // Try Twilio's built-in transcription
  // This works with Twilio Intelligence API (requires separate setup)
  // For basic accounts: just mark as needs_manual_transcription
  const db_ref = admin.firestore().collection('callRecordings').doc(callSid);

  // Check if Twilio Intelligence is configured
  const intelligenceServiceSid = process.env.TWILIO_INTELLIGENCE_SERVICE_SID;

  if (!intelligenceServiceSid) {
    await db_ref.update({ transcriptStatus: 'needs_manual' });
    return;
  }

  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  // Create an Intelligence transcript
  const transcript = await twilio.intelligence.v2.transcripts.create({
    serviceSid: intelligenceServiceSid,
    channel: {
      media_properties: {
        media_url: recordingUrl + '.mp3',
      }
    }
  });

  await db_ref.update({
    transcriptSid:    transcript.sid,
    transcriptStatus: 'processing',
  });
}
