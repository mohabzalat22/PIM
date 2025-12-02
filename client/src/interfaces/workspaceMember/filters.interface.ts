export default interface Filters {
  search: string;
  workspaceId?: number;
  userId?: number;
  role?: string;
  sortBy: string;
  sortOrder: string;
}