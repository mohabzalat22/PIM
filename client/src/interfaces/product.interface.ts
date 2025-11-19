import type ProductAsset from "./productAsset.interface";
import type ProductCategory from "./productCategory.interface";
import type ProductAttributeValue from "./productAttributeValue.interface";
import type AttributeSet from "./attributeSet.interface";

export default interface Product {
  id: number;
  sku: string;
  type: string;
  attributeSetId?: number | null;
  attributeSet?: AttributeSet | null;
  createdAt: string;
  updatedAt: string;
  productAssets?: ProductAsset[];
  productCategories?: ProductCategory[];
  productAttributeValues?: ProductAttributeValue[];
}