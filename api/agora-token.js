const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = async (req, res) => {
	// Basic headers: JSON, CORS, and no caching
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');

	if (req.method === 'OPTIONS') {
		return res.status(204).end();
	}

	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	try {
		const appId = process.env.AGORA_APP_ID;
		const appCertificate = process.env.AGORA_APP_CERTIFICATE;
		if (!appId || !appCertificate) {
			return res.status(500).json({ error: 'Server misconfigured: missing AGORA_APP_ID or AGORA_APP_CERTIFICATE' });
		}

		const { channel, uid, role = 'publisher', expireSeconds = '3600' } = req.query || {};
		if (!channel) {
			return res.status(400).json({ error: 'Missing channel' });
		}

		const agoraRole = role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
		const expireTimeInSeconds = Math.max(60, parseInt(expireSeconds, 10) || 3600);
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const privilegeExpireTs = currentTimestamp + expireTimeInSeconds;

		// Agora web SDK supports both numeric and string UIDs. Use 0 when not provided.
		const sanitizedUid = uid && `${uid}`.length > 0 ? uid : 0;

		const token = RtcTokenBuilder.buildTokenWithUid(
			appId,
			appCertificate,
			channel,
			Number.isNaN(Number(sanitizedUid)) ? 0 : Number(sanitizedUid),
			agoraRole,
			privilegeExpireTs
		);

		return res.status(200).json({ appId, channel, uid: sanitizedUid, token, expiresAt: privilegeExpireTs });
	} catch (err) {
		console.error('Error generating Agora token', err);
		return res.status(500).json({ error: 'Failed to generate token' });
	}
};
