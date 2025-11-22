import type Team from "./team.interface";

export type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

export interface User {
  id: number;
  email: string;
  name?: string;
  clerkId: string;
}

export default interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: MemberRole;
  createdAt: string;
  updatedAt: string;
  team?: Team;
  user?: User;
}
