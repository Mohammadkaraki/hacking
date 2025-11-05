import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/emails';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(), // DISABLED: Auto-verify emails (verification temporarily disabled)
      },
    });

    // DISABLED: Email verification temporarily disabled
    // TODO: Re-enable verification emails when needed
    // Generate verification token
    // const token = await createVerificationToken(email);
    // Send verification email
    // const emailResult = await sendVerificationEmail(email, token);

    // if (!emailResult.success) {
    //   console.error('❌ Failed to send verification email:', emailResult.error);
    //   // Note: We don't fail the signup if email fails, user can request resend
    // } else {
    //   console.log('✅ Verification email sent successfully to:', email);
    //   console.log('📧 Email ID:', emailResult);
    // }

    return NextResponse.json(
      {
        message: 'Account created successfully. You can now sign in.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        emailSent: false, // Verification disabled
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
