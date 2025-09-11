import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getValidatedAuthData } from '../utils/cookies';

export interface User {
  id: string;
  email: string;
  phone: string;
  isVerified: boolean;
  verifiedAt?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  fullName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Function to get initial state from cookies
const getInitialStateFromCookies = (): AuthState => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }

  const validatedAuthData = getValidatedAuthData();
  
  if (validatedAuthData && validatedAuthData.token) {
    return {
      user: validatedAuthData.user,
      token: validatedAuthData.token,
      refreshToken: validatedAuthData.refreshToken || null,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  }

  return {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialStateFromCookies();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  setLoading,
  setError,
  clearError,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;