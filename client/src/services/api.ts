import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log helpful debugging in development while keeping UI friendly
    if (import.meta.env.DEV) {
      console.warn('API Client Notice (will fallback locally if offline):', error.message);
    }
    return Promise.reject(error);
  }
);
