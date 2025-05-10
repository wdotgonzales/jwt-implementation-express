/**
 * @file Authentication routes for handling user registration, login, and logout.
 * @module routes/authRoutes
 * @requires express
 * @requires ../controllers/authController
 */

import express from "express";
import { register, login, logout } from "../controllers/authController.js";

/**
 * Express router for authentication endpoints.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route for user registration.
 * @name post/register
 * @function
 * @memberof module:routes/authRoutes
 * @param {string} path - Express route path ("/register")
 * @param {Function} middleware - Express middleware function (register controller)
 * @see {@link module:controllers/authController.register} for implementation details
 * @example
 * POST /api/auth/register
 * Request Body:
 * {
 *   "full_name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 */
router.post("/register", register);

/**
 * Route for user login.
 * @name post/login
 * @function
 * @memberof module:routes/authRoutes
 * @param {string} path - Express route path ("/login")
 * @param {Function} middleware - Express middleware function (login controller)
 * @see {@link module:controllers/authController.login} for implementation details
 * @example
 * POST /api/auth/login
 * Request Body:
 * {
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 */
router.post("/login", login);

/**
 * Route for user logout.
 * @name post/logout
 * @function
 * @memberof module:routes/authRoutes
 * @param {string} path - Express route path ("/logout")
 * @param {Function} middleware - Express middleware function (logout controller)
 * @see {@link module:controllers/authController.logout} for implementation details
 * @example
 * POST /api/auth/logout
 * Request Body:
 * {
 *   "user_id": 123,
 *   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */

router.post("/logout", logout);

/**
 * @exports authRoutes
 * @type {express.Router}
 */
export default router;
