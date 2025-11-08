# Stripe Webhook Setup Guide

This guide explains how to set up Stripe webhooks for both **local development** and **production**.

## Why Webhooks Are Important

When a user completes payment through Stripe:
1. User is redirected to your success page
2. **Stripe sends a webhook** to your server with payment confirmation
3. Your webhook handler creates the purchase record in the database
4. User can now access and download the course

Without webhooks working properly, purchases won't be recorded!

---

## Setup for Local Development (localhost)

Stripe webhooks can't reach `localhost` by default. You need to use the **Stripe CLI** to forward webhooks.

### Step 1: Install Stripe CLI

**Windows:**
```bash
# Download from: https://github.com/stripe/stripe-cli/releases
# Or use Scoop:
scoop install stripe
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download from: https://github.com/stripe/stripe-cli/releases
```

### Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authorize the CLI with your Stripe account.

### Step 3: Forward Webhooks to Localhost

Run this command in a **separate terminal** (keep it running while developing):

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

You'll see output like:
```
> Ready! You are using Stripe API Version [2024-XX-XX]. Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Copy the Webhook Secret

Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Restart Your Next.js Dev Server

```bash
npm run dev
```

### Step 6: Test the Webhook

Now when you make a test purchase:
1. The Stripe CLI will forward the webhook to your localhost
2. You'll see logs in both terminals:
   - Stripe CLI terminal: Shows webhook events being forwarded
   - Next.js terminal: Shows webhook being processed
3. Purchase will be created in the database
4. Course will appear in the dashboard

---

## Setup for Production (Deployed App)

### Step 1: Get Your Production Webhook Endpoint

Your webhook endpoint will be:
```
https://yourdomain.com/api/payments/webhook
```

### Step 2: Create Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen to:
   - ✅ `checkout.session.completed` (REQUIRED)
   - ✅ `payment_intent.payment_failed` (OPTIONAL)
5. Click **"Add endpoint"**

### Step 3: Get the Webhook Signing Secret

1. Click on your newly created webhook
2. Click **"Reveal"** under "Signing secret"
3. Copy the secret (starts with `whsec_`)

### Step 4: Add to Production Environment Variables

Add the webhook secret to your production environment (Vercel, Railway, etc.):

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Vercel Example:**
```bash
vercel env add STRIPE_WEBHOOK_SECRET
# Paste the secret when prompted
```

### Step 5: Deploy and Test

1. Deploy your app
2. Make a test purchase using Stripe test cards
3. Check Stripe Dashboard > Webhooks to see successful deliveries
4. Verify purchase appears in user dashboard

---

## Testing Webhooks

### Test Card Numbers

Use these for testing (from [Stripe Test Cards](https://stripe.com/docs/testing)):

- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

**Expiry:** Any future date (e.g., `12/34`)
**CVC:** Any 3 digits (e.g., `123`)
**ZIP:** Any 5 digits (e.g., `12345`)

### Verify Webhook is Working

**Local Development:**
- Check the Stripe CLI terminal for forwarded events
- Check your Next.js terminal for webhook processing logs
- Look for: `✅ Payment completed for user...`

**Production:**
- Go to Stripe Dashboard > Webhooks
- Click on your webhook endpoint
- Check "Recent events" - should show successful deliveries
- Click on an event to see the request/response

### Check Database

After a successful purchase, verify in your database:

```bash
npm run db:studio
```

Check the `Purchase` table - should have a new record with:
- `status: "completed"`
- `userId` and `courseId` filled
- `stripePaymentIntentId` and `stripeSessionId` present

---

## Troubleshooting

### Issue: Webhook not being received

**Local:**
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/payments/webhook`
- Check if `STRIPE_WEBHOOK_SECRET` is in `.env`
- Restart Next.js dev server after adding the secret

**Production:**
- Check webhook endpoint URL is correct in Stripe Dashboard
- Verify `STRIPE_WEBHOOK_SECRET` is set in production environment
- Check webhook logs in Stripe Dashboard for errors

### Issue: "No signatures found" error

- The webhook secret is missing or incorrect
- Make sure you copied the full secret (starts with `whsec_`)
- Restart your server after adding the secret

### Issue: Purchase not appearing in dashboard

1. Check if webhook ran successfully (check logs)
2. Verify purchase was created in database
3. Check if user is logged in correctly
4. Look for errors in browser console and server logs

### Issue: 401 Unauthorized or signature verification failed

- Webhook secret doesn't match
- In production: Get the secret from the specific webhook endpoint in Stripe Dashboard
- In development: Get the secret from the Stripe CLI output

---

## Current Status

✅ Webhook handler is set up at `/api/payments/webhook`
✅ Signature verification is enabled
✅ Fallback purchase creation is in place (if webhooks fail)
⏳ **You need to:** Run Stripe CLI for local testing OR configure production webhook

---

## Quick Start Commands

**Local Development:**
```bash
# Terminal 1: Run Stripe CLI
stripe listen --forward-to localhost:3000/api/payments/webhook

# Copy the webhook secret (whsec_xxx) to .env file

# Terminal 2: Run Next.js
npm run dev

# Terminal 3 (optional): Watch database
npm run db:studio
```

**Make a Test Purchase:**
1. Go to any course page: `http://localhost:3000/courses/[course-id]`
2. Click "Enroll Now"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. You should be redirected to dashboard with the course available!

---

## Production Deployment Checklist

- [ ] Create webhook endpoint in Stripe Dashboard
- [ ] Set `STRIPE_WEBHOOK_SECRET` in production environment
- [ ] Deploy application
- [ ] Test with Stripe test mode
- [ ] Switch to live mode when ready
- [ ] Create live mode webhook endpoint
- [ ] Update `STRIPE_WEBHOOK_SECRET` with live mode secret
- [ ] Test with real payment (small amount)
- [ ] Monitor webhook deliveries in Stripe Dashboard

---

## Support

If webhooks are not working after following this guide:
1. Check server logs for errors
2. Check Stripe Dashboard > Webhooks > Recent events
3. Verify all environment variables are set correctly
4. Make sure you're using the correct API keys (test vs live mode)
