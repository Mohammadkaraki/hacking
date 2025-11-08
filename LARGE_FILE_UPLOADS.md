# 📦 Large File Upload Guide

## Overview

Your admin system now supports uploading **very large course files** (10GB+) using intelligent upload strategies.

---

## 🚀 What's Supported

### File Size Limits

| Size Range | Upload Method | Performance |
|------------|---------------|-------------|
| **< 100MB** | Simple upload | Fast, single request |
| **100MB - 5GB** | Multipart upload (10MB chunks) | Reliable, resumable |
| **5GB+** | Needs config adjustment | See below |

### Current Configuration

**Next.js Body Size Limit**: `5GB` (configured in `next.config.js`)
**S3 Multipart Threshold**: `100MB`
**Chunk Size**: `10MB` per part

---

## 🔧 How It Works

### Automatic Upload Strategy Selection

The system **automatically** chooses the best upload method:

```typescript
// lib/s3.ts

// Small files (< 100MB) → Simple upload
if (fileSize < 100MB) {
  → Single PutObjectCommand to S3
  → Fast and efficient
}

// Large files (≥ 100MB) → Multipart upload
else {
  → Split into 10MB chunks
  → Upload each chunk separately
  → Combine chunks on S3
  → More reliable for large files
}
```

### Multipart Upload Process

```
1. Initiate Multipart Upload
   ↓
2. Split file into 10MB chunks
   ↓
3. Upload chunk 1/500 (0.2%)
   Upload chunk 2/500 (0.4%)
   ...
   Upload chunk 500/500 (100%)
   ↓
4. Complete multipart upload
   → S3 combines all chunks into final file
   ↓
5. Done! File ready for download
```

**Benefits:**
- ✅ **Reliable** - If one chunk fails, retry only that chunk
- ✅ **Progress tracking** - See upload percentage
- ✅ **Memory efficient** - Uploads in small pieces
- ✅ **Automatic cleanup** - Aborts on failure

---

## 📊 Upload Performance Estimates

**Assuming 10 Mbps upload speed:**

| File Size | Chunks | Upload Time |
|-----------|--------|-------------|
| 100 MB | 10 | ~1.5 minutes |
| 500 MB | 50 | ~7 minutes |
| 1 GB | 100 | ~15 minutes |
| 2 GB | 200 | ~30 minutes |
| 5 GB | 500 | ~1.2 hours |
| 10 GB | 1000 | ~2.5 hours |

*Note: Actual times vary based on your internet speed and server location*

---

## 🎯 Best Practices for Large Files

### 1. Compress Your Course Files

**Before uploading:**
```bash
# Create compressed archive
zip -9 course-content.zip videos/ labs/ slides/

# Or use 7-Zip for better compression
7z a -t7z -m0=lzma2 -mx=9 course-content.7z videos/ labs/ slides/
```

**Compression ratios (typical):**
- Videos (already compressed): ~5-10% reduction
- PDFs: ~10-20% reduction
- Images: ~20-40% reduction
- Text/code files: ~70-80% reduction

### 2. Split Very Large Courses

If your course is **> 10GB**, consider splitting into multiple files:

```
Course Structure:
├── Part 1: Introduction (2GB)
├── Part 2: Advanced Topics (3GB)
├── Part 3: Hands-on Labs (4GB)
└── Part 4: Bonus Content (2GB)
```

**Benefits:**
- Faster uploads
- Users can download parts separately
- Better for slow connections

### 3. Use Efficient Video Encoding

For video-heavy courses:

```bash
# Compress video with ffmpeg (H.264, good quality)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# For even smaller files (H.265/HEVC)
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium -c:a aac -b:a 128k output.mp4
```

**Typical reductions:**
- 1080p video: 50-70% smaller with minimal quality loss
- 4K video: 60-80% smaller

---

## ⚙️ Configuration for Files > 5GB

If you need to upload files **larger than 5GB**, update your configuration:

### Step 1: Update Next.js Config

Edit `next.config.js`:

```javascript
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10gb', // Change from 5gb to 10gb (or higher)
    },
  },
};
```

### Step 2: Increase Server Timeout

For very large uploads, you may need to increase timeout:

**Option A: Vercel (if deploying)**
- Vercel Pro/Enterprise: 60 second timeout
- For larger files, use direct S3 upload (see alternative below)

**Option B: Self-hosted (Node.js)**
Create `server.js` with custom timeout:
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  })
    .setTimeout(3600000) // 1 hour timeout
    .listen(3000);
});
```

---

## 🔄 Alternative: Client-Side Direct Upload to S3

For **extremely large files** (10GB+), consider client-side upload directly to S3:

### Benefits
- ✅ Bypasses Next.js server (no body size limit)
- ✅ Faster (direct browser → S3)
- ✅ No server bandwidth usage
- ✅ Better for Vercel/serverless

### Implementation Overview

```typescript
// 1. Admin requests presigned upload URL from your API
POST /api/admin/courses/presigned-upload
→ Returns: { uploadUrl, key }

// 2. Frontend uploads directly to S3
fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});

// 3. After upload, create course record
POST /api/admin/courses
{ title, description, s3FileKey: key, ... }
```

**Would you like me to implement this for you?** It's the best solution for 10GB+ files.

---

## 🛠️ Monitoring Upload Progress

### Server-Side Logs

When uploading, check your server console:

```
Using multipart upload for courses/1736189022-advanced-hacking.zip (2500.00 MB)
Splitting into 250 parts (10MB each)
Multipart upload initiated: abc123xyz...
Uploaded part 1/250 (0.4%)
Uploaded part 2/250 (0.8%)
...
Uploaded part 250/250 (100.0%)
Multipart upload completed: courses/1736189022-advanced-hacking.zip
```

### Frontend Progress (Future Enhancement)

Currently, the upload appears as "Creating Course..." in the UI. To show real progress, we'd need:
- WebSocket connection
- Server progress updates
- Frontend progress bar

**Would you like me to add this?**

---

## 💡 Recommendations

### For Typical Courses (< 2GB)
✅ **Use current setup** - Works perfectly out of the box
✅ Compress your files with ZIP
✅ Upload through admin dashboard

### For Large Courses (2-5GB)
✅ **Current setup works** - Multipart upload handles it
⚠️ Be patient - May take 30min - 1 hour
✅ Monitor server console for progress

### For Very Large Courses (5-10GB)
⚠️ **Increase config** to 10GB limit
✅ Use strong compression
✅ Consider splitting into parts
⚠️ Upload during off-peak hours

### For Huge Courses (10GB+)
🚀 **Use direct S3 upload** (client-side)
✅ Split into multiple parts
✅ Use streaming video hosting instead (Vimeo, Wistia)
✅ Consider alternative delivery methods

---

## 🐛 Troubleshooting

### "Request Entity Too Large" (413 Error)
→ Increase `bodySizeLimit` in `next.config.js`

### Upload Stuck/Frozen
→ Check server console for errors
→ Restart Next.js dev server
→ Verify AWS credentials are correct

### "Multipart upload failed"
→ Check AWS S3 permissions (need multipart upload rights)
→ Verify bucket exists and is accessible
→ Check server logs for specific error

### Upload Takes Too Long
→ Compress files before uploading
→ Split large courses into parts
→ Consider direct S3 upload method

### Memory Issues
→ Restart Next.js server
→ Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=8192 npm run dev`

---

## 📝 AWS S3 Requirements

### Required IAM Permissions

Your AWS credentials need these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",           // Simple upload
        "s3:GetObject",           // Download/presigned URLs
        "s3:DeleteObject",        // Delete old files
        "s3:CreateMultipartUpload",  // Multipart upload
        "s3:UploadPart",             // Upload chunks
        "s3:CompleteMultipartUpload", // Finalize upload
        "s3:AbortMultipartUpload",   // Cleanup failed uploads
        "s3:ListMultipartUploadParts" // Optional: monitoring
      ],
      "Resource": "arn:aws:s3:::cyberacademy-courses-bucket/*"
    }
  ]
}
```

### S3 Bucket Configuration

**Lifecycle Policy** (recommended):
Clean up incomplete multipart uploads after 7 days

```json
{
  "Rules": [
    {
      "Id": "CleanupIncompleteUploads",
      "Status": "Enabled",
      "AbortIncompleteMultipartUpload": {
        "DaysAfterInitiation": 7
      }
    }
  ]
}
```

---

## 🎉 Summary

Your system now supports:

✅ **Automatic upload strategy** (simple vs multipart)
✅ **Files up to 5GB** (configurable to 10GB+)
✅ **Chunked uploads** (10MB chunks)
✅ **Progress logging** (console output)
✅ **Error handling** (automatic cleanup)
✅ **Production-ready** (reliable and tested)

For files over 10GB, consider implementing **direct S3 client-side upload** - let me know if you want this!
