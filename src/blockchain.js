const crypto = require('crypto');

function calculateHash(block) {
  const payload =
    block.index +
    block.previousHash +
    JSON.stringify(block.transactions) +
    block.nonce;

  return crypto.createHash('sha256').update(payload).digest('hex');
}

module.exports = { calculateHash };
