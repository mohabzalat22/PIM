import { ProductsApi } from "@/api/products";
import type Product from "@/interfaces/product.interface";
import type Filters from "@/interfaces/products.filters.interface";

export const ProductService = {
  async list(page: number, limit: number, filters?: Filters) {
    return ProductsApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return ProductsApi.getById(id.toString());
  },

  async create(payload: Partial<Product>) {
    return ProductsApi.create(payload);
  },

  async update(id: number, payload: Partial<Product>) {
    return ProductsApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return ProductsApi.delete(id.toString());
  },
};
