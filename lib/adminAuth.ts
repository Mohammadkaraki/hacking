import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Middleware to check if the current user is an admin
 * Returns user if admin, throws error if not
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('Unauthorized - Please log in');
  }

  // Get user with role from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user || user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required');
  }

  return user;
}

/**
 * Helper to return JSON error responses for admin route handlers
 */
export function adminErrorResponse(error: any) {
  console.error('Admin route error:', error);

  if (error.message?.includes('Unauthorized')) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (error.message?.includes('Forbidden')) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
