import { AttributesApi } from "@/api/attributes";
import type Attribute from "@/interfaces/attribute.interface";
import type { Filters } from "@/interfaces/attributes.filters.interface";

export const AttributeService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return AttributesApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return AttributesApi.getById(id.toString());
  },

  async create(payload: Partial<Attribute>) {
    return AttributesApi.create(payload);
  },

  async update(id: number, payload: Partial<Attribute>) {
    return AttributesApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return AttributesApi.delete(id.toString());
  },
};
