import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setCredentials, logout } from '../slices/authSlice';
import { useGetMeQuery } from '../api/authApi';
import { setAuthCookies, clearAuthCookies, getValidatedAuthData, validateCookieData } from '../utils/cookies';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, refreshToken, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Get user data if token exists but no user data
  const { data: meData, error: meError, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  // Sync state with cookies when auth state changes (fallback)
  useEffect(() => {
    const validatedAuthData = getValidatedAuthData();
    
    // If we have auth state but no valid cookies, clear it
    if ((token || user) && !validateCookieData()) {
      dispatch(logout());
      return;
    }
    
    // If cookies exist but state is different, sync them
    if (validatedAuthData && validatedAuthData.token && token && user) {
      if (token !== validatedAuthData.token || refreshToken !== validatedAuthData.refreshToken) {
        dispatch(setCredentials({
          user: validatedAuthData.user,
          token: validatedAuthData.token,
          refreshToken: validatedAuthData.refreshToken || undefined,
        }));
      }
    }
  }, [dispatch, token, user, refreshToken, isAuthenticated]);

  // Handle successful user data fetch
  useEffect(() => {
    if (meData?.success && meData.user && token) {
      dispatch(setCredentials({
        user: meData.user,
        token,
        refreshToken: refreshToken || undefined,
      }));
    }
  }, [meData, token, refreshToken, dispatch]);

  // Handle auth error (token invalid)
  useEffect(() => {
    if (meError && token) {
      // Token is invalid, logout user
      dispatch(logout());
      clearAuthCookies();
    }
  }, [meError, token, dispatch]);

  // Sync auth state to cookies when it changes
  useEffect(() => {
    if (token && user) {
      setAuthCookies({
        token,
        refreshToken: refreshToken || undefined,
        userData: user,
      });
    } else if (!token && !user) {
      clearAuthCookies();
    }
  }, [token, refreshToken, user]);

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading: meLoading,
  };
};
