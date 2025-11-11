import type ProductAsset from "./productAsset.interface";
import type ProductCategory from "./productCategory.interface";
import type ProductAttributeValue from "./productAttributeValue.interface";

export default interface Product {
  id: number;
  sku: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  productAssets?: ProductAsset[];
  productCategories?: ProductCategory[];
  productAttributeValues?: ProductAttributeValue[];
}