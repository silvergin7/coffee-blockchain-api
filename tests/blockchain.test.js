import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { calculateHash } from '../src/blockchain.js';

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
