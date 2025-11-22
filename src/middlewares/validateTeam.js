import z from "zod";
import { findById, findByName } from "../models/teamModel.js";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
});

const teamUpdateSchema = z.object({
  name: z.string().min(1, "Team name is required").optional(),
});

export const validateTeamCreation = async (req, res, next) => {
  const result = teamSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Team validation failed. Please check the provided data.", result.error);
  }

  // Check if a team with the same name already exists
  const teamExists = await findByName(result.data.name);

  if (teamExists) {
    return res.error(`A team with name '${result.data.name}' already exists in the system.`, 409, {
      error: `name-${result.data.name}`,
    });
  }

  next();
};

export const validateTeamUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Team ID is required and must be a valid number.");
  }

  const result = teamUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Team update validation failed. Please check the provided data.", result.error);
  }

  const teamExists = await findById(id);

  if (!teamExists) {
    return res.notFound(`Team with ID ${id} not found.`);
  }

  // If name is being updated, check for uniqueness
  if (result.data.name) {
    const nameExists = await findByName(result.data.name);
    if (nameExists && nameExists.id !== id) {
      return res.error(`A team with name '${result.data.name}' already exists in the system.`, 409, {
        error: `name-${result.data.name}`,
      });
    }
  }

  next();
};
