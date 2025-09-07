/**
 * Test utility for email service
 * This file can be used to test email functionality during development
 */

import { emailService } from './emailService';

export async function testEmailService() {
  console.log('Testing email service...');
  
  // Check if email is configured
  if (!emailService.isEmailConfigured()) {
    console.error('❌ Email service is not configured. Please check your environment variables.');
    return false;
  }

  console.log('✅ Email service is configured');

  // Test sending an OTP email
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const testOTP = '123456';

  try {
    console.log(`📧 Sending test OTP email to ${testEmail}...`);
    const result = await emailService.sendOTPEmail(testEmail, testOTP, false);
    
    if (result) {
      console.log('✅ Test OTP email sent successfully');
      return true;
    } else {
      console.error('❌ Failed to send test OTP email');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending test OTP email:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmailService()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}
