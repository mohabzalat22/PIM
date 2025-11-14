import { ProductAttibuteValuesApi } from "@/api/productAttributeValues";
import type ProductAttributeValue from "@/interfaces/productAttributes/productAttributevalue.interface";
import type Filters from "@/interfaces/productAttributes/filters.interface";

export const ProductAttributeValueService = {
  async getAll(page: number, limit: number, filters: Filters) {
    return ProductAttibuteValuesApi.getAll(page, limit, filters);
  },

  async getById(id: number) {
    return ProductAttibuteValuesApi.getById(id.toString());
  },

  async create(payload: Partial<ProductAttributeValue>) {
    return ProductAttibuteValuesApi.create(payload);
  },

  async update(id: number, payload: Partial<ProductAttributeValue>) {
    return ProductAttibuteValuesApi.update(id.toString(), payload);
  },

  async remove(id: number) {
    return ProductAttibuteValuesApi.delete(id.toString());
  },
};
