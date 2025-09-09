# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

## Required Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/easy-mart-clone

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Easy Mart

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Optional Variables

```env
# Rate Limiting (for Redis in production)
REDIS_URL=redis://localhost:6379
```

## Security Notes

1. **Never commit `.env.local` to version control**
2. **Use strong, unique values for JWT_SECRET**
3. **Use app passwords for Gmail SMTP (not your regular password)**
4. **Keep Cloudinary credentials secure**

## Setup Instructions

1. Copy this template to `.env.local`
2. Fill in your actual values
3. Restart your development server
4. Test the application functionality
