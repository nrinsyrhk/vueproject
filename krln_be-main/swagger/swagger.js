// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KRLN list of api',
      version: '1.0.0',
      description: '',
    },
    servers: [
      {
        url: process.env.SERVER_URL ,
      },
    ],
  },
  apis: ['./routes/*.js','./api/*.js'],
        // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
