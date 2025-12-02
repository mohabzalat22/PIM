import type Workspace from "@/interfaces/workspace.interface";
import client from "./apiClient";
import type Filters from "@/interfaces/workspace/filters.interface";

export const WorkspaceApi = {
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

    const response = await client.get("/workspaces", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/workspaces/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Workspace>) => {
    const response = await client.post("/workspaces", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Workspace>) => {
    const response = await client.put(`/workspaces/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/workspaces/${id}`);
    return response.data;
  },
};