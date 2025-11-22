import { UserApi } from "@/api/users";

export const UserService = {
  async getAll(page: number = 1, limit: number = 100) {
    return UserApi.getAll(page, limit);
  },

  async getById(id: number) {
    return UserApi.getById(id.toString());
  },
};
