import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authTokenStore } from './authTokenStore';
import { emitLoginRequired } from './authEvents';

// API base configuration
// In production (behind nginx reverse proxy), use relative path '/api'
// In development, use the full URL to the backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add Bearer token for SPA OIDC
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authTokenStore.getToken();
    if (token) {
      (config.headers as any) = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Unified error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle HTTP error status
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - trigger OIDC login redirect (handled by OidcAuthEventsHandler)
          emitLoginRequired();
          break;
        case 403:
          console.error('Access denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('Request failed:', error.response.status);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error, please check your connection');
    } else {
      // Other errors
      console.error('Request configuration error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

