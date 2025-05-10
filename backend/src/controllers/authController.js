/**
 * @file Authentication controller for handling user registration, login, and logout.
 * @module controllers/authController
 */

import User from "../models/User.js";
import AuthService from "../services/authService.js";

/**
 * Registers a new user.
 * @async
 * @function register
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing user registration data.
 * @param {string} req.body.full_name - User's full name.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} Response object with registration result.
 * @throws {Error} Possible errors:
 * - ALL_FIELDS_REQUIRED: If any required field is missing
 * - INVALID_EMAIL_FORMAT: If email format is invalid
 * - EMAIL_EXISTS: If email is already registered
 * - PASSWORD_TOO_SHORT: If password is less than 8 characters
 * - Server error for unexpected failures
 */
export const register = async (req, res) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      message: "Successfully registered user.",
      data: user,
      error: null,
    });
  } catch (error) {
    let statusCode = 400;
    let errorDetails = "Invalid request";

    switch (error.message) {
      case "ALL_FIELDS_REQUIRED":
        statusCode = 400;
        errorDetails = "All fields (full_name, email, password) are required";
        break;

      case "INVALID_EMAIL_FORMAT":
        statusCode = 400;
        errorDetails = "Email must be a valid format (e.g., user@example.com)";
        break;

      case "EMAIL_EXISTS":
        statusCode = 409;
        errorDetails = "Email address is already registered";
        break;

      case "PASSWORD_TOO_SHORT":
        statusCode = 400;
        errorDetails = "Password must be at least 8 characters long";
        break;

      default:
        statusCode = 500;
        errorDetails = "An unexpected error occurred";
        console.error("Unhandled error:", error);
    }

    res.status(statusCode).json({
      message: "User registration failed",
      data: null,
      error: statusCode === 500 ? error.message : errorDetails,
    });
  }
};

/**
 * Authenticates a user and generates access/refresh tokens.
 * @async
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing login credentials.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} Response object with authentication tokens.
 * @throws {Error} Possible errors:
 * - ALL_FIELDS_REQUIRED: If email or password is missing
 * - INVALID_CREDENTIALS: If credentials are invalid
 * - Server error for unexpected failures
 */
export const login = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await AuthService.loginUser(req.body);
    res.status(200).json({
      message: "Successfully logged in user.",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      error: null,
    });
  } catch (error) {
    let statusCode = 400;
    let errorDetails = "Invalid request";

    switch (error.message) {
      case "ALL_FIELDS_REQUIRED":
        statusCode = 400;
        errorDetails = "All fields (email, password) are required";
        break;

      case "INVALID_CREDENTIALS":
        statusCode = 401;
        errorDetails = "Invalid email or password";
        break;

      default:
        statusCode = 500;
        errorDetails = "An unexpected error occurred";
        console.error("Unhandled error:", error);
    }

    res.status(statusCode).json({
      message: "User login failed",
      data: null,
      error: statusCode === 500 ? error.message : errorDetails,
    });
  }
};

/**
 * Logs out a user and invalidates the refresh token.
 * @async
 * @function logout
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing logout information.
 * @param {string} req.body.user_id - ID of the user to logout.
 * @param {string} req.body.refresh_token - Refresh token to invalidate.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} Response object with logout confirmation.
 * @throws {Error} Possible errors:
 * - LOGOUT_FIELDS_REQUIRED: If required fields are missing
 * - REFRESH_TOKEN_DOES_EXIST_FOR_THIS_USER: If refresh token validation fails
 * - Server error for unexpected failures
 */
export const logout = async (req, res) => {
  try {
    const { user_id, refresh_token } = await AuthService.logoutUser(req.body);
    res.status(200).json({
      message: "Successfully logged out user.",
      data: {
        user_id: await User.fetchUserInformationByUserId(user_id),
        refresh_token: refresh_token,
      },
      error: null,
    });
  } catch (error) {
    let statusCode = 400;
    let errorDetails = "Invalid request";

    switch (error.message) {
      case "LOGOUT_FIELDS_REQUIRED":
        statusCode = 400;
        errorDetails = "Logout fields (user_id, refresh_token) are required";
        break;

      case "REFRESH_TOKEN_DOES_EXIST_FOR_THIS_USER":
        statusCode = 401;
        errorDetails =
          "The refresh token does exist in the whitelist assigned to the user's ID.";
        break;

      default:
        statusCode = 500;
        errorDetails = "An unexpected error occurred";
        console.error("Unhandled error:", error);
    }

    res.status(statusCode).json({
      message: "User logout failed",
      data: null,
      error: statusCode === 500 ? error.message : errorDetails,
    });
  }
};
