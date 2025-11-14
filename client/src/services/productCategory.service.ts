import { ProductCategoriesApi } from "@/api/productCategories";
import type ProductCategory from "@/interfaces/productCategory.interface";

export const ProductCategoryService = {
  async getAll(page: number, limit: number) {
    return ProductCategoriesApi.getAll(page, limit);
  },

  async getById(id: number) {
    return ProductCategoriesApi.getById(id.toString());
  },

  async create(payload: Partial<ProductCategory>) {
    return ProductCategoriesApi.create(payload);
  },

  async update(id: number, payload: Partial<ProductCategory>) {
    return ProductCategoriesApi.update(id.toString(), payload);
  },

  async remove(productId: number, categoryId: number) {
    return ProductCategoriesApi.delete(
      productId.toString(),
      categoryId.toString()
    );
  },
};
