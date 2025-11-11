import type ProductAsset from "./productAsset.interface";

export default interface Asset {
  id: number;
  filePath: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  productAssets?: ProductAsset[];
}