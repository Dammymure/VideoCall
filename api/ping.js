module.exports = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Cache-Control', 'no-store');
	return res.status(200).json({ ok: true, now: Date.now() });
};
