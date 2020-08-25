const express = require('express');
import routes from './routes';
const bodyParser = require("body-parser");

// Create express instnace
const app = express();

// Require & Import API routes
app.use('/authen', routes.authen);

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
};