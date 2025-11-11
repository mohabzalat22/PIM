export default interface Category {
  id: number;
  parentId?: number;
  translations?: Array<{
    name: string;
    slug: string;
  }>;
}