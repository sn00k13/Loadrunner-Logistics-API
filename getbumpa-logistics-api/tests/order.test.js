const request = require('supertest');
const app = require('../src/app');

describe('Order API', () => {
  it('should return 401 without API key', async () => {
    const res = await request(app).post('/orders').send({});
    expect(res.statusCode).toEqual(401);
  });
});