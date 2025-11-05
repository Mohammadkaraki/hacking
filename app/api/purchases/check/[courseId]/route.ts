import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: params.courseId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Convert BigInt to Number before serializing
    const serializedPurchase = {
      ...purchase,
      course: purchase.course ? {
        ...purchase.course,
        fileSize: purchase.course.fileSize ? Number(purchase.course.fileSize) : null,
      } : null,
    };

    return NextResponse.json(serializedPurchase);
  } catch (error) {
    console.error('Error checking purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
