import { WorkspaceInviteApi } from "@/api/workspaceInvites";
import type {
  CreateInvitationPayload,
  AcceptInvitationPayload,
} from "@/interfaces/workspaceInvite.interface";

export const WorkspaceInviteService = {
  /**
   * Create a new workspace invitation
   */
  async createInvitation(payload: CreateInvitationPayload) {
    return WorkspaceInviteApi.create(payload);
  },

  /**
   * Validate an invitation token
   */
  async validateToken(token: string) {
    return WorkspaceInviteApi.validateToken(token);
  },

  /**
   * Accept a workspace invitation
   */
  async acceptInvitation(payload: AcceptInvitationPayload) {
    return WorkspaceInviteApi.accept(payload);
  },

  /**
   * Get all invitations for a workspace
   */
  async getWorkspaceInvitations(workspaceId: number) {
    return WorkspaceInviteApi.getByWorkspace(workspaceId);
  },

  /**
   * Delete an invitation
   */
  async deleteInvitation(id: number) {
    return WorkspaceInviteApi.delete(id);
  },
};
