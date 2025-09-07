# Authentication API

This directory contains the authentication API endpoints for the Easy Mart Clone application. The API has been refactored following security best practices and modern development patterns.

## Architecture

### Shared Utilities (`lib/auth/`)

- **`validation.ts`** - Common validation schemas and utility functions
- **`errors.ts`** - Custom error classes and error handling middleware
- **`response.ts`** - Standardized API response formats
- **`security.ts`** - Security utilities (rate limiting, headers, token validation)
- **`logger.ts`** - Structured logging for monitoring and debugging

### API Endpoints

#### 1. POST `/api/auth/register`
Register a new user with email or phone number.

**Request Body:**
```json
{
  "identifier": "user@example.com" | "+1234567890",
  "type": "email" | "phone" // optional, auto-detected if not provided
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Verification code sent to user@example.com",
  "data": {
    "verificationCode": "1234", // Remove in production
    "expiresAt": "2024-01-01T12:00:00.000Z",
    "identifier": "user@example.com",
    "type": "email",
    "userId": "user_id"
  }
}
```

#### 2. POST `/api/auth/signin`
Initiate sign-in process by sending verification code.

**Request Body:**
```json
{
  "identifier": "user@example.com" | "+1234567890",
  "type": "email" | "phone" // optional, auto-detected if not provided
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to user@example.com",
  "data": {
    "verificationCode": "1234", // Remove in production
    "expiresAt": "2024-01-01T12:00:00.000Z",
    "identifier": "user@example.com",
    "type": "email"
  }
}
```

#### 3. POST `/api/auth/validate-otp`
Validate OTP and complete authentication.

**Request Body:**
```json
{
  "identifier": "user@example.com" | "+1234567890",
  "code": "1234",
  "type": "email" | "phone" // optional, auto-detected if not provided
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP validated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "phone": "+1234567890",
      "isVerified": true,
      "verifiedAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### 4. POST `/api/auth/resend`
Resend verification code.

**Request Body:**
```json
{
  "identifier": "user@example.com" | "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "New verification code sent to user@example.com",
  "data": {
    "verificationCode": "1234", // Remove in production
    "expiresAt": "2024-01-01T12:00:00.000Z",
    "identifier": "user@example.com",
    "type": "email"
  }
}
```

#### 5. POST `/api/auth/verify`
Alternative verification endpoint (legacy support).

**Request Body:**
```json
{
  "identifier": "user@example.com" | "+1234567890",
  "code": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "phone": "+1234567890",
      "isVerified": true,
      "verifiedAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "jwt_access_token"
  }
}
```

#### 6. GET `/api/auth/me`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "phone": "+1234567890",
      "isVerified": true,
      "verifiedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

## Security Features

### Rate Limiting
- **Sign-in**: 5 attempts per 15 minutes per IP
- **OTP Validation**: 10 attempts per 15 minutes per IP
- **Resend**: 3 attempts per 5 minutes per IP
- **Registration**: 3 attempts per 15 minutes per IP

### Security Headers
All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Input Validation
- Email format validation
- Phone number validation (E.164 and local formats)
- Input sanitization to prevent XSS
- Zod schema validation for all inputs

### JWT Tokens
- Access tokens: 7 days expiry
- Refresh tokens: 30 days expiry
- Proper token validation in protected routes

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // Optional, for validation errors
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Invalid or missing authentication
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Logging

All authentication events are logged with structured data:
- Auth attempts (success/failure)
- Rate limit violations
- Validation errors
- Security events

Logs include masked identifiers for privacy protection.

## Development vs Production

### Development
- Verification codes are returned in API responses
- Detailed error logging
- Debug information included

### Production
- Remove verification codes from responses
- Implement actual email/SMS sending
- Use proper logging service (CloudWatch, etc.)
- Set secure JWT secrets
- Enable additional security measures

## Environment Variables

```env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development|production
```

## Best Practices Implemented

1. **DRY Principle** - Shared utilities eliminate code duplication
2. **Single Responsibility** - Each module has a clear purpose
3. **Error Handling** - Comprehensive error handling with proper HTTP status codes
4. **Security First** - Rate limiting, input validation, security headers
5. **Logging** - Structured logging for monitoring and debugging
6. **Type Safety** - Full TypeScript support with proper interfaces
7. **Consistent API** - Standardized request/response formats
8. **Performance** - Efficient database queries and caching considerations