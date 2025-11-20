import { AxiosError } from "axios";
import type { ApiError } from "@/types/api.types";

/**
 * Extracts structured error information from various error types
 * @param error - The error object to extract information from
 * @returns Structured ApiError object
 */
export const extractApiError = (error: unknown): ApiError => {
  // Handle Axios errors (API responses)
  if (error instanceof AxiosError) {
    const response = error.response;
    
    // Backend returned an error response
    if (response?.data) {
      return {
        success: false,
        statusCode: response.status,
        message: response.data.message || "An error occurred",
        error: response.data.error,
      };
    }
    
    // Network error (no response received)
    if (error.request) {
      return {
        success: false,
        statusCode: 0,
        message: "Network error. Please check your connection.",
      };
    }
    
    // Request configuration error
    return {
      success: false,
      statusCode: 0,
      message: error.message || "Failed to make request",
    };
  }
  
  // Handle generic Error objects
  if (error instanceof Error) {
    return {
      success: false,
      statusCode: 500,
      message: error.message,
    };
  }
  
  // Handle unknown error types
  return {
    success: false,
    statusCode: 500,
    message: "An unexpected error occurred",
  };
};
