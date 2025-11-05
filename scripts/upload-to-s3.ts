import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

interface CourseFile {
  courseId: string;
  filePath: string;
}

/**
 * Upload a file to S3 and update the course record
 */
async function uploadCourseFile(courseFile: CourseFile) {
  const { courseId, filePath } = courseFile;

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  // Get file stats
  const fileStats = fs.statSync(filePath);
  const fileSize = BigInt(fileStats.size);
  const fileExtension = path.extname(filePath);
  const fileName = path.basename(filePath);

  // Determine file type
  const fileTypeMap: { [key: string]: string } = {
    '.zip': 'application/zip',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.rar': 'application/x-rar-compressed',
    '.7z': 'application/x-7z-compressed',
  };
  const fileType = fileTypeMap[fileExtension.toLowerCase()] || 'application/octet-stream';

  // S3 key (path in bucket)
  const s3FileKey = `courses/${courseId}/${fileName}`;

  try {
    console.log(`📤 Uploading ${fileName} to S3...`);

    // Read file
    const fileContent = fs.readFileSync(filePath);

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3FileKey,
      Body: fileContent,
      ContentType: fileType,
      Metadata: {
        courseId: courseId,
        originalFileName: fileName,
      },
    });

    await s3Client.send(uploadCommand);
    console.log(`✅ Uploaded to S3: ${s3FileKey}`);

    // Update course in database
    await prisma.course.update({
      where: { id: courseId },
      data: {
        s3BucketName: bucketName,
        s3FileKey: s3FileKey,
        fileSize: fileSize,
        fileType: fileType,
      },
    });

    console.log(`✅ Updated course ${courseId} in database`);
    console.log(`   - File size: ${(Number(fileSize) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - File type: ${fileType}`);
    console.log('');
  } catch (error) {
    console.error(`❌ Error uploading file for course ${courseId}:`, error);
  }
}

/**
 * Main function to upload multiple course files
 */
async function main() {
  console.log('🚀 Starting S3 upload process...\n');

  // Define your course files here
  const courseFiles: CourseFile[] = [
    {
      courseId: 'cmhf332nr0000vd9sn8o7kcyl',
      filePath: 'C:\\Users\\zfkas\\Desktop\\mohammad\\NextJs\\hacking\\CourseFiles\\ethical-hacking.zip',
    },
    {
      courseId: 'cmhf332ns0001vd9sinbzht3f',
      filePath: 'C:\\Users\\zfkas\\Desktop\\mohammad\\NextJs\\hacking\\CourseFiles\\pentesting.zip',
    },
    {
      courseId: 'cmhf332nt0002vd9sbeshgnl3',
      filePath: 'C:\\Users\\zfkas\\Desktop\\mohammad\\NextJs\\hacking\\CourseFiles\\web-security.zip',
    },
    {
      courseId: 'cmhf332nu0003vd9sicxdulzr',
      filePath: 'C:\\Users\\zfkas\\Desktop\\mohammad\\NextJs\\hacking\\CourseFiles\\network-security.zip',
    },
    {
      courseId: 'cmhf332nu0004vd9s31i0zw5x',
      filePath: 'C:\\Users\\zfkas\\Desktop\\mohammad\\NextJs\\hacking\\CourseFiles\\forensics.zip',
    },
  ];

  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found in .env file!');
    process.exit(1);
  }

  if (!bucketName) {
    console.error('❌ AWS_S3_BUCKET_NAME not found in .env file!');
    process.exit(1);
  }

  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`🌍 Region: ${process.env.AWS_REGION}\n`);

  // Get all courses from database
  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
  });

  console.log('📚 Available courses in database:');
  courses.forEach((course) => {
    console.log(`   - ${course.id}: ${course.title}`);
  });
  console.log('');

  // Upload files
  for (const courseFile of courseFiles) {
    await uploadCourseFile(courseFile);
  }

  console.log('✅ Upload process completed!');
  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
