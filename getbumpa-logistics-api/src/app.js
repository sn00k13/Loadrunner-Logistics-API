require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/orders', orderRoutes);

// Health check
app.get('/', (req, res) => res.send('API is running'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;