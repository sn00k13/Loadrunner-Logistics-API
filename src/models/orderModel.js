const db = require('../utils/db');

exports.createOrder = async (orderData) => {
	const result = await db.query(
		`INSERT INTO orders 
      (merchant_id, item, quantity, address, status, pickup_location, created_at, updated_at, tracking_number) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING *`,
		[
			orderData.merchant_id,
			orderData.item,
			orderData.quantity,
			orderData.address,
			orderData.status || 'pending',
			orderData.pickup_location,
			orderData.created_at || new Date(),
			orderData.updated_at || new Date(),
			orderData.tracking_number,
		]
	);
	return result.rows[0];
};

exports.getOrderById = async (id) => {
	const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
	return result.rows[0];
};

exports.updateOrderStatus = async (
	id,
	status,
	pickup_location = null,
	updated_at = new Date()
) => {
	const result = await db.query(
		'UPDATE orders SET status = $1, pickup_location = $2, updated_at = $3 WHERE id = $4 RETURNING *',
		[status, pickup_location, updated_at, id]
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
