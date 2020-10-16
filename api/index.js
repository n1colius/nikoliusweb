const express = require('express');
import routes from './routes';
const bodyParser = require("body-parser");

// Create express instnace
const app = express();

//Tambahan code dibawah ini belum coba di test di server, coba aja di server pakai npm run build dan jalankan pakai pm2
//!!!!!!!!!!!!!!!
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