import { TeamApi } from "@/api/teams";
import type Team from "@/interfaces/team.interface";
import type Filters from "@/interfaces/team/filters.interface";

export const TeamService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return TeamApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return TeamApi.getById(id.toString());
  },

  async create(payload: Partial<Team>) {
    return TeamApi.create(payload);
  },

  async update(id: number, payload: Partial<Team>) {
    return TeamApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return TeamApi.delete(id.toString());
  },
};
