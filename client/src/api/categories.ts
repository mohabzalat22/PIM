import client from "./apiClient";
import type Category  from "@/interfaces/category.interface";

export const CategoryApi = {
    getAll: async (filters?: Record<string, string>) => {
        const response = await client.get("/categories", { params: filters });
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