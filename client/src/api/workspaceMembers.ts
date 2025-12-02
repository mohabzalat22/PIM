import type WorkspaceMember from "@/interfaces/workspaceMember.interface";
import client from "./apiClient";
import type Filters from "@/interfaces/workspaceMember/filters.interface";

export const WorkspaceMemberApi = {
  getAll: async (
    page: number,
    limit: number,
    filters: Filters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.workspaceId) params.append("workspaceId", filters.workspaceId.toString());
    if (filters.userId) params.append("userId", filters.userId.toString());
    if (filters.role) params.append("role", filters.role);

    const response = await client.get("/workspace-members", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/workspace-members/${id}`);
    return response.data;
  },

  getMembersByWorkspace: async (workspaceId: number) => {
    const response = await client.get(`/workspace-members/workspace/${workspaceId}`);
    return response.data;
  },

  getWorkspacesByUser: async (userId: number) => {
    const response = await client.get(`/workspace-members/user/${userId}`);
    return response.data;
  },

  create: async (payload: Partial<WorkspaceMember>) => {
    const response = await client.post("/workspace-members", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<WorkspaceMember>) => {
    const response = await client.put(`/workspace-members/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/workspace-members/${id}`);
    return response.data;
  },
};