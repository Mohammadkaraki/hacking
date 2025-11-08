import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Upload file to S3 with automatic multipart upload for large files
 * Uses simple upload for files < 100MB, multipart for larger files
 */
export const uploadToS3 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
  const fileSize = file.length;

  // Threshold for multipart upload (100MB)
  const MULTIPART_THRESHOLD = 100 * 1024 * 1024;

  // For files smaller than 100MB, use simple upload
  if (fileSize < MULTIPART_THRESHOLD) {
    console.log(`Using simple upload for ${key} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return key;
  }

  // For files >= 100MB, use multipart upload
  console.log(`Using multipart upload for ${key} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
  return await uploadLargeFileToS3(file, key, contentType, bucketName);
};

/**
 * Multipart upload for large files (> 100MB)
 * Splits file into 10MB chunks for better reliability
 */
async function uploadLargeFileToS3(
  file: Buffer,
  key: string,
  contentType: string,
  bucketName: string
): Promise<string> {
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
  const fileSize = file.length;
  const numParts = Math.ceil(fileSize / CHUNK_SIZE);

  console.log(`Splitting ${key} into ${numParts} parts (${(CHUNK_SIZE / 1024 / 1024).toFixed(0)}MB each)`);

  // Step 1: Initiate multipart upload
  const createCommand = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const { UploadId } = await s3Client.send(createCommand);

  if (!UploadId) {
    throw new Error('Failed to initiate multipart upload');
  }

  console.log(`Multipart upload initiated: ${UploadId}`);

  try {
    const uploadedParts = [];

    // Step 2: Upload each part
    for (let partNumber = 1; partNumber <= numParts; partNumber++) {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, fileSize);
      const chunk = file.slice(start, end);

      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucketName,
        Key: key,
        PartNumber: partNumber,
        UploadId,
        Body: chunk,
      });

      const { ETag } = await s3Client.send(uploadPartCommand);

      uploadedParts.push({
        ETag,
        PartNumber: partNumber,
      });

      // Log progress
      const progress = ((partNumber / numParts) * 100).toFixed(1);
      console.log(`Uploaded part ${partNumber}/${numParts} (${progress}%)`);
    }

    // Step 3: Complete multipart upload
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId,
      MultipartUpload: {
        Parts: uploadedParts,
      },
    });

    await s3Client.send(completeCommand);
    console.log(`Multipart upload completed: ${key}`);

    return key;
  } catch (error) {
    // If upload fails, abort multipart upload to avoid orphaned parts
    console.error('Multipart upload failed, aborting:', error);

    try {
      const abortCommand = new AbortMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId,
      });
      await s3Client.send(abortCommand);
      console.log('Multipart upload aborted successfully');
    } catch (abortError) {
      console.error('Failed to abort multipart upload:', abortError);
    }

    throw error;
  }
}

export const generateDownloadUrl = async (
  key: string,
  expiresIn: number = 3600, // Default 1 hour in seconds
  filename?: string // Optional filename for download
): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

  // Extract filename from key if not provided
  const downloadFilename = filename || key.split('/').pop() || 'download';

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${downloadFilename}"`, // Force download
    ResponseContentType: 'application/octet-stream', // Force as binary file
  });

  // Generate pre-signed URL that expires
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
};

/**
 * Upload image to S3 (thumbnails, instructor avatars)
 * Organized in separate folders: thumbnails/, instructors/
 */
export const uploadImageToS3 = async (
  file: Buffer,
  folder: 'thumbnails' | 'instructors',
  fileName: string,
  contentType: string
): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${timestamp}-${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // Cache images for 1 year
  });

  await s3Client.send(command);
  console.log(`Image uploaded to S3: ${key}`);

  // Return public URL
  return `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
};

export { s3Client };
