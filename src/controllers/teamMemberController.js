import {
  findAll,
  findById,
  findByTeam,
  findByUser,
  create,
  update,
  deleteById,
} from "../models/teamMemberModel.js";

/**
 * Get all team members with pagination
 */
export const getTeamMembers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [teamMembers, total] = (await findAll(skip, limit)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(teamMembers, "Team members retrieved successfully", meta);
};

/**
 * Get a single team member by ID
 */
export const getTeamMember = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Team member ID is required");
  }
  const teamMember = (await findById(id)) ?? {};
  res.success(teamMember, "Team member retrieved successfully");
};

/**
 * Get all members of a specific team
 */
export const getMembersByTeam = async (req, res) => {
  const teamId = Number(req.params.teamId);
  if (!teamId) {
    return res.badRequest("Team ID is required");
  }
  const teamMembers = (await findByTeam(teamId)) ?? [];
  res.success(teamMembers, "Team members retrieved successfully");
};

/**
 * Get all teams for a specific user
 */
export const getTeamsByUser = async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.badRequest("User ID is required");
  }
  const teamMembers = (await findByUser(userId)) ?? [];
  res.success(teamMembers, "User teams retrieved successfully");
};

/**
 * Create a new team member
 */
export const createTeamMember = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new team member", 500, result.error);
  }
  res.created(result, "Team member created successfully");
};

/**
 * Update a team member (typically for role changes)
 */
export const updateTeamMember = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update team member");
  }
  res.success(result, "Team member updated successfully");
};

/**
 * Delete a team member
 */
export const deleteTeamMember = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete team member");
  }
  res.success(result, "Team member removed successfully");
};
