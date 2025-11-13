export default interface Attribute {
  id: number;
  code: string;
  label: string;
  dataType: string;
  inputType: string;
  isFilterable: boolean;
  isGlobal: boolean;
}