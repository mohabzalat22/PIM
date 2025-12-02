import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Find all workspaces with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Number of records to return
 * @param {Object} filters - Filter options (search, sortBy, sortOrder)
 * @returns {Promise<[Array, number]>} - Array of workspaces and total count
 */
export const findAll = async (skip, limit, filters = {}) => {
  const where = {};

  // Search filter (name search)
  if (filters.search) {
    where.name = { contains: filters.search, mode: 'insensitive' };
  }

  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'name') {
    orderBy.name = filters.sortOrder || 'asc';
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  const workspaces = await prisma.workspace.findMany({
    skip,
    take: limit,
    where,
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
    orderBy,
  });

  const total = await prisma.workspace.count({ where });

  return [workspaces, total];
};

/**
 * Find workspace by ID
 * @param {number} id - Workspace ID
 * @returns {Promise<Object|null>} - Workspace object or null
 */
export const findById = async (id) => {
  return await prisma.workspace.findUnique({
    where: { id: parseInt(id) },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * Find workspace by name
 * @param {string} name - Workspace name
 * @returns {Promise<Object|null>} - Workspace object or null
 */
export const findByName = async (name) => {
  return await prisma.workspace.findFirst({
    where: { name },
  });
};

/**
 * Create a new workspace
 * @param {Object} data - Workspace data
 * @returns {Promise<Object>} - Created workspace object
 */
export const create = async (data) => {
  return await prisma.workspace.create({
    data,
    include: {
      members: true,
    },
  });
};

/**
 * Update workspace by ID
 * @param {number} id - Workspace ID
 * @param {Object} data - Updated workspace data
 * @returns {Promise<Object>} - Updated workspace object
 */
export const update = async (id, data) => {
  return await prisma.workspace.update({
    where: { id: parseInt(id) },
    data,
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
};

/**
 * Delete workspace by ID
 * @param {number} id - Workspace ID
 * @returns {Promise<Object>} - Deleted workspace object
 */
export const deleteById = async (id) => {
  return await prisma.workspace.delete({
    where: { id: parseInt(id) },
  });
};