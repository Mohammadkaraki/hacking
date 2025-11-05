# CyberAcademy - Complete Setup Guide

This guide will walk you through setting up your cybersecurity courses e-commerce platform with payment processing, authentication, and secure file downloads.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [OAuth Provider Setup](#oauth-provider-setup)
6. [PayPal Integration](#paypal-integration)
7. [AWS S3 Configuration](#aws-s3-configuration)
8. [Running the Application](#running-the-application)
9. [Database Seeding](#database-seeding)
10. [Deployment](#deployment)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Git**

You'll also need accounts for:
- **Google Cloud Console** (for Google OAuth)
- **GitHub** (for GitHub OAuth)
- **PayPal Developer** (for payment processing)
- **AWS** (for S3 file storage)

---

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd C:\Users\zfkas\Desktop\mohammad\NextJs\hacking
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Database Setup

### 1. Create PostgreSQL Database

Connect to PostgreSQL and create a new database:

```sql
CREATE DATABASE cyberacademy;
```

### 2. Configure Database Connection

Copy the example environment file:

```bash
copy .env.example .env
```

Update the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/cyberacademy?schema=public"
```

Replace `username` and `password` with your PostgreSQL credentials.

### 3. Run Migrations

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## Environment Configuration

Edit your `.env` file with all required configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cyberacademy?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# OAuth Providers (configured in next steps)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# PayPal (configured in next steps)
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
PAYPAL_MODE="sandbox"  # Use "live" for production

# AWS S3 (configured in next steps)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET_NAME=""

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DOWNLOAD_LINK_EXPIRY_HOURS="24"
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it into your `.env` file.

---

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Choose **Web application** as application type
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy **Client ID** and **Client Secret** to your `.env` file

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: CyberAcademy
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Generate a new client secret
6. Copy **Client ID** and **Client Secret** to your `.env` file

---

## PayPal Integration

### 1. Create PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in or create an account
3. Navigate to **Dashboard** > **Apps & Credentials**

### 2. Create REST API App

1. Click **Create App**
2. Choose **Merchant** as app type
3. Give your app a name (e.g., "CyberAcademy")
4. Click **Create App**

### 3. Get Credentials

1. In your app dashboard, you'll see:
   - **Client ID** (copy to `PAYPAL_CLIENT_ID`)
   - **Secret** (copy to `PAYPAL_CLIENT_SECRET`)
2. Use **Sandbox** credentials for testing
3. For production, switch to **Live** and update credentials

### 4. Configure Sandbox (Testing)

1. Go to **Sandbox** > **Accounts**
2. Create test buyer and seller accounts
3. Use these accounts to test payments

---

## AWS S3 Configuration

### 1. Create AWS Account

Sign up at [aws.amazon.com](https://aws.amazon.com/) if you don't have an account.

### 2. Create S3 Bucket

1. Go to [S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. Choose a unique bucket name (e.g., `cyberacademy-courses`)
4. Select your preferred region
5. **Block Public Access**: Keep all options checked (we'll use pre-signed URLs)
6. Click **Create bucket**

### 3. Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Navigate to **Users** > **Add users**
3. User name: `cyberacademy-s3-user`
4. Select **Access key - Programmatic access**
5. Click **Next: Permissions**

### 4. Set Permissions

1. Click **Attach existing policies directly**
2. Search and select **AmazonS3FullAccess** (or create custom policy for specific bucket)
3. Click **Next** through remaining steps
4. Click **Create user**

### 5. Save Credentials

1. Download the CSV or copy:
   - **Access Key ID** → `AWS_ACCESS_KEY_ID`
   - **Secret Access Key** → `AWS_SECRET_ACCESS_KEY`
2. Update your `.env` file

### 6. Configure CORS (Optional)

If you need browser uploads, add CORS policy to your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

---

## Running the Application

### 1. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 2. Test Authentication

1. Navigate to `http://localhost:3000`
2. Click **Login**
3. Try signing in with Google or GitHub

### 3. Test Payment Flow

To fully test payments, you need to:
1. Add courses to the database (see Database Seeding below)
2. Sign in
3. Navigate to a course detail page
4. Click **Buy Now**
5. Complete payment using PayPal sandbox account

---

## Database Seeding

### Option 1: Using Prisma Studio (Manual)

1. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navigate to the **Course** model
3. Click **Add record** and fill in course details:
   - Title, description, thumbnail URL
   - Price, duration, lessons, etc.
   - **Important**: Add `s3FileKey` with the S3 object key for downloadable file

### Option 2: Create a Seed Script

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Complete Ethical Hacking Bootcamp',
      description: 'Learn penetration testing from scratch',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
      difficulty: 'Beginner',
      duration: '40 hours',
      lessons: 280,
      price: 49.99,
      originalPrice: 199.99,
      category: 'Ethical Hacking',
      instructor: 'Alex Morgan',
      rating: 4.8,
      featured: true,
      active: true,
      prerequisites: ['Basic computer knowledge'],
      whatYouLearn: [
        'Penetration testing fundamentals',
        'Network security',
        'Web application hacking',
        'Wireless security'
      ],
      s3BucketName: process.env.AWS_S3_BUCKET_NAME,
      s3FileKey: 'courses/ethical-hacking-complete.zip',
      fileSize: 1024000000,
      fileType: 'zip',
    },
  });

  console.log('Seeded course:', course1.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:

```bash
npx ts-node prisma/seed.ts
```

### Upload Course Files to S3

Use AWS CLI or S3 console to upload your course files:

```bash
aws s3 cp course-file.zip s3://your-bucket-name/courses/ethical-hacking-complete.zip
```

---

## Deployment

### Deploy to Vercel (Recommended for Next.js)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Configure Environment Variables**:
   - Go to your project in Vercel Dashboard
   - Navigate to **Settings** > **Environment Variables**
   - Add all variables from your `.env` file
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain

5. **Update OAuth Redirect URIs**:
   - Add production URLs to Google and GitHub OAuth settings
   - Example: `https://yourdomain.com/api/auth/callback/google`

6. **PayPal Production**:
   - Switch `PAYPAL_MODE` to `"live"`
   - Update to production PayPal credentials

### Database (Production)

Options:
- **Vercel Postgres**: Integrated with Vercel
- **Railway**: Easy PostgreSQL hosting
- **Supabase**: PostgreSQL + additional features
- **AWS RDS**: Scalable managed PostgreSQL

Update `DATABASE_URL` with production database connection string.

---

## Key Features Implemented

✅ **Authentication**
- OAuth with Google & GitHub
- Protected routes
- Session management

✅ **Course Management**
- Course listing and detail pages
- Locked content for non-paying users
- Course categories and filtering

✅ **Payment Processing**
- PayPal integration
- Order creation and capture
- Purchase tracking

✅ **File Downloads**
- Secure AWS S3 integration
- Time-limited pre-signed URLs (24h expiry)
- Download tracking

✅ **User Dashboard**
- View purchased courses
- Generate download links
- Purchase history

✅ **Security**
- Protected API routes
- User authentication verification
- Secure file access

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db push
```

### OAuth Not Working

- Check redirect URIs match exactly
- Ensure OAuth apps are not in development mode with restrictions

### PayPal Sandbox Issues

- Use sandbox test accounts from PayPal Developer Dashboard
- Check PayPal credentials are for sandbox, not live

### S3 Download Issues

- Verify IAM user has S3 permissions
- Check bucket name and region are correct
- Ensure `s3FileKey` in database matches actual S3 object key

---

## Support & Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **PayPal API**: https://developer.paypal.com/api/rest/
- **AWS S3 Docs**: https://docs.aws.amazon.com/s3/

---

## Next Steps

1. **Customize UI**: Update branding, colors, and content
2. **Add Admin Panel**: Create interface for managing courses
3. **Email Notifications**: Integrate email service for purchase confirmations
4. **Analytics**: Add tracking for purchases and user behavior
5. **Reviews System**: Allow students to leave course reviews
6. **Referral Program**: Add affiliate/referral system
7. **Coupons**: Implement discount codes

---

**Congratulations!** 🎉 Your cybersecurity courses platform is now ready!
