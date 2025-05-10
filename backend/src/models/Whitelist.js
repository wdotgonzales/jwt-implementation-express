/**
 * @file Whitelist model for managing JWT refresh tokens in the database.
 * @module models/Whitelist
 * @requires ../config/db.config
 * @requires ../util/datetime.util
 */

import pool from "../config/db.config.js";
import DatetimeUtil from "../util/datetime.util.js";

/**
 * Class representing Whitelist model for JWT refresh token operations.
 * Handles CRUD operations for refresh tokens in the database whitelist.
 */
class Whitelist {
  /**
   * Creates a new refresh token entry in the whitelist.
   * @static
   * @async
   * @param {Object} tokenData - Refresh token data.
   * @param {number} tokenData.user_id - Associated user ID.
   * @param {string} tokenData.refresh_token - The refresh token string.
   * @param {string|Date} tokenData.expires_at - Expiration datetime of the token.
   * @returns {Promise<Object>} Created whitelist entry.
   * @property {number} id - Database ID of the entry.
   * @property {string} refresh_token - The stored refresh token.
   * @property {number} user_id - Associated user ID.
   * @property {string} expires_at - Token expiration datetime.
   */
  static async create({ user_id, refresh_token, expires_at }) {
    const [result] = await pool.query(
      `INSERT INTO jwt_whitelist (user_id, refresh_token, expires_at, created_at) 
         VALUES (?, ?, ?, ?)`,
      [user_id, refresh_token, expires_at, DatetimeUtil.now()]
    );

    return { id: result.insertId, refresh_token, user_id, expires_at };
  }

  /**
   * Deletes a refresh token from the whitelist.
   * @static
   * @async
   * @param {Object} tokenData - Refresh token data to delete.
   * @param {number} tokenData.user_id - Associated user ID.
   * @param {string} tokenData.refresh_token - The refresh token string to remove.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
  static async delete({ user_id, refresh_token }) {
    const [result] = await pool.query(
      `DELETE FROM jwt_whitelist 
       WHERE user_id = ? AND refresh_token = ?`,
      [user_id, refresh_token]
    );

    return result.affectedRows > 0;
  }

  /**
   * Updates the last used timestamp for a refresh token.
   * @static
   * @async
   * @param {string} refresh_token - The refresh token to update.
   * @returns {Promise<boolean>} True if update was successful, false otherwise.
   */
  static async updateLastUsed(refresh_token) {
    const [result] = await pool.query(
      `UPDATE jwt_whitelist 
       SET last_used_at = ? 
       WHERE refresh_token = ?`,
      [DatetimeUtil.now(), refresh_token]
    );

    return result.affectedRows > 0;
  }

  /**
   * Checks if a refresh token exists in the whitelist for a specific user.
   * @static
   * @async
   * @param {Object} tokenData - Refresh token data to verify.
   * @param {number} tokenData.user_id - Associated user ID.
   * @param {string} tokenData.refresh_token - The refresh token string to check.
   * @returns {Promise<boolean>} True if the token exists for the user, false otherwise.
   */
  static async doesRefreshTokenExist({ user_id, refresh_token }) {
    const [rows] = await pool.query(
      "SELECT 1 FROM jwt_whitelist WHERE user_id = ? AND refresh_token = ? LIMIT 1",
      [user_id, refresh_token]
    );
    return rows.length > 0;
  }
}

export default Whitelist;
