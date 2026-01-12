// API response type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication related types
export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

export interface User {
  id: string;
  email?: string;
  username?: string;
  name?: string;
  avatar?: string;
}

// Generic error response
export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

