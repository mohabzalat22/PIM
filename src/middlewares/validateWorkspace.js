import z from "zod";
import { findById, findByName } from "../models/workspaceModel.js";

const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

const workspaceUpdateSchema = z.object({
  name: z.string().min(1, "Workspace name is required").optional(),
});

export const validateWorkspaceCreation = async (req, res, next) => {
  const result = workspaceSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Workspace validation failed. Please check the provided data.", result.error);
  }

  // Check if a workspace with the same name already exists
  const workspaceExists = await findByName(result.data.name);

  if (workspaceExists) {
    return res.error(`A workspace with name '${result.data.name}' already exists in the system.`, 409, {
      error: `name-${result.data.name}`,
    });
  }

  next();
};

export const validateWorkspaceUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Workspace ID is required and must be a valid number.");
  }

  const result = workspaceUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Workspace update validation failed. Please check the provided data.", result.error);
  }

  const workspaceExists = await findById(id);

  if (!workspaceExists) {
    return res.notFound(`Workspace with ID ${id} not found.`);
  }

  // If name is being updated, check for uniqueness
  if (result.data.name) {
    const nameExists = await findByName(result.data.name);
    if (nameExists && nameExists.id !== id) {
      return res.error(`A workspace with name '${result.data.name}' already exists in the system.`, 409, {
        error: `name-${result.data.name}`,
      });
    }
  }

  next();
};