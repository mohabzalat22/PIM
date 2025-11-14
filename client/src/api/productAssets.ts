import client from "./apiClient";
import type ProductAsset from "@/interfaces/productAsset.interface";

export const ProductAssetsApi = {
  getAll: async (page: number, limit: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await client.get("/product-assets", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/product-assets/${id}`);
    return response.data;
  },

  create: async (payload: Partial<ProductAsset>) => {
    const response = await client.post("/product-assets", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<ProductAsset>) => {
    const response = await client.put(`/product-assets/${id}`, payload);
    return response.data;
  },

  delete: async (productId: string, assetId: string, type: string) => {
    const response = await client.delete(
      `/product-assets/${productId}/${assetId}/${type}`
    );
    return response.data;
  },
};
