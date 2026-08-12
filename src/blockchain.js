const crypto = require('crypto');

function calculateHash(block) {
  const payload =
    block.index +
    block.previousHash +
    JSON.stringify(block.transactions) +
    block.nonce;

  return crypto.createHash('sha256').update(payload).digest('hex');
}

class Blockchain {
  constructor() {
    this.difficulty =
      process.env.NODE_ENV === 'test'
        ? 1
        : Number(process.env.POW_DIFFICULTY ?? 3);
    this.pendingTransactions = [];
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: 0,
      transactions: [],
      previousHash: '0',
      nonce: 0,
    };

    genesisBlock.hash = calculateHash(genesisBlock);
    return genesisBlock;
  }

  mineBlock() {
    const transactions = [...this.pendingTransactions];

    const previousHash = this.chain.at(-1).hash;
    const index = this.chain.length;
    const timestamp = Date.now();
    const target = '0'.repeat(this.difficulty);

    let nonce = 0;
    let hash = calculateHash({ index, previousHash, transactions, nonce });

    while (!hash.startsWith(target)) {
      nonce++;
      hash = calculateHash({ index, previousHash, transactions, nonce });
    }

    const block = {
      index,
      timestamp,
      transactions,
      previousHash,
      nonce,
      hash,
    };

    this.chain.push(block);
    this.pendingTransactions = [];
    return block;
  }
}

module.exports = { calculateHash, Blockchain };
