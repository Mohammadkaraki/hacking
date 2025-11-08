import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');

    const where: any = { active: true };

    if (featured) {
      where.featured = true;
    }

    if (category) {
      where.category = category;
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Add student count to each course and convert BigInt to Number
    const coursesWithStudents = await Promise.all(
      courses.map(async (course) => {
        const purchaseCount = await prisma.purchase.count({
          where: {
            courseId: course.id,
            status: 'completed',
          },
        });
        // Use the higher value between initial students and actual purchases
        const totalStudents = Math.max(course.students || 0, purchaseCount);
        return {
          ...course,
          fileSize: course.fileSize ? Number(course.fileSize) : null,
          students: totalStudents,
        };
      })
    );

    return NextResponse.json(coursesWithStudents);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
