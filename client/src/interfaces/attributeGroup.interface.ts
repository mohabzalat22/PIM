import type Attribute from "./attribute.interface";
import type AttributeSet from "./attributeSet.interface";

export interface AttributeGroupAttribute {
  id: number;
  attributeId: number;
  sortOrder: number;
  attribute: Attribute;
}

export default interface AttributeGroup {
  id: number;
  code: string;
  label: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  attributeSet?: AttributeSet;
  groupAttributes?: AttributeGroupAttribute[];
}
