import type Filters from "@/interfaces/products.filters.interface";
import client from "./apiClient";
import type Product from "@/interfaces/product.interface";

export const ProductsApi = {
  getAll: async (page: number, limit: number, filters: Filters) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (Object.keys(filters.attributeFilters).length > 0) {
      params.append("attributes", JSON.stringify(filters.attributeFilters));
    }

    const response = await client.get(`/products?`, {params: params});
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/products/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Product>) => {
    const response = await client.post("/products", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Product>) => {
    const response = await client.put(`/products/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await client.delete(`/products/${id}`);
    return response.data;
  },
};
