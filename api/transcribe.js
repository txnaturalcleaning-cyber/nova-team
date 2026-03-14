// api/transcribe.js
// Downloads MP3 from Twilio → sends to AssemblyAI (speaker diarization + auto language)
// Polls until done → saves transcript + speaker lines to Firebase → returns result

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { recordingSid, contactName } = req.body || {};
  if (!recordingSid) return res.status(400).json({ success: false, error: 'recordingSid required' });

  const accountSid    = process.env.TWILIO_ACCOUNT_SID;
  const authToken     = process.env.TWILIO_AUTH_TOKEN;
  const assemblyKey   = process.env.ASSEMBLYAI_API_KEY;
  const fbBase        = 'https://nova-launch-system-default-rtdb.firebaseio.com/recordings';
  const fbAuth        = process.env.FIREBASE_DB_SECRET;
  const fbSuffix      = fbAuth ? `?auth=${fbAuth}` : '';

  if (!assemblyKey) return res.status(500).json({ success: false, error: 'ASSEMBLYAI_API_KEY not set in Vercel env' });

  try {
    // ── 1. Get public audio URL (Twilio authenticated URL won't work directly with AssemblyAI)
    //       We proxy the audio through our own endpoint so AssemblyAI can fetch it
    const audioUrl = `https://nova-team-omega.vercel.app/api/get-recording?recordingSid=${recordingSid}&audio=1`;

    // ── 2. Submit transcription job to AssemblyAI
    const submitRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': assemblyKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url:          audioUrl,
        speaker_labels:     true,          // Agent vs Client diarization
        language_detection: true,          // Auto-detect RU/EN/ES/etc
        speakers_expected:  2,             // Usually agent + client
        punctuate:          true,
        format_text:        true,
      }),
    });

    const submitData = await submitRes.json();
    if (!submitData.id) {
      console.error('AssemblyAI submit error:', submitData);
      return res.json({ success: false, error: submitData.error || 'AssemblyAI submit failed' });
    }

    const transcriptId = submitData.id;

    // Save "processing" status immediately so UI can show spinner
    await fetch(`${fbBase}/${recordingSid}/transcriptStatus.json${fbSuffix}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify('processing'),
    });

    // ── 3. Poll AssemblyAI until completed (max 120s, every 3s)
    let result = null;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const pollRes  = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { 'Authorization': assemblyKey },
      });
      const pollData = await pollRes.json();

      if (pollData.status === 'completed') {
        result = pollData;
        break;
      }
      if (pollData.status === 'error') {
        await fetch(`${fbBase}/${recordingSid}/transcriptStatus.json${fbSuffix}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify('error'),
        });
        return res.json({ success: false, error: 'AssemblyAI error: ' + pollData.error });
      }
    }

    if (!result) {
      // Still processing — save transcriptId so client can poll separately
      await fetch(`${fbBase}/${recordingSid}/assemblyId.json${fbSuffix}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transcriptId),
      });
      return res.json({ success: false, status: 'processing', transcriptId });
    }

    // ── 4. Format speaker lines
    //    AssemblyAI uses Speaker A / B — map to Agent / Client
    //    (first speaker = Agent since they initiate the call)
    const speakerMap   = {};
    let speakerCounter = 0;
    const speakerLabels= ['Agent', 'Client', 'Other'];

    const lines = (result.utterances || []).map(u => {
      if (!(u.speaker in speakerMap)) {
        speakerMap[u.speaker] = speakerLabels[speakerCounter++] || `Speaker ${u.speaker}`;
      }
      const mm  = Math.floor(u.start / 60000);
      const ss  = Math.floor((u.start % 60000) / 1000);
      const ts  = `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
      return { ts, speaker: speakerMap[u.speaker], text: u.text };
    });

    const transcriptText = lines.map(l => `${l.ts}  ${l.speaker}: ${l.text}`).join('\n');
    const language       = result.language_code || 'en';

    // ── 5. Save everything to Firebase
    const savePayload = {
      transcript:       transcriptText,
      transcriptLines:  lines,          // structured for UI rendering
      transcriptStatus: 'completed',
      language,
      assemblyId:       transcriptId,
      transcribedAt:    new Date().toISOString(),
    };

    await fetch(`${fbBase}/${recordingSid}.json${fbSuffix}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savePayload),
    });

    return res.json({
      success:         true,
      transcript:      transcriptText,
      transcriptLines: lines,
      language,
    });

  } catch (e) {
    console.error('Transcribe error:', e);
    return res.status(500).json({ success: false, error: e.message });
  }
}
