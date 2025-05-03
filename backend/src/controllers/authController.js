import AuthService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      message: "Successfully registered user.",
      data: user,
      error: null,
    });
  } catch (error) {
    let statusCode = 400;
    let errorDetails = "Invalid request";

    switch (error.message) {
      case "ALL_FIELDS_REQUIRED":
        statusCode = 400;
        errorDetails = "All fields (full_name, email, password) are required";
        break;

      case "INVALID_EMAIL_FORMAT":
        statusCode = 400;
        errorDetails = "Email must be a valid format (e.g., user@example.com)";
        break;

      case "EMAIL_EXISTS":
        statusCode = 409;
        errorDetails = "Email address is already registered";
        break;

      case "PASSWORD_TOO_SHORT":
        statusCode = 400;
        errorDetails = "Password must be at least 8 characters long";
        break;

      default:
        statusCode = 500;
        errorDetails = "An unexpected error occurred";
        console.error("Unhandled error:", error);
    }

    res.status(statusCode).json({
      message: "User registration failed",
      data: null,
      error: statusCode === 500 ? error.message : errorDetails,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await AuthService.loginUser(req.body);
    res.status(200).json({
      message: "Successfully logged in user.",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      error: null,
    });
  } catch (error) {
    let statusCode = 400;
    let errorDetails = "Invalid request";

    switch (error.message) {
      case "ALL_FIELDS_REQUIRED":
        statusCode = 400;
        errorDetails = "All fields (email, password) are required";
        break;

      case "INVALID_CREDENTIALS":
        statusCode = 401;
        errorDetails = "Invalid email or password";
        break;

      default:
        statusCode = 500;
        errorDetails = "An unexpected error occurred";
        console.error("Unhandled error:", error);
    }

    res.status(statusCode).json({
      message: "User login failed",
      data: null,
      error: statusCode === 500 ? error.message : errorDetails,
    });
  }
};
