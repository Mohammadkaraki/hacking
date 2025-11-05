# S3 Upload Guide

This guide explains how to upload your course files to AWS S3 using the automated script.

## Prerequisites

✅ AWS account created
✅ S3 bucket created
✅ IAM user with S3 permissions created
✅ AWS credentials added to `.env` file

## Step 1: Get Your Course IDs

First, run this command to see all courses in your database:

```bash
npm run db:studio
```

This will open Prisma Studio in your browser where you can see all course IDs.

Or run this to see course IDs in terminal:

```bash
npx prisma db seed
```

Your existing courses should have IDs like:
- `clxxxx1` - Complete Ethical Hacking Bootcamp
- `clxxxx2` - Advanced Penetration Testing
- etc.

## Step 2: Prepare Your Course Files

1. Put all your course files in a folder (e.g., `C:\CourseFiles\`)
2. Supported file types:
   - `.zip` - Compressed courses
   - `.pdf` - Course PDFs
   - `.mp4`, `.avi`, `.mov` - Video files
   - `.rar`, `.7z` - Other archives

Example structure:
```
C:\CourseFiles\
  ├── ethical-hacking-bootcamp.zip
  ├── penetration-testing-course.zip
  ├── web-security-course.zip
  └── ...
```

## Step 3: Edit the Upload Script

Open `scripts/upload-to-s3.ts` and find this section (around line 86):

```typescript
const courseFiles: CourseFile[] = [
  {
    courseId: 'clxxxx1', // Replace with actual course ID
    filePath: 'C:\\path\\to\\your\\course1.zip', // Replace with actual file path
  },
  {
    courseId: 'clxxxx2',
    filePath: 'C:\\path\\to\\your\\course2.zip',
  },
  // Add more courses as needed
];
```

Replace with your actual course IDs and file paths. For example:

```typescript
const courseFiles: CourseFile[] = [
  {
    courseId: 'clm1a2b3c4d5e6f7g8h9',
    filePath: 'C:\\CourseFiles\\ethical-hacking-bootcamp.zip',
  },
  {
    courseId: 'clm9h8g7f6e5d4c3b2a1',
    filePath: 'C:\\CourseFiles\\penetration-testing-course.zip',
  },
  {
    courseId: 'clm3c4d5e6f7g8h9i0j1',
    filePath: 'C:\\CourseFiles\\web-security-course.zip',
  },
];
```

**Note:** Use double backslashes (`\\`) in Windows paths!

## Step 4: Run the Upload Script

```bash
npm run s3:upload
```

The script will:
1. Check if AWS credentials are configured
2. List all available courses in your database
3. Upload each file to S3
4. Update the course records with:
   - S3 bucket name
   - S3 file key (path)
   - File size
   - File type

## Expected Output

```
🚀 Starting S3 upload process...

📦 Bucket: cyberacademy-courses-bucket
🌍 Region: us-east-1

📚 Available courses in database:
   - clm1a2b3c4d5e6f7g8h9: Complete Ethical Hacking Bootcamp
   - clm9h8g7f6e5d4c3b2a1: Advanced Penetration Testing
   - clm3c4d5e6f7g8h9i0j1: Web Application Security & OWASP Top 10

📤 Uploading ethical-hacking-bootcamp.zip to S3...
✅ Uploaded to S3: courses/clm1a2b3c4d5e6f7g8h9/ethical-hacking-bootcamp.zip
✅ Updated course clm1a2b3c4d5e6f7g8h9 in database
   - File size: 1024.50 MB
   - File type: application/zip

📤 Uploading penetration-testing-course.zip to S3...
✅ Uploaded to S3: courses/clm9h8g7f6e5d4c3b2a1/penetration-testing-course.zip
✅ Updated course clm9h8g7f6e5d4c3b2a1 in database
   - File size: 2048.75 MB
   - File type: application/zip

✅ Upload process completed!
```

## Troubleshooting

### Error: "File not found"
- Check your file path
- Make sure to use double backslashes (`\\`) on Windows
- Verify the file exists at that location

### Error: "AWS credentials not found"
- Check your `.env` file has:
  ```
  AWS_ACCESS_KEY_ID="AKIA..."
  AWS_SECRET_ACCESS_KEY="..."
  AWS_S3_BUCKET_NAME="..."
  AWS_REGION="us-east-1"
  ```

### Error: "Access Denied"
- Make sure your IAM user has `AmazonS3FullAccess` permission
- Check your bucket name is correct

### Error: "Course not found"
- Verify the course ID exists in your database
- Run `npm run db:studio` to see all course IDs

## Verify Upload

After uploading, verify in AWS Console:
1. Go to AWS S3 Console
2. Open your bucket (`cyberacademy-courses-bucket`)
3. You should see a `courses/` folder with subfolders for each course ID

## Next Steps

After successfully uploading all files, you can:
1. Start the development server: `npm run dev`
2. Test the complete flow:
   - Sign in with Google
   - Browse courses
   - Purchase a course with Stripe test card
   - Download the course file from your dashboard
