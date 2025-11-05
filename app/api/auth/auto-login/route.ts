import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find the auto-login token
    const autoLoginToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!autoLoginToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Check if token is expired
    if (autoLoginToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    // Extract email from identifier (format: "autologin:email@example.com")
    const email = autoLoginToken.identifier.replace('autologin:', '');

    // Get user details
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, image: true, emailVerified: true },
    });

    if (!user || !user.emailVerified) {
      return NextResponse.json({ error: 'User not found or not verified' }, { status: 400 });
    }

    // Delete the used token
    await prisma.verificationToken.delete({ where: { token } });

    // Return user info for NextAuth session creation
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Auto-login error:', error);
    return NextResponse.json({ error: 'Failed to auto-login' }, { status: 500 });
  }
}
