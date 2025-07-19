const db = require('../utils/db');

exports.createOrder = async (orderData) => {
  // Example: Insert into DB and return order
  // You should implement proper validation and SQL here
  const result = await db.query(
    'INSERT INTO orders (merchant_id, item, quantity, address, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [orderData.merchant_id, orderData.item, orderData.quantity, orderData.address, 'pending']
  );
  return result.rows[0];
};

exports.getOrderById = async (id) => {
  const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0];
};

exports.updateOrderStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rowCount > 0;
};