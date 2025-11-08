import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, adminErrorResponse } from '@/lib/adminAuth';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * POST /api/admin/upload/presigned-url
 * Generate presigned URL for direct client-side upload to S3
 * This bypasses the Next.js server for very large files (10GB+)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { fileName, fileType, fileSize } = await request.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: 'fileName, fileType, and fileSize are required' },
        { status: 400 }
      );
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

    // Generate unique S3 key
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `courses/${timestamp}-${sanitizedFileName}`;

    // Create presigned POST URL (allows direct upload from browser)
    // Valid for 1 hour, max file size 50GB
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucketName,
      Key: s3Key,
      Conditions: [
        ['content-length-range', 0, 50 * 1024 * 1024 * 1024], // Max 50GB
        ['eq', '$Content-Type', fileType],
      ],
      Fields: {
        'Content-Type': fileType,
      },
      Expires: 3600, // 1 hour
    });

    console.log(`Generated presigned upload URL for: ${s3Key}`);

    return NextResponse.json({
      uploadUrl: url,
      fields,
      s3Key,
      fileName: sanitizedFileName,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
