const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCourses() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        s3FileKey: true,
        s3BucketName: true,
      },
    });

    console.log('\n=== Courses in Database ===\n');
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   S3 Key: ${course.s3FileKey || 'NO FILE'}`);
      console.log(`   Bucket: ${course.s3BucketName || 'N/A'}`);
      console.log('');
    });

    console.log(`Total courses: ${courses.length}\n`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourses();
