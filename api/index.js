const express = require('express');
import routes from './routes';
const bodyParser = require("body-parser");

// Create express instnace
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//redirect www ke non-www
function redirectWwwTraffic(req, res, next) {
	if (req.headers.host.slice(0, 4) === 'www.') {
		var newHost = req.headers.host.slice(4);
		return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
	}
	next();
};  
app.set('trust proxy', true);
app.use(redirectWwwTraffic);

// Require & Import API routes
app.use('/authen', routes.authen);
app.use('/blogman', routes.blogman);

// Export the server middleware
module.exports = {
	path: '/api',
	handler: app
};