import axios from 'axios';
import { store } from './store';
import { logout } from './slices/authSlice';
import { getAuthCookies, clearAuthCookies } from './utils/cookies';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from Redux store first, then from cookies
    const state = store.getState();
    let token = state.auth.token;
    
    if (!token && typeof window !== 'undefined') {
      // Fallback to cookies if Redux state is empty
      const cookies = getAuthCookies();
      token = cookies.token;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      store.dispatch(logout());
      
      // Clear cookies
      if (typeof window !== 'undefined') {
        clearAuthCookies();
      }
      
      // Redirect to signin page
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
