export default interface Locale {
  id: number;
  value: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  storeView?: {
    id: number;
    code: string;
    name: string;
  };
}
