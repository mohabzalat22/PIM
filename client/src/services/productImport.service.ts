import * as ProductImportApi from "../api/productImport";
import type { ImportResult } from "../api/productImport";

export const ProductImportService = {
  /**
   * Import products from file
   * @param file File to import
   * @returns Import result with summary
   */
  async import(file: File): Promise<ImportResult> {
    try {
      const result = await ProductImportApi.importProducts(file);
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import products";
      throw new Error(errorMessage);
    }
  },

  /**
   * Validate file before import
   * @param file File to validate
   * @returns Validation result
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size exceeds 50MB limit",
      };
    }

    // Check file extension
    const allowedExtensions = [".json", ".xml", ".csv"];
    const filename = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      filename.endsWith(ext)
    );

    if (!hasValidExtension) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`,
      };
    }

    return { valid: true };
  },
};
