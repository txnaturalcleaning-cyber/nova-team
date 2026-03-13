// api/get-recording.js
// Two modes:
//   GET ?callSid=xxx         → returns recording metadata from Firebase
//   GET ?recordingSid=xxx&audio=1  → proxies the MP3 audio from Twilio (handles auth)
//   POST { callSid, transcript }   → saves manual transcript to Firebase

import admin from 'firebase-admin';

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
  // ── SAVE MANUAL TRANSCRIPT ──
  if (req.method === 'POST') {
    const { callSid, transcript, partnerId } = req.body;
    if (!callSid || !transcript) {
      return res.status(400).json({ error: 'callSid and transcript required' });
    }
    try {
      await db.collection('callRecordings').doc(callSid).set({
        transcript,
        transcriptStatus: 'manual',
        transcribedAt:    admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'GET') return res.status(405).end();

  const { callSid, recordingSid, audio, partnerId } = req.query;

  // ── PROXY AUDIO FILE ──
  if (audio === '1' && recordingSid) {
    try {
      const accountSid  = process.env.TWILIO_ACCOUNT_SID;
      const authToken   = process.env.TWILIO_AUTH_TOKEN;
      const audioUrl    = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`;

      const response = await fetch(audioUrl, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Recording not found or not ready' });
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      const buffer = await response.arrayBuffer();
      return res.send(Buffer.from(buffer));

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── GET RECORDING METADATA BY callSid ──
  if (callSid) {
    try {
      const doc = await db.collection('callRecordings').doc(callSid).get();
      if (!doc.exists) {
        return res.json({ success: false, recording: null });
      }
      return res.json({ success: true, recording: doc.data() });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── LIST RECENT RECORDINGS ──
  try {
    const limit = parseInt(req.query.limit) || 50;
    const snapshot = await db.collection('callRecordings')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const recordings = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, recordings });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
