// api/sms-webhook.js — receives incoming SMS from Twilio
// Set this URL in Twilio console: https://nova-team-omega.vercel.app/api/sms-webhook
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { From, To, Body, MessageSid } = req.body;

  console.log(`Incoming SMS from ${From}: ${Body}`);

  // Store incoming message in Firebase
  // (simple version — logs to console, full version requires Firebase Admin SDK)
  // For now return TwiML response
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <!-- Auto-reply disabled. Message logged. -->
</Response>`);
}
