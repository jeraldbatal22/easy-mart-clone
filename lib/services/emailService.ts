import nodemailer from 'nodemailer';
import { logger } from '@/lib/auth/logger';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const emailConfig: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      };

      // Check if email configuration is complete
      if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        logger.warn('Email service not configured - missing SMTP credentials');
        return;
      }

      this.transporter = nodemailer.createTransport(emailConfig);
      this.isConfigured = true;
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service:', error as Record<string, any>);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      logger.warn('Email service not configured - email not sent');
      return false;
    }

    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Easy Mart'}" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}:`, result.messageId);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error as Record<string, any>);
      return false;
    }
  }

  async sendOTPEmail(email: string, otp: string, isResend: boolean = false): Promise<boolean> {
    const subject = isResend 
      ? 'Your New Verification Code - Easy Mart' 
      : 'Your Verification Code - Easy Mart';

    const html = this.generateOTPEmailTemplate(otp, isResend);
    const text = this.generateOTPEmailText(otp, isResend);

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  private generateOTPEmailTemplate(otp: string, isResend: boolean): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code - Easy Mart</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .otp-container {
            background-color: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
          }
          .otp-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
          }
          .message {
            font-size: 16px;
            color: #374151;
            margin-bottom: 20px;
            text-align: center;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🛒 Easy Mart</div>
            <h1 class="title">${isResend ? 'New Verification Code' : 'Verify Your Account'}</h1>
          </div>
          
          <div class="message">
            ${isResend 
              ? 'You requested a new verification code. Use the code below to verify your account:'
              : 'Welcome to Easy Mart! Please use the verification code below to complete your account verification:'
            }
          </div>
          
          <div class="otp-container">
            <div class="otp-label">Your verification code:</div>
            <div class="otp-code">${otp}</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This code will expire in 10 minutes. Do not share this code with anyone. Easy Mart will never ask for your verification code.
          </div>
          
          <div class="message">
            If you didn't request this ${isResend ? 'new ' : ''}verification code, please ignore this email or contact our support team.
          </div>
          
          <div class="footer">
            <p>This email was sent by Easy Mart</p>
            <p>© 2024 Easy Mart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateOTPEmailText(otp: string, isResend: boolean): string {
    return `
${isResend ? 'New Verification Code' : 'Verify Your Account'} - Easy Mart

${isResend 
  ? 'You requested a new verification code. Use the code below to verify your account:'
  : 'Welcome to Easy Mart! Please use the verification code below to complete your account verification:'
}

Your verification code: ${otp}

This code will expire in 10 minutes. Do not share this code with anyone.

If you didn't request this ${isResend ? 'new ' : ''}verification code, please ignore this email or contact our support team.

---
Easy Mart
© 2024 Easy Mart. All rights reserved.
    `.trim();
  }

  isEmailConfigured(): boolean {
    return this.isConfigured;
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
