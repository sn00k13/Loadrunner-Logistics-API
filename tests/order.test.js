const request = require('supertest');
const app = require('../src/app'); // Adjust path if needed

describe('Order API', () => {
  let apiKey;
  let createdOrderId;

  beforeAll(async () => {
    // TODO: Replace with code to programmatically obtain a JWT if possible
   apiKey = process.env.API_KEY || 'my-not-so-secure-api-key';
  });

  const orderData = {
    merchant_id: 'test-customer',
    item: 'Heineken',
    quantity: 2,
    address: '123 Test Street',
    status: 'pending',
  };

  it('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(401);
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${apiKey}`)
      .send(orderData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.merchant_id).toBe(orderData.merchant_id);
    createdOrderId = res.body.id;
  });

  it('should get all orders', async () => {
    const res = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get an order by ID', async () => {
    const res = await request(app)
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${apiKey}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdOrderId);
    expect(res.body.merchant_id).toBe(orderData.merchant_id);
    expect(res.body.item).toBe(orderData.item);
    expect(res.body.quantity).toBe(orderData.quantity);
    expect(res.body.address).toBe(orderData.address);
    expect(res.body.status).toBe(orderData.status);
  });

  it('should return 404 for a non-existent order ID', async () => {
    const res = await request(app)
      .get('/orders/nonexistentid')
      .set('Authorization', `Bearer ${apiKey}`);
    expect(res.statusCode).toBe(404);
  });

  it('should update the status of an order', async () => {
    const res = await request(app)
      .post(`/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ status: 'shipped' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdOrderId);
    expect(res.body.status).toBe('shipped');
  });

  it('should return 400 when updating status with missing field', async () => {
    const res = await request(app)
      .post(`/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('should return 401 for protected endpoints with invalid token', async () => {
    const res = await request(app)
      .get('/orders')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
  });
});