# LoadRunner Logistics API

## Overview

This project is a Node.js/Express REST API for managing orders from getbumpa.com merchants.
It features JWT authentication, order management endpoints, and auto-generated API docs via Swagger.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [Running the API](#running-the-api)
7. [API Documentation (Swagger)](#api-documentation-swagger)
8. [Authentication](#authentication)
9. [API Endpoints](#api-endpoints)
10. [Error Handling](#error-handling)
11. [Extending the API](#extending-the-api)
12. [Contributing](#contributing)
13. [License](#license)
14. [GetBumpa Logistics API – Integration & Onboarding Guide](#getbumpa-logistics-api--integration--onboarding-guide)

---

## Features

- Create, fetch, and update orders
- JWT-based authentication
- Secure headers via Helmet
- CORS enabled
- Interactive API documentation with Swagger UI

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (via `db` utility)
- Swagger (OpenAPI 3.0)
- JWT for authentication
- Helmet, CORS

---

## Project Structure

```
src/
  ├─ app.js                # Main Express app
  ├─ swagger.js            # Swagger/OpenAPI config
  ├─ routes/
  │    └─ orderRoutes.js   # Order-related endpoints
  ├─ controllers/
  │    └─ orderController.js
  ├─ models/
  │    └─ orderModel.js
  ├─ middleware/
  │    └─ authMiddleware.js
  └─ utils/
       └─ db.js            # Database connection utilities
```

---

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd getbumpa-logistics-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your database**
   Ensure PostgreSQL is running and you have created the required tables.

---

## Environment Variables

Create a `.env` file in the root directory with the following variables (example):

```
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/yourdb
JWT_SECRET=your_jwt_secret
```

---

## Running the API

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

## API Documentation (Swagger)

Interactive API docs are available at:  
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## Authentication

All endpoints (except health check `/`) require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

---

## API Endpoints

### Health Check

- `GET /`  
  Returns: `"API is running"`

---

### Orders

#### Create Order

- `POST /orders`
- **Body:**
  ```json
  {
  	"customerId": "string",
  	"items": [{ "productId": "string", "quantity": 1 }],
  	"address": "string"
  }
  ```
- **Response:**  
  `201 Created` with the created order object

---

#### Get All Orders

- `GET /orders`
- **Response:**  
  `200 OK`  
  Returns a list of all orders

---

#### Get Order by ID

- `GET /orders/:id`
- **Response:**  
  `200 OK`  
  Returns the order object

---

#### Update Order Status

- `POST /orders/:id/status`
- **Body:**
  ```json
  { "status": "pending | shipped | delivered | ..." }
  ```
- **Response:**  
  `200 OK`  
  Returns confirmation of update

---

#### Get Latest Pickup Location for an Order

- `GET /orders/track/{tracking_number}/latest-pickup-location`
- **Response:**
  ```json
  { "tracking_number": "...", "pickup_location": "..." }
  ```
- Returns the most recent pickup location for the order based on tracking events.

---

#### Estimate Delivery Fee

- `POST /orders/estimate-delivery-fee`
- **Request body:**
  ```json
  {
  	"address": "Lagos, Nigeria",
  	"item": "Shoes",
  	"quantity": 2
  }
  ```
- **Response:**
  ```json
  {
  	"delivery_fee": 1900,
  	"currency": "NGN",
  	"estimated_delivery_time": "2-3 days"
  }
  ```
- Returns estimated delivery fee and ETA (does not create the order).

---

### Order Tracking

- `pickup_location` removed from orders table and order creation API. To get pickup location for an order, query the latest tracking event from the order_tracking table using the order's tracking_number.

#### Get All Tracking Events (Admin/Debug)

- `GET /track/all`
- **Response:**
  ```json
  [
    { "id": 1, "order_id": 123, "status": "Picked up", "pickup_location": "Warehouse A", ... },
    ...
  ]
  ```
- Returns all tracking events in the order_tracking table (requires API key).

---

## Error Handling

- All errors return a JSON response with an `error` or `message` field.
- Common HTTP status codes used: `400`, `401`, `404`, `500`.

---

## Extending the API

- Add new routes in `routes/`
- Implement business logic in `controllers/`
- Add database queries in `models/`
- Document new endpoints with Swagger JSDoc comments

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

---

## License

MIT (or your chosen license)

---

## GetBumpa Logistics API – Integration & Onboarding Guide

Welcome to the GetBumpa Logistics API!
This guide will walk you through the full order and tracking flow, including delivery fee estimation, order creation, and tracking updates.

---

## Authentication

All endpoints require Bearer token authentication.

- **Header:**  
  `Authorization: Bearer <YOUR_API_KEY>`

---

## API Endpoints Overview

| Purpose                | Method | Endpoint                                                 | Auth Required | Description                                  |
| ---------------------- | ------ | -------------------------------------------------------- | ------------- | -------------------------------------------- |
| Estimate Delivery Fee  | POST   | `/orders/estimate-delivery-fee`                          | Yes           | Calculate delivery fee before order creation |
| Create Order           | POST   | `/orders`                                                | Yes           | Create a new order (with delivery fee)       |
| Get Order By ID        | GET    | `/orders/{id}`                                           | Yes           | Fetch a specific order                       |
| Add Tracking Event     | POST   | `/track/{tracking_number}/tracking`                      | Yes           | Add a tracking event by tracking number      |
| Get Tracking Events    | GET    | `/track/{tracking_number}/tracking`                      | Yes           | Get all tracking events for an order         |
| Get Latest Pickup Loc. | GET    | `/orders/track/{tracking_number}/latest-pickup-location` | Yes           | Get the latest pickup location for an order  |

---

## 1. Estimate Delivery Fee

**Endpoint:**  
`POST /orders/estimate-delivery-fee`

**Request Body:**

```json
{
	"address": "Ikeja, Lagos",
	"city": "Lagos",
	"region": "Southwest",
	"item_type": "fragile",
	"item_weight": 2
}
```

- All fields are required for accurate fee calculation.

**Response:**

```json
{
	"delivery_fee": 2900,
	"currency": "NGN",
	"estimated_delivery_time": "2-3 days"
}
```

---

## 2. Create Order

**Endpoint:**  
`POST /orders`

**Request Body:**

```json
{
	"merchant_id": "abc123",
	"item": "Shoes",
	"quantity": 2,
	"address": "Ikeja, Lagos",
	"status": "order created",
	"delivery_fee": 2900
}
```

- Use the `delivery_fee` from the previous step.
- `merchant_id` is required and must be unique per merchant.

**Response:**

```json
{
	"id": 1,
	"merchant_id": "abc123",
	"item": "Shoes",
	"quantity": 2,
	"address": "Ikeja, Lagos",
	"status": "order created",
	"delivery_fee": 2900,
	"created_at": "2025-07-20T19:30:00.000Z",
	"updated_at": "2025-07-20T19:30:00.000Z",
	"tracking_number": "LOADRL-20250720-XXXXXX"
}
```

---

## 3. Add Tracking Event

**Endpoint:**  
`POST /track/{tracking_number}/tracking`

**Request Body:**

```json
{
	"status": "Picked up",
	"pickup_location": "Warehouse A",
	"timestamp": "2025-07-21T10:00:00Z"
}
```

- `status` is required.
- `pickup_location` and `timestamp` are optional, but recommended.

**Response:**  
Returns the created tracking event.

---

## 4. Get Tracking Events

**Endpoint:**  
`GET /track/{tracking_number}/tracking`

**Response:**

```json
[
	{
		"id": 1,
		"order_id": 123,
		"status": "Picked up",
		"pickup_location": "Warehouse A",
		"timestamp": "2025-07-21T10:00:00Z"
	}
]
```

---

## 5. Get Latest Pickup Location

**Endpoint:**  
`GET /orders/track/{tracking_number}/latest-pickup-location`

**Response:**

```json
{
	"tracking_number": "LOADRL-20250720-XXXXXX",
	"pickup_location": "Warehouse A"
}
```

---

## 6. Get Order By ID

**Endpoint:**  
`GET /orders/{id}`

**Response:**  
Returns all order details, including `delivery_fee` and `tracking_number`.

---

## General Notes

- All endpoints require the `Authorization` header.
- All request/response bodies are JSON.
- All times are in ISO 8601 format (UTC).
- Use the `tracking_number` returned from order creation for all tracking operations.
- Always estimate delivery fee before creating an order.

---

## Error Handling

- 400: Bad Request (missing or invalid data)
- 401: Unauthorized (missing or invalid API key)
- 404: Not found (invalid order or tracking number)
- 500: Internal server error

---

## Example Workflow

1. **Estimate Fee:**  
   Call `/orders/estimate-delivery-fee` with order details.
2. **Create Order:**  
   If the fee is accepted, call `/orders` with all order details and the `delivery_fee`.
3. **Track Order:**  
   Use the `tracking_number` to add or get tracking events.

---

## Contact & Support

- For API keys, integration help, or support, contact:  
  [devops@bubblebarrel.dev](mailto:devops@bubblebarrel.dev)

---

**For further details, see the Swagger UI at `/api-docs` or review the codebase.**
