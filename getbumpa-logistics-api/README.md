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

**For further details, see the Swagger UI at `/api-docs` or review the codebase.**
