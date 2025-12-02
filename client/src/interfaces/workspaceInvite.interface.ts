export interface WorkspaceInvite {
  id: number;
  workspaceId: number;
  email: string;
  token: string;
  role: "ADMIN" | "MEMBER";
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  workspace?: {
    id: number;
    name: string;
    owner?: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface CreateInvitationPayload {
  workspaceId: number;
  email: string;
  role: "ADMIN" | "MEMBER";
  expiresInHours?: number;
}

export interface CreateInvitationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    invitation: WorkspaceInvite;
    invitationUrl: string;
  };
}

export interface ValidateTokenResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    valid: boolean;
    workspace: {
      id: number;
      name: string;
    };
    role: "ADMIN" | "MEMBER";
    email: string;
  };
}

export interface AcceptInvitationPayload {
  token: string;
}

export interface AcceptInvitationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    membership: {
      id: number;
      workspaceId: number;
      userId: number;
      role: "ADMIN" | "MEMBER";
    };
    workspace: {
      id: number;
      name: string;
    };
  };
}
