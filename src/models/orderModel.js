const db = require('../utils/db');

exports.createOrder = async (orderData) => {
	const result = await db.query(
		`INSERT INTO orders 
      (merchant_id, item, quantity, address, status, location, created_at, updated_at, tracking_number) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING *`,
		[
			orderData.merchant_id,
			orderData.item,
			orderData.quantity,
			orderData.address,
			orderData.status || 'pending',
			orderData.location,
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
	location = null,
	updated_at = new Date()
) => {
	const result = await db.query(
		'UPDATE orders SET status = $1, location = $2, updated_at = $3 WHERE id = $4 RETURNING *',
		[status, location, updated_at, id]
	);
	return result.rows[0];
};

exports.getAllOrders = async () => {
	const result = await db.query('SELECT * FROM orders');
	return result.rows;
};
