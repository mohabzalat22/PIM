import { StoreApi } from "@/api/store";
import type Store from "@/interfaces/store.interface";
import type Filters from "@/interfaces/store/filters.interface";

export const StoreService = {
  async list(page: number, limit: number, filters?: Filters) {
    return StoreApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return StoreApi.getById(id.toString());
  },

  async create(payload: Partial<Store>) {
    return StoreApi.create(payload);
  },

  async update(id: number, payload: Partial<Store>) {
    return StoreApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return StoreApi.delete(id.toString());
  },
};
