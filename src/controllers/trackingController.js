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
