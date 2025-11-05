/**
 * Test script to verify Resend email functionality
 * Run with: npx tsx scripts/test-email.ts
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing Resend Email Configuration...\n');

  console.log('Environment Variables:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not Set');
  console.log('- FROM_EMAIL:', process.env.FROM_EMAIL || 'onboarding@resend.dev');
  console.log('- APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  console.log('\n');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY is not set in .env file');
    process.exit(1);
  }

  // Prompt for test email
  const testEmail = 'delivered@resend.dev'; // Resend test email

  console.log(`📧 Sending test email to: ${testEmail}\n`);

  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: testEmail,
      subject: 'Test Email from CyberAcademy',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px;">
              <h1 style="color: #00ff9f;">✅ Email Test Successful!</h1>
              <p style="color: #333; font-size: 16px;">
                If you're seeing this email, your Resend configuration is working correctly!
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                API Key: ${process.env.RESEND_API_KEY?.substring(0, 10)}...
                <br/>
                From: ${process.env.FROM_EMAIL || 'onboarding@resend.dev'}
                <br/>
                Date: ${new Date().toISOString()}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('\nResponse:', JSON.stringify(result, null, 2));
    console.log('\n📬 Check your email inbox (and spam folder)');
  } catch (error: any) {
    console.error('❌ Failed to send email\n');
    console.error('Error details:', error);

    if (error.message?.includes('API key')) {
      console.error('\n💡 Tip: Check if your RESEND_API_KEY is valid');
      console.error('   Get your API key from: https://resend.com/api-keys');
    }

    if (error.message?.includes('domain')) {
      console.error('\n💡 Tip: You need to verify your domain in Resend');
      console.error('   Or use the default: onboarding@resend.dev for testing');
    }
  }
}

testEmail();
