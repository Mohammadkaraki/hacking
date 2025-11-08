import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendAccountCredentialsEmail } from '@/lib/emails';
import { generateDownloadUrl } from '@/lib/s3';
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // Verify webhook signature (PRODUCTION & DEVELOPMENT with Stripe CLI)
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('🔔 Webhook received (verified):', event.type);
    } else {
      // Fallback for development without webhook secret (NOT RECOMMENDED)
      console.warn('⚠️ Processing webhook WITHOUT signature verification - set STRIPE_WEBHOOK_SECRET');
      event = JSON.parse(body);
      console.log('🔔 Webhook received (unverified):', event.type);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('💳 Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;

        // Get metadata
        const courseId = session.metadata?.courseId;
        let userId = session.metadata?.userId;
        const isGuestCheckout = session.metadata?.isGuestCheckout === 'true';

        if (!courseId) {
          console.error('Missing courseId in checkout session');
          break;
        }

        // Get customer email from Stripe
        const customerEmail = session.customer_email || session.customer_details?.email;

        if (!customerEmail) {
          console.error('No customer email found in session');
          break;
        }

        // Get course details
        const course = await prisma.course.findUnique({
          where: { id: courseId },
        });

        if (!course) {
          console.error('Course not found:', courseId);
          break;
        }

        let generatedPassword: string | null = null;
        let autoLoginToken: string | null = null;

        // Handle guest checkout - create account automatically
        if (isGuestCheckout || userId === 'guest') {
          console.log('🔄 Processing guest checkout for:', customerEmail);

          // Check if user already exists
          let existingUser = await prisma.user.findUnique({
            where: { email: customerEmail },
          });

          if (!existingUser) {
            // Generate random secure password
            generatedPassword = crypto.randomBytes(12).toString('base64').slice(0, 16);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            // Extract name from email or use default
            const nameFromEmail = customerEmail.split('@')[0];
            const userName = session.customer_details?.name || nameFromEmail;

            // Create new user account with email already verified
            existingUser = await prisma.user.create({
              data: {
                email: customerEmail,
                name: userName,
                password: hashedPassword,
                emailVerified: new Date(), // Auto-verify for purchased accounts
              },
            });

            console.log('✅ Created new user account:', existingUser.id);
          } else {
            console.log('ℹ️ User already exists:', existingUser.id);
          }

          userId = existingUser.id;

          // Generate auto-login token for seamless login (for ALL guest checkouts, new or existing)
          autoLoginToken = crypto.randomBytes(32).toString('hex');
          const tokenExpiry = new Date();
          tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Valid for 24 hours

          // Delete any old auto-login tokens for this email
          await prisma.verificationToken.deleteMany({
            where: {
              identifier: `autologin:${customerEmail}`,
            },
          });

          // Create new auto-login token
          await prisma.verificationToken.create({
            data: {
              identifier: `autologin:${customerEmail}`,
              token: autoLoginToken,
              expires: tokenExpiry,
            },
          });

          console.log('✅ Generated auto-login token for:', customerEmail);
        }

        if (!userId || userId === 'guest') {
          console.error('Failed to get/create userId');
          break;
        }

        // Get payment intent
        const paymentIntentId = session.payment_intent as string;

        // Create or update purchase
        await prisma.purchase.upsert({
          where: {
            userId_courseId: {
              userId: userId,
              courseId: courseId,
            },
          },
          update: {
            status: 'completed',
            stripePaymentIntentId: paymentIntentId,
            stripeSessionId: session.id,
          },
          create: {
            userId: userId,
            courseId: courseId,
            stripePaymentIntentId: paymentIntentId,
            stripeSessionId: session.id,
            amount: (session.amount_total || 0) / 100, // Convert from cents
            currency: session.currency || 'usd',
            status: 'completed',
          },
        });

        console.log(`✅ Payment completed for user ${userId}, course ${courseId}`);

        // Send email with credentials and download link (for new accounts)
        if (generatedPassword && course.s3FileKey) {
          try {
            // Generate download URL
            const expiryHours = parseInt(process.env.DOWNLOAD_LINK_EXPIRY_HOURS || '168', 10); // 7 days
            const expiresInSeconds = expiryHours * 60 * 60;
            const downloadUrl = await generateDownloadUrl(course.s3FileKey, expiresInSeconds);

            // Get user details
            const user = await prisma.user.findUnique({
              where: { id: userId },
            });

            if (user) {
              // Send email with account credentials and download link
              await sendAccountCredentialsEmail(
                user.email,
                user.name || 'User',
                generatedPassword,
                course.title,
                downloadUrl
              );

              console.log('✅ Sent credentials email to:', user.email);
            }
          } catch (error) {
            console.error('❌ Failed to send credentials email:', error);
          }
        }

        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
