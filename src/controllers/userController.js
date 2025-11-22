import {
  findAll,
  findById,
  findByEmail,
  findByClerkId,
  create,
  update,
  deleteById,
} from "../models/userModel.js";

/**
 * Get all users with pagination
 */
export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = (await findAll(skip, limit)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(users, "Users retrieved successfully", meta);
};

/**
 * Get a single user by ID
 */
export const getUser = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("User ID is required");
  }
  const user = (await findById(id)) ?? {};
  res.success(user, "User retrieved successfully");
};

/**
 * Get a single user by Clerk ID
 */
export const getUserByClerkId = async (req, res) => {
  const { clerkId } = req.params;
  if (!clerkId) {
    return res.badRequest("Clerk ID is required");
  }
  const user = await findByClerkId(clerkId);
  if (!user) {
    return res.notFound(`User with Clerk ID ${clerkId} not found.`);
  }
  res.success(user, "User retrieved successfully");
};

/**
 * Get a single user by email
 */
export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.badRequest("Email is required");
  }
  const user = await findByEmail(email);
  if (!user) {
    return res.notFound(`User with email ${email} not found.`);
  }
  res.success(user, "User retrieved successfully");
};

/**
 * Create a new user
 */
export const createUser = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new user", 500, result.error);
  }
  res.created(result, "User created successfully");
};

/**
 * Update an existing user
 */
export const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update user");
  }
  res.success(result, "User updated successfully");
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete user");
  }
  res.success(result, "User deleted successfully");
};
