import type Attribute from "./attribute.interface";

export interface AttributeSetAttribute {
  id: number;
  attributeId: number;
  sortOrder: number;
  attribute: Attribute;
}

export interface AttributeGroupAttribute {
  id: number;
  attributeId: number;
  sortOrder: number;
  attribute: Attribute;
}

export interface AttributeGroup {
  id: number;
  code: string;
  label: string;
  sortOrder: number;
  groupAttributes?: AttributeGroupAttribute[];
}

export default interface AttributeSet {
  id: number;
  code: string;
  label: string;
  productType?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  groups?: AttributeGroup[];
  setAttributes?: AttributeSetAttribute[];
}
