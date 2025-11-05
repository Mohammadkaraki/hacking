import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, deleteVerificationToken, generateVerificationToken } from '@/lib/tokens';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the token and get the email
    const email = await verifyToken(token);

    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user's emailVerified field
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the used token
    await deleteVerificationToken(token);

    // Generate a one-time auto-login token (expires in 5 minutes)
    const autoLoginToken = generateVerificationToken();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.verificationToken.create({
      data: {
        identifier: `autologin:${email}`,
        token: autoLoginToken,
        expires,
      },
    });

    return NextResponse.json(
      {
        message: 'Email verified successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        autoLoginToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
