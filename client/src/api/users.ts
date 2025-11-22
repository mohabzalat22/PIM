import client from "./apiClient";

export const UserApi = {
  getAll: async (page: number = 1, limit: number = 100) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await client.get("/users", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/users/${id}`);
    return response.data;
  },
};
