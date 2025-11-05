import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const uploadToS3 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
};

export const generateDownloadUrl = async (
  key: string,
  expiresIn: number = 3600 // Default 1 hour in seconds
): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  // Generate pre-signed URL that expires
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
};

export { s3Client };
