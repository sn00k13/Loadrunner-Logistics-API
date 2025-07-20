const request = require('supertest');
const app = require('../src/app'); // Adjust path if needed

describe('Order API', () => {
	let apiKey;
	let createdOrderId;

	beforeAll(async () => {
		// TODO: Replace with code to programmatically obtain a JWT if possible
		apiKey = process.env.API_KEY || '74a26bb0b14934f5b978c3e0b100039a';
	});

	// Ensure test orderData includes all required fields for order creation, especially pickup_location and status, to prevent 400 errors during test runs.
	const orderData = {
		merchant_id: 'test-merchant',
		item: 'Widget',
		quantity: 2,
		address: '123 Test Street',
		status: 'pending',
		pickup_location: 'Test Warehouse',
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
		expect(res.body).toHaveProperty('pickup_location');
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
		expect(res.body).toHaveProperty(
			'pickup_location',
			orderData.pickup_location
		);
	});

	it('should return 404 for a non-existent order ID', async () => {
		const res = await request(app)
			.get('/orders/999999')
			.set('Authorization', `Bearer ${apiKey}`);
		expect(res.statusCode).toBe(404);
	});

	it('should update the status of an order', async () => {
		const res = await request(app)
			.post(`/orders/${createdOrderId}/status`)
			.set('Authorization', `Bearer ${apiKey}`)
			.send({ status: 'shipped', pickup_location: 'New Pickup Location' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('id', createdOrderId);
		expect(res.body.status).toBe('shipped');
		expect(res.body).toHaveProperty('pickup_location', 'New Pickup Location');
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

describe('Order Tracking by Tracking Number API', () => {
	let apiKey;
	let trackingNumber;

	beforeAll(async () => {
		apiKey = process.env.API_KEY || '74a26bb0b14934f5b978c3e0b100039a';
		// Create a new order to use for tracking tests
		const orderData = {
			merchant_id: 'tracknum-merchant',
			item: 'Tracked Widget 2',
			quantity: 1,
			address: '789 TrackNum Street',
			status: 'pending',
			pickup_location: 'TrackNum Warehouse',
		};
		const res = await request(app)
			.post('/orders')
			.set('Authorization', `Bearer ${apiKey}`)
			.send(orderData);
		trackingNumber = res.body.tracking_number;
	});

	it('should add a tracking event to an order using tracking_number', async () => {
		const trackingData = {
			status: 'In transit',
			pickup_location: 'Checkpoint B',
		};
		const res = await request(app)
			.post(`/orders/track/${trackingNumber}/tracking`)
			.set('Authorization', `Bearer ${apiKey}`)
			.send(trackingData);
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('id');
		expect(res.body.status).toBe(trackingData.status);
		expect(res.body.pickup_location).toBe(trackingData.pickup_location);
	});

	it('should get all tracking events for an order using tracking_number', async () => {
		const res = await request(app)
			.get(`/orders/track/${trackingNumber}/tracking`)
			.set('Authorization', `Bearer ${apiKey}`);
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body[0]).toHaveProperty('status');
		expect(res.body[0]).toHaveProperty('pickup_location');
	});

	it('should return 404 for tracking events on non-existent tracking_number', async () => {
		const res = await request(app)
			.get('/orders/track/INVALIDTRACKNUM123/tracking')
			.set('Authorization', `Bearer ${apiKey}`);
		expect(res.statusCode).toBe(404);
	});
});
