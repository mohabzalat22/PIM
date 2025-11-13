
import type Product from "./product.interface";
import type Attribute from "./attribute.interface";
import type StoreView from "../storeView.interface";

export default interface ProductAttributeValue {
  id: number;
  productId: number;
  attributeId: number;
  storeViewId: number;
  valueString?: string;
  valueText?: string;
  valueInt?: number;
  valueDecimal?: number;
  valueBoolean?: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  attribute?: Attribute;
  storeView?: StoreView;
}