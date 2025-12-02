import type Workspace from "./workspace.interface";

export type MemberRole = "ADMIN" | "MEMBER";

export interface User {
  id: number;
  email: string;
  name?: string;
  clerkId: string;
}

export default interface WorkspaceMember {
  id: number;
  workspaceId: number;
  userId: number;
  role: MemberRole;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}