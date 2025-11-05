import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('📚 Courses in database:\n');

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      s3FileKey: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (courses.length === 0) {
    console.log('❌ No courses found. Run "npm run db:seed" first.');
    return;
  }

  courses.forEach((course, index) => {
    console.log(`${index + 1}. ${course.title}`);
    console.log(`   Course ID: ${course.id}`);
    console.log(`   S3 File: ${course.s3FileKey || 'Not uploaded yet'}`);
    console.log('');
  });

  console.log(`Total: ${courses.length} courses`);

  await prisma.$disconnect();
}

main().catch(console.error);
