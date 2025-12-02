import {
  findAll,
  findById,
  findByWorkspace,
  findByUser,
  create,
  update,
  deleteById,
} from "../models/workspaceMemberModel.js";

/**
 * Get all workspace members with pagination
 */
export const getWorkspaceMembers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Extract filter parameters
  const filters = {
    search: req.query.search || null,
    workspaceId: req.query.workspaceId ? parseInt(req.query.workspaceId) : null,
    userId: req.query.userId ? parseInt(req.query.userId) : null,
    role: req.query.role || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [workspaceMembers, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(workspaceMembers, "Workspace members retrieved successfully", meta);
};

/**
 * Get a single workspace member by ID
 */
export const getWorkspaceMember = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Workspace member ID is required");
  }
  const workspaceMember = (await findById(id)) ?? {};
  res.success(workspaceMember, "Workspace member retrieved successfully");
};

/**
 * Get all members of a specific workspace
 */
export const getMembersByWorkspace = async (req, res) => {
  const workspaceId = Number(req.params.workspaceId);
  if (!workspaceId) {
    return res.badRequest("Workspace ID is required");
  }
  const workspaceMembers = (await findByWorkspace(workspaceId)) ?? [];
  res.success(workspaceMembers, "Workspace members retrieved successfully");
};

/**
 * Get all workspaces for a specific user
 */
export const getWorkspacesByUser = async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.badRequest("User ID is required");
  }
  const workspaceMembers = (await findByUser(userId)) ?? [];
  res.success(workspaceMembers, "User workspaces retrieved successfully");
};

/**
 * Create a new workspace member
 */
export const createWorkspaceMember = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new workspace member", 500, result.error);
  }
  res.created(result, "Workspace member created successfully");
};

/**
 * Update a workspace member (typically for role changes)
 */
export const updateWorkspaceMember = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update workspace member");
  }
  res.success(result, "Workspace member updated successfully");
};

/**
 * Delete a workspace member
 */
export const deleteWorkspaceMember = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete workspace member");
  }
  res.success(result, "Workspace member deleted successfully");
};