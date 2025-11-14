import type StoreView from "./storeView.interface";

export default interface Store {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  storeViews?: StoreView[];
}