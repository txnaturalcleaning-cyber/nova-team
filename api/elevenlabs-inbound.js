// api/elevenlabs-inbound.js
// Called by Twilio Dial action when browser doesn't answer
// Redirects the call to ElevenLabs native endpoint

export default function handler(req, res) {
  const agentId = process.env.ELEVENLABS_AGENT_ID || 'agent_2201kksb8516fgmvbecpydj82qcr';
  
  console.log('Redirecting to ElevenLabs:', { 
    DialCallStatus: req.body?.DialCallStatus,
    From: req.body?.From,
    To: req.body?.To 
  });

  // If browser answered — just hang up (shouldn't happen but safety check)
  if (req.body?.DialCallStatus === 'completed') {
    res.setHeader('Content-Type', 'text/xml');
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
  }

  // Redirect to ElevenLabs native inbound endpoint
  // <Redirect> re-sends all original call parameters to ElevenLabs
  res.setHeader('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Redirect method="POST">https://api.us.elevenlabs.io/twilio/inbound_call?agent_id=${agentId}</Redirect>
</Response>`);
}
