const db = require('../utils/db');

exports.createOrder = async (orderData) => {
	const { merchant_id, item, quantity, address, status, tracking_number } =
		orderData;
	const result = await db.query(
		'INSERT INTO orders (merchant_id, item, quantity, address, status, created_at, updated_at, tracking_number) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6) RETURNING *',
		[merchant_id, item, quantity, address, status, tracking_number]
	);
	return result.rows[0];
};

exports.getOrderById = async (id) => {
	const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
	return result.rows[0];
};

exports.updateOrderStatus = async (orderId, status, updated_at) => {
	const result = await db.query(
		'UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
		[status, updated_at, orderId]
	);
	return result.rows[0];
};

exports.getAllOrders = async () => {
	const result = await db.query('SELECT * FROM orders');
	return result.rows;
};

exports.getOrderByTrackingNumber = async (tracking_number) => {
	const result = await db.query(
		'SELECT * FROM orders WHERE tracking_number = $1',
		[tracking_number]
	);
	return result.rows[0];
};

// No changes needed to orderModel.js for tracking_number migration (other than getOrderByTrackingNumber already added).
