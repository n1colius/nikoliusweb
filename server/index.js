const express = require("express");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");
const bodyParser = require("body-parser");
require("dotenv").config();

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

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

async function start() {
	// Init Nuxt.js
	const nuxt = new Nuxt(config);
	const { host, port } = nuxt.options.server;
	await nuxt.ready();

	// Build only in dev mode
	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	}

	// Give nuxt middleware to express
	app.use(nuxt.render);

	// Listen the server
	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	});
}
start();