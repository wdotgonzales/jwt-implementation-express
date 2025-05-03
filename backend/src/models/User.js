import pool from "../config/db.config.js";
import bcryptjs from "bcryptjs";

const saltRounds = 12;

class User {
  static async emailExists(email) {
    const [rows] = await pool.query(
      "SELECT 1 FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows.length > 0;
  }

  static async hashPassword(plainPassword) {
    return await bcryptjs.hash(plainPassword, saltRounds);
  }

  static async create({ email, fullname, password }) {

    if (!fullname || !email || !password || fullname.trim() === '' || email.trim() === '' || password.trim() === '') {
        throw new Error("ALL_FIELDS_REQUIRED");
      }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("INVALID_EMAIL_FORMAT");
    }

    if (await this.emailExists(email)) {
      throw new Error("EMAIL_EXISTS");
    }

    if (password.length < 8) {
      throw new Error("PASSWORD_TOO_SHORT");
    }

    const hashedPassword = await this.hashPassword(password);

    const [result] = await pool.query(
      `INSERT INTO users (email, fullname, password) 
       VALUES (?, ?, ?)`,
      [email, fullname, hashedPassword]
    );

    return { id: result.insertId, username, email };
  }
}

export default User;
