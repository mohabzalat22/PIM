import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Find all users with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Number of records to return
 * @returns {Promise<[Array, number]>} - Array of users and total count
 */
export const findAll = async (skip, limit) => {
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    include: {
      teamMembers: {
        include: {
          team: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.user.count();

  return [users, total];
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} - User object or null
 */
export const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      teamMembers: {
        include: {
          team: true,
        },
      },
    },
  });
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User object or null
 */
export const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Create a new user
 * @param {Object} data - User data
 * @returns {Promise<Object>} - Created user object
 */
export const create = async (data) => {
  return await prisma.user.create({
    data,
    include: {
      teamMembers: true,
    },
  });
};

/**
 * Update user by ID
 * @param {number} id - User ID
 * @param {Object} data - Updated user data
 * @returns {Promise<Object>} - Updated user object
 */
export const update = async (id, data) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data,
    include: {
      teamMembers: {
        include: {
          team: true,
        },
      },
    },
  });
};

/**
 * Delete user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} - Deleted user object
 */
export const deleteById = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};
