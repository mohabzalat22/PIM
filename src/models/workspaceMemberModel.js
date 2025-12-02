import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Find all workspace members with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Number of records to return
 * @param {Object} filters - Filter options (search, workspaceId, userId, role, sortBy, sortOrder)
 * @returns {Promise<[Array, number]>} - Array of workspace members and total count
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

  // Filter by workspace
  if (filters.workspaceId) {
    where.workspaceId = filters.workspaceId;
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

  const workspaceMembers = await prisma.workspaceMember.findMany({
    skip,
    take: limit,
    where,
    include: {
      user: true,
      workspace: true,
    },
    orderBy,
  });

  const total = await prisma.workspaceMember.count({ where });

  return [workspaceMembers, total];
};

/**
 * Find workspace member by ID
 * @param {number} id - WorkspaceMember ID
 * @returns {Promise<Object|null>} - WorkspaceMember object or null
 */
export const findById = async (id) => {
  return await prisma.workspaceMember.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      workspace: true,
    },
  });
};

/**
 * Find all workspace members by workspace ID
 * @param {number} workspaceId - Workspace ID
 * @returns {Promise<Array>} - Array of workspace members
 */
export const findByWorkspace = async (workspaceId) => {
  return await prisma.workspaceMember.findMany({
    where: { workspaceId: parseInt(workspaceId) },
    include: {
      user: true,
      workspace: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Find all workspace members by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of workspace members
 */
export const findByUser = async (userId) => {
  return await prisma.workspaceMember.findMany({
    where: { userId: parseInt(userId) },
    include: {
      user: true,
      workspace: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Find workspace member by workspace ID and user ID
 * @param {number} workspaceId - Workspace ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} - WorkspaceMember object or null
 */
export const findByWorkspaceAndUser = async (workspaceId, userId) => {
  return await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: parseInt(workspaceId),
      userId: parseInt(userId),
    },
  });
};

/**
 * Create a new workspace member
 * @param {Object} data - WorkspaceMember data
 * @returns {Promise<Object>} - Created workspace member object
 */
export const create = async (data) => {
  return await prisma.workspaceMember.create({
    data,
    include: {
      user: true,
      workspace: true,
    },
  });
};

/**
 * Update workspace member by ID
 * @param {number} id - WorkspaceMember ID
 * @param {Object} data - Updated workspace member data
 * @returns {Promise<Object>} - Updated workspace member object
 */
export const update = async (id, data) => {
  return await prisma.workspaceMember.update({
    where: { id: parseInt(id) },
    data,
    include: {
      user: true,
      workspace: true,
    },
  });
};

/**
 * Delete workspace member by ID
 * @param {number} id - WorkspaceMember ID
 * @returns {Promise<Object>} - Deleted workspace member object
 */
export const deleteById = async (id) => {
  return await prisma.workspaceMember.delete({
    where: { id: parseInt(id) },
  });
};