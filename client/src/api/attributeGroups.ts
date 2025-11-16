import client from "./apiClient";
import type AttributeGroup from "@/interfaces/attributeGroup.interface";
import type { AttributeGroupFilters } from "@/interfaces/attributeGroup.filters.interface";

export const AttributeGroupsApi = {
  getAll: async (
    page: number,
    limit: number,
    filters: AttributeGroupFilters = {
      search: "",
      attributeSetId: "",
      sortBy: "sortOrder",
      sortOrder: "asc",
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy || "sortOrder",
      sortOrder: filters.sortOrder || "asc",
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.attributeSetId) params.append("attributeSetId", filters.attributeSetId);

    const response = await client.get("/attribute-groups", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/attribute-groups/${id}`);
    return response.data;
  },

  getAttributes: async (id: string) => {
    const response = await client.get(`/attribute-groups/${id}/attributes`);
    return response.data;
  },

  create: async (payload: Partial<AttributeGroup> & { attributeSetId: number }) => {
    const response = await client.post("/attribute-groups", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<AttributeGroup> & { attributeSetId?: number }) => {
    const response = await client.put(`/attribute-groups/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`/attribute-groups/${id}`);
    return response.data;
  },
};
