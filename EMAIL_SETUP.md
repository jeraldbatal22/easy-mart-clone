# Email Service Setup

The signup email functionality requires SMTP configuration. Add the following environment variables to your `.env.local` file:

## Required Environment Variables

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Easy Mart
```

## Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Alternative SMTP Providers

You can use any SMTP provider by updating the environment variables:

- **SendGrid**: Use their SMTP settings
- **AWS SES**: Use their SMTP credentials
- **Mailgun**: Use their SMTP settings
- **Custom SMTP**: Use your own SMTP server settings

## Development Mode

In development mode, if email sending fails, the verification code will be returned in the API response for testing purposes.

## Testing the Signup Flow

1. Start the development server: `npm run dev`
2. Navigate to `/signup`
3. Enter a valid email address
4. Click "Continue"
5. Check your email for the verification code
6. Enter the code on the OTP page to complete registration

## Troubleshooting

- If emails are not being sent, check the console logs for SMTP errors
- Ensure all environment variables are properly set
- Verify your SMTP credentials are correct
- Check if your email provider requires specific security settings
