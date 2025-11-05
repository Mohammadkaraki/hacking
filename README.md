# CyberAcademy - Cybersecurity Courses E-Commerce Platform

A complete, production-ready cybersecurity courses platform with payment processing, secure file downloads, and user authentication. Built with Next.js 14 and featuring a stunning cyberpunk design.

## 🚀 Features

### Core E-Commerce Features
- **💳 Payment Processing**: Integrated PayPal checkout with order tracking
- **🔐 OAuth Authentication**: Sign in with Google or GitHub
- **📥 Secure Downloads**: AWS S3 integration with time-limited pre-signed URLs
- **👤 User Dashboard**: View purchased courses and download materials
- **🛡️ Protected Routes**: Middleware-based authentication and authorization
- **📊 Purchase Tracking**: Complete order history and status tracking

### Design & UX
- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Stunning Animations**: Framer Motion + GSAP for smooth, professional animations
- **Cyberpunk Design**: Dark theme with neon accents and matrix effects
- **Fully Responsive**: Mobile-first design that works on all devices
- **Performance Optimized**: Fast load times with optimized images and lazy loading

## 📋 Pages & Features

### Public Pages
1. **Homepage** - Hero section, featured courses, testimonials, learning path
2. **Course Detail** - Full course information with locked content preview
3. **Sign In** - OAuth authentication with Google and GitHub

### Authenticated Pages
4. **User Dashboard** - Purchased courses, download links, statistics
5. **Course Download** - Secure S3 pre-signed URL generation

### API Routes
- `/api/auth/*` - NextAuth.js authentication endpoints
- `/api/courses/*` - Course listing and details
- `/api/payments/*` - PayPal order creation and capture
- `/api/purchases/*` - Purchase verification and history
- `/api/downloads/*` - Secure download link generation

## 🚀 Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for a 5-minute setup guide.

### Minimum Setup

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment**:
   \`\`\`bash
   copy .env.example .env
   # Edit .env with your credentials
   \`\`\`

3. **Setup database**:
   \`\`\`bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed  # Optional: adds sample courses
   \`\`\`

4. **Run development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

Visit `http://localhost:3000` 🎉

### Full Setup

For complete configuration including OAuth, PayPal, and AWS S3, see **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**.

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/                # API routes (auth, payments, downloads)
│   ├── auth/               # Authentication pages
│   ├── courses/            # Course detail pages
│   ├── dashboard/          # User dashboard
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── providers.tsx       # Session provider
├── components/
│   ├── effects/            # Visual effects (Matrix, Particles, etc.)
│   ├── sections/           # Page sections (Hero, Navbar, Footer, etc.)
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── prisma.ts           # Database client
│   ├── auth.ts             # NextAuth configuration
│   ├── paypal.ts           # PayPal SDK
│   └── s3.ts               # AWS S3 utilities
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/
│   └── seed.ts             # Database seeding
├── types/                  # TypeScript type definitions
├── data/                   # Static data (homepage content)
└── public/                 # Static assets
\`\`\`

## 🔧 Configuration

### Environment Variables

Required environment variables:

\`\`\`env
DATABASE_URL              # PostgreSQL connection
NEXTAUTH_SECRET           # Auth secret key
GOOGLE_CLIENT_ID          # Google OAuth
GITHUB_CLIENT_ID          # GitHub OAuth
PAYPAL_CLIENT_ID          # PayPal payments
AWS_ACCESS_KEY_ID         # AWS S3 storage
AWS_S3_BUCKET_NAME        # S3 bucket name
\`\`\`

See `.env.example` for complete list.

### Database Commands

\`\`\`bash
npm run db:generate       # Generate Prisma client
npm run db:migrate        # Run migrations
npm run db:seed           # Seed sample courses
npm run db:studio         # Open Prisma Studio
\`\`\`

### Customization

- **Colors**: Edit `tailwind.config.ts`
- **Courses**: Add via Prisma Studio or seed script
- **Branding**: Update components in `components/sections/`

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (OAuth)
- **Payments**: PayPal SDK
- **Storage**: AWS S3
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion + GSAP
- **Deployment**: Vercel (recommended)

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

## 🔐 Security Features

- OAuth-only authentication (no password storage)
- Protected API routes with middleware
- Pre-signed S3 URLs with expiration
- Server-side payment verification
- Purchase ownership validation
- Download tracking and audit logs

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
vercel
\`\`\`

Update environment variables in Vercel dashboard and configure production OAuth redirect URIs.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For setup help, refer to the documentation files or create an issue.

---

**Built with ❤️ for cybersecurity education** 🛡️💻
# hacking
