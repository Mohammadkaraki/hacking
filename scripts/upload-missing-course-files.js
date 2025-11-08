require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createCourseZipFile(courseName) {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(__dirname, `${courseName}-temp.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`   ✅ Created ZIP file: ${archive.pointer()} bytes`);
      resolve(zipPath);
    });

    archive.on('error', (err) => reject(err));
    archive.pipe(output);

    // Add course content files
    archive.append(`# ${courseName}\n\nWelcome to ${courseName}!\n\nThis is your complete course package.`, {
      name: 'README.md'
    });
    archive.append(`# Course Overview\n\n## What You'll Learn\n\nComplete ${courseName} materials.`, {
      name: 'Course-Overview.md'
    });
    archive.append('console.log("Course materials loaded!");', {
      name: 'scripts/start.js'
    });
    archive.append('<h1>Course Materials</h1><p>Access your lessons here.</p>', {
      name: 'lessons/index.html'
    });
    archive.append('def main():\n    print("Welcome to the course!")\n\nif __name__ == "__main__":\n    main()', {
      name: 'tools/course.py'
    });

    archive.finalize();
  });
}

async function fileExistsInS3(key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

async function uploadToS3(filePath, s3Key) {
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: 'application/zip',
  });

  await s3Client.send(command);
  console.log(`   ✅ Uploaded to S3: ${s3Key}`);

  return {
    s3Key,
    fileSize: fileContent.length,
  };
}

async function uploadMissingCourseFiles() {
  try {
    console.log('\n🚀 Uploading files for courses without S3 files...\n');

    // Get all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        s3FileKey: true,
        s3BucketName: true,
      },
    });

    console.log(`📚 Found ${courses.length} courses\n`);

    let uploadedCount = 0;
    let skippedCount = 0;

    for (const course of courses) {
      console.log(`\n📖 Processing: ${course.title}`);
      console.log(`   ID: ${course.id}`);

      // Check if course has an S3 key
      if (!course.s3FileKey) {
        console.log('   ⚠️  No S3 key - creating new file...');

        // Create new S3 key
        const timestamp = Date.now();
        const cleanTitle = course.title
          .replace(/[^a-zA-Z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase()
          .substring(0, 50);
        const newS3Key = `courses/${timestamp}-${cleanTitle}.zip`;

        // Create ZIP file
        const zipPath = await createCourseZipFile(course.title);

        // Upload to S3
        const { fileSize } = await uploadToS3(zipPath, newS3Key);

        // Update database
        await prisma.course.update({
          where: { id: course.id },
          data: {
            s3BucketName: process.env.AWS_S3_BUCKET_NAME,
            s3FileKey: newS3Key,
            fileSize: BigInt(fileSize),
            fileType: 'application/zip',
          },
        });

        console.log(`   ✅ Updated database with new S3 key`);

        // Clean up temp file
        fs.unlinkSync(zipPath);

        uploadedCount++;
      } else {
        // Check if file exists in S3
        const exists = await fileExistsInS3(course.s3FileKey);

        if (!exists) {
          console.log(`   ⚠️  S3 key exists but file missing: ${course.s3FileKey}`);
          console.log('   📦 Creating and uploading new file...');

          // Create ZIP file
          const zipPath = await createCourseZipFile(course.title);

          // Upload with existing S3 key
          const { fileSize } = await uploadToS3(zipPath, course.s3FileKey);

          // Update file size in database
          await prisma.course.update({
            where: { id: course.id },
            data: {
              fileSize: BigInt(fileSize),
              fileType: 'application/zip',
            },
          });

          console.log(`   ✅ File uploaded to existing S3 key`);

          // Clean up temp file
          fs.unlinkSync(zipPath);

          uploadedCount++;
        } else {
          console.log(`   ✅ File already exists in S3`);
          skippedCount++;
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! Course files upload complete!');
    console.log('='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   - Total courses: ${courses.length}`);
    console.log(`   - Files uploaded: ${uploadedCount}`);
    console.log(`   - Files skipped (already exist): ${skippedCount}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error uploading course files:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

uploadMissingCourseFiles();
