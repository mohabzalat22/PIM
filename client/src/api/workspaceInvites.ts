import client from "./apiClient";
import type {
  CreateInvitationPayload,
  CreateInvitationResponse,
  ValidateTokenResponse,
  AcceptInvitationPayload,
  AcceptInvitationResponse,
  WorkspaceInvite,
} from "@/interfaces/workspaceInvite.interface";

export const WorkspaceInviteApi = {
  /**
   * Create a new workspace invitation
   */
  create: async (payload: CreateInvitationPayload) => {
    const response = await client.post<CreateInvitationResponse>(
      "/workspace-invites",
      payload
    );
    return response.data;
  },

  /**
   * Validate an invitation token
   */
  validateToken: async (token: string) => {
    const response = await client.get<ValidateTokenResponse>(
      `/workspace-invites/validate/${token}`
    );
    return response.data;
  },

  /**
   * Accept a workspace invitation
   */
  accept: async (payload: AcceptInvitationPayload) => {
    const response = await client.post<AcceptInvitationResponse>(
      "/workspace-invites/accept",
      payload
    );
    return response.data;
  },

  /**
   * Get all invitations for a workspace
   */
  getByWorkspace: async (workspaceId: number) => {
    const response = await client.get<WorkspaceInvite[]>(
      `/workspace-invites/workspace/${workspaceId}`
    );
    return response.data;
  },

  /**
   * Delete an invitation
   */
  delete: async (id: number) => {
    const response = await client.delete(`/workspace-invites/${id}`);
    return response.data;
  },
};
