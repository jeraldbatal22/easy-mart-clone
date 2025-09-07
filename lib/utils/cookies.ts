import Cookies from 'js-cookie';

export interface AuthCookies {
  token: string | null;
  refreshToken: string | null;
  userData: string | null;
}

export const COOKIE_NAMES = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

// Cookie options
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Refresh token cookie options (30 days)
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  expires: 30, // 30 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Get all auth cookies
export const getAuthCookies = (): AuthCookies => {
  if (typeof window === 'undefined') {
    return {
      token: null,
      refreshToken: null,
      userData: null,
    };
  }

  return {
    token: Cookies.get(COOKIE_NAMES.TOKEN) || null,
    refreshToken: Cookies.get(COOKIE_NAMES.REFRESH_TOKEN) || null,
    userData: Cookies.get(COOKIE_NAMES.USER_DATA) || null,
  };
};

// Set auth cookies
export const setAuthCookies = (data: {
  token: string;
  refreshToken?: string;
  userData: any;
}) => {
  if (typeof window === 'undefined') return;

  // Set token
  Cookies.set(COOKIE_NAMES.TOKEN, data.token, COOKIE_OPTIONS);
  
  // Set refresh token if provided (with longer expiration)
  if (data.refreshToken) {
    Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, data.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  }
  
  // Set user data
  Cookies.set(COOKIE_NAMES.USER_DATA, JSON.stringify(data.userData), COOKIE_OPTIONS);
};

// Clear all auth cookies
export const clearAuthCookies = () => {
  if (typeof window === 'undefined') return;

  Cookies.remove(COOKIE_NAMES.TOKEN);
  Cookies.remove(COOKIE_NAMES.REFRESH_TOKEN);
  Cookies.remove(COOKIE_NAMES.USER_DATA);
};

// Get parsed user data
export const getUserDataFromCookie = () => {
  const cookies = getAuthCookies();
  if (!cookies.userData) return null;
  
  try {
    return JSON.parse(cookies.userData);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
};

// Check if user is authenticated based on cookies
export const isAuthenticatedFromCookies = (): boolean => {
  const cookies = getAuthCookies();
  return !!(cookies.token && cookies.userData);
};

// Validate cookie data integrity
export const validateCookieData = (): boolean => {
  const cookies = getAuthCookies();
  const userData = getUserDataFromCookie();
  
  // Check if we have all required data
  if (!cookies.token || !userData) {
    return false;
  }
  
  // Validate user data structure
  if (!userData.id || !userData.email) {
    return false;
  }
  
  return true;
};

// Get validated auth data from cookies
export const getValidatedAuthData = () => {
  if (!validateCookieData()) {
    return null;
  }
  
  const cookies = getAuthCookies();
  const userData = getUserDataFromCookie();
  
  return {
    token: cookies.token,
    refreshToken: cookies.refreshToken,
    user: userData,
  };
};
