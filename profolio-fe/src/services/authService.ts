import apiClient from '../config/api';
import { LoginRequest, ApiResponse } from '../types/api';

/**
 * Authentication service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Register new user
   * After registration, user should use OAuth2 flow to login
   * @param userData - User registration data
   * @returns Registration response
   */
  async register(userData: LoginRequest & { name?: string }): Promise<void> {
    const response = await apiClient.post<ApiResponse<any>>('/auth/register', userData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Registration failed');
    }
    
    // Registration only. Login is handled by OIDC redirect flow.
  },

};
