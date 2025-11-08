import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, adminErrorResponse } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { uploadToS3 } from '@/lib/s3';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * GET /api/admin/courses/:id
 * Get single course details for editing
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            purchases: {
              where: { status: 'completed' },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...course,
      fileSize: course.fileSize ? Number(course.fileSize) : null,
      students: course._count.purchases,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

/**
 * PUT /api/admin/courses/:id
 * Update an existing course (with optional file replacement)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const formData = await request.formData();

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Extract course data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const thumbnail = formData.get('thumbnail') as string;
    const difficulty = formData.get('difficulty') as string;
    const duration = formData.get('duration') as string;
    const lessons = parseInt(formData.get('lessons') as string);
    const price = parseFloat(formData.get('price') as string);
    const originalPrice = parseFloat(formData.get('originalPrice') as string);
    const category = formData.get('category') as string;
    const instructor = formData.get('instructor') as string;
    const featured = formData.get('featured') === 'true';
    const active = formData.get('active') === 'true';

    // Parse arrays
    const prerequisites = JSON.parse(formData.get('prerequisites') as string || '[]');
    const whatYouLearn = JSON.parse(formData.get('whatYouLearn') as string || '[]');
    const highlights = JSON.parse(formData.get('highlights') as string || '[]');
    const targetAudience = JSON.parse(formData.get('targetAudience') as string || '[]');
    const instructorCredentials = JSON.parse(formData.get('instructorCredentials') as string || '[]');

    // Optional fields
    const videoPreviewUrl = formData.get('videoPreviewUrl') as string || null;
    const instructorBio = formData.get('instructorBio') as string || null;
    const instructorAvatar = formData.get('instructorAvatar') as string || null;

    // Handle file upload (if new file provided)
    const file = formData.get('file') as File | null;
    let s3FileKey = existingCourse.s3FileKey;
    let fileSize = existingCourse.fileSize ? Number(existingCourse.fileSize) : null;
    let fileType = existingCourse.fileType;

    if (file) {
      // Delete old file from S3 if it exists
      if (existingCourse.s3FileKey) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || '',
            Key: existingCourse.s3FileKey,
          });
          await s3Client.send(deleteCommand);
          console.log(`Deleted old S3 file: ${existingCourse.s3FileKey}`);
        } catch (error) {
          console.error('Error deleting old S3 file:', error);
          // Continue anyway - don't fail the update
        }
      }

      // Upload new file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      s3FileKey = `courses/${timestamp}-${sanitizedFileName}`;
      fileType = file.type || 'application/zip';
      fileSize = file.size;

      await uploadToS3(buffer, s3FileKey, fileType);
      console.log(`New file uploaded to S3: ${s3FileKey} (${fileSize} bytes)`);
    }

    // Update course in database
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description,
        thumbnail,
        difficulty,
        duration,
        lessons,
        price,
        originalPrice,
        category,
        instructor,
        featured,
        active,
        prerequisites,
        whatYouLearn,
        highlights,
        targetAudience,
        instructorCredentials,
        videoPreviewUrl,
        instructorBio,
        instructorAvatar,
        s3FileKey,
        fileSize: fileSize ? BigInt(fileSize) : null,
        fileType,
      },
    });

    console.log(`Course updated: ${course.id} - ${course.title}`);

    return NextResponse.json({
      ...course,
      fileSize: course.fileSize ? Number(course.fileSize) : null,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return adminErrorResponse(error);
  }
}

/**
 * DELETE /api/admin/courses/:id
 * Delete a course and its S3 file
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    // Get course to delete S3 file
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Delete S3 file if it exists
    if (course.s3FileKey) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME || '',
          Key: course.s3FileKey,
        });
        await s3Client.send(deleteCommand);
        console.log(`Deleted S3 file: ${course.s3FileKey}`);
      } catch (error) {
        console.error('Error deleting S3 file:', error);
        // Continue with database deletion even if S3 delete fails
      }
    }

    // Delete course from database (cascades to purchases, downloads, etc.)
    await prisma.course.delete({
      where: { id: params.id },
    });

    console.log(`Course deleted: ${params.id} - ${course.title}`);

    return NextResponse.json({
      message: 'Course deleted successfully',
      courseId: params.id,
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return adminErrorResponse(error);
  }
}
