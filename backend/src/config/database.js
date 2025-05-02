/**
 * MySQL connection pool module using mysql2/promise.
 * @module db/pool
 * @requires mysql2/promise
 * @requires dotenv
 * @requires path
 */

const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

/**
 * Loads environment variables from the .env file located in the project root.
 */
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * MySQL connection pool configuration.
 * @type {Object}
 * @property {string} host - MySQL host address from environment variables
 * @property {string} user - MySQL username from environment variables
 * @property {string} password - MySQL password from environment variables
 * @property {string} database - MySQL database name from environment variables
 * @property {string|number} port - MySQL port from environment variables
 * @property {boolean} waitForConnections - Whether to queue connections when limit is reached
 * @property {number} connectionLimit - Maximum number of connections in pool
 * @property {number} queueLimit - Maximum number of connection requests to queue (0 = unlimited)
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * MySQL connection pool instance.
 * @type {Pool}
 */
module.exports = pool;