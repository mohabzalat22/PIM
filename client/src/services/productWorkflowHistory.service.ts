import client from "../api/apiClient";

export const ProductWorkflowHistoryService = {
  getByProductId: async (productId: number) => {
    const response = await client.get(`/products/${productId}/workflow-history`);
    return response.data;
  },

  getAll: async (page: number = 1, limit: number = 50, filters: { productId?: number; changedById?: number } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.productId) params.append("productId", filters.productId.toString());
    if (filters.changedById) params.append("changedById", filters.changedById.toString());

    const response = await client.get(`/workflow-history?`, { params });
    return response.data;
  },
};
