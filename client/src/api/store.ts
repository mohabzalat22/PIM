import type Store from "@/interfaces/store.interface";
import client from "./apiClient";
import type Filters from "@/interfaces/store/filters.interface";

export const StoreApi = {
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

    const response = await client.get("/stores", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/stores/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Store>) => {
    const response = await client.post("/stores", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Store>) => {
    const response = await client.put(`/stores/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/stores/${id}`);
    return response.data;
  },
};
