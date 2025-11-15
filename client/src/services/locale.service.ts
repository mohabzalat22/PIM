import { LocalesApi, type LocaleFilters } from "@/api/locale";
import type Locale from "@/interfaces/locale.interface";

export const LocaleService = {
  async getAll(page: number, limit: number, filters?: LocaleFilters) {
    return LocalesApi.getAll(page, limit, filters);
  },

  async create(payload: Partial<Locale>) {
    return LocalesApi.create(payload);
  },

  async update(id: number, payload: Partial<Locale>) {
    return LocalesApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return LocalesApi.delete(id.toString());
  },
};
