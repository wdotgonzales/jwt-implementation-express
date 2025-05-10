/**
 * @file User routes for handling user-related endpoints.
 * @module routes/userRoutes
 * @requires express
 * @requires ../controllers/userController
 * @requires ../middlewares/authenticateToken
 */

import express from "express";
import {
  usersDetails,
  fetchUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

/**
 * Express router for user endpoints.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route for fetching authenticated user details.
 * @name get/details
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express route path ("/details")
 * @param {Function} middleware - Authentication middleware to verify JWT token
 * @param {Function} controller - Controller to handle user details request
 * @see {@link module:middlewares/authenticateToken} for authentication details
 * @see {@link module:controllers/userController.usersDetails} for implementation details
 * @example
 * // Example request:
 * GET /api/user/details
 * Headers:
 * {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * @example
 * // Example successful response:
 * {
 *   "message": "User details retrieved successfully",
 *   "data": {
 *     "id": 123,
 *     "full_name": "John Doe",
 *     "email": "john@example.com"
 *   },
 *   "error": null
 * }
 *
 * @example
 * // Example error response:
 * {
 *   "message": "Authentication failed",
 *   "data": null,
 *   "error": "Invalid token"
 * }
 */
router.get("/details", authenticateToken, usersDetails);

/**
 * Route for fetching all users.
 * @name get/
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express route path ("/")
 * @param {Function} controller - Controller to handle fetch all users request
 * @see {@link module:controllers/userController.fetchUsers} for implementation details
 * @example
 * // Example request:
 * GET /api/user/
 *
 * @example
 * // Example successful response:
 * {
 *   "message": "Successfully fetched all users",
 *   "data": [
 *     {
 *       "id": 123,
 *       "full_name": "John Doe",
 *       "email": "john@example.com"
 *     },
 *     {
 *       "id": 456,
 *       "full_name": "Jane Smith",
 *       "email": "jane@example.com"
 *     }
 *   ],
 *   "error": null
 * }
 */
router.get("/", fetchUsers);

/**
 * Route for fetching a specific user by ID.
 * @name get/:id
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express route path ("/:id")
 * @param {Function} controller - Controller to handle fetch user request
 * @see {@link module:controllers/userController.fetchUserById} for implementation details
 * @example
 * // Example request:
 * GET /api/user/123
 *
 * @example
 * // Example successful response:
 * {
 *   "message": "Successfully fetched user",
 *   "data": {
 *     "id": 123,
 *     "full_name": "John Doe",
 *     "email": "john@example.com"
 *   },
 *   "error": null
 * }
 *
 * @example
 * // Example error response (user not found):
 * {
 *   "message": "User not found",
 *   "data": null,
 *   "error": "No user exists with the given ID"
 * }
 */
router.get("/:id", fetchUserById);

/**
 * Route for updating a user by ID.
 * @name put/:id
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express route path ("/:id")
 * @param {Function} controller - Controller to handle update user request
 * @see {@link module:controllers/userController.updateUserById} for implementation details
 * @example
 * // Example request:
 * PUT /api/user/123
 * Body:
 * {
 *   "email": "new.email@example.com",
 *   "full_name": "Updated Name"
 * }
 *
 * @example
 * // Example successful response:
 * {
 *   "message": "User updated successfully",
 *   "data": {
 *     "id": 123,
 *     "email": "new.email@example.com",
 *     "full_name": "Updated Name"
 *   },
 *   "error": null
 * }
 *
 * @example
 * // Example error response (validation):
 * {
 *   "message": "Updating user failed",
 *   "data": null,
 *   "error": "Both email and full name are required"
 * }
 */
router.put("/:id", updateUserById);

/**
 * Route for deleting a user by ID.
 * @name delete/:id
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express route path ("/:id")
 * @param {Function} controller - Controller to handle delete user request
 * @see {@link module:controllers/userController.deleteUserById} for implementation details
 * @example
 * // Example request:
 * DELETE /api/user/123
 *
 * @example
 * // Example successful response:
 * {
 *   "message": "User deleted successfully",
 *   "data": {
 *     "success": true
 *   },
 *   "error": null
 * }
 *
 * @example
 * // Example error response:
 * {
 *   "message": "User not found",
 *   "data": null,
 *   "error": "No user exists with the given ID"
 * }
 */
router.delete("/:id", deleteUserById);

/**
 * @exports userRoutes
 * @type {express.Router}
 */
export default router;
