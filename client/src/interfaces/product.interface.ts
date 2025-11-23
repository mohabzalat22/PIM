import type ProductAsset from "./productAsset.interface";
import type ProductCategory from "./productCategory.interface";
import type ProductAttributeValue from "./productAttributeValue.interface";
import type AttributeSet from "./attributeSet.interface";

export type ProductStatus = 'DRAFT' | 'ENRICHMENT' | 'VALIDATION' | 'APPROVAL' | 'PUBLISHING';

export interface AssignedUser {
  id: number;
  name: string;
  email: string;
}

export default interface Product {
  id: number;
  sku: string;
  type: string;
  status?: ProductStatus;
  attributeSetId?: number | null;
  attributeSet?: AttributeSet | null;
  assignedTo?: number | null;
  assignedUser?: AssignedUser | null;
  createdAt: string;
  updatedAt: string;
  productAssets?: ProductAsset[];
  productCategories?: ProductCategory[];
  productAttributeValues?: ProductAttributeValue[];
}