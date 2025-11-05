import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const searchTerm = query.trim().toLowerCase();

    // Search courses by title, description, category, or instructor
    const courses = await prisma.course.findMany({
      where: {
        AND: [
          {
            active: true, // Only show active courses
          },
          {
            OR: [
              {
                title: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                category: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                instructor: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        thumbnail: true,
        price: true,
        rating: true,
      },
      orderBy: [
        { rating: 'desc' },
        { featured: 'desc' },
      ],
      take: 10, // Limit to top 10 results
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search courses' },
      { status: 500 }
    );
  }
}
