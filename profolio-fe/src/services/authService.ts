import apiClient from '../config/api';
import { LoginRequest, LoginResponse, ApiResponse, User } from '../types/api';

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
    
    // ⭐ BFF Pattern: No tokens returned, user must login via OAuth2 flow
  },

  /**
   * Logout user
   * BFF pattern: Server clears session cookie
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    // ⭐ BFF Pattern: Cookie is cleared by server, no localStorage cleanup needed
  },

  /**
   * Get current user info
   * @returns Current user data
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to get user info');
  },

  /**
   * Check if user is authenticated
   * In BFF pattern, check by calling /api/auth/me
   * @returns Promise<boolean> indicating authentication status
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get stored auth token
   * ⭐ BFF Pattern: Tokens are NOT stored in frontend
   * @returns null (tokens are server-side only)
   */
  getToken(): string | null {
    // ⭐ In BFF pattern, tokens are server-side only
    return null;
  },
};

