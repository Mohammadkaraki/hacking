import { resend } from './resend';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your CyberAcademy account',
      html: getVerificationEmailTemplate(verificationUrl),
    });

    console.log('📧 Resend API Response:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    return { success: false, error };
  }
}

/**
 * Email template for verification
 */
function getVerificationEmailTemplate(verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0e27;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e27; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1f3a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 255, 159, 0.2);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #00ff9f 0%, #00b8ff 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #0a0e27; font-size: 32px; font-weight: bold;">
                      🛡️ CyberAcademy
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #00ff9f; margin: 0 0 20px 0; font-size: 24px;">
                      Verify Your Email Address
                    </h2>

                    <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Thank you for signing up for CyberAcademy! To complete your registration and start learning, please verify your email address by clicking the button below.
                    </p>

                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #00ff9f 0%, #00b8ff 100%); color: #0a0e27; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0, 255, 159, 0.3);">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="color: #00b8ff; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
                      ${verificationUrl}
                    </p>

                    <div style="border-top: 1px solid #2d3748; margin: 30px 0; padding-top: 30px;">
                      <p style="color: #718096; font-size: 12px; line-height: 1.6; margin: 0;">
                        <strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with CyberAcademy, you can safely ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f1628; padding: 30px; text-align: center;">
                    <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                      © ${new Date().getFullYear()} CyberAcademy. All rights reserved.
                    </p>
                    <p style="color: #4a5568; font-size: 12px; margin: 0;">
                      Master cybersecurity skills with expert-led courses
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to CyberAcademy! 🎉',
      html: getWelcomeEmailTemplate(name),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send account credentials after purchase (for guest checkout)
 */
export async function sendAccountCredentialsEmail(
  email: string,
  name: string,
  password: string,
  courseName: string,
  downloadUrl: string
) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your CyberAcademy Account & ${courseName} Course`,
      html: getAccountCredentialsTemplate(name, email, password, courseName, downloadUrl),
    });

    console.log('📧 Account credentials email sent:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Failed to send credentials email:', error);
    return { success: false, error };
  }
}

/**
 * Account credentials email template
 */
function getAccountCredentialsTemplate(
  name: string,
  email: string,
  password: string,
  courseName: string,
  downloadUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Course & Account Details</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0e27;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e27; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1f3a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 255, 159, 0.2);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #00ff9f 0%, #00b8ff 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #0a0e27; font-size: 32px; font-weight: bold;">
                      🎉 Purchase Successful!
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #00ff9f; margin: 0 0 20px 0; font-size: 24px;">
                      Welcome ${name}! 👋
                    </h2>

                    <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Thank you for purchasing <strong style="color: #00ff9f;">${courseName}</strong>! Your payment was successful.
                    </p>

                    <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      We've created an account for you so you can access your course anytime. Here are your login credentials:
                    </p>

                    <!-- Credentials Box -->
                    <div style="background-color: #0f1628; border: 2px solid #00ff9f; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                      <p style="color: #00ff9f; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">
                        📧 YOUR ACCOUNT DETAILS
                      </p>
                      <p style="color: #a0aec0; font-size: 14px; margin: 0 0 10px 0;">
                        <strong style="color: #00b8ff;">Email:</strong> ${email}
                      </p>
                      <p style="color: #a0aec0; font-size: 14px; margin: 0 0 10px 0;">
                        <strong style="color: #00b8ff;">Password:</strong> <span style="background-color: #1a1f3a; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</span>
                      </p>
                      <p style="color: #718096; font-size: 12px; margin: 10px 0 0 0;">
                        💡 You can change your password after logging in
                      </p>
                    </div>

                    <!-- Download Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #00ff9f 0%, #00b8ff 100%); color: #0a0e27; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0, 255, 159, 0.3);">
                            📥 Download Course Now
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Login Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 20px 0;">
                          <a href="${APP_URL}/auth/signin" style="display: inline-block; background-color: transparent; border: 2px solid #00b8ff; color: #00b8ff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            🔐 Login to Your Account
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="border-top: 1px solid #2d3748; margin: 30px 0; padding-top: 30px;">
                      <p style="color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                        <strong>What's next?</strong>
                      </p>
                      <ul style="color: #a0aec0; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                        <li>Download your course materials</li>
                        <li>Login anytime to re-download</li>
                        <li>Explore more courses</li>
                        <li>Update your profile and password</li>
                      </ul>
                    </div>

                    <div style="background-color: #0f1628; border-left: 4px solid #00b8ff; padding: 15px; margin: 20px 0 0 0; border-radius: 4px;">
                      <p style="color: #718096; font-size: 12px; line-height: 1.6; margin: 0;">
                        <strong style="color: #00b8ff;">⚡ Important:</strong> Save this email! It contains your login credentials. You can always reset your password if needed.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f1628; padding: 30px; text-align: center;">
                    <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                      © ${new Date().getFullYear()} CyberAcademy. All rights reserved.
                    </p>
                    <p style="color: #4a5568; font-size: 12px; margin: 0;">
                      Need help? Contact us at support@cyberacademy.com
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Welcome email template
 */
function getWelcomeEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to CyberAcademy</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0e27;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e27; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1f3a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 255, 159, 0.2);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #00ff9f 0%, #00b8ff 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #0a0e27; font-size: 32px; font-weight: bold;">
                      🛡️ Welcome to CyberAcademy!
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #00ff9f; margin: 0 0 20px 0; font-size: 24px;">
                      Hi ${name}! 👋
                    </h2>

                    <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Your email has been verified successfully! Welcome to the CyberAcademy community.
                    </p>

                    <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      You now have access to our comprehensive cybersecurity courses. Start learning today and advance your career in cybersecurity!
                    </p>

                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${APP_URL}/courses" style="display: inline-block; background: linear-gradient(135deg, #00ff9f 0%, #00b8ff 100%); color: #0a0e27; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0, 255, 159, 0.3);">
                            Browse Courses
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="border-top: 1px solid #2d3748; margin: 30px 0; padding-top: 30px;">
                      <p style="color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                        <strong>What's next?</strong>
                      </p>
                      <ul style="color: #a0aec0; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                        <li>Explore our course catalog</li>
                        <li>Complete your profile</li>
                        <li>Join our community</li>
                        <li>Start your first course</li>
                      </ul>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f1628; padding: 30px; text-align: center;">
                    <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                      © ${new Date().getFullYear()} CyberAcademy. All rights reserved.
                    </p>
                    <p style="color: #4a5568; font-size: 12px; margin: 0;">
                      Need help? Contact us at support@cyberacademy.com
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
