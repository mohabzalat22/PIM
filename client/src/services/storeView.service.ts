import { StoreViewsApi } from "@/api/storeView";
import type StoreView from "@/interfaces/storeView.interface";
import type Filter from "@/interfaces/storeView/filters.iterface";

export const StoreViewService = {
  async getAll(page: number, limit: number, filters?: Filter) {
    return StoreViewsApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return StoreViewsApi.getById(id.toString());
  },

  async create(payload: Partial<StoreView>) {
    return StoreViewsApi.create(payload);
  },

  async update(id: number, payload: Partial<StoreView>) {
    return StoreViewsApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return StoreViewsApi.delete(id.toString());
  },
};
