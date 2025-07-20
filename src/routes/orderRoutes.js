const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: string
 *                 description: The Name of the merchant placing the order
 *               item:
 *                 type: string
 *                 description: The item in the order
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the item
 *               status:
 *                 type: string
 *                 description: Status of the order
 *               address:
 *                 type: string
 *                 description: Delivery address
 *             required:
 *               - merchant_id
 *               - item
 *               - quantity
 *               - status
 *               - address
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', authMiddleware, orderController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 merchant_id:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       item:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                 address:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.get('/:id', authMiddleware, orderController.getOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   post:
 *     summary: Update the status of an order
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the order (e.g., pending, shipped, delivered)
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.post('/:id/status', authMiddleware, orderController.updateOrderStatus);

router.get('/', authMiddleware, orderController.getAllOrders);
module.exports = router;