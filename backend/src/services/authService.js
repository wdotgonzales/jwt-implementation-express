/**
 * @file Authentication service handling core business logic for user authentication.
 * @module services/authService
 * @requires ../models/User
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @requires ./whitelistService
 * @requires ../util/datetime.util
 */

import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import WhitelistService from "./whitelistService.js";
import DatetimeUtil from "../util/datetime.util.js";

const saltRounds = 12;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Class containing authentication service methods.
 * Handles registration, login, logout, and related validation logic.
 */
class AuthService {
  /**
   * Validates user registration data.
   * @static
   * @async
   * @param {Object} userData - User registration data.
   * @param {string} userData.full_name - User's full name.
   * @param {string} userData.email - User's email address.
   * @param {string} userData.password - User's password.
   * @throws {Error} Possible validation errors:
   * - ALL_FIELDS_REQUIRED: If any field is missing or empty
   * - INVALID_EMAIL_FORMAT: If email format is invalid
   * - PASSWORD_TOO_SHORT: If password is less than 8 characters
   */
  static async validateRegistrationData({ full_name, email, password }) {
    if (
      !full_name ||
      !email ||
      !password ||
      full_name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      throw new Error("ALL_FIELDS_REQUIRED");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("INVALID_EMAIL_FORMAT");
    }

    if (password.length < 8) {
      throw new Error("PASSWORD_TOO_SHORT");
    }
  }

  /**
   * Registers a new user.
   * @static
   * @async
   * @param {Object} userData - User registration data.
   * @param {string} userData.full_name - User's full name.
   * @param {string} userData.email - User's email address.
   * @param {string} userData.password - User's password.
   * @returns {Promise<Object>} Created user object (without password).
   * @throws {Error} Possible errors:
   * - EMAIL_EXISTS: If email is already registered
   * - Errors from validateRegistrationData
   */
  static async registerUser(userData) {
    await this.validateRegistrationData(userData);

    if (await User.emailExists(userData.email)) {
      throw new Error("EMAIL_EXISTS");
    }

    const hashedPassword = await bcryptjs.hash(userData.password, saltRounds);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  /**
   * Authenticates a user and generates JWT tokens.
   * @static
   * @async
   * @param {Object} credentials - User login credentials.
   * @param {string} credentials.email - User's email address.
   * @param {string} credentials.password - User's password.
   * @returns {Promise<Object>} Object containing access and refresh tokens.
   * @property {string} accessToken - JWT access token (expires in 15 minutes).
   * @property {string} refreshToken - JWT refresh token (expires in 7 days).
   * @throws {Error} Possible errors:
   * - ALL_FIELDS_REQUIRED: If email or password is missing
   * - INVALID_CREDENTIALS: If email/password combination is invalid
   */
  static async loginUser({ email, password }) {
    if (!email || email == "" || !password || password == "") {
      throw new Error("ALL_FIELDS_REQUIRED");
    }

    const user = await User.userExistByEmail(email);

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    await WhitelistService.insertRefreshToken({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_at: DatetimeUtil.expiryFromDays(7),
    });

    return { accessToken, refreshToken };
  }

  /**
   * Handles user logout by validating and preparing for token invalidation.
   * @static
   * @async
   * @param {Object} tokenData - Token data for logout.
   * @param {string} tokenData.refresh_token - Refresh token to invalidate.
   * @param {number} tokenData.user_id - ID of the user logging out.
   * @returns {Promise<Object>} Object containing user ID and refresh token.
   * @throws {Error} Possible errors:
   * - LOGOUT_FIELDS_REQUIRED: If required fields are missing
   * - Error from checkRefreshTokenExistence if token validation fails
   */
  static async logoutUser({ refresh_token, user_id }) {
    if (refresh_token === "" || !refresh_token || user_id === "" || !user_id) {
      throw new Error("LOGOUT_FIELDS_REQUIRED");
    }

    await WhitelistService.checkRefreshTokenExistence({
      user_id: user_id,
      refresh_token: refresh_token,
    });

    return {
      user_id: user_id,
      refresh_token: refresh_token,
    };
  }
}

export default AuthService;
