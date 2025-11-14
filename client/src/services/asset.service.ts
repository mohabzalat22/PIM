import { AssetsApi } from "@/api/assets";
import type Asset from "@/interfaces/asset.interface";
import type Filters from "@/interfaces/categories.filters.interface";

export const AssetService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return AssetsApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return AssetsApi.getById(id.toString());
  },

  async create(payload: Partial<Asset>) {
    return AssetsApi.create(payload);
  },

  async update(id: number, payload: Partial<Asset>) {
    return AssetsApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return AssetsApi.delete(id.toString());
  },
};
