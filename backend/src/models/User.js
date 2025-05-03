import pool from "../config/db.config.js";

class User {
  static async create({ email, full_name, password }) {
    const [result] = await pool.query(
      `INSERT INTO user (email, full_name, password) 
       VALUES (?, ?, ?)`,
      [email, full_name, password]
    );

    return { id: result.insertId, full_name, email };
  }

  static async emailExists(email) {
    const [rows] = await pool.query(
      "SELECT 1 FROM user WHERE email = ? LIMIT 1",
      [email]
    );
    return rows.length > 0;
  }

  static async userExistByUserId(user_id) {
    const [rows] = await pool.query(
      "SELECT 1 FROM user WHERE id = ? LIMIT 1",
      [user_id]
    );
    return rows.length > 0;
  }

  static async userExistByEmail(email) {
    const [rows] = await pool.query(
      "SELECT id, email, full_name, password FROM user WHERE email = ? LIMIT 1",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

export default User;
