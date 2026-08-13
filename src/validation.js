const requiredFields = ['sender', 'recipient', 'batchId', 'weightKg'];

function validateTransaction(req, res, next) {
  const missingField = requiredFields.find(
    (field) => !req.body || !(field in req.body),
  );

  if (missingField) {
    return res.status(400).json({ error: `${missingField} is required` });
  }

  next();
}

module.exports = { validateTransaction };
