# Email Verification Setup Guide

This guide will help you set up email verification for your CyberAcademy application using Resend.

## 📋 Prerequisites

- Resend account (free tier available)
- A verified domain (optional, can use default for testing)

## 🚀 Step-by-Step Setup

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get Your API Key

1. Log into your Resend dashboard
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "CyberAcademy Production")
5. Copy the API key (you'll only see it once!)

### Step 3: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
FROM_EMAIL="noreply@yourdomain.com"
```

**Important Notes:**
- For testing, you can use `onboarding@resend.dev` as the FROM_EMAIL
- For production, you need to verify your domain in Resend
- Never commit your `.env` file to version control

### Step 4: Verify Your Domain (Production Only)

For production use with your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `cyberacademy.com`)
4. Add the provided DNS records to your domain registrar:
   - SPF record
   - DKIM records
   - DMARC record (optional but recommended)
5. Wait for verification (can take up to 24-48 hours)
6. Update `FROM_EMAIL` to use your domain: `noreply@cyberacademy.com`

### Step 5: Test Email Verification

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the signup page: `http://localhost:3000/auth/signup`

3. Create a new account

4. Check your email inbox for the verification email

5. Click the verification link

6. You should be redirected to the sign-in page after successful verification

## 📁 File Structure

Here's what was created for email verification:

```
├── lib/
│   ├── resend.ts              # Resend client configuration
│   ├── tokens.ts              # Token generation and verification
│   └── emails.ts              # Email templates and sending logic
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── signup/
│   │       │   └── route.ts   # Updated to send verification email
│   │       └── verify-email/
│   │           └── route.ts   # Email verification endpoint
│   └── auth/
│       └── verify-email/
│           └── page.tsx       # Verification page UI
└── prisma/
    └── schema.prisma          # VerificationToken model (already exists)
```

## 🔧 How It Works

### 1. User Signs Up
- User fills out signup form
- Password is hashed with bcrypt
- User record created in database
- Verification token generated (32-byte random hex)
- Token stored in database with 24-hour expiry
- Verification email sent to user

### 2. User Receives Email
- Beautiful HTML email with verification link
- Link format: `https://yourdomain.com/auth/verify-email?token=xxxxx`
- Token expires in 24 hours

### 3. User Clicks Link
- Verification page loads
- Token validated against database
- If valid and not expired:
  - User's `emailVerified` field updated
  - Token deleted from database
  - User redirected to sign-in page
- If invalid or expired:
  - Error message displayed
  - Options to create new account or sign in

### 4. User Can Sign In
- User can now sign in with credentials
- Email verification status can be checked if needed

## 🎨 Email Templates

Two email templates are included:

1. **Verification Email**: Sent when user signs up
2. **Welcome Email**: Can be sent after verification (optional)

Both templates are styled to match your CyberAcademy brand with:
- Dark theme matching your site
- Cyan accent colors
- Professional layout
- Mobile responsive

## 🔒 Security Features

- ✅ Tokens are cryptographically random (32 bytes)
- ✅ Tokens expire after 24 hours
- ✅ One-time use tokens (deleted after verification)
- ✅ Email must match token to verify
- ✅ Old tokens replaced when new signup with same email
- ✅ Passwords hashed with bcrypt

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify it's correctly set in `.env`
2. **Check Console**: Look for errors in terminal
3. **Verify Domain**: For production, ensure domain is verified
4. **Rate Limits**: Free tier has limits (check Resend dashboard)

### Token Expired Error

- Tokens expire after 24 hours
- User needs to sign up again to get a new token
- Consider adding a "Resend Verification Email" feature

### Email Goes to Spam

- Verify your domain (production)
- Set up SPF, DKIM, and DMARC records
- Use a professional FROM_EMAIL address
- Warm up your sending reputation gradually

## 📊 Monitoring

Monitor email delivery in your Resend dashboard:
- Delivery rates
- Bounce rates
- Click rates
- Failed sends

## 🚀 Production Checklist

Before going live:

- [ ] Verify your domain in Resend
- [ ] Add all DNS records (SPF, DKIM, DMARC)
- [ ] Update `FROM_EMAIL` to use your domain
- [ ] Test verification flow end-to-end
- [ ] Set up error logging/monitoring
- [ ] Configure email rate limiting if needed
- [ ] Update email templates with real support contact

## 💡 Future Enhancements

Consider adding:

1. **Resend Verification Email** button
2. **Password Reset** via email
3. **Email Change** verification
4. **Welcome Series** emails
5. **Notification Preferences** for users
6. **Email Analytics** dashboard

## 📞 Support

- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: support@resend.com
- **Community**: Discord and GitHub discussions

## 🔑 Free Tier Limits (Resend)

- 100 emails/day
- 1 verified domain
- All features included

Upgrade for:
- More emails
- Multiple domains
- Priority support
- Advanced analytics
