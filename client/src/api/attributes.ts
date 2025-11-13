import type Attribute from "@/interfaces/attribute.interface";
import client from "./apiClient";
import type { Filters } from "@/interfaces/attributes.filters.interface";

export const AttributesApi = {
  getAll: async (page: number, limit: number, filters: Filters) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.dataType) params.append("dataType", filters.dataType);
    if (filters.inputType) params.append("inputType", filters.inputType);
    if (filters.isFilterable !== "")
      params.append("isFilterable", filters.isFilterable);
    if (filters.isGlobal !== "") params.append("isGlobal", filters.isGlobal);

    const response = await client.get("/attributes", { params: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/attributes/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Attribute>) => {
    const response = await client.post("attributes/", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Attribute>) => {
    const response = await client.put(`attributes/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`attributes/${id}`);
    return response.data;
  },
};
