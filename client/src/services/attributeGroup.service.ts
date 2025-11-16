import { AttributeGroupsApi } from "@/api/attributeGroups";
import type AttributeGroup from "@/interfaces/attributeGroup.interface";
import type { AttributeGroupFilters } from "@/interfaces/attributeGroup.filters.interface";
import client from "@/api/apiClient";

export const AttributeGroupService = {
  async getAll(page: number, limit: number, filters?: AttributeGroupFilters) {
    return AttributeGroupsApi.getAll(page, limit, filters || {});
  },

  async getById(id: number) {
    return AttributeGroupsApi.getById(id.toString());
  },

  async getAttributes(id: number) {
    return AttributeGroupsApi.getAttributes(id.toString());
  },

  async create(payload: Partial<AttributeGroup> & { attributeSetId: number }) {
    return AttributeGroupsApi.create(payload);
  },

  async update(id: number, payload: Partial<AttributeGroup> & { attributeSetId?: number }) {
    return AttributeGroupsApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return AttributeGroupsApi.delete(id.toString());
  },

  async addAttributeToGroup(
    attributeSetId: number,
    attributeGroupId: number,
    attributeId: number,
    sortOrder?: number
  ) {
    const response = await client.post(
      `/attribute-sets/${attributeSetId}/groups/${attributeGroupId}/attributes`,
      {
        attributeId,
        sortOrder,
      }
    );

    const data = response.data as { success?: boolean; message?: string };

    if (data && data.success === false) {
      throw new Error(data.message || "Failed to add attribute to group");
    }

    return data;
  },

  async removeAttributeFromGroup(
    attributeSetId: number,
    attributeGroupId: number,
    relationId: number
  ) {
    const response = await client.delete(
      `/attribute-sets/${attributeSetId}/groups/${attributeGroupId}/attributes/${relationId}`
    );

    const data = response.data as { success?: boolean; message?: string };

    if (data && data.success === false) {
      throw new Error(data.message || "Failed to remove attribute from group");
    }

    return data;
  },
};
