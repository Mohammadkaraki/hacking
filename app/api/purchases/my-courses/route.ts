import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: true,
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });

    // Convert BigInt to Number before serializing
    const serializedPurchases = purchases.map((purchase) => ({
      ...purchase,
      course: purchase.course ? {
        ...purchase.course,
        fileSize: purchase.course.fileSize ? Number(purchase.course.fileSize) : null,
      } : null,
    }));

    return NextResponse.json(serializedPurchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
