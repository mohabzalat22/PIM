import client from "./apiClient";
import type Filters from "@/interfaces/productAttributes/filters.interface";
import type ProductAttributeValue from "@/interfaces/productAttributes/productAttributevalue.interface";

export const ProductAttibuteValuesApi = {
  getAll: async (page: number, limit: number, filters: Filters) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.productId) params.append("productId", filters.productId);
    if (filters.attributeId) params.append("attributeId", filters.attributeId);
    if (filters.storeViewId) params.append("storeViewId", filters.storeViewId);
    if (filters.dataType) params.append("dataType", filters.dataType);

    const response = await client.get("product-attributes", { params: params });
    return response.data;
  },
  getById: async (id: string) => {
          const response = await client.get(`/product-attributes/${id}`);
          return response.data;
      },
  
      create: async (payload: Partial<ProductAttributeValue>)=> {
          const response = await client.post("/product-attributes", payload);
          return response.data;
      },
  
      update: async (id: string, payload: Partial<ProductAttributeValue>) => {
          const response = await client.put(`/product-attributes/${id}`, payload);
          return response.data;
      },
  
      delete: async (id: string) => {
          const response = await client.delete(`/product-attributes/${id}`);
          return response.data;
      },
};
