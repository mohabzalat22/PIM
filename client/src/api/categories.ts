import type Filters  from "@/interfaces/category/category.filters.interface";
import client from "./apiClient";
import type Category  from "@/interfaces/category.interface";

export const CategoryApi = {
    getAll: async (page: number, limit: number, filters: Filters={
        search: "",
        parentId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      }) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        });

        if (filters.search) params.append("search", filters.search);
        if (filters.parentId) params.append("parentId", filters.parentId);

        const response = await client.get("/categories", { params: params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await client.get(`/categories/${id}`);
        return response.data;
    },

    create: async (payload: Partial<Category>)=> {
        const response = await client.post("/categories", payload);
        return response.data;
    },

    update: async (id: string, payload: Partial<Category>) => {
        const response = await client.put(`/categories/${id}`, payload);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await client.delete(`/categories/${id}`);
        return response.data;
    },
};