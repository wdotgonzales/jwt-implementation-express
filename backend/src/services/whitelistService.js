/**
 * @file Whitelist service for managing JWT refresh tokens in the system.
 * @module services/whitelistService
 * @requires ../models/Whitelist
 * @requires ../models/User
 */

import Whitelist from "../models/Whitelist.js";
import User from "../models/User.js";

/**
 * Class containing business logic for refresh token whitelisting operations.
 * Handles creation, validation, and deletion of refresh tokens.
 */
class WhitelistService {
  /**
   * Validates data before inserting a refresh token into the whitelist.
   * @static
   * @async
   * @param {Object} tokenData - Refresh token data to validate.
   * @param {number} tokenData.user_id - User ID associated with the token.
   * @param {string} tokenData.refresh_token - The refresh token string.
   * @param {string|Date} tokenData.expires_at - Token expiration datetime.
   * @throws {Error} ALL_FIELDS_REQUIRED if any field is missing or empty.
   */
  static async validateInsertionData({ user_id, refresh_token, expires_at }) {
    if (
      !user_id ||
      !refresh_token ||
      !expires_at ||
      user_id === "" ||
      refresh_token === "" ||
      expires_at === ""
    ) {
      throw new Error("ALL_FIELDS_REQUIRED");
    }
  }

  /**
   * Inserts a new refresh token into the whitelist.
   * @static
   * @async
   * @param {Object} data - Refresh token data to insert.
   * @param {number} data.user_id - User ID associated with the token.
   * @param {string} data.refresh_token - The refresh token string.
   * @param {string|Date} data.expires_at - Token expiration datetime.
   * @returns {Promise<Object>} The created whitelist entry.
   * @throws {Error} Possible errors:
   * - ALL_FIELDS_REQUIRED: If validation fails
   * - USER_ID_DOES_NOT_BELONG_TO_ANY_ACCOUNT: If user doesn't exist
   */
  static async insertRefreshToken(data) {
    await this.validateInsertionData(data);

    if (!(await User.userExistByUserId(data.user_id))) {
      throw new Error("USER_ID_DOES_NOT_BELONG_TO_ANY_ACCOUNT");
    }

    const refreshTokenData = await Whitelist.create(data);

    return refreshTokenData;
  }

  /**
   * Checks if a refresh token exists in the whitelist and deletes it.
   * Used during logout to validate and immediately revoke the token.
   * @static
   * @async
   * @param {Object} tokenData - Refresh token data to validate.
   * @param {number} tokenData.user_id - User ID associated with the token.
   * @param {string} tokenData.refresh_token - The refresh token string to validate.
   * @throws {Error} REFRESH_TOKEN_DOES_EXIST_FOR_THIS_USER if token doesn't exist.
   */
  static async checkRefreshTokenExistence({ user_id, refresh_token }) {
    const isValid = await Whitelist.doesRefreshTokenExist({
      user_id: user_id,
      refresh_token: refresh_token,
    });

    if (!isValid) {
      throw new Error("REFRESH_TOKEN_DOES_EXIST_FOR_THIS_USER");
    }

    await this.deleteRefreshToken({
      user_id: user_id,
      refresh_token: refresh_token,
    });
  }

  /**
   * Deletes a refresh token from the whitelist.
   * @static
   * @async
   * @param {Object} tokenData - Refresh token data to delete.
   * @param {number} tokenData.user_id - User ID associated with the token.
   * @param {string} tokenData.refresh_token - The refresh token string to remove.
   * @returns {Promise<void>}
   */
  static async deleteRefreshToken({ user_id, refresh_token }) {
    await Whitelist.delete({ user_id: user_id, refresh_token: refresh_token });
  }
}

export default WhitelistService;
