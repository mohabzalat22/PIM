import type StoreView from "@/interfaces/storeView.interface";
import client from "./apiClient";
import type Filter from "@/interfaces/storeView/filters.iterface";

export const StoreViewsApi = {
  getAll: async (
    page: number,
    limit: number,
    filters: Filter = {
      search: "",
      storeId: "",
      locale: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.storeId) params.append("storeId", filters.storeId);
    if (filters.locale) params.append("locale", filters.locale);


    const response = await client.get("/store-views", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/store-views/${id}`);
    return response.data;
  },

  create: async (payload: Partial<StoreView>) => {
    const response = await client.post("/store-views", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<StoreView>) => {
    const response = await client.put(`/store-views/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/store-views/${id}`);
    return response.data;
  },
};
