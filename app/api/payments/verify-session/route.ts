import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    console.log('\n🔍 Verifying payment session:', sessionId);

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve the Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('💳 Stripe session retrieved:');
    console.log('- Payment status:', checkoutSession.payment_status);
    console.log('- Customer email:', checkoutSession.customer_email);
    console.log('- Metadata:', checkoutSession.metadata);

    if (!checkoutSession) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 404 });
    }

    // Check if payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const courseId = checkoutSession.metadata?.courseId;
    let userId = checkoutSession.metadata?.userId;
    const isGuestCheckout = checkoutSession.metadata?.isGuestCheckout === 'true';

    if (!courseId) {
      return NextResponse.json({ error: 'Invalid session metadata - missing courseId' }, { status: 400 });
    }

    // Get customer email
    const customerEmail = checkoutSession.customer_email || checkoutSession.customer_details?.email;

    // Check if user is already logged in
    const session = await getServerSession(authOptions);

    // If user is logged in, use their ID (overrides metadata)
    if (session?.user?.id) {
      userId = session.user.id;
      console.log(`✅ User is logged in: ${session.user.email} (ID: ${userId})`);
    }

    // For guest checkout, find the auto-login token
    let autoLoginToken: string | null = null;
    if (isGuestCheckout && customerEmail) {
      const token = await prisma.verificationToken.findFirst({
        where: {
          identifier: `autologin:${customerEmail}`,
          expires: {
            gt: new Date(),
          },
        },
        orderBy: {
          expires: 'desc',
        },
      });

      autoLoginToken = token?.token || null;
    }

    // For guest checkout, get or create the user account
    let actualUserId = userId;
    let createdUser = null;

    if (isGuestCheckout && customerEmail) {
      let user = await prisma.user.findUnique({
        where: { email: customerEmail },
      });

      if (!user) {
        // FALLBACK: Create user account if webhook hasn't done it yet
        console.log('⚠️ Creating user account (webhook may have failed)');

        const crypto = require('crypto');
        const bcrypt = require('bcryptjs');

        const generatedPassword = crypto.randomBytes(12).toString('base64').slice(0, 16);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const nameFromEmail = customerEmail.split('@')[0];
        const userName = checkoutSession.customer_details?.name || nameFromEmail;

        user = await prisma.user.create({
          data: {
            email: customerEmail,
            name: userName,
            password: hashedPassword,
            emailVerified: new Date(),
          },
        });

        createdUser = { email: customerEmail, password: generatedPassword };
        console.log(`✅ Created user account for: ${customerEmail}`);

        // Create auto-login token
        const autoLoginTokenValue = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        await prisma.verificationToken.create({
          data: {
            identifier: `autologin:${customerEmail}`,
            token: autoLoginTokenValue,
            expires: tokenExpiry,
          },
        });

        autoLoginToken = autoLoginTokenValue;
        console.log(`✅ Generated auto-login token for: ${customerEmail}`);
      }

      actualUserId = user.id;
    }

    // Check if purchase already exists
    let existingPurchase = null;
    if (actualUserId && actualUserId !== 'guest') {
      existingPurchase = await prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: actualUserId,
            courseId: courseId,
          },
        },
        include: {
          course: true,
        },
      });
    }

    if (existingPurchase) {
      console.log(`✅ Purchase already exists for user ${actualUserId}, course ${courseId}`);
      return NextResponse.json({
        message: 'Purchase already recorded',
        purchase: {
          ...existingPurchase,
          course: existingPurchase.course ? {
            ...existingPurchase.course,
            fileSize: existingPurchase.course.fileSize ? Number(existingPurchase.course.fileSize) : null,
          } : null,
        },
        autoLoginToken, // Include auto-login token for guest checkout
      });
    }

    // FALLBACK: If webhook hasn't created the purchase yet, create it here
    // This ensures the purchase is recorded even if webhooks fail
    console.log('⚠️ Purchase not found - creating as fallback (webhook may have failed)');

    // Ensure we have a valid userId before creating purchase
    if (!actualUserId) {
      return NextResponse.json(
        { error: 'Unable to identify user for this purchase' },
        { status: 400 }
      );
    }

    const paymentIntentId = checkoutSession.payment_intent as string;

    const purchase = await prisma.purchase.create({
      data: {
        userId: actualUserId,
        courseId: courseId,
        stripePaymentIntentId: paymentIntentId,
        stripeSessionId: sessionId,
        amount: (checkoutSession.amount_total || 0) / 100, // Convert from cents
        currency: checkoutSession.currency || 'usd',
        status: 'completed',
      },
      include: {
        course: true,
      },
    });

    console.log(`✅ Purchase created (fallback) for user ${actualUserId}, course ${courseId}`);

    return NextResponse.json({
      message: 'Purchase verified successfully',
      purchase: {
        ...purchase,
        course: purchase.course ? {
          ...purchase.course,
          fileSize: purchase.course.fileSize ? Number(purchase.course.fileSize) : null,
        } : null,
      },
      autoLoginToken, // Include auto-login token for guest checkout
    });
  } catch (error: any) {
    console.error('❌ Error verifying session:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: `Failed to verify session: ${error.message}` },
      { status: 500 }
    );
  }
}
