import { AxiosError } from 'axios';

/**
 * Extract error message from API error
 * @param error - Axios error object
 * @returns Error message string
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns boolean indicating if it's a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && !!error.request;
  }
  return false;
};

/**
 * Format API endpoint with path parameters
 * @param endpoint - API endpoint template (e.g., '/users/:id')
 * @param params - Parameters object (e.g., { id: '123' })
 * @returns Formatted endpoint (e.g., '/users/123')
 */
export const formatEndpoint = (endpoint: string, params: Record<string, string | number>): string => {
  let formatted = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    formatted = formatted.replace(`:${key}`, String(value));
  });
  return formatted;
};

