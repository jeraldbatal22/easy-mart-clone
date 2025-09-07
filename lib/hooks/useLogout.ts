import { useAppDispatch } from '../hooks';
import { logout } from '../slices/authSlice';
import { clearAuthCookies } from '../utils/cookies';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // Clear Redux state
    dispatch(logout());
    
    // Clear cookies
    if (typeof window !== 'undefined') {
      clearAuthCookies();
    }
    
    // Redirect to signin
    router.push('/signin');
  };

  return { logout: handleLogout };
};
