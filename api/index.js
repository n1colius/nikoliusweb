const express = require('express');
import routes from './routes';
const bodyParser = require("body-parser");

// Create express instnace
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Require & Import API routes
app.use('/authen', routes.authen);
app.use('/blogman', routes.blogman);

// Export the server middleware
module.exports = {
	path: '/api',
	handler: app
};