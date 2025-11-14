import { CategoryApi } from "@/api/categories";
import type Category from "@/interfaces/category.interface";
import type Filters from "@/interfaces/category/category.filters.interface";

export const CategoryService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return CategoryApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return CategoryApi.getById(id.toString());
  },

  async create(payload: Partial<Category>) {
    return CategoryApi.create(payload);
  },

  async update(id: number, payload: Partial<Category>) {
    return CategoryApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return CategoryApi.delete(id.toString());
  },
};
