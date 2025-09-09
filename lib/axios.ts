import axios from 'axios';
import { getAuthCookies, clearAuthCookies } from './utils/cookies';

// Optional store attachment to avoid circular imports
let attachedStore: { getState: () => any; dispatch: (action: any) => any } | null = null;
export const attachStore = (store: { getState: () => any; dispatch: (action: any) => any }) => {
  attachedStore = store;
};

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from Redux store first, then from cookies
    let token: string | undefined;
    try {
      if (attachedStore) {
        const state = attachedStore.getState();
        token = state?.auth?.token;
      }
    } catch {
      // ignore
    }
    
    if (!token && typeof window !== 'undefined') {
      // Fallback to cookies if Redux state is empty
      const cookies = getAuthCookies();
      token = cookies.token || undefined;
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
      if (attachedStore) {
        // Dispatch logout by action type to avoid importing slice here
        attachedStore.dispatch({ type: 'auth/logout' });
      }
      
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
