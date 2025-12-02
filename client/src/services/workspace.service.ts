import { WorkspaceApi } from "@/api/workspaces";
import type Workspace from "@/interfaces/workspace.interface";
import type Filters from "@/interfaces/workspace/filters.interface";

export const WorkspaceService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return WorkspaceApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return WorkspaceApi.getById(id.toString());
  },

  async create(payload: Partial<Workspace>) {
    return WorkspaceApi.create(payload);
  },

  async update(id: number, payload: Partial<Workspace>) {
    return WorkspaceApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return WorkspaceApi.delete(id.toString());
  },
};