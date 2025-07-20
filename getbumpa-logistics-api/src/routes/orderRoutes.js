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
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer placing the order
 *               items:
 *                 type: array
 *                 description: List of items in the order
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: The product ID
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
 *               address:
 *                 type: string
 *                 description: Delivery address
 *             required:
 *               - customerId
 *               - items
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
 *                 customerId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
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