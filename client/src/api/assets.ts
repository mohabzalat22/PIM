import client from "./apiClient";
import type Asset from "@/interfaces/asset.interface";
import type Filters from "@/interfaces/categories.filters.interface";

export const AssetsApi = {
  getAll: async (
    page: number,
    limit: number,
    filters: Filters = {
      search: "",
      mimeType: "",
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
    if (filters.mimeType) params.append("mimeType", filters.mimeType);

    const response = await client.get("/assets", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/assets/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Asset>) => {
    const response = await client.post("/assets", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Asset>) => {
    const response = await client.put(`/assets/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/assets/${id}`);
    return response.data;
  },
};
