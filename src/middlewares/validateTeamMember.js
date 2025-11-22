import z from "zod";
import { MemberRole } from "@prisma/client";
import { findById, findByTeamAndUser } from "../models/teamMemberModel.js";
import { findById as findUserById } from "../models/userModel.js";
import { findById as findTeamById } from "../models/teamModel.js";

const teamMemberSchema = z.object({
  teamId: z.number({ required_error: "Team ID is required" }).int().positive(),
  userId: z.number({ required_error: "User ID is required" }).int().positive(),
  role: z.enum(Object.values(MemberRole), {
    errorMap: () => ({ message: "Invalid role. Must be OWNER, ADMIN, or MEMBER" }),
  }),
});

const teamMemberUpdateSchema = z.object({
  role: z.enum(Object.values(MemberRole), {
    errorMap: () => ({ message: "Invalid role. Must be OWNER, ADMIN, or MEMBER" }),
  }).optional(),
});

export const validateTeamMemberCreation = async (req, res, next) => {
  const result = teamMemberSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Team member validation failed. Please check the provided data.", result.error);
  }

  const { teamId, userId } = result.data;

  // Check if team exists
  const teamExists = await findTeamById(teamId);
  if (!teamExists) {
    return res.notFound(`Team with ID ${teamId} not found.`);
  }

  // Check if user exists
  const userExists = await findUserById(userId);
  if (!userExists) {
    return res.notFound(`User with ID ${userId} not found.`);
  }

  // Check if user is already a member of this team
  const memberExists = await findByTeamAndUser(teamId, userId);
  if (memberExists) {
    return res.error(`User with ID ${userId} is already a member of team with ID ${teamId}.`, 409, {
      error: `team-${teamId}-user-${userId}`,
    });
  }

  next();
};

export const validateTeamMemberUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Team member ID is required and must be a valid number.");
  }

  const result = teamMemberUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Team member update validation failed. Please check the provided data.", result.error);
  }

  const teamMemberExists = await findById(id);

  if (!teamMemberExists) {
    return res.notFound(`Team member with ID ${id} not found.`);
  }

  next();
};
