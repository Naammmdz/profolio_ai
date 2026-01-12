import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add authentication token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
          // Unauthorized - Clear token and redirect to login page
          localStorage.removeItem('auth_token');
          window.location.href = '/auth';
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

