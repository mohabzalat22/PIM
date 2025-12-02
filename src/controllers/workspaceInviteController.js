import {
  createInvitation,
  findInvitationByToken,
  validateInvitation,
  markInvitationAsUsed,
  findInvitationsByWorkspace,
  deleteInvitation,
} from "../models/workspaceInviteModel.js";
import {
  create as createMembership,
  findByWorkspaceAndUser,
} from "../models/workspaceMemberModel.js";
import { findByUserId } from "../models/subscriptionModel.js";
import { findById as findWorkspaceById } from "../models/workspaceModel.js";
import { findByClerkId, findByEmail } from "../models/userModel.js";
import { getAuth } from "@clerk/express";
import {
  generateInvitationToken,
  calculateExpirationDate,
} from "../utils/tokenGenerator.js";

/**
 * Create a new workspace invitation
 */
export const createWorkspaceInvitation = async (req, res) => {
  const { workspaceId, email, role, expiresInHours } = req.validatedData;

  // Get authenticated user's Clerk ID
  const { userId: clerkId } = getAuth(req);
  const user = await findByClerkId(clerkId);

  if (!user) {
    return res.error("User not found", 404);
  }

  // Verify workspace exists and user is the owner
  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) {
    return res.notFound("Workspace not found");
  }

  if (workspace.ownerId !== user.id) {
    return res.error("Only workspace owners can send invitations", 403);
  }

  // Check if user is trying to invite themselves
  if (email.toLowerCase() === user.email.toLowerCase()) {
    return res.badRequest("You cannot invite yourself to the workspace");
  }

  // Check if the invited email is already a member
  const invitedUser = await findByEmail(email);
  if (invitedUser) {
    const existingMember = await findByWorkspaceAndUser(
      workspaceId,
      invitedUser.id
    );
    if (existingMember) {
      return res.error(
        "This user is already a member of the workspace",
        409
      );
    }
  }

  // Generate secure token
  const token = generateInvitationToken();
  const expiresAt = calculateExpirationDate(expiresInHours);

  // Create invitation
  const invitation = await createInvitation({
    workspaceId,
    email: email.toLowerCase(),
    token,
    role,
    expiresAt,
  });

  if (!invitation) {
    return res.error("Failed to create invitation", 500);
  }

  // Generate invitation URL
  const invitationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/invite?token=${token}`;

  res.created(
    {
      invitation,
      invitationUrl,
    },
    "Workspace invitation created successfully"
  );
};

/**
 * Validate invitation token
 */
export const validateInvitationToken = async (req, res) => {
  const { token } = req.params;

  const validation = await validateInvitation(token);

  if (!validation.valid) {
    return res.error(validation.message, 400);
  }

  res.success(
    {
      valid: true,
      workspace: {
        id: validation.invitation.workspace.id,
        name: validation.invitation.workspace.name,
      },
      role: validation.invitation.role,
      email: validation.invitation.email,
    },
    "Invitation is valid"
  );
};

/**
 * Accept workspace invitation
 */
export const acceptWorkspaceInvitation = async (req, res) => {
  const { token } = req.validatedData;

  // Get authenticated user
  const { userId: clerkId } = getAuth(req);
  const user = await findByClerkId(clerkId);

  if (!user) {
    return res.error("User not found. Please sign in first.", 404);
  }

  // Validate invitation
  const validation = await validateInvitation(token);

  if (!validation.valid) {
    return res.error(validation.message, 400);
  }

  const invitation = validation.invitation;

  // Verify the email matches (case-insensitive)
  if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return res.error(
      "This invitation was sent to a different email address",
      403
    );
  }

  // Check if already a member
  const existingMember = await findByWorkspaceAndUser(
    invitation.workspaceId,
    user.id
  );

  if (existingMember) {
    return res.error("You are already a member of this workspace", 409);
  }

  // Check workspace owner's subscription status
  const workspace = invitation.workspace;
  const ownerSubscription = await findByUserId(workspace.ownerId);

  if (!ownerSubscription || ownerSubscription.status !== "ACTIVE") {
    return res.error(
      "Cannot accept invitation. The workspace owner's subscription is not active.",
      403
    );
  }

  // Check if subscription has expired
  if (ownerSubscription.endDate && new Date() > new Date(ownerSubscription.endDate)) {
    return res.error(
      "Cannot accept invitation. The workspace owner's subscription has expired.",
      403
    );
  }

  // Create workspace membership
  const membership = await createMembership({
    workspaceId: invitation.workspaceId,
    userId: user.id,
    role: invitation.role,
  });

  if (!membership) {
    return res.error("Failed to create workspace membership", 500);
  }

  // Mark invitation as used
  await markInvitationAsUsed(invitation.id);

  res.success(
    {
      membership,
      workspace: {
        id: workspace.id,
        name: workspace.name,
      },
    },
    "Successfully joined workspace"
  );
};

/**
 * Get all invitations for a workspace
 */
export const getWorkspaceInvitations = async (req, res) => {
  const workspaceId = parseInt(req.params.workspaceId);

  if (!workspaceId) {
    return res.badRequest("Workspace ID is required");
  }

  // Get authenticated user
  const { userId: clerkId } = getAuth(req);
  const user = await findByClerkId(clerkId);

  if (!user) {
    return res.error("User not found", 404);
  }

  // Verify workspace exists and user is the owner or admin
  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) {
    return res.notFound("Workspace not found");
  }

  // Check if user is owner or admin member
  const isOwner = workspace.ownerId === user.id;
  const member = await findByWorkspaceAndUser(workspaceId, user.id);
  const isAdmin = member && member.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return res.error(
      "Only workspace owners and admins can view invitations",
      403
    );
  }

  const invitations = await findInvitationsByWorkspace(workspaceId);

  res.success(invitations, "Workspace invitations retrieved successfully");
};

/**
 * Delete an invitation
 */
export const deleteWorkspaceInvitation = async (req, res) => {
  const invitationId = parseInt(req.params.id);

  if (!invitationId) {
    return res.badRequest("Invitation ID is required");
  }

  // Get authenticated user
  const { userId: clerkId } = getAuth(req);
  const user = await findByClerkId(clerkId);

  if (!user) {
    return res.error("User not found", 404);
  }

  // Get invitation to check workspace ownership
  const invitation = await findInvitationByToken(req.invitation?.token);
  if (!invitation) {
    return res.notFound("Invitation not found");
  }

  const workspace = await findWorkspaceById(invitation.workspaceId);
  if (workspace.ownerId !== user.id) {
    return res.error("Only workspace owners can delete invitations", 403);
  }

  const deleted = await deleteInvitation(invitationId);

  if (!deleted) {
    return res.error("Failed to delete invitation", 500);
  }

  res.success(deleted, "Invitation deleted successfully");
};
