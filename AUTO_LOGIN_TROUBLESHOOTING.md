# Auto-Login Troubleshooting Guide

## Issue: Users Being Redirected to Sign-In After Payment

### What Was Fixed

1. **Auto-login token now generated for ALL guest checkouts** (not just new users)
2. **Added retry logic** to wait for webhook processing (up to 5 retries, 2 seconds each)
3. **Better error handling** in success page
4. **Improved logging** throughout the flow

## How the Flow Works

```
User Buys Course (Guest)
    ↓
Stripe Checkout
    ↓
Payment Success
    ↓
Stripe Webhook Fires → Creates/Updates User → Generates Auto-Login Token
    ↓
Success Page → Waits for Webhook → Gets Token → Auto-Login → Dashboard
```

## Common Issues & Solutions

### Issue 1: Webhook Not Being Called

**Symptom:** User redirected to sign-in, no account created

**Cause:** Stripe webhook not configured or not firing

**Solution:**

#### For Development (Stripe CLI):
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/payments/webhook
```

#### For Production:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Issue 2: Webhook Processes Too Slowly

**Symptom:** User sees "Confirming your purchase..." for a long time

**Current Fix:** Success page retries up to 5 times (10 seconds total)

**Check Logs:**
```
Console should show:
🔔 Webhook received: checkout.session.completed
💳 Processing checkout.session.completed
🔄 Processing guest checkout for: user@email.com
✅ Created new user account: cuid123...
✅ Generated auto-login token for: user@email.com
✅ Payment completed for user cuid123, course cuid456
```

### Issue 3: Auto-Login Token Not Found

**Symptom:** User redirected to sign-in after payment

**Possible Causes:**
1. Webhook hasn't processed yet (wait 10 seconds and refresh)
2. Token expired (24 hour validity)
3. Database issue

**Check Database:**
```sql
-- Check if auto-login token exists
SELECT * FROM "VerificationToken"
WHERE identifier LIKE 'autologin:%'
ORDER BY expires DESC;
```

**Manual Fix:**
User can login with email + password sent in email

### Issue 4: Email Not Received

**Symptom:** New user doesn't receive credentials email

**Check:**
1. Email sent only to **NEW users** (not existing accounts)
2. Check spam folder
3. Verify Resend API key in `.env`
4. Check server logs for email errors

**Server Logs Should Show:**
```
✅ Sent credentials email to: user@email.com
```

### Issue 5: Download Link Not Found

**Symptom:** User logged in but can't find download

**Solution:** Dashboard shows all purchased courses with download buttons

**Location:** `/dashboard` page

**Features:**
- Lists all purchased courses
- "Download Course" button for each
- Generates temporary S3 download link (24 hours)
- Link opens in new tab

## Testing the Complete Flow

### Prerequisites:
```bash
# Make sure these are set in .env
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
FROM_EMAIL=your-email@domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Test Steps:

#### 1. Start Stripe Webhook Listener (Development):
```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

#### 2. Start Dev Server:
```bash
npm run dev
```

#### 3. Test Guest Checkout:
1. **Open browser in incognito mode** (to ensure logged out)
2. Go to: `http://localhost:3000/courses`
3. Click any course
4. Click "Enroll Now"
5. **Should go directly to Stripe** (NOT sign-in page!)
6. Use test card: `4242 4242 4242 4242`
7. Enter test email: `test@example.com`
8. Complete payment

#### 4. Verify Success Flow:
1. Redirected to `/payment/success?session_id=...`
2. Should see: "Processing your purchase..."
3. Then: "Confirming your purchase..." (if waiting for webhook)
4. Then: "Logging you in..."
5. Finally: "Purchase successful! Redirecting to your dashboard..."
6. Lands on `/dashboard` **LOGGED IN**

#### 5. Verify Email:
1. Check email at `test@example.com`
2. Should receive email with:
   - Account credentials
   - Password
   - Download link
   - Login link

#### 6. Verify Dashboard:
1. Should see purchased course
2. Click "Download Course" button
3. Download should start

## Debugging Console Messages

### Success Path:
```javascript
// Browser Console (Success Page):
"Waiting for webhook... retry 1/5" // If webhook slow
"Waiting for webhook... retry 2/5"
// ... then success

// Server Console (Webhook):
"🔔 Webhook received: checkout.session.completed"
"💳 Processing checkout.session.completed"
"🔄 Processing guest checkout for: test@example.com"
"✅ Created new user account: cluXXXXXX"
"✅ Generated auto-login token for: test@example.com"
"✅ Payment completed for user cluXXXXXX, course cluYYYYYY"
"✅ Sent credentials email to: test@example.com"
```

### Failure Paths:

**No Auto-Login Token:**
```javascript
// Browser Console:
"Waiting for webhook... retry 1/5"
"Waiting for webhook... retry 2/5"
"Waiting for webhook... retry 3/5"
"Waiting for webhook... retry 4/5"
"Waiting for webhook... retry 5/5"
"Purchase successful! Please check your email for login credentials."
// Redirects to /auth/signin
```

**Auto-Login Failed:**
```javascript
// Browser Console:
"Auto-login failed: CredentialsSignin"
"Purchase successful! Please check your email for login credentials."
// Redirects to /auth/signin
```

## Manual Recovery Steps

If auto-login fails but payment succeeded:

### For User:
1. Check email for credentials
2. Go to `/auth/signin`
3. Login with email + password from email
4. Go to `/dashboard`
5. Download course

### For Admin:
```sql
-- Find the purchase
SELECT * FROM "Purchase"
WHERE "stripeSessionId" = 'cs_test_XXX';

-- Check if user was created
SELECT * FROM "User"
WHERE email = 'user@email.com';

-- Check auto-login token
SELECT * FROM "VerificationToken"
WHERE identifier = 'autologin:user@email.com'
AND expires > NOW();
```

## Key Files Modified

1. `app/api/payments/webhook/route.ts`
   - Always generates auto-login token for guest checkouts
   - Improved logging

2. `app/payment/success/page.tsx`
   - Added retry logic (5 attempts)
   - Better error handling
   - Waits for webhook to complete

3. `app/api/payments/verify-session/route.ts`
   - Returns auto-login token
   - Works for both guest and authenticated users

4. `app/courses/[id]/page.tsx`
   - Removed signin redirect
   - Allows guest checkout

5. `app/dashboard/page.tsx`
   - Already has download functionality
   - Shows all purchased courses

## Environment Variables Checklist

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...                    # Required
STRIPE_WEBHOOK_SECRET=whsec_...                  # Production only

# Email
RESEND_API_KEY=re_...                            # Required
FROM_EMAIL=noreply@yourdomain.com                # Required

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000        # Required

# Optional
DOWNLOAD_LINK_EXPIRY_HOURS=168                   # Default: 168 (7 days)
```

## Still Having Issues?

### Check These:

1. **Is Stripe webhook configured?**
   - Development: Run `stripe listen`
   - Production: Configure in Stripe Dashboard

2. **Are environment variables set?**
   ```bash
   cat .env | grep STRIPE
   cat .env | grep RESEND
   ```

3. **Is the database up to date?**
   ```bash
   npm run db:migrate
   ```

4. **Check server logs:**
   - Look for 🔔 webhook received
   - Look for ✅ success messages
   - Look for ❌ error messages

5. **Check browser console:**
   - Look for auto-login attempts
   - Look for API errors

## Contact Information

If issues persist:
1. Check server logs for detailed errors
2. Check Stripe dashboard for webhook delivery status
3. Verify email in Resend dashboard
4. Check database for user/purchase records

---

**Last Updated:** 2025-11-05
**Status:** ✅ Implemented with retry logic and improved error handling
