import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Find all teams with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Number of records to return
 * @returns {Promise<[Array, number]>} - Array of teams and total count
 */
export const findAll = async (skip, limit) => {
  const teams = await prisma.team.findMany({
    skip,
    take: limit,
    include: {
      teamMembers: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.team.count();

  return [teams, total];
};

/**
 * Find team by ID
 * @param {number} id - Team ID
 * @returns {Promise<Object|null>} - Team object or null
 */
export const findById = async (id) => {
  return await prisma.team.findUnique({
    where: { id: parseInt(id) },
    include: {
      teamMembers: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * Find team by name
 * @param {string} name - Team name
 * @returns {Promise<Object|null>} - Team object or null
 */
export const findByName = async (name) => {
  return await prisma.team.findUnique({
    where: { name },
  });
};

/**
 * Create a new team
 * @param {Object} data - Team data
 * @returns {Promise<Object>} - Created team object
 */
export const create = async (data) => {
  return await prisma.team.create({
    data,
    include: {
      teamMembers: true,
    },
  });
};

/**
 * Update team by ID
 * @param {number} id - Team ID
 * @param {Object} data - Updated team data
 * @returns {Promise<Object>} - Updated team object
 */
export const update = async (id, data) => {
  return await prisma.team.update({
    where: { id: parseInt(id) },
    data,
    include: {
      teamMembers: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * Delete team by ID
 * @param {number} id - Team ID
 * @returns {Promise<Object>} - Deleted team object
 */
export const deleteById = async (id) => {
  return await prisma.team.delete({
    where: { id: parseInt(id) },
  });
};
