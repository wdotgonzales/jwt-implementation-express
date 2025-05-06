import Whitelist from "../models/Whitelist.js";
import User from "../models/User.js";

class WhitelistService {
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

  static async insertRefreshToken(data) {
    await this.validateInsertionData(data);

    if (!(await User.userExistByUserId(data.user_id))) {
      throw new Error("USER_ID_DOES_NOT_BELONG_TO_ANY_ACCOUNT");
    }

    const refreshTokenData = await Whitelist.create(data);

    return refreshTokenData;
  }
}

export default WhitelistService;
