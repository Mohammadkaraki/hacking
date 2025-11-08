@echo off
echo ============================================
echo Starting Stripe Webhook Listener
echo ============================================
echo.
echo This will forward Stripe webhooks to your localhost.
echo Keep this terminal open while developing!
echo.
echo After starting, copy the webhook signing secret (whsec_xxx)
echo and add it to your .env file as STRIPE_WEBHOOK_SECRET
echo.
echo ============================================
echo.

stripe listen --forward-to localhost:3000/api/payments/webhook
