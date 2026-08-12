import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { calculateHash, Blockchain } from '../src/blockchain.js';

describe('calculateHash', () => {
  it('returns SHA-256 of index + previousHash + JSON.stringify(transactions) + nonce', () => {
    const block = {
      index: 1,
      previousHash: 'abc',
      transactions: [
        { sender: 'farm', recipient: 'roaster', batchId: 'B1', weightKg: 50 },
      ],
      nonce: 42,
    };

    const payload =
      block.index +
      block.previousHash +
      JSON.stringify(block.transactions) +
      block.nonce;

    const expected = crypto.createHash('sha256').update(payload).digest('hex');

    expect(calculateHash(block)).toBe(expected);
  });
});

describe('Blockchain#mineBlock', () => {
  let originalNodeEnv;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('mines pending transactions into a valid proof-of-work block', () => {
    const transaction = {
      sender: 'farm',
      recipient: 'roaster',
      batchId: 'B1',
      weightKg: 50,
    };

    const blockchain = new Blockchain();
    blockchain.pendingTransactions.push(transaction);

    const minedBlock = blockchain.mineBlock();

    expect(minedBlock.hash.startsWith('0')).toBe(true);
    expect(typeof minedBlock.nonce).toBe('number');
    expect(minedBlock.transactions).toEqual([transaction]);
    expect(minedBlock.hash).toBe(
      calculateHash({
        index: minedBlock.index,
        previousHash: minedBlock.previousHash,
        transactions: minedBlock.transactions,
        nonce: minedBlock.nonce,
      }),
    );
    expect(blockchain.chain.at(-1)).toEqual(minedBlock);
    expect(blockchain.pendingTransactions).toEqual([]);
  });
});

describe('Blockchain#addTransaction', () => {
  it('adds a transaction to pendingTransactions and returns the updated count', () => {
    const transaction = {
      sender: 'farm',
      recipient: 'roaster',
      batchId: 'B1',
      weightKg: 50,
    };

    const blockchain = new Blockchain();
    const pendingCount = blockchain.addTransaction(transaction);

    expect(pendingCount).toBe(1);
    expect(blockchain.pendingTransactions).toEqual([transaction]);
  });
});
