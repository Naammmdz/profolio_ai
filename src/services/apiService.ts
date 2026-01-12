import apiClient from '../config/api';
import { ApiResponse } from '../types/api';

/**
 * Generic API service
 * Base service for making API calls
 */
export const apiService = {
  /**
   * GET request
   * @param url - API endpoint
   * @param params - Query parameters
   * @returns API response
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Request failed');
  },

  /**
   * POST request
   * @param url - API endpoint
   * @param data - Request body
   * @returns API response
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Request failed');
  },

  /**
   * PUT request
   * @param url - API endpoint
   * @param data - Request body
   * @returns API response
   */
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Request failed');
  },

  /**
   * PATCH request
   * @param url - API endpoint
   * @param data - Request body
   * @returns API response
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data);
    
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Request failed');
  },

  /**
   * DELETE request
   * @param url - API endpoint
   * @returns API response
   */
  async delete<T>(url: string): Promise<T> {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Request failed');
  },
};

