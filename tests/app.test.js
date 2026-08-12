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
