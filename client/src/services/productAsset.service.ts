import { ProductAssetsApi } from "@/api/productAssets";
import type ProductAsset from "@/interfaces/productAsset.interface";

export const ProductAssetService = {
  async getAll(page: number, limit: number) {
    return ProductAssetsApi.getAll(page, limit);
  },

  async getById(id: number) {
    return ProductAssetsApi.getById(id.toString());
  },

  async create(payload: Partial<ProductAsset>) {
    return ProductAssetsApi.create(payload);
  },

  async update(id: number, payload: Partial<ProductAsset>) {
    return ProductAssetsApi.update(id.toString(), payload);
  },

  async remove(productId: number, assetId: number, type: string) {
    return ProductAssetsApi.delete(
      productId.toString(),
      assetId.toString(),
      type
    );
  },
};
