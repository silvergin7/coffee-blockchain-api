import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /blockchain', () => {
  it('returns the full chain including the genesis block', async () => {
    const response = await request(app).get('/blockchain');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      index: 0,
      transactions: [],
      previousHash: '0',
    });
  });
});

describe('POST /transactions', () => {
  it('adds a valid transaction to pendingTransactions and returns 201', async () => {
    const transaction = {
      sender: 'farm',
      recipient: 'roaster',
      batchId: 'B1',
      weightKg: 50,
    };

    const response = await request(app)
      .post('/transactions')
      .send(transaction);

    expect(response.status).toBe(201);
    expect(app.locals.blockchain.pendingTransactions).toEqual([transaction]);
  });
});
