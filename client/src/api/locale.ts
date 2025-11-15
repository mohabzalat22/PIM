import type Locale from "@/interfaces/locale.interface";
import client from "./apiClient";

export interface LocaleFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const LocalesApi = {
  getAll: async (
    page: number,
    limit: number,
    filters: LocaleFilters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: filters.sortBy ?? "createdAt",
      sortOrder: filters.sortOrder ?? "desc",
    });

    if (filters.search) params.append("search", filters.search);

    const response = await client.get("/locales", { params });
    return response.data as {
      data: Locale[];
      meta?: { totalPages?: number; total?: number };
    };
  },

  create: async (payload: Partial<Locale>) => {
    const response = await client.post("/locales", payload);
    return response.data as Locale;
  },

  update: async (id: string, payload: Partial<Locale>) => {
    const response = await client.put(`/locales/${id}`, payload);
    return response.data as Locale | { message: string };
  },

  delete: async (id: string) => {
    const response = await client.delete(`/locales/${id}`);
    return response.data;
  },
};
