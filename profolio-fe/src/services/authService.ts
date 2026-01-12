import apiClient from '../config/api';
import { LoginRequest, LoginResponse, ApiResponse, User } from '../types/api';

/**
 * Authentication service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login user
   * @param credentials - Login credentials
   * @returns Login response with token and user info
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    if (response.data.success && response.data.data) {
      // Store token in localStorage
      localStorage.setItem('auth_token', response.data.data.token);
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  },

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Registration response
   */
  async register(userData: LoginRequest & { name?: string }): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', userData);
    
    if (response.data.success && response.data.data) {
      // Store token in localStorage
      localStorage.setItem('auth_token', response.data.data.token);
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Registration failed');
  },

  /**
   * Logout user
   * Clears token from localStorage
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
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
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get stored auth token
   * @returns Auth token or null
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};

