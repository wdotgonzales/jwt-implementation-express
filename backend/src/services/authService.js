import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import WhitelistService from "./whitelistService.js";
import DatetimeUtil from "../util/datetime.util.js";
const saltRounds = 12;
const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
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
}

export default AuthService;
