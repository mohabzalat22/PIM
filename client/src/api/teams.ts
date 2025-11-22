import type Team from "@/interfaces/team.interface";
import client from "./apiClient";
import type Filters from "@/interfaces/team/filters.interface";

export const TeamApi = {
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

    const response = await client.get("/teams", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/teams/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Team>) => {
    const response = await client.post("/teams", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Team>) => {
    const response = await client.put(`/teams/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/teams/${id}`);
    return response.data;
  },
};
