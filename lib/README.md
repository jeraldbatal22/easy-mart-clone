# Redux Setup Documentation

This project uses Redux Toolkit with RTK Query for state management and API calls, with cookie-based persistence for auth tokens.

## Structure

```
lib/
├── store.ts                 # Redux store configuration
├── slices/
│   └── authSlice.ts        # Auth state management
├── api/
│   └── authApi.ts          # RTK Query API endpoints
├── utils/
│   └── cookies.ts          # Cookie utilities for auth persistence
├── hooks.ts                # Typed Redux hooks
├── hooks/
│   ├── useAuth.ts          # Auth state hook with cookie persistence
│   └── useLogout.ts        # Logout functionality
├── axios.ts                # Axios interceptors with cookie support
└── providers/
    └── ReduxProvider.tsx   # Redux provider wrapper
```

## Usage

### 1. Auth State Management

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Welcome, {user?.email}!</div>;
}
```

### 2. API Calls with RTK Query

```tsx
import { useValidateOtpMutation } from '@/lib/api/authApi';

function OtpPage() {
  const [validateOtp, { isLoading, error }] = useValidateOtpMutation();
  
  const handleVerify = async () => {
    try {
      const result = await validateOtp({
        identifier: 'user@example.com',
        code: '1234',
        type: 'email'
      }).unwrap();
      
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <button onClick={handleVerify} disabled={isLoading}>
      {isLoading ? 'Verifying...' : 'Verify'}
    </button>
  );
}
```

### 3. Auth Actions

```tsx
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials, logout } from '@/lib/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  const handleLogin = (user, token) => {
    dispatch(setCredentials({ user, token }));
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };
}
```

### 4. Route Protection

```tsx
import AuthGuard from '@/components/auth/AuthGuard';

function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div>This page requires authentication</div>
    </AuthGuard>
  );
}

function PublicPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div>This page is for non-authenticated users</div>
    </AuthGuard>
  );
}
```

## Features

- ✅ **Redux Toolkit** for state management
- ✅ **RTK Query** for API calls with caching
- ✅ **Cookie-based persistence** for auth tokens and user data
- ✅ **Axios Interceptors** for automatic token handling
- ✅ **TypeScript** support with typed hooks
- ✅ **Auth Guards** for route protection
- ✅ **Automatic token refresh** and logout on 401 errors
- ✅ **Secure cookie storage** with proper options

## API Endpoints

The following endpoints are available through RTK Query:

- `useSigninMutation()` - User signin
- `useValidateOtpMutation()` - OTP validation
- `useResendOtpMutation()` - Resend OTP
- `useGetMeQuery()` - Get current user

## State Structure

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

## Persistence

Auth state is automatically persisted to secure HTTP-only cookies and restored on app reload. The following data is stored in cookies:

- `auth_token` - JWT access token
- `refresh_token` - Refresh token for token renewal
- `user_data` - Serialized user information

Cookies are configured with:
- 7-day expiration
- Secure flag in production
- SameSite strict policy
- Root path access
