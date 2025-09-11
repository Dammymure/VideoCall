const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
require('dotenv').config();

const app = express();

// Allow requests from your Vercel frontend domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://video-call-iota-hazel.vercel.app/'
    : 'http://localhost:3000'
}));

app.use(express.json());

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Token generation endpoint
app.post('/token', (req, res) => {
  const channelName = req.body.channelName;
  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required' });
  }

  const appId = process.env.APP_ID;
  const appCertificate = process.env.APP_CERTIFICATE;
  
  if (!appId || !appCertificate) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      0,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    return res.json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});