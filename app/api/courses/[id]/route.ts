import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Limit to 10 most recent reviews
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Count students (purchases)
    const purchaseCount = await prisma.purchase.count({
      where: {
        courseId: params.id,
        status: 'completed',
      },
    });

    // Use the higher value between initial students and actual purchases
    // This allows displaying initial student count for new courses
    const totalStudents = Math.max(course.students || 0, purchaseCount);

    // Calculate average rating from reviews
    let averageRating = course.rating;
    if (course.reviews && course.reviews.length > 0) {
      const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / course.reviews.length;

      // Update course rating in database (async, don't wait)
      prisma.course.update({
        where: { id: params.id },
        data: { rating: averageRating },
      }).catch((error) => console.error('Failed to update course rating:', error));
    }

    return NextResponse.json({
      ...course,
      fileSize: course.fileSize ? Number(course.fileSize) : null,
      students: totalStudents,
      rating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
