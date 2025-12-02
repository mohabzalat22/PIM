import { WorkspaceMemberApi } from "@/api/workspaceMembers";
import type WorkspaceMember from "@/interfaces/workspaceMember.interface";
import type Filters from "@/interfaces/workspaceMember/filters.interface";

export const WorkspaceMemberService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return WorkspaceMemberApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return WorkspaceMemberApi.getById(id.toString());
  },

  async getMembersByWorkspace(workspaceId: number) {
    return WorkspaceMemberApi.getMembersByWorkspace(workspaceId);
  },

  async getWorkspacesByUser(userId: number) {
    return WorkspaceMemberApi.getWorkspacesByUser(userId);
  },

  async create(payload: Partial<WorkspaceMember>) {
    return WorkspaceMemberApi.create(payload);
  },

  async update(id: number, payload: Partial<WorkspaceMember>) {
    return WorkspaceMemberApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return WorkspaceMemberApi.delete(id.toString());
  },
};