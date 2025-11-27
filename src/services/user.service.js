import {
  findAll,
  findById,
  findByEmail,
  findByClerkId,
  create,
  update,
  deleteById,
  findByStripeCustomerId,
} from "../models/userModel.js";

/**
 * User Service - Business logic layer for user operations
 */
const UserService = {
  /**
   * Get all users with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Promise<{users: Array, meta: Object}>} - Users array and pagination metadata
   */
  async getAllUsers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await findAll(skip, limit);

      const meta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      return { users, meta };
    } catch (error) {
      throw new Error(`Failed to retrieve users: ${error.message}`);
    }
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async getUserById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error("Valid user ID is required");
      }

      const user = await findById(parseInt(id));
      return user;
    } catch (error) {
      throw new Error(`Failed to retrieve user by ID: ${error.message}`);
    }
  },

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async getUserByEmail(email) {
    try {
      if (!email || typeof email !== "string") {
        throw new Error("Valid email is required");
      }

      const user = await findByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`Failed to retrieve user by email: ${error.message}`);
    }
  },
  /** Get user by Stripe Customer ID  */
  async getUserByStripeCustomerId(stripeCustomerId) {
    try {
      if (!stripeCustomerId || typeof stripeCustomerId !== "string") {
        throw new Error("Valid Stripe Customer ID is required");
      }

      const user = await findByStripeCustomerId(stripeCustomerId);
      return user;
    } catch (error) {
      throw new Error(
        `Failed to retrieve user by Stripe Customer ID: ${error.message}`
      );
    }
  },

  /**
   * Get user by Clerk ID
   * @param {string} clerkId - Clerk user ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async getUserByClerkId(clerkId) {
    try {
      if (!clerkId || typeof clerkId !== "string") {
        throw new Error("Valid Clerk ID is required");
      }

      const user = await findByClerkId(clerkId);
      return user;
    } catch (error) {
      throw new Error(`Failed to retrieve user by Clerk ID: ${error.message}`);
    }
  },

  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @returns {Promise<Object>} - Created user object
   */
  async createUser(userData) {
    try {
      if (!userData || typeof userData !== "object") {
        throw new Error("Valid user data is required");
      }

      // Basic business logic validation
      if (!userData.email) {
        throw new Error("Email is required for user creation");
      }

      if (!userData.name) {
        throw new Error("Name is required for user creation");
      }

      const newUser = await create(userData);
      return newUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  /**
   * Update user by ID
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Updated user object
   */
  async updateUser(id, userData) {
    try {
      if (!id || isNaN(id)) {
        throw new Error("Valid user ID is required");
      }

      if (!userData || typeof userData !== "object") {
        throw new Error("Valid user data is required for update");
      }

      // Check if user exists before updating
      const existingUser = await findById(parseInt(id));
      if (!existingUser) {
        throw new Error("User not found");
      }

      const updatedUser = await update(parseInt(id), userData);
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  /**
   * Delete user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} - Deleted user object
   */
  async deleteUser(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error("Valid user ID is required");
      }

      // Check if user exists before deleting
      const existingUser = await findById(parseInt(id));
      if (!existingUser) {
        throw new Error("User not found");
      }

      const deletedUser = await deleteById(parseInt(id));
      return deletedUser;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  },
};

export default UserService;
