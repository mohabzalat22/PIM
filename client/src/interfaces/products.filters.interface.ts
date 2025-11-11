export default interface Filters {
  search: string;
  type: string;
  categoryId: string;
  attributeFilters: Record<string, string>;
  sortBy: string;
  sortOrder: string;
}