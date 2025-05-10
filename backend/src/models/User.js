/**
 * @file User model for handling all database operations related to users.
 * @module models/User
 * @requires ../config/db.config
 */

import pool from "../config/db.config.js";

/**
 * Class representing User model and its static methods for database operations.
 */
class User {
  /**
   * Creates a new user in the database.
   * @static
   * @async
   * @param {Object} userData - User data to create.
   * @param {string} userData.email - User's email address.
   * @param {string} userData.full_name - User's full name.
   * @param {string} userData.password - User's hashed password.
   * @returns {Promise<Object>} Created user object (without password).
   * @throws {Error} If database operation fails.
   */
  static async create({ email, full_name, password }) {
    const [result] = await pool.query(
      `INSERT INTO user (email, full_name, password) 
       VALUES (?, ?, ?)`,
      [email, full_name, password]
    );

    return { id: result.insertId, full_name, email };
  }

  /**
   * Checks if an email already exists in the database.
   * @static
   * @async
   * @param {string} email - Email address to check.
   * @returns {Promise<boolean>} True if email exists, false otherwise.
   */
  static async emailExists(email) {
    const [rows] = await pool.query(
      "SELECT 1 FROM user WHERE email = ? LIMIT 1",
      [email]
    );
    return rows.length > 0;
  }

  /**
   * Checks if a user exists by their ID.
   * @static
   * @async
   * @param {number} user_id - User ID to check.
   * @returns {Promise<boolean>} True if user exists, false otherwise.
   */
  static async userExistByUserId(user_id) {
    const [rows] = await pool.query("SELECT 1 FROM user WHERE id = ? LIMIT 1", [
      user_id,
    ]);
    return rows.length > 0;
  }

  /**
   * Finds a user by email and returns their complete record.
   * @static
   * @async
   * @param {string} email - Email address to search for.
   * @returns {Promise<Object|null>} User object if found (including password), null otherwise.
   * @property {number} id - User ID.
   * @property {string} email - User's email.
   * @property {string} full_name - User's full name.
   * @property {string} password - User's hashed password.
   */
  static async userExistByEmail(email) {
    const [rows] = await pool.query(
      "SELECT id, email, full_name, password FROM user WHERE email = ? LIMIT 1",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Fetches user information by user ID (excluding sensitive data like password).
   * @static
   * @async
   * @param {number} user_id - User ID to fetch.
   * @returns {Promise<Object|null>} User object if found (without password), null otherwise.
   * @property {number} id - User ID.
   * @property {string} email - User's email.
   * @property {string} full_name - User's full name.
   */
  static async fetchUserInformationByUserId(user_id) {
    const [rows] = await pool.query(
      "SELECT id, email, full_name FROM user WHERE id = ? LIMIT 1",
      [user_id]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    };
  }

  /**
   * Fetches all users from the database (excluding sensitive data like passwords).
   * @static
   * @async
   * @returns {Promise<Array<Object>>} Array of user objects.
   * @property {number} id - User ID.
   * @property {string} email - User's email.
   * @property {string} full_name - User's full name.
   */
  static async fetchAllUser() {
    const [rows] = await pool.query("SELECT id, email, full_name FROM user");
    return rows;
  }

  /**
   * Updates a user's information in the database.
   * @static
   * @async
   * @param {Object} userData - User data to update.
   * @param {number} userData.user_id - ID of the user to update.
   * @param {string} userData.email - New email address.
   * @param {string} userData.full_name - New full name.
   * @returns {Promise<Object|null>} Updated user object if successful, null if user not found.
   * @property {number} id - Updated user ID.
   * @property {string} email - Updated email.
   * @property {string} full_name - Updated full name.
   * @throws {Error} If database operation fails.
   */
  static async updateUser({ user_id, email, full_name }) {
    const [result] = await pool.query(
      "UPDATE user SET email = ?, full_name = ? WHERE id = ?",
      [email, full_name, user_id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id: user_id,
      email: email,
      full_name: full_name,
    };
  }

  /**
   * Deletes a user from the database.
   * @static
   * @async
   * @param {number} user_id - ID of the user to delete.
   * @returns {Promise<Object|null>} Success object if deletion was successful, null if user not found.
   * @property {boolean} success - Always true when returned (indicates successful deletion).
   * @throws {Error} If database operation fails.
   */
  static async deleteUser(user_id) {
    const [result] = await pool.query("DELETE FROM user WHERE id = ?", [
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      success: true,
    };
  }
}

export default User;
