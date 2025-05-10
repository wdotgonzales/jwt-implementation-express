/**
 * @file Main application entry point and server configuration.
 * @module app
 * @requires express
 * @requires ./routes/authRoutes
 * @requires ./routes/userRoutes
 * @requires cookie-parser
 * @requires dotenv/config
 */

import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express();

/**
 * Port number the server will listen on.
 * @constant {number}
 * @default 5000
 */
const PORT = 5000;

/**
 * Middleware for parsing cookies from incoming requests.
 * @see {@link https://www.npmjs.com/package/cookie-parser}
 */
app.use(cookieParser());

/**
 * Middleware for parsing JSON bodies from incoming requests.
 * Enables handling of JSON payloads in request bodies.
 */
app.use(express.json());

/**
 * Routes for authentication endpoints.
 * All routes in authRoutes will be prefixed with '/api/auth'.
 * @see {@link module:routes/authRoutes}
 */
app.use("/api/auth", authRoutes);

/**
 * Routes for user-related endpoints.
 * All routes in userRoutes will be prefixed with '/api/users'.
 * @see {@link module:routes/userRoutes}
 */
app.use("/api/users", userRoutes);

/**
 * Starts the Express server on the specified PORT.
 * @listens PORT
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * @exports app - The configured Express application
 */
export default app;
