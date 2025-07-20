// No changes needed to trackingModel.js for tracking_number migration.
// Continue to use order_id as foreign key for relational integrity.

const db = require('../utils/db');
const orderModel = require('./orderModel');

// Add a tracking event
exports.addTrackingEvent = async (orderId, status, pickup_location) => {
	const result = await db.query(
		'INSERT INTO order_tracking (order_id, status, pickup_location) VALUES ($1, $2, $3) RETURNING *',
		[orderId, status, pickup_location]
	);
	return result.rows[0];
};

// Get tracking events for an order
exports.getTrackingEvents = async (orderId) => {
	const result = await db.query(
		'SELECT * FROM order_tracking WHERE order_id = $1 ORDER BY timestamp ASC',
		[orderId]
	);
	return result.rows;
};

// Fetch the latest pickup_location for an order by tracking_number
exports.getLatestPickupLocationByTrackingNumber = async (tracking_number) => {
	// Get the order by tracking_number
	const order = await orderModel.getOrderByTrackingNumber(tracking_number);
	if (!order) return null;
	// Get the latest tracking event for this order
	const result = await db.query(
		'SELECT pickup_location FROM order_tracking WHERE order_id = $1 AND pickup_location IS NOT NULL ORDER BY timestamp DESC LIMIT 1',
		[order.id]
	);
	return result.rows[0]?.pickup_location || null;
};
