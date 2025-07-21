const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LoadRunner Logistics API',
      version: '1.0.0',
      description: 'API for receiving and managing orders from getbumpa.com merchants',
    },
    servers: [
      {
        url: 'https://api.loadrunnerl.cloud/orders',
        description: 'API server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your API key as: Bearer <API_KEY>'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;