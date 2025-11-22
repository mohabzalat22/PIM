import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Find all team members with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Number of records to return
 * @param {Object} filters - Filter options (search, teamId, userId, role, sortBy, sortOrder)
 * @returns {Promise<[Array, number]>} - Array of team members and total count
 */
export const findAll = async (skip, limit, filters = {}) => {
  const where = {};

  // Search filter (search in user email or name)
  if (filters.search) {
    where.user = {
      OR: [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } }
      ]
    };
  }

  // Filter by team
  if (filters.teamId) {
    where.teamId = filters.teamId;
  }

  // Filter by user
  if (filters.userId) {
    where.userId = filters.userId;
  }

  // Filter by role
  if (filters.role) {
    where.role = filters.role;
  }

  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'role') {
    orderBy.role = filters.sortOrder || 'asc';
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  const teamMembers = await prisma.teamMember.findMany({
    skip,
    take: limit,
    where,
    include: {
      user: true,
      team: true,
    },
    orderBy,
  });

  const total = await prisma.teamMember.count({ where });

  return [teamMembers, total];
};

/**
 * Find team member by ID
 * @param {number} id - TeamMember ID
 * @returns {Promise<Object|null>} - TeamMember object or null
 */
export const findById = async (id) => {
  return await prisma.teamMember.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      team: true,
    },
  });
};

/**
 * Find all team members by team ID
 * @param {number} teamId - Team ID
 * @returns {Promise<Array>} - Array of team members
 */
export const findByTeam = async (teamId) => {
  return await prisma.teamMember.findMany({
    where: { teamId: parseInt(teamId) },
    include: {
      user: true,
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Find all team members by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of team members
 */
export const findByUser = async (userId) => {
  return await prisma.teamMember.findMany({
    where: { userId: parseInt(userId) },
    include: {
      user: true,
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Find team member by team ID and user ID
 * @param {number} teamId - Team ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} - TeamMember object or null
 */
export const findByTeamAndUser = async (teamId, userId) => {
  return await prisma.teamMember.findFirst({
    where: {
      teamId: parseInt(teamId),
      userId: parseInt(userId),
    },
  });
};

/**
 * Create a new team member
 * @param {Object} data - TeamMember data
 * @returns {Promise<Object>} - Created team member object
 */
export const create = async (data) => {
  return await prisma.teamMember.create({
    data,
    include: {
      user: true,
      team: true,
    },
  });
};

/**
 * Update team member by ID
 * @param {number} id - TeamMember ID
 * @param {Object} data - Updated team member data
 * @returns {Promise<Object>} - Updated team member object
 */
export const update = async (id, data) => {
  return await prisma.teamMember.update({
    where: { id: parseInt(id) },
    data,
    include: {
      user: true,
      team: true,
    },
  });
};

/**
 * Delete team member by ID
 * @param {number} id - TeamMember ID
 * @returns {Promise<Object>} - Deleted team member object
 */
export const deleteById = async (id) => {
  return await prisma.teamMember.delete({
    where: { id: parseInt(id) },
  });
};
