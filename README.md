# 🚚 LoadRunner Logistics API

> A plug-and-play REST API for ecommerce merchants to estimate delivery fees, create orders, and track shipments in real time.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 🧩 What It Does

LoadRunner lets any ecommerce app integrate logistics in minutes:

- **Estimate delivery fees** before an order is placed
- **Create and manage orders** tied to merchant accounts
- **Track shipments** end-to-end with pickup location history
- **Generate tracking numbers** automatically on order creation

Built for Nigerian ecommerce but easily adaptable to any market.

---

## ✨ Features

- 📦 Full order lifecycle — create, update, and track
- 💰 Delivery fee estimation by address, region, item type, and weight
- 🔐 JWT Bearer token authentication
- 📍 Real-time shipment tracking with pickup location history
- 📄 Interactive API docs via Swagger UI
- 🛡️ Secure headers with Helmet + CORS enabled

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| Auth | JWT (Bearer Token) |
| Docs | Swagger / OpenAPI 3.0 |
| Security | Helmet, CORS |

---

## 📁 Project Structure

```
src/
  ├─ app.js                 # Main Express app
  ├─ swagger.js             # Swagger/OpenAPI config
  ├─ routes/
  │    └─ orderRoutes.js    # Order endpoints
  ├─ controllers/
  │    └─ orderController.js
  ├─ models/
  │    └─ orderModel.js
  ├─ middleware/
  │    └─ authMiddleware.js
  └─ utils/
       └─ db.js             # PostgreSQL connection utility
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sn00k13/BUMPA-API.git
cd BUMPA-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/loadrunner
JWT_SECRET=your_jwt_secret
```

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.  
Swagger docs at `http://localhost:5000/api-docs`.

---

## 🔐 Authentication

All endpoints (except the health check) require a valid JWT token:

```
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns `"API is running"` |

---

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/estimate-delivery-fee` | Estimate fee before creating an order |
| POST | `/orders` | Create a new order |
| GET | `/orders` | Get all orders |
| GET | `/orders/:id` | Get order by ID |
| POST | `/orders/:id/status` | Update order status |
| GET | `/orders/track/:tracking_number/latest-pickup-location` | Get latest pickup location |

---

### Tracking

| Method | Endpoint | Description |
|---|---|---|
| POST | `/track/:tracking_number/tracking` | Add a tracking event |
| GET | `/track/:tracking_number/tracking` | Get all tracking events |
| GET | `/track/all` | Get all tracking events (admin) |

---

## 🔄 Integration Workflow

Follow this sequence to integrate LoadRunner into your ecommerce app:

### Step 1 — Estimate Delivery Fee

```http
POST /orders/estimate-delivery-fee
```

```json
{
  "address": "Ikeja, Lagos",
  "city": "Lagos",
  "region": "Southwest",
  "item_type": "fragile",
  "item_weight": 2
}
```

**Response:**

```json
{
  "delivery_fee": 2900,
  "currency": "NGN",
  "estimated_delivery_time": "2-3 days"
}
```

---

### Step 2 — Create Order

```http
POST /orders
```

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

**Response:**

```json
{
  "id": 1,
  "tracking_number": "LOADRL-20250720-XXXXXX",
  "status": "order created",
  "delivery_fee": 2900,
  "created_at": "2025-07-20T19:30:00.000Z"
}
```

---

### Step 3 — Track the Order

```http
POST /track/{tracking_number}/tracking
```

```json
{
  "status": "Picked up",
  "pickup_location": "Warehouse A",
  "timestamp": "2025-07-21T10:00:00Z"
}
```

Then retrieve updates:

```http
GET /track/{tracking_number}/tracking
```

---

## ⚠️ Error Codes

| Code | Meaning |
|---|---|
| 400 | Bad Request — missing or invalid data |
| 401 | Unauthorized — missing or invalid token |
| 404 | Not Found — order or tracking number doesn't exist |
| 500 | Internal Server Error |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request

Ideas for contributions: multi-currency support, webhook notifications, carrier integrations, rate caching.

---

## 👤 Author

**Ugochukwu Okonkwo**
- GitHub: [@sn00k13](https://github.com/sn00k13)
- LinkedIn: [ugochukwu-c-okonkwo](https://linkedin.com/in/ugochukwu-c-okonkwo)
- Support: [devops@bubblebarrel.dev](mailto:devops@bubblebarrel.dev)

---

## 📄 License

MIT © Ugochukwu Okonkwo
