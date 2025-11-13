import type Attribute from "@/interfaces/attribute.interface";
import client from "./apiClient";

export const AttributesApi = {
  getAll: async () => {
    const response = await client.get("/attributes");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await client.get(`/attributes/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Attribute>) => {
    const response = await client.post("attributes/", payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<Attribute>) => {
    const response = await client.put(`attributes/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await client.delete(`attributes/${id}`);
    return response.data;
  },
};
