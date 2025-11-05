import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get purchases for this user
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json({
      session: {
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
      },
      purchasesCount: purchases.length,
      purchases: purchases.map((p) => ({
        id: p.id,
        courseTitle: p.course.title,
        amount: p.amount,
      })),
    });
  } catch (error) {
    console.error('Error in debug session:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
