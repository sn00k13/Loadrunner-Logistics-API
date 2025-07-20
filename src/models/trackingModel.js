const db = require('../utils/db');

// Add a tracking event
exports.addTrackingEvent = async (orderId, status, location) => {
  const result = await db.query(
    'INSERT INTO order_tracking (order_id, status, location) VALUES ($1, $2, $3) RETURNING *',
    [orderId, status, location]
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