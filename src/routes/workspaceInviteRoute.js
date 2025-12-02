import express from "express";
import {
  createWorkspaceInvitation,
  acceptWorkspaceInvitation,
  getWorkspaceInvitations,
  deleteWorkspaceInvitation,
} from "../controllers/workspaceInviteController.js";
import {
  validateWorkspaceInviteCreation,
  validateInvitationAcceptance,
} from "../middlewares/validateWorkspaceInvite.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

/**
 * POST /api/workspace-invites
 * Create a new workspace invitation
 */
router.post(
  "/",
  validateWorkspaceInviteCreation,
  asyncWrapper(createWorkspaceInvitation)
);

/**
 * POST /api/workspace-invites/accept
 * Accept a workspace invitation
 */
router.post(
  "/accept",
  validateInvitationAcceptance,
  asyncWrapper(acceptWorkspaceInvitation)
);

/**
 * GET /api/workspace-invites/workspace/:workspaceId
 * Get all invitations for a workspace
 */
router.get(
  "/workspace/:workspaceId",
  asyncWrapper(getWorkspaceInvitations)
);

/**
 * DELETE /api/workspace-invites/:id
 * Delete an invitation
 */
router.delete(
  "/:id",
  asyncWrapper(deleteWorkspaceInvitation)
);

export default router;
