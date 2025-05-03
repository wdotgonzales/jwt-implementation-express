import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
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
        errorDetails = "All fields (fullname, email, password) are required";
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
