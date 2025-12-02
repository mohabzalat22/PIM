import z from "zod";
import { MemberRole } from "@prisma/client";
import { findById, findByWorkspaceAndUser } from "../models/workspaceMemberModel.js";
import { findById as findUserById } from "../models/userModel.js";
import { findById as findWorkspaceById } from "../models/workspaceModel.js";

const workspaceMemberSchema = z.object({
  workspaceId: z.number({ required_error: "Workspace ID is required" }).int().positive(),
  userId: z.number({ required_error: "User ID is required" }).int().positive(),
  role: z.enum(Object.values(MemberRole), {
    errorMap: () => ({ message: "Invalid role. Must be ADMIN or MEMBER" }),
  }),
});

const workspaceMemberUpdateSchema = z.object({
  role: z.enum(Object.values(MemberRole), {
    errorMap: () => ({ message: "Invalid role. Must be ADMIN or MEMBER" }),
  }).optional(),
});

export const validateWorkspaceMemberCreation = async (req, res, next) => {
  const result = workspaceMemberSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Workspace member validation failed. Please check the provided data.", result.error);
  }

  const { workspaceId, userId } = result.data;

  // Check if workspace exists
  const workspaceExists = await findWorkspaceById(workspaceId);
  if (!workspaceExists) {
    return res.notFound(`Workspace with ID ${workspaceId} not found.`);
  }

  // Check if user exists
  const userExists = await findUserById(userId);
  if (!userExists) {
    return res.notFound(`User with ID ${userId} not found.`);
  }

  // Check if user is already a member of this workspace
  const memberExists = await findByWorkspaceAndUser(workspaceId, userId);
  if (memberExists) {
    return res.error(`User with ID ${userId} is already a member of workspace with ID ${workspaceId}.`, 409, {
      error: `workspace-${workspaceId}-user-${userId}`,
    });
  }

  next();
};

export const validateWorkspaceMemberUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Workspace member ID is required and must be a valid number.");
  }

  const result = workspaceMemberUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Workspace member update validation failed. Please check the provided data.", result.error);
  }

  const workspaceMemberExists = await findById(id);

  if (!workspaceMemberExists) {
    return res.notFound(`Workspace member with ID ${id} not found.`);
  }

  next();
};