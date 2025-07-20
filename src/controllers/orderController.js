const orderModel = require('../models/orderModel');

const generateTrackingNumber = () => {
	const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
	return `LOADRL-${date}-${rand}`;
};

exports.createOrder = async (req, res) => {
	try {
		const { merchant_id, item, quantity, address, status, delivery_fee } =
			req.body;
		const tracking_number = generateTrackingNumber();
		const order = await orderModel.createOrder({
			merchant_id,
			item,
			quantity,
			address,
			status,
			tracking_number,
			delivery_fee,
		});
		res.status(201).json(order);
	} catch (err) {
		console.error('Order creation error:', err);
		res.status(500).json({ error: err.message });
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

// Customized delivery fee estimation
exports.estimateDeliveryFee = async (req, res) => {
	try {
		const {
			address = '',
			city = '',
			region = '',
			item_type = '',
			item_weight = 1,
		} = req.body;

		// Example logic (customize as needed):
		let baseFee = 1000;

		// Region/city/address logic
		let locationFee = 1000;
		if (
			city.toLowerCase() === 'lagos' ||
			address.toLowerCase().includes('lagos')
		) {
			locationFee = 500;
		} else if (region.toLowerCase() === 'southwest') {
			locationFee = 800;
		}

		// Item type logic
		let typeFee = 0;
		if (item_type.toLowerCase() === 'fragile') typeFee = 800;
		else if (item_type.toLowerCase() === 'electronics') typeFee = 600;
		else if (item_type.toLowerCase() === 'clothing') typeFee = 200;

		// Item weight logic (per kg, min 1kg)
		let weightFee = Math.max(item_weight, 1) * 300;

		const delivery_fee = baseFee + locationFee + typeFee + weightFee;
		res.json({
			delivery_fee,
			currency: 'NGN',
			estimated_delivery_time: '2-3 days',
		});
	} catch (err) {
		console.error('Error estimating delivery fee:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};
