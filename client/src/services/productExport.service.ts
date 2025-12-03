import * as ProductExportApi from "../api/productExport";

export const ProductExportService = {
  /**
   * Export products in specified format
   * @param format Export format (json, xml, csv, yaml)
   * @param filters Optional filters
   * @returns Blob for download
   */
  async export(
    format: "json" | "xml" | "csv" | "yaml",
    filters?: {
      search?: string;
      type?: string;
      status?: string;
      categoryId?: string;
      assignedTo?: string;
      page?: number;
      limit?: number;
    }
  ) {
    try {
      const blob = await ProductExportApi.exportProducts({
        format,
        ...filters,
      });
      return blob;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export products";
      throw new Error(errorMessage);
    }
  },

  /**
   * Trigger file download from blob
   * @param blob File blob
   * @param format File format for extension
   */
  downloadFile(blob: Blob, format: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const timestamp = new Date().toISOString().split("T")[0];
    link.download = `products-export-${timestamp}.${format}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  },
};
