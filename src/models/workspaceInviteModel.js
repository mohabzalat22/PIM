import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new workspace invitation
 * @param {Object} data - Invitation data { workspaceId, email, token, role, expiresAt }
 * @returns {Promise<Object>} - Created invitation object
 */
export const createInvitation = async (data) => {
  return await prisma.workspaceInvite.create({
    data,
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

/**
 * Find invitation by token
 * @param {string} token - Invitation token
 * @returns {Promise<Object|null>} - Invitation object or null
 */
export const findInvitationByToken = async (token) => {
  return await prisma.workspaceInvite.findUnique({
    where: { token },
    include: {
      workspace: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Validate invitation token
 * @param {string} token - Invitation token
 * @returns {Promise<Object>} - Validation result { valid: boolean, message: string, invitation: Object|null }
 */
export const validateInvitation = async (token) => {
  const invitation = await findInvitationByToken(token);

  if (!invitation) {
    return { valid: false, message: "Invalid invitation token", invitation: null };
  }

  if (invitation.usedAt) {
    return { valid: false, message: "This invitation has already been used", invitation: null };
  }

  const now = new Date();
  if (now > new Date(invitation.expiresAt)) {
    return { valid: false, message: "This invitation has expired", invitation: null };
  }

  return { valid: true, message: "Invitation is valid", invitation };
};

/**
 * Mark invitation as used
 * @param {number} id - Invitation ID
 * @returns {Promise<Object>} - Updated invitation object
 */
export const markInvitationAsUsed = async (id) => {
  return await prisma.workspaceInvite.update({
    where: { id },
    data: { usedAt: new Date() },
  });
};

/**
 * Get all invitations for a workspace
 * @param {number} workspaceId - Workspace ID
 * @returns {Promise<Array>} - Array of invitations
 */
export const findInvitationsByWorkspace = async (workspaceId) => {
  return await prisma.workspaceInvite.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Delete invitation by ID
 * @param {number} id - Invitation ID
 * @returns {Promise<Object>} - Deleted invitation object
 */
export const deleteInvitation = async (id) => {
  return await prisma.workspaceInvite.delete({
    where: { id },
  });
};
