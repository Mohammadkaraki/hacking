import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve the Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 404 });
    }

    // Check if payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const courseId = checkoutSession.metadata?.courseId;
    const userId = checkoutSession.metadata?.userId;
    const isGuestCheckout = checkoutSession.metadata?.isGuestCheckout === 'true';

    if (!courseId || !userId) {
      return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 });
    }

    // Get customer email
    const customerEmail = checkoutSession.customer_email || checkoutSession.customer_details?.email;

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

    // Check if user is already logged in
    const session = await getServerSession(authOptions);
    if (session?.user && userId !== session.user.id && !isGuestCheckout) {
      return NextResponse.json({ error: 'User mismatch' }, { status: 401 });
    }

    // Check if purchase already exists
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json({
        message: 'Purchase already recorded',
        purchase: existingPurchase,
        autoLoginToken, // Include auto-login token for guest checkout
      });
    }

    // Note: Purchase should already be created by webhook
    // Just return the token, don't try to create purchase here
    let purchase = null;

    // Only check purchase if userId exists (not guest)
    if (userId && userId !== 'guest') {
      purchase = await prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId,
          },
        },
        include: {
          course: true,
        },
      });
    }

    console.log(`✅ Purchase verified for user ${userId}, course ${courseId}`);

    return NextResponse.json({
      message: 'Purchase verified successfully',
      purchase: purchase,
      autoLoginToken, // Include auto-login token for guest checkout
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
