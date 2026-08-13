import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

let app;
let originalNodeEnv;

beforeEach(() => {
  originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';
  app = createApp();
});

afterEach(() => {
  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }
});

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

describe('POST /mine', () => {
  it('mines pending transactions into a new block and returns 201', async () => {
    const transaction = {
      sender: 'farm',
      recipient: 'roaster',
      batchId: 'B1',
      weightKg: 50,
    };

    const postTransaction = await request(app)
      .post('/transactions')
      .send(transaction);

    expect(postTransaction.status).toBe(201);

    const response = await request(app).post('/mine');

    expect(response.status).toBe(201);
    expect(response.body).toEqual(app.locals.blockchain.chain.at(-1));
    expect(response.body.transactions).toEqual([transaction]);
    expect(app.locals.blockchain.chain).toHaveLength(2);
    expect(app.locals.blockchain.chain.at(-1)).toEqual(response.body);
    expect(app.locals.blockchain.pendingTransactions).toEqual([]);
  });
});
