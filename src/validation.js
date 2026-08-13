function validateTransaction(req, res, next) {
  if (!req.body || !req.body.batchId) {
    return res.status(400).json({ error: 'batchId is required' });
  }

  next();
}

module.exports = { validateTransaction };
