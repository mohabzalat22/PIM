import { TeamMemberApi } from "@/api/teamMembers";
import type TeamMember from "@/interfaces/teamMember.interface";
import type Filters from "@/interfaces/teamMember/filters.interface";

export const TeamMemberService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return TeamMemberApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return TeamMemberApi.getById(id.toString());
  },

  async getMembersByTeam(teamId: number) {
    return TeamMemberApi.getMembersByTeam(teamId);
  },

  async getTeamsByUser(userId: number) {
    return TeamMemberApi.getTeamsByUser(userId);
  },

  async create(payload: Partial<TeamMember>) {
    return TeamMemberApi.create(payload);
  },

  async update(id: number, payload: Partial<TeamMember>) {
    return TeamMemberApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return TeamMemberApi.delete(id.toString());
  },
};
