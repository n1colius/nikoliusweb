var mysql = require('mysql');
const util = require('util')

var pool  = mysql.createPool({
  connectionLimit : 10,
  queueLimit: 100,
  host : process.env.DBHOST,
  port : parseInt(process.env.DBPORT),
  user : process.env.DBUSER,
  password : process.env.DBPASS,
  database : process.env.DBNAME,
  connectTimeout : 10000,
  waitForConnections: true,
  acquireTimeout: 10000,
  debug : false
});

pool.on('connection', function (connection) {
  console.log('MySQL DB Connection established');
});

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot...');
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

module.exports = pool;