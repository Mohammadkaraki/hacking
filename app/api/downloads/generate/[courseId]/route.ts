import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateDownloadUrl } from '@/lib/s3';

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has purchased the course
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

    if (!purchase || purchase.status !== 'completed') {
      return NextResponse.json(
        { error: 'Course not purchased or payment incomplete' },
        { status: 403 }
      );
    }

    if (!purchase.course.s3FileKey) {
      return NextResponse.json(
        { error: 'Course file not available' },
        { status: 404 }
      );
    }

    // Generate pre-signed URL (expires in 24 hours)
    const expiryHours = parseInt(process.env.DOWNLOAD_LINK_EXPIRY_HOURS || '24', 10);
    const expiresInSeconds = expiryHours * 60 * 60;

    // Create a clean filename from course title
    const cleanFilename = purchase.course.title
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .substring(0, 100) // Limit length
      + '.zip';

    const downloadUrl = await generateDownloadUrl(
      purchase.course.s3FileKey,
      expiresInSeconds,
      cleanFilename // Pass clean filename
    );

    // Get client IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // Log download attempt
    await prisma.download.create({
      data: {
        userId: session.user.id,
        courseId: params.courseId,
        downloadUrl: downloadUrl,
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
        ipAddress: ipAddress,
      },
    });

    return NextResponse.json({
      downloadUrl,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download link' },
      { status: 500 }
    );
  }
}
