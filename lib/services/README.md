# Email Service Configuration

This directory contains the email service implementation using Nodemailer for sending OTP verification codes.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Easy Mart
```

## Email Provider Setup

### Gmail Setup
1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings > Security > App passwords
3. Generate an App Password for "Mail"
4. Use the generated App Password as `SMTP_PASS`

### Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Usage

The email service is automatically initialized and can be used throughout the application:

```typescript
import { emailService } from '@/lib/services/emailService';

// Send OTP email
await emailService.sendOTPEmail('user@example.com', '123456', false);

// Send resend OTP email
await emailService.sendOTPEmail('user@example.com', '123456', true);
```

## Features

- ✅ HTML and text email templates
- ✅ Responsive design
- ✅ Security warnings
- ✅ Branded styling
- ✅ Error handling and logging
- ✅ Configuration validation
- ✅ Singleton pattern for efficiency
