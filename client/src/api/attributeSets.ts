import client from "./apiClient";
import type AttributeSet from "@/interfaces/attributeSet.interface";
import type { AttributeSetFilters } from "@/interfaces/attributeSet.filters.interface";

export const AttributeSetsApi = {
  getAll: async (
    page: number,
    limit: number,
    filters: AttributeSetFilters = {
      search: "",
      productType: "",
      isDefault: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy || "createdAt",
      sortOrder: filters.sortOrder || "desc",
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.productType) params.append("productType", filters.productType);
    if (filters.isDefault !== undefined && filters.isDefault !== "") {
      params.append("isDefault", filters.isDefault);
    }

    const response = await client.get("/attribute-sets", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/attribute-sets/${id}`);
    return response.data;
  },

  create: async (payload: Partial<AttributeSet>) => {
    const response = await client.post("/attribute-sets", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<AttributeSet>) => {
    const response = await client.put(`/attribute-sets/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/attribute-sets/${id}`);
    return response.data;
  },
};
