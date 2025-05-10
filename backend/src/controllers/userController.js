import User from "../models/User.js";

/**
 * @controller usersDetails
 * @description Get details of the authenticated user
 * @route GET /api/users/me
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {number} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user details or error
 */
export const usersDetails = async (req, res) => {
  try {
    const userDetails = await User.fetchUserInformationByUserId(req.user.id);
    res.status(200).json({
      message: "User details accessed successfully",
      data: userDetails,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "Accessing user's details failed",
      data: null,
      error: err.message || "Internal server error",
    });
  }
};

/**
 * @controller fetchUsers
 * @description Get all users (excluding sensitive information)
 * @route GET /api/users
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with users array or error
 */
export const fetchUsers = async (req, res) => {
  try {
    const users = await User.fetchAllUser();
    res.status(200).json({
      message: "Successfully fetched all users",
      data: users,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      message: "Fetching all users failed",
      data: [],
      error: err.message || "Internal server error",
    });
  }
};

/**
 * @controller fetchUserById
 * @description Get a specific user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - User ID to fetch
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data or error
 */
export const fetchUserById = async (req, res) => {
  const user_id = req.params.id;

  // Early return if ID is missing or invalid
  if (!user_id || user_id.trim() === "") {
    return res.status(400).json({
      message: "Fetching user failed",
      data: null,
      error: "Missing or invalid user ID",
    });
  }

  try {
    const user = await User.fetchUserInformationByUserId(user_id);

    // Handle case where user is not found (404)
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        error: "No user exists with the given ID",
      });
    }

    // Success response
    return res.status(200).json({
      message: "Successfully fetched user",
      data: user,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Fetching user failed",
      data: null,
      error: err.message || "Internal server error",
    });
  }
};

/**
 * @controller updateUserById
 * @description Update a user's information
 * @route PUT /api/users/:id
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - User ID to update
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - New email address
 * @param {string} req.body.full_name - New full name
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated user data or error
 */
export const updateUserById = async (req, res) => {
  try {
    // Validate user ID
    const user_id = req.params.id?.trim();
    if (!user_id) {
      return res.status(400).json({
        message: "Updating user failed",
        data: null,
        error: "Missing or invalid user ID",
      });
    }

    // Validate request body
    const { email, full_name } = req.body;
    if (!email?.trim() || !full_name?.trim()) {
      return res.status(400).json({
        message: "Updating user failed",
        data: null,
        error: "Both email and full name are required",
      });
    }

    // Check if email already exists (excluding current user)
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(400).json({
        message: "Updating user failed",
        data: null,
        error: "Email already belongs to another user",
      });
    }

    // Verify user exists
    const userExists = await User.userExistByUserId(user_id);
    if (!userExists) {
      return res.status(404).json({
        message: "Updating user failed",
        data: null,
        error: "User not found",
      });
    }

    const response = await User.updateUser({ user_id, email, full_name });

    return res.status(200).json({
      message: "User updated successfully",
      data: response,
      error: null,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      message: "Internal server error",
      data: null,
      error: err.message || "Failed to update user",
    });
  }
};

/**
 * @controller deleteUserById
 * @description Delete a user by ID
 * @route DELETE /api/users/:id
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - User ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status or error
 */
export const deleteUserById = async (req, res) => {
  const user_id = req.params.id;

  if (!user_id || user_id.trim() === "") {
    return res.status(400).json({
      message: "Fetching user failed",
      data: null,
      error: "Missing or invalid user ID",
    });
  }

  try {
    const user = await User.fetchUserInformationByUserId(user_id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        error: "No user exists with the given ID",
      });
    }

    const response = await User.deleteUser(user_id);
    return res.status(200).json({
      message: "User deleted successfully",
      data: response,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      data: null,
      error: err.message || "Failed to delete user",
    });
  }
};
