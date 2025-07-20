const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const trackingController = require('../controllers/trackingController');
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
 *                 description: The ID of the merchant placing the order
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
 *               location:
 *                 type: string
 *                 description: Current location of the order
 *               updated_at:
 *                 type: string
 *                 format: date-time
 *                 description: Last updated timestamp
 *             required:
 *               - merchant_id
 *               - item
 *               - quantity
 *               - status
 *               - address
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post('/', authMiddleware, orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', authMiddleware, orderController.getAllOrders);

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
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post('/:id/status', authMiddleware, orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/tracking:
 *   post:
 *     summary: Add a tracking event to an order
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Tracking
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
 *                 description: Tracking status (e.g., Picked up, In transit, Delivered)
 *               location:
 *                 type: string
 *                 description: Location for this tracking event
 *             required:
 *               - status
 *     responses:
 *       201:
 *         description: Tracking event added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrackingEvent'
 */
router.post(
	'/:id/tracking',
	authMiddleware,
	trackingController.addTrackingEvent
);

/**
 * @swagger
 * /orders/{id}/tracking:
 *   get:
 *     summary: Get tracking history for an order
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Tracking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: List of tracking events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrackingEvent'
 */
router.get(
	'/:id/tracking',
	authMiddleware,
	trackingController.getTrackingEvents
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         merchant_id:
 *           type: string
 *         item:
 *           type: string
 *         quantity:
 *           type: integer
 *         address:
 *           type: string
 *         status:
 *           type: string
 *         location:
 *           type: string
 *         updated_at:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *     TrackingEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         order_id:
 *           type: integer
 *         status:
 *           type: string
 *         location:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 */
