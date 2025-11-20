import { toast } from "sonner";
import { extractApiError } from "./errorExtractor";
import type { ApiError } from "@/types/api.types";

/**
 * Wraps an async function with error handling
 * Automatically extracts and displays backend error messages
 * 
 * @param fn - Async function to execute
 * @param onError - Optional custom error handler (overrides default toast)
 * @returns Result of the function or null on error
 * 
 * @example
 * // Basic usage with automatic error toast
 * await asyncWrapper(async () => {
 *   await ProductService.remove(id);
 *   toast.success("Product deleted");
 * });
 * 
 * @example
 * // With custom error handling
 * await asyncWrapper(
 *   async () => { ... },
 *   (error) => {
 *     console.error("Custom error:", error);
 *     toast.error(`Custom: ${error.message}`);
 *   }
 * );
 */
export const asyncWrapper = async <T>(
  fn: () => Promise<T>,
  onError?: (error: ApiError) => void
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    const apiError = extractApiError(error);
    
    if (onError) {
      // Use custom error handler
      onError(apiError);
    } else {
      // Default: show toast with backend error message
      toast.error(apiError.message);
    }
    
    return null;
  }
};
