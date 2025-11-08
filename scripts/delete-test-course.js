const { PrismaClient } = require('@prisma/client');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function deleteTestCourse() {
  try {
    console.log('🗑️  Deleting test course...\n');

    // Find the test course
    const course = await prisma.course.findFirst({
      where: {
        title: 'Advanced Web Application Security & Penetration Testing',
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        reviews: true,
        purchases: true,
      },
    });

    if (!course) {
      console.log('❌ Test course not found');
      return;
    }

    console.log(`Found course: ${course.title} (ID: ${course.id})`);

    // Delete S3 file if exists
    if (course.s3FileKey) {
      try {
        console.log(`\n🗑️  Deleting S3 file: ${course.s3FileKey}`);
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: course.s3FileKey,
        });
        await s3Client.send(deleteCommand);
        console.log('✅ S3 file deleted');
      } catch (error) {
        console.log('⚠️  S3 file may not exist:', error.message);
      }
    }

    // Delete related records
    console.log('\n🗑️  Deleting database records...');

    // Delete lessons
    for (const module of course.modules) {
      await prisma.courseLesson.deleteMany({
        where: { moduleId: module.id },
      });
    }
    console.log(`✅ Deleted ${course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons`);

    // Delete modules
    await prisma.courseModule.deleteMany({
      where: { courseId: course.id },
    });
    console.log(`✅ Deleted ${course.modules.length} modules`);

    // Delete reviews and their users
    for (const review of course.reviews) {
      await prisma.courseReview.delete({
        where: { id: review.id },
      });
      // Delete seed review users (emails starting with seed-)
      const user = await prisma.user.findUnique({
        where: { id: review.userId },
      });
      if (user && user.email.startsWith('seed-')) {
        await prisma.user.delete({
          where: { id: user.id },
        });
      }
    }
    console.log(`✅ Deleted ${course.reviews.length} reviews`);

    // Delete purchases
    await prisma.purchase.deleteMany({
      where: { courseId: course.id },
    });
    console.log(`✅ Deleted ${course.purchases.length} purchases`);

    // Delete downloads
    await prisma.download.deleteMany({
      where: { courseId: course.id },
    });

    // Finally, delete the course
    await prisma.course.delete({
      where: { id: course.id },
    });
    console.log('✅ Course deleted');

    console.log('\n✅ Test course deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting test course:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestCourse();
