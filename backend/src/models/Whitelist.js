import pool from "../config/db.config.js";
import DatetimeUtil from "../util/datetime.util.js";

class Whitelist {
  static async create({ user_id, refresh_token, expires_at }) {
    const [result] = await pool.query(
      `INSERT INTO jwt_whitelist (user_id, refresh_token, expires_at, created_at) 
         VALUES (?, ?, ?, ?)`,
      [user_id, refresh_token, expires_at, DatetimeUtil.now()]
    );

    return { id: result.insertId, refresh_token, user_id, expires_at };
  }

  static async delete({ user_id, refresh_token }) {
    const [result] = await pool.query(
      `DELETE FROM jwt_whitelist 
       WHERE user_id = ? AND refresh_token = ?`,
      [user_id, refresh_token]
    );

    return result.affectedRows > 0;
  }

  static async updateLastUsed(refresh_token) {
    const [result] = await pool.query(
      `UPDATE jwt_whitelist 
       SET last_used_at = ? 
       WHERE refresh_token = ?`,
      [DatetimeUtil.now(), refresh_token]
    );

    return result.affectedRows > 0;
  }
}

export default Whitelist;
