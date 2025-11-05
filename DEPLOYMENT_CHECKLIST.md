# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### 1. Code & Build
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Build completes without errors: `npm run build`
- [ ] Production build runs locally: `npm start`
- [ ] All TypeScript errors resolved
- [ ] Code committed to git repository

### 2. Environment Variables
- [ ] Created `.env.production` or configured in hosting platform
- [ ] `DATABASE_URL` points to production database
- [ ] `NEXTAUTH_URL` set to production domain (e.g., `https://yourdomain.com`)
- [ ] `NEXTAUTH_SECRET` generated and set (different from dev)
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] All OAuth credentials configured
- [ ] PayPal credentials configured (sandbox or live)
- [ ] AWS credentials configured
- [ ] Double-checked no `.env` file committed to git

### 3. Database
- [ ] Production PostgreSQL database created
- [ ] Database is accessible from hosting platform
- [ ] Connection string tested
- [ ] Migrations run: `npx prisma migrate deploy`
- [ ] Prisma client generated: `npx prisma generate`
- [ ] Courses seeded or manually added
- [ ] Database backups configured

### 4. OAuth Configuration
- [ ] Google OAuth redirect URI added:
  - Production: `https://yourdomain.com/api/auth/callback/google`
- [ ] GitHub OAuth redirect URI added:
  - Production: `https://yourdomain.com/api/auth/callback/github`
- [ ] OAuth apps set to public/production mode
- [ ] Verified redirect URIs match exactly (no trailing slashes if not needed)

### 5. PayPal Configuration
- [ ] Decided on sandbox vs. live mode
- [ ] If live mode:
  - [ ] `PAYPAL_MODE="live"`
  - [ ] Live credentials configured
  - [ ] PayPal business account verified
  - [ ] Return/cancel URLs updated to production domain
- [ ] If sandbox (for testing):
  - [ ] `PAYPAL_MODE="sandbox"`
  - [ ] Sandbox credentials configured
  - [ ] Team knows to use sandbox accounts for testing

### 6. AWS S3
- [ ] Production S3 bucket created
- [ ] Bucket is in correct region
- [ ] IAM user has appropriate permissions
- [ ] Course files uploaded to S3
- [ ] File paths in database match S3 keys
- [ ] CORS configured if needed
- [ ] Tested pre-signed URL generation

### 7. Security
- [ ] Sensitive files in `.gitignore`:
  - [ ] `.env`
  - [ ] `.env.local`
  - [ ] `.env.production`
- [ ] No API keys or secrets in client-side code
- [ ] CSP headers configured (if applicable)
- [ ] Rate limiting considered for API routes

## Deployment

### Vercel (Recommended)

1. **Initial Setup**
   - [ ] Vercel CLI installed: `npm i -g vercel`
   - [ ] Logged in: `vercel login`

2. **Configure Project**
   - [ ] Run `vercel` in project directory
   - [ ] Link to existing project or create new
   - [ ] Configure build settings:
     - Build Command: `prisma generate && next build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Environment Variables**
   - [ ] Go to Vercel Dashboard → Project → Settings → Environment Variables
   - [ ] Add all variables from `.env.example`
   - [ ] Select "Production" environment for each
   - [ ] Click "Save"

4. **Database Connection**
   - [ ] If using Vercel Postgres, follow integration steps
   - [ ] If external database, ensure it's accessible from Vercel IPs
   - [ ] Test connection after first deployment

5. **Deploy**
   - [ ] Run `vercel --prod` or push to main branch
   - [ ] Wait for build to complete
   - [ ] Check deployment logs for errors

### Alternative Platforms

#### Railway
- [ ] Connect GitHub repository
- [ ] Add PostgreSQL service
- [ ] Configure environment variables
- [ ] Deploy from dashboard

#### Netlify
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy

#### Docker / VPS
- [ ] Create Dockerfile
- [ ] Build Docker image
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure environment variables
- [ ] Deploy container

## Post-Deployment

### 1. Verification
- [ ] Site loads at production URL
- [ ] Homepage displays correctly
- [ ] All images and assets load
- [ ] No console errors in production

### 2. Authentication Testing
- [ ] Sign in with Google works
- [ ] Sign in with GitHub works
- [ ] User session persists across page refreshes
- [ ] Sign out works correctly
- [ ] Protected routes redirect to sign-in

### 3. Course Testing
- [ ] Course listing page loads
- [ ] Individual course pages load
- [ ] Course details display correctly
- [ ] Locked content shows for non-purchasers

### 4. Payment Testing
- [ ] "Buy Now" button works
- [ ] Redirects to PayPal correctly
- [ ] PayPal payment completes
- [ ] Redirects back to site after payment
- [ ] Purchase is recorded in database
- [ ] User is redirected to dashboard

### 5. Download Testing
- [ ] Purchased courses appear in dashboard
- [ ] "Download Course" button appears
- [ ] Clicking download generates pre-signed URL
- [ ] Download link works and file downloads
- [ ] Download is recorded in database

### 6. Mobile Testing
- [ ] Test on mobile devices (iOS/Android)
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Payment flow works on mobile
- [ ] Touch interactions work correctly

### 7. Performance Testing
- [ ] Run Lighthouse audit (aim for >90 performance score)
- [ ] Check Core Web Vitals
- [ ] Test page load times
- [ ] Verify images are optimized
- [ ] Check bundle sizes

### 8. SEO & Social
- [ ] Meta tags display correctly
- [ ] Open Graph tags work (test with Facebook debugger)
- [ ] Twitter cards work
- [ ] Sitemap generated (if applicable)
- [ ] robots.txt configured

## Monitoring & Maintenance

### Setup Monitoring
- [ ] Configure error tracking (Sentry, LogRocket, etc.)
- [ ] Set up uptime monitoring (UptimeRobot, etc.)
- [ ] Configure analytics (Google Analytics, Plausible, etc.)
- [ ] Set up alerts for critical errors

### Regular Maintenance
- [ ] Schedule database backups
- [ ] Monitor S3 storage costs
- [ ] Review PayPal transaction logs
- [ ] Check for npm security updates: `npm audit`
- [ ] Update dependencies regularly
- [ ] Monitor application logs

### User Support
- [ ] Create FAQ page
- [ ] Set up support email
- [ ] Create user documentation
- [ ] Set up feedback collection

## Emergency Procedures

### Rollback Plan
- [ ] Know how to rollback deployment
- [ ] Keep previous working version accessible
- [ ] Document rollback steps

### Issues & Solutions

**Payment Not Working**
- Check PayPal credentials
- Verify PayPal webhook endpoints
- Check database for failed transactions
- Review server logs

**Downloads Not Working**
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure files exist in S3
- Check pre-signed URL expiration settings

**Authentication Issues**
- Verify OAuth redirect URIs
- Check NextAuth configuration
- Review session settings
- Clear cookies and test again

**Database Connection Issues**
- Check DATABASE_URL format
- Verify database is running
- Check firewall/security group settings
- Test connection from deployment platform

## Going Live Checklist

### Before Announcing
- [ ] All features tested end-to-end
- [ ] Payment processing confirmed working
- [ ] Course content uploaded and accessible
- [ ] Terms of Service page created
- [ ] Privacy Policy page created
- [ ] Contact information added
- [ ] Support system in place

### Launch Day
- [ ] Switch PayPal from sandbox to live (if ready)
- [ ] Update `PAYPAL_MODE="live"` in environment
- [ ] Verify real payment works with test purchase
- [ ] Monitor error logs closely
- [ ] Be available for quick fixes

### Marketing
- [ ] Social media announcements
- [ ] Email list notification (if applicable)
- [ ] Blog post about launch
- [ ] Submit to directories/forums

---

## Resources

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **NextAuth.js Production**: https://next-auth.js.org/deployment
- **PayPal Go Live**: https://developer.paypal.com/api/rest/production/
- **AWS S3 Security**: https://docs.aws.amazon.com/s3/index.html

---

**Good luck with your launch! 🚀**
