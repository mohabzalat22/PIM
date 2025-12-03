import apiClient from "./apiClient";

export interface ImportResult {
  success: boolean;
  message: string;
  data: {
    summary: {
      total: number;
      successful: number;
      failed: number;
      updated: number;
      created: number;
      skipped: number;
      errors: Array<{
        sku: string;
        index: number;
        error: string;
      }>;
    };
    validationErrors: Array<{
      index: number;
      sku: string;
      errors: Array<{
        field: string;
        message: string;
      }>;
    }>;
  };
}

/**
 * Import products from file
 * @param file File to import (JSON, XML, CSV, or YAML)
 * @returns Import result with summary
 */
export const importProducts = async (file: File): Promise<ImportResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ImportResult>(
    "/products/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
