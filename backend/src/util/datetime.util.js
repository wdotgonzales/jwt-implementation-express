class DatetimeUtil {
  /**
   * Get current GMT+8 datetime as MySQL string
   * @returns {string} MySQL formatted datetime (YYYY-MM-DD HH:mm:ss)
   */
  static now() {
    return new Date(Date.now() + 8 * 3600 * 1000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
  }

  /**
   * Convert days to MySQL datetime expiry string (GMT+8)
   * @param {number} days - Number of days until expiry
   * @returns {string} MySQL formatted expiry datetime (YYYY-MM-DD HH:mm:ss)
   */
  static expiryFromDays(days) {
    const expiryMs = Date.now() + days * 24 * 60 * 60 * 1000 + 8 * 3600 * 1000;
    return new Date(expiryMs).toISOString().replace("T", " ").slice(0, 19);
  }
}

export default DatetimeUtil;
