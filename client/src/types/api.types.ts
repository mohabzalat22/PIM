/**
 * API Error Response Interface
 * Represents the structure of error responses from the backend API
 */
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error?: {
    name: string;
    message: string | object;
  };
}

/**
 * API Success Response Interface
 * Represents the structure of successful responses from the backend API
 */
export interface ApiResponse<T = unknown> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
