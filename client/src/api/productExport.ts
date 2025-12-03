import apiClient from "./apiClient";

export interface ExportOptions {
  format: "json" | "xml" | "csv" | "yaml";
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  categoryId?: string;
  assignedTo?: string;
}

/**
 * Export products with all related data
 * @param options Export options including format and filters
 * @returns Blob for file download
 */
export const exportProducts = async (
  options: ExportOptions
): Promise<Blob> => {
  const params = new URLSearchParams();
  params.append("format", options.format);
  
  if (options.page) params.append("page", options.page.toString());
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.search) params.append("search", options.search);
  if (options.type) params.append("type", options.type);
  if (options.status) params.append("status", options.status);
  if (options.categoryId) params.append("categoryId", options.categoryId);
  if (options.assignedTo) params.append("assignedTo", options.assignedTo);

  const response = await apiClient.get(`/products/export?${params.toString()}`, {
    responseType: "blob",
  });

  return response.data;
};
