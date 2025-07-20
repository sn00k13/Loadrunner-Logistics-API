const orderModel = require('../models/orderModel');

const generateTrackingNumber = () => {
	const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
	return `LOADRL-${date}-${rand}`;
};

exports.createOrder = async (req, res) => {
	try {
		const { merchant_id, item, quantity, address, status, pickup_location } =
			req.body;
		const orderData = {
			merchant_id,
			item,
			quantity,
			address,
			status,
			pickup_location,
			tracking_number: generateTrackingNumber(),
		};
		const order = await orderModel.createOrder(orderData);
		res.status(201).json(order);
	} catch (err) {
		console.error('Order creation error:', err);
		res.status(400).json({ error: err.message });
	}
};

exports.getOrder = async (req, res) => {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(404).json({ error: 'Order not found' });
		const order = await orderModel.getOrderById(id);
		if (!order) return res.status(404).json({ error: 'Order not found' });
		res.json(order);
	} catch (err) {
		console.error('Get order error:', err);
		res.status(500).json({ message: 'Failed to fetch order' });
	}
};

exports.updateOrderStatus = async (req, res) => {
	try {
		const updated = await orderModel.updateOrderStatus(
			Number(req.params.id),
			req.body.status,
			req.body.pickup_location,
			req.body.updated_at || new Date()
		);
		if (!updated) return res.status(404).json({ error: 'Order not found' });
		res.json(updated);
	} catch (err) {
		console.error('Update status error:', err);
		res.status(400).json({ error: err.message });
	}
};

exports.getAllOrders = async (req, res) => {
	try {
		const orders = await orderModel.getAllOrders();
		res.json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Failed to fetch orders' });
	}
};
