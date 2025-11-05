# Quick Start Guide - CyberAcademy Platform

Get your cybersecurity courses platform up and running in minutes!

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example environment file
copy .env.example .env

# Edit .env and add your credentials
# Minimum required for testing:
# - DATABASE_URL
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL=http://localhost:3000
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample courses (optional)
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## ⚙️ Configuration Checklist

### Required for Basic Functionality
- [ ] PostgreSQL database created
- [ ] `DATABASE_URL` configured in `.env`
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] Database migrated (`npm run db:migrate`)

### Required for Authentication
- [ ] Google OAuth credentials (Google Cloud Console)
- [ ] GitHub OAuth credentials (GitHub Developer Settings)
- [ ] OAuth redirect URIs configured

### Required for Payments
- [ ] PayPal Developer account created
- [ ] PayPal Sandbox App created
- [ ] `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` configured
- [ ] PayPal mode set to "sandbox"

### Required for Downloads
- [ ] AWS account created
- [ ] S3 bucket created
- [ ] IAM user with S3 access created
- [ ] AWS credentials configured in `.env`
- [ ] Course files uploaded to S3

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample courses
npm run db:studio        # Open Prisma Studio GUI

# Code Quality
npm run lint             # Run linter
```

---

## 🧪 Testing the Platform

### Test Authentication
1. Go to `/auth/signin`
2. Click "Continue with Google" or "Continue with GitHub"
3. Complete OAuth flow
4. You should be redirected back with user info in navbar

### Test Course Viewing
1. Ensure database has courses (run `npm run db:seed`)
2. Click on a course card on homepage
3. View course details at `/courses/[id]`
4. Notice course content is locked (showing lock icon)

### Test Payment Flow (Sandbox)
1. Sign in with OAuth
2. Navigate to a course detail page
3. Click "Buy Now"
4. Complete payment using PayPal sandbox account:
   - Email: Use sandbox buyer account from PayPal Developer Dashboard
   - Password: From sandbox account details
5. After successful payment, you'll be redirected to dashboard

### Test Download
1. Go to `/dashboard` after purchasing a course
2. Click "Download Course" button
3. Pre-signed URL is generated (valid for 24 hours)
4. File download should start in new tab

---

## 🔑 Getting Test Credentials

### PayPal Sandbox Accounts

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Navigate to **Sandbox** > **Accounts**
3. Default test accounts are provided:
   - **Buyer Account**: For testing purchases
   - **Seller Account**: Receives test payments
4. Click "View/Edit" to see login credentials

### Google OAuth (Development)

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. OAuth 2.0 Client ID → Web Application
4. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth (Development)

1. [GitHub Settings](https://github.com/settings/developers)
2. New OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

---

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── courses/      # Course API
│   │   ├── payments/     # PayPal integration
│   │   ├── purchases/    # Purchase management
│   │   └── downloads/    # Download generation
│   ├── auth/            # Auth pages (signin)
│   ├── courses/         # Course pages
│   ├── dashboard/       # User dashboard
│   └── providers.tsx    # SessionProvider wrapper
├── components/
│   ├── sections/        # Page sections
│   ├── ui/              # Reusable components
│   └── effects/         # Visual effects
├── lib/
│   ├── prisma.ts        # Database client
│   ├── auth.ts          # NextAuth config
│   ├── paypal.ts        # PayPal SDK
│   └── s3.ts            # AWS S3 utilities
├── prisma/
│   └── schema.prisma    # Database schema
├── types/
│   └── index.ts         # TypeScript types
└── middleware.ts        # Route protection
```

---

## 🔧 Troubleshooting

### "Module not found" errors
```bash
npm run db:generate
```

### Database connection fails
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Test connection: `npx prisma db push`

### OAuth redirect errors
- Ensure redirect URIs match exactly in OAuth provider settings
- Check `NEXTAUTH_URL` in `.env` matches current URL

### PayPal payment fails
- Verify using **sandbox** credentials, not live
- Check PayPal mode is set to "sandbox" in `.env`
- Use PayPal sandbox test account credentials

### S3 download doesn't work
- Verify IAM user has S3 permissions
- Check bucket name in `.env` matches actual bucket
- Ensure course has `s3FileKey` set in database
- Verify file exists in S3 at specified key

---

## 📚 Next Steps

1. **Customize Branding**: Update colors, logo, and content
2. **Add More Courses**: Use Prisma Studio or seed script
3. **Upload Course Files**: Add actual course materials to S3
4. **Configure Production OAuth**: Add production URLs
5. **Switch to Live PayPal**: When ready for real payments
6. **Deploy**: Push to Vercel or your hosting provider

---

## 🆘 Need Help?

- **Full Setup Guide**: See `SETUP_GUIDE.md` for detailed instructions
- **Prisma Issues**: https://www.prisma.io/docs
- **NextAuth Issues**: https://next-auth.js.org/
- **PayPal API**: https://developer.paypal.com/docs/
- **AWS S3**: https://docs.aws.amazon.com/s3/

---

## ✅ You're Ready!

Your platform includes:
- ✅ User authentication (OAuth)
- ✅ Course browsing and details
- ✅ PayPal payment processing
- ✅ Secure file downloads (S3)
- ✅ User dashboard
- ✅ Purchase tracking
- ✅ Protected routes

Happy hacking! 🛡️💻
