import {
  findAll,
  findById,
  create,
  update,
  deleteById,
} from "../models/teamModel.js";

/**
 * Get all teams with pagination
 */
export const getTeams = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Extract filter parameters
  const filters = {
    search: req.query.search || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [teams, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(teams, "Teams retrieved successfully", meta);
};

/**
 * Get a single team by ID
 */
export const getTeam = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Team ID is required");
  }
  const team = (await findById(id)) ?? {};
  res.success(team, "Team retrieved successfully");
};

/**
 * Create a new team
 */
export const createTeam = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new team", 500, result.error);
  }
  res.created(result, "Team created successfully");
};

/**
 * Update an existing team
 */
export const updateTeam = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update team");
  }
  res.success(result, "Team updated successfully");
};

/**
 * Delete a team
 */
export const deleteTeam = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete team");
  }
  res.success(result, "Team deleted successfully");
};
