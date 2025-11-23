export default interface Filters {
  search: string;
  type: string;
  status: string;
  categoryId: string;
  attributeFilters: Record<string, string>;
  sortBy: string;
  sortOrder: string;
}