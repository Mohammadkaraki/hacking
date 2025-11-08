require('dotenv').config();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function listS3Files() {
  try {
    console.log('\n📦 S3 Bucket Contents\n');
    console.log(`Bucket: ${process.env.AWS_S3_BUCKET_NAME}\n`);

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: 'courses/',
    });

    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      console.log('❌ No files found in S3 bucket under courses/ folder');
      return;
    }

    console.log(`Found ${response.Contents.length} file(s):\n`);

    response.Contents.forEach((file, index) => {
      const sizeKB = (file.Size / 1024).toFixed(2);
      const date = file.LastModified?.toLocaleString() || 'Unknown';
      console.log(`${index + 1}. ${file.Key}`);
      console.log(`   Size: ${sizeKB} KB`);
      console.log(`   Modified: ${date}\n`);
    });
  } catch (error) {
    console.error('❌ Error listing S3 files:', error.message);
  }
}

listS3Files();
