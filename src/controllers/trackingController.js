const trackingModel = require('../models/trackingModel');

exports.addTrackingEvent = async (req, res) => {
  const { status, location } = req.body;
  const { id: orderId } = req.params;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  try {
    const event = await trackingModel.addTrackingEvent(orderId, status, location);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrackingEvents = async (req, res) => {
  const { id: orderId } = req.params;
  try {
    const events = await trackingModel.getTrackingEvents(orderId);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};