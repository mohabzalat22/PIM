import {
  findAll,
  findById,
  create,
  update,
  deleteById,
} from "../models/workspaceModel.js";
import { findByClerkId } from "../models/userModel.js";
import { getAuth } from "@clerk/express";

/**
 * Get all workspaces with pagination
 */
export const getWorkspaces = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Extract filter parameters
  const filters = {
    search: req.query.search || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [workspaces, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(workspaces, "Workspaces retrieved successfully", meta);
};

/**
 * Get a single workspace by ID
 */
export const getWorkspace = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Workspace ID is required");
  }
  const workspace = (await findById(id)) ?? {};
  res.success(workspace, "Workspace retrieved successfully");
};

/**
 * Create a new workspace
 */
export const createWorkspace = async (req, res) => {
  // Get authenticated user's Clerk ID
  const { userId: clerkId } = getAuth(req);
  
  // Find the user in the database
  const user = await findByClerkId(clerkId);
  if (!user) {
    return res.error("User not found", 404);
  }

  // Add ownerId to the workspace data
  const workspaceData = {
    ...req.body,
    ownerId: user.id,
  };

  const result = await create(workspaceData);
  if (!result) {
    return res.error("Failed to create new workspace", 500, result.error);
  }
  res.created(result, "Workspace created successfully");
};

/**
 * Update an existing workspace
 */
export const updateWorkspace = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update workspace");
  }
  res.success(result, "Workspace updated successfully");
};

/**
 * Delete a workspace
 */
export const deleteWorkspace = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete workspace");
  }
  res.success(result, "Workspace deleted successfully");
};