export default interface StoreView {
  id: number;
  code: string;
  name: string;
  localeId: number;
  locale?: {
    id: number;
    value: string;
    label: string;
  };
}