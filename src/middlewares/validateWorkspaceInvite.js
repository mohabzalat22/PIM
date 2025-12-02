import z from "zod";
import { findInvitationByToken } from "../models/workspaceInviteModel.js";

// Zod schema for creating an invitation
const createInvitationSchema = z.object({
  workspaceId: z.number().int().positive("Workspace ID must be a positive integer"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER"], {
    errorMap: () => ({ message: "Role must be either ADMIN or MEMBER" }),
  }).default("MEMBER"),
  expiresInHours: z.number().int().positive().optional().default(168), // 7 days default
});

// Zod schema for validating token
const validateTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// Zod schema for accepting invitation
const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

/**
 * Validate workspace invitation creation request
 */
export const validateWorkspaceInviteCreation = async (req, res, next) => {
  const result = createInvitationSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest(
      "Workspace invitation validation failed. Please check the provided data.",
      result.error
    );
  }

  req.validatedData = result.data;
  next();
};

/**
 * Validate token parameter
 */
export const validateToken = async (req, res, next) => {
  const token = req.params.token || req.body.token;
  const result = validateTokenSchema.safeParse({ token });

  if (!result.success) {
    return res.badRequest(
      "Token validation failed. Token is required.",
      result.error
    );
  }

  // Check if invitation exists
  const invitation = await findInvitationByToken(result.data.token);
  if (!invitation) {
    return res.notFound("Invitation not found. The link may be invalid.");
  }

  req.invitation = invitation;
  next();
};

/**
 * Validate invitation acceptance request
 */
export const validateInvitationAcceptance = async (req, res, next) => {
  const result = acceptInvitationSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest(
      "Invitation acceptance validation failed. Please check the provided data.",
      result.error
    );
  }

  req.validatedData = result.data;
  next();
};
