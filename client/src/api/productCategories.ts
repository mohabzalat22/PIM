import client from "./apiClient";
import type ProductCategory from "@/interfaces/productCategory.interface";

export const ProductCategoriesApi = {
  getAll: async (page: number, limit: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await client.get("/product-categories", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/product-categories/${id}`);
    return response.data;
  },

  create: async (payload: Partial<ProductCategory>) => {
    const response = await client.post("/product-categories", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<ProductCategory>) => {
    const response = await client.put(`/product-categories/${id}`, payload);
    return response.data;
  },

  delete: async (productId: string, categoryId: string) => {
    const response = await client.delete(
      `/product-categories/${productId}/${categoryId}`
    );
    return response.data;
  },
};
