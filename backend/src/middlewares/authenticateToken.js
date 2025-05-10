/**
 * @file Middleware for authenticating JWT tokens in requests.
 * @module middlewares/authenticateToken
 */

import jwt from "jsonwebtoken";

/**
 * Middleware that authenticates JWT tokens in incoming requests.
 *
 * This middleware checks for a valid JWT in the Authorization header,
 * verifies it against the server's secret, and attaches the decoded user
 * information to the request object if successful.
 *
 * @function authenticateToken
 * @param {Object} req - Express request object.
 * @param {Object} req.headers - Request headers.
 * @param {string} [req.headers.authorization] - Authorization header in format "Bearer <token>".
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void|Object} Either calls next() or returns an error response.
 *
 * @throws {JsonWebTokenError} Possible JWT-related errors:
 * - TokenExpiredError: If the token has expired
 * - JsonWebTokenError: If the token is invalid or malformed
 *
 * @example
 * // How to use in routes:
 * router.get('/protected-route', authenticateToken, (req, res) => {
 *   // Access authenticated user via req.user
 * });
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication failed",
        data: null,
        error: "Access token is missing",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = { id: decoded.id };

    // Proceed to the next middleware/controller
    next();
  } catch (err) {
    let errorMessage = "Invalid token";
    let statusCode = 403;

    switch (err.name) {
      case "TokenExpiredError":
        errorMessage = "Token has expired";
        statusCode = 401;
        break;
      case "JsonWebTokenError":
        errorMessage = "Invalid token signature";
        break;
    }

    return res.status(statusCode).json({
      message: "Authentication failed",
      data: null,
      error: errorMessage,
    });
  }
};
