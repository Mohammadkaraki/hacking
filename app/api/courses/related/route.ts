import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '3', 10);

    // Build where clause
    const where: any = {
      active: true,
      NOT: courseId ? { id: courseId } : undefined,
    };

    // If category provided, filter by category; otherwise get featured courses
    if (category) {
      where.category = category;
    } else {
      where.featured = true;
    }

    const courses = await prisma.course.findMany({
      where,
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Add student count to each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const purchaseCount = await prisma.purchase.count({
          where: {
            courseId: course.id,
            status: 'completed',
          },
        });

        return {
          ...course,
          fileSize: course.fileSize ? Number(course.fileSize) : null,
          students: purchaseCount,
        };
      })
    );

    return NextResponse.json(coursesWithStats);
  } catch (error) {
    console.error('Error fetching related courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
