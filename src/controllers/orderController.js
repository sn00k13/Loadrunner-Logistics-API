const orderModel = require('../models/orderModel');

const generateTrackingNumber = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `LOADRL-${date}-${rand}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { merchant_id, item, quantity, address, status, location } = req.body;
    const orderData = {
      merchant_id,
      item,
      quantity,
      address,
      status,
      location,
      tracking_number: generateTrackingNumber()
    };
    const order = await orderModel.createOrder(orderData);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const updated = await orderModel.updateOrderStatus(req.params.id, req.body.status, req.body.tracking, req.body.location, req.body.timestamp || new Date());
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
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