import type TeamMember from "@/interfaces/teamMember.interface";
import client from "./apiClient";
import type Filters from "@/interfaces/teamMember/filters.interface";

export const TeamMemberApi = {
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
    if (filters.teamId) params.append("teamId", filters.teamId.toString());
    if (filters.userId) params.append("userId", filters.userId.toString());
    if (filters.role) params.append("role", filters.role);

    const response = await client.get("/team-members", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/team-members/${id}`);
    return response.data;
  },

  getMembersByTeam: async (teamId: number) => {
    const response = await client.get(`/team-members/team/${teamId}`);
    return response.data;
  },

  getTeamsByUser: async (userId: number) => {
    const response = await client.get(`/team-members/user/${userId}`);
    return response.data;
  },

  create: async (payload: Partial<TeamMember>) => {
    const response = await client.post("/team-members", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<TeamMember>) => {
    const response = await client.put(`/team-members/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/team-members/${id}`);
    return response.data;
  },
};
