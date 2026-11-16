import axios from 'axios';

// Automatically determine API Base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // If deployed or served under same host
  if (typeof window !== 'undefined' && window.location.port !== '5173') {
    return '/api';
  }
  // Local development fallback
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinema_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // If token expired, clear auth
    if (error.response?.status === 401) {
      // Clear token if user was logged in
      const currentToken = localStorage.getItem('cinema_token');
      if (currentToken) {
        localStorage.removeItem('cinema_token');
        localStorage.removeItem('cinema_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
