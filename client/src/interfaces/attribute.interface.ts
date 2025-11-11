import type ProductAttributeValue from "./productAttributeValue.interface";
export default interface Attribute {
  id: number;
  code: string;
  label: string;
  dataType: string;
  inputType: string;
  isFilterable: boolean;
  productAttributeValues: ProductAttributeValue[];
}