import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, adminErrorResponse } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { uploadToS3, uploadImageToS3 } from '@/lib/s3';

/**
 * GET /api/admin/courses
 * Get all courses (including inactive) for admin dashboard
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
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

    const coursesWithStats = courses.map((course) => ({
      ...course,
      fileSize: course.fileSize ? Number(course.fileSize) : null,
      students: course._count.purchases,
    }));

    return NextResponse.json(coursesWithStats);
  } catch (error) {
    return adminErrorResponse(error);
  }
}

/**
 * POST /api/admin/courses
 * Create a new course with file upload to S3
 * Accepts both multipart/form-data and application/json
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const contentType = request.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    let courseData: any;
    let file: File | null = null;

    if (isJson) {
      // JSON payload (file already uploaded to S3)
      courseData = await request.json();
    } else {
      // FormData payload (traditional upload)
      const formData = await request.formData();
      file = formData.get('file') as File | null;

      // Handle image uploads
      const thumbnailFile = formData.get('thumbnailFile') as File | null;
      const instructorAvatarFile = formData.get('instructorAvatarFile') as File | null;

      let thumbnailUrl = formData.get('thumbnail') as string;
      let instructorAvatarUrl = formData.get('instructorAvatar') as string;

      if (thumbnailFile) {
        const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
        thumbnailUrl = await uploadImageToS3(buffer, 'thumbnails', thumbnailFile.name, thumbnailFile.type);
      }

      if (instructorAvatarFile) {
        const buffer = Buffer.from(await instructorAvatarFile.arrayBuffer());
        instructorAvatarUrl = await uploadImageToS3(buffer, 'instructors', instructorAvatarFile.name, instructorAvatarFile.type);
      }

      courseData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        thumbnail: thumbnailUrl,
        difficulty: formData.get('difficulty') as string,
        duration: formData.get('duration') as string,
        lessons: parseInt(formData.get('lessons') as string),
        price: parseFloat(formData.get('price') as string),
        originalPrice: parseFloat(formData.get('originalPrice') as string),
        category: formData.get('category') as string,
        instructor: formData.get('instructor') as string,
        featured: formData.get('featured') === 'true',
        prerequisites: JSON.parse(formData.get('prerequisites') as string || '[]'),
        whatYouLearn: JSON.parse(formData.get('whatYouLearn') as string || '[]'),
        highlights: JSON.parse(formData.get('highlights') as string || '[]'),
        targetAudience: JSON.parse(formData.get('targetAudience') as string || '[]'),
        instructorCredentials: JSON.parse(formData.get('instructorCredentials') as string || '[]'),
        videoPreviewUrl: formData.get('videoPreviewUrl') as string || null,
        instructorBio: formData.get('instructorBio') as string || null,
        instructorAvatar: instructorAvatarUrl,
        totalVideoHours: parseFloat(formData.get('totalVideoHours') as string || '0'),
        initialStudents: formData.get('initialStudents') as string || '0',
        initialRating: formData.get('initialRating') as string || '0',
        faqs: formData.get('faqs') as string || null,
        modules: formData.get('modules') as string || null,
        seedReviews: formData.get('seedReviews') as string || null,
        s3FileKey: formData.get('s3FileKey') as string || null,
        fileSize: formData.get('fileSize') ? parseInt(formData.get('fileSize') as string) : null,
        fileType: formData.get('fileType') as string || null,
      };
    }

    // Handle file upload (only for FormData requests)
    let s3FileKey: string | null = courseData.s3FileKey || null;
    let fileSize: number | null = courseData.fileSize || null;
    let fileType: string | null = courseData.fileType || null;

    if (file) {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate S3 key (path)
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      s3FileKey = `courses/${timestamp}-${sanitizedFileName}`;
      fileType = file.type || 'application/zip';
      fileSize = file.size;

      // Upload to S3
      await uploadToS3(buffer, s3FileKey, fileType);

      console.log(`File uploaded to S3: ${s3FileKey} (${fileSize} bytes)`);
    }

    // Convert arrays from strings if needed
    const prerequisites = Array.isArray(courseData.prerequisites)
      ? courseData.prerequisites
      : courseData.prerequisites?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    const whatYouLearn = Array.isArray(courseData.whatYouLearn)
      ? courseData.whatYouLearn
      : courseData.whatYouLearn?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    const highlights = Array.isArray(courseData.highlights)
      ? courseData.highlights
      : courseData.highlights?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    const targetAudience = Array.isArray(courseData.targetAudience)
      ? courseData.targetAudience
      : courseData.targetAudience?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    const instructorCredentials = Array.isArray(courseData.instructorCredentials)
      ? courseData.instructorCredentials
      : courseData.instructorCredentials?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    // Create course in database
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
        difficulty: courseData.difficulty,
        duration: courseData.duration,
        lessons: parseInt(courseData.lessons),
        price: parseFloat(courseData.price),
        originalPrice: parseFloat(courseData.originalPrice),
        category: courseData.category,
        instructor: courseData.instructor,
        rating: parseFloat(courseData.initialRating) || 0,
        students: parseInt(courseData.initialStudents) || 0,
        featured: courseData.featured || false,
        prerequisites,
        whatYouLearn,
        highlights,
        targetAudience,
        instructorCredentials,
        videoPreviewUrl: courseData.videoPreviewUrl || null,
        instructorBio: courseData.instructorBio || null,
        instructorAvatar: courseData.instructorAvatar || null,
        totalVideoHours: courseData.totalVideoHours || null,
        faqs: courseData.faqs ? (typeof courseData.faqs === 'string' ? JSON.parse(courseData.faqs) : courseData.faqs) : null,
        lastContentUpdate: new Date(),
        s3BucketName: process.env.AWS_S3_BUCKET_NAME || null,
        s3FileKey,
        fileSize: fileSize ? BigInt(fileSize) : null,
        fileType,
        active: true,
      },
    });

    console.log(`Course created: ${course.id} - ${course.title}`);

    // Create modules and lessons if provided
    const modulesData = courseData.modules
      ? (typeof courseData.modules === 'string' ? JSON.parse(courseData.modules) : courseData.modules)
      : [];
    if (Array.isArray(modulesData) && modulesData.length > 0) {
      for (const moduleData of modulesData) {
        const createdModule = await prisma.courseModule.create({
          data: {
            courseId: course.id,
            title: moduleData.title,
            description: moduleData.description || null,
            order: moduleData.order,
            duration: moduleData.duration,
          },
        });

        // Create lessons for this module
        if (Array.isArray(moduleData.lessons) && moduleData.lessons.length > 0) {
          for (const lessonData of moduleData.lessons) {
            await prisma.courseLesson.create({
              data: {
                moduleId: createdModule.id,
                title: lessonData.title,
                duration: lessonData.duration,
                order: lessonData.order,
                isFree: lessonData.isFree || false,
              },
            });
          }
        }
      }
      console.log(`Created ${modulesData.length} modules with lessons`);
    }

    // Create seed reviews if provided (for social proof / testimonials)
    const seedReviewsData = courseData.seedReviews
      ? (typeof courseData.seedReviews === 'string' ? JSON.parse(courseData.seedReviews) : courseData.seedReviews)
      : [];

    if (Array.isArray(seedReviewsData) && seedReviewsData.length > 0) {
      // Create or get a system user for seed reviews
      let systemUser = await prisma.user.findUnique({
        where: { email: 'system-reviews@internal.local' }
      });

      if (!systemUser) {
        systemUser = await prisma.user.create({
          data: {
            email: 'system-reviews@internal.local',
            name: 'System',
            emailVerified: new Date(),
            role: 'user',
          }
        });
      }

      // Create reviews with unique constraint handling
      for (const reviewData of seedReviewsData) {
        // Create a unique user for each review based on name
        const reviewerEmail = `seed-${reviewData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}@reviews.local`;

        const reviewer = await prisma.user.create({
          data: {
            email: reviewerEmail,
            name: reviewData.name,
            emailVerified: new Date(),
            role: 'user',
          }
        });

        await prisma.courseReview.create({
          data: {
            courseId: course.id,
            userId: reviewer.id,
            rating: reviewData.rating,
            review: reviewData.review,
            helpful: 0,
          },
        });
      }

      // Update course average rating
      const avgRating = seedReviewsData.reduce((sum, r) => sum + r.rating, 0) / seedReviewsData.length;
      await prisma.course.update({
        where: { id: course.id },
        data: { rating: avgRating },
      });

      console.log(`Created ${seedReviewsData.length} seed reviews`);
    }

    return NextResponse.json({
      ...course,
      fileSize: course.fileSize ? Number(course.fileSize) : null,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return adminErrorResponse(error);
  }
}
