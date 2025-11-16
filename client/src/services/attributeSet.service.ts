import { AttributeSetsApi } from "@/api/attributeSets";
import type AttributeSet from "@/interfaces/attributeSet.interface";
import type { AttributeSetFilters } from "@/interfaces/attributeSet.filters.interface";
import client from "@/api/apiClient";

export const AttributeSetService = {
  async getAll(page: number, limit: number, filters?: AttributeSetFilters) {
    return AttributeSetsApi.getAll(page, limit, filters || {});
  },

  async getById(id: number) {
    return AttributeSetsApi.getById(id.toString());
  },

  async create(payload: Partial<AttributeSet>) {
    return AttributeSetsApi.create(payload);
  },

  async update(id: number, payload: Partial<AttributeSet>) {
    return AttributeSetsApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return AttributeSetsApi.delete(id.toString());
  },

  async addAttributeToSet(attributeSetId: number, attributeId: number, sortOrder?: number) {
    const response = await client.post(`/attribute-sets/${attributeSetId}/attributes`, {
      attributeId,
      sortOrder,
    });

    const data = response.data as { success?: boolean; message?: string };

    if (data && data.success === false) {
      throw new Error(data.message || "Failed to add attribute to set");
    }

    return data;
  },

  async removeAttributeFromSet(attributeSetId: number, relationId: number) {
    const response = await client.delete(
      `/attribute-sets/${attributeSetId}/attributes/${relationId}`
    );

    const data = response.data as { success?: boolean; message?: string };

    if (data && data.success === false) {
      throw new Error(data.message || "Failed to remove attribute from set");
    }

    return data;
  },
};
