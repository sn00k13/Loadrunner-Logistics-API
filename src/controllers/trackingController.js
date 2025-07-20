const trackingModel = require('../models/trackingModel');
const orderModel = require('../models/orderModel');

exports.addTrackingEventByTrackingNumber = async (req, res) => {
	const { status, pickup_location } = req.body;
	const { tracking_number } = req.params;
	if (!status) {
		return res.status(400).json({ error: 'Status is required' });
	}
	try {
		const order = await orderModel.getOrderByTrackingNumber(tracking_number);
		if (!order) return res.status(404).json({ error: 'Order not found' });
		const event = await trackingModel.addTrackingEvent(
			order.id,
			status,
			pickup_location
		);
		res.status(201).json(event);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getTrackingEventsByTrackingNumber = async (req, res) => {
	const { tracking_number } = req.params;
	try {
		const order = await orderModel.getOrderByTrackingNumber(tracking_number);
		if (!order) return res.status(404).json({ error: 'Order not found' });
		const events = await trackingModel.getTrackingEvents(order.id);
		res.json(events);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Get the latest pickup_location for an order by tracking_number
exports.getLatestPickupLocation = async (req, res) => {
	try {
		const { tracking_number } = req.params;
		const pickup_location =
			await require('../models/trackingModel').getLatestPickupLocationByTrackingNumber(
				tracking_number
			);
		if (!pickup_location) {
			return res
				.status(404)
				.json({ error: 'No pickup location found for this tracking number' });
		}
		res.json({ tracking_number, pickup_location });
	} catch (err) {
		console.error('Error fetching latest pickup_location:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Get all tracking events in the order_tracking table
exports.getAllTrackingEvents = async (req, res) => {
	try {
		const db = require('../utils/db');
		const result = await db.query(
			'SELECT * FROM order_tracking ORDER BY id ASC'
		);
		res.json(result.rows);
	} catch (err) {
		console.error('Error fetching all tracking events:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};
