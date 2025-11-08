# Admin Dashboard Setup Guide

## 🚀 What Was Built

A complete admin dashboard system for managing courses with:

1. ✅ **Role-based access control** - Added `role` field to User model
2. ✅ **Admin API routes** - Create, Read, Update, Delete courses
3. ✅ **File upload to S3** - Upload course files (ZIP/PDF) directly to AWS S3
4. ✅ **Admin dashboard UI** - View all courses with stats
5. ✅ **Course creation form** - Rich form for creating new courses
6. ✅ **Course editing** - Update existing courses and replace files

---

## 📋 Setup Instructions

### Step 1: Make a User an Admin

You need to manually set a user's role to "admin" in the database.

**Option A: Using Prisma Studio (Easiest)**
```bash
npx prisma studio
```
1. Navigate to the `User` table
2. Find your user account
3. Edit the `role` field from `"user"` to `"admin"`
4. Save changes

**Option B: Using SQL (PostgreSQL)**
```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE "User"
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

**Option C: Using Prisma Client Script**
```bash
node scripts/make-admin.js
```
(See script below)

---

### Step 2: Access the Admin Dashboard

1. Log in to your account (the one you made admin)
2. Navigate to: **http://localhost:3000/admin**
3. You should see the admin dashboard with all courses

---

## 🎯 Admin Features

### Admin Dashboard (`/admin`)
- **View all courses** (active and inactive)
- **Stats overview** (total courses, active, featured, students)
- **Quick actions** (Edit, Delete courses)
- **Create new course** button

### Create Course (`/admin/courses/new`)
- **Basic info**: Title, description, category, difficulty
- **Pricing**: Price, original price
- **Content**: What you'll learn, prerequisites, highlights
- **Instructor**: Name, bio, credentials, avatar
- **Media**: Thumbnail, preview video
- **File upload**: ZIP/PDF course files → Uploads to S3

### Edit Course (`/admin/courses/edit/[id]`)
- **Pre-filled form** with existing course data
- **Replace file**: Upload new file to replace existing S3 file
- **Toggle active/inactive**: Control course visibility
- **Toggle featured**: Feature courses on homepage

---

## 🔐 Security Features

### Admin Route Protection
All admin routes check:
1. ✅ User is authenticated
2. ✅ User has `role = "admin"`
3. ❌ Returns 401/403 if unauthorized

### File Upload Security
- Files are uploaded to private S3 bucket
- Only admins can upload files
- Files are accessible via presigned URLs (24hr expiry)
- Old files are automatically deleted when replaced

---

## 📁 File Structure

```
app/
├── admin/
│   ├── page.tsx                        # Admin dashboard (list courses)
│   └── courses/
│       ├── new/page.tsx                # Create course form
│       └── edit/[id]/page.tsx          # Edit course form
│
└── api/
    └── admin/
        └── courses/
            ├── route.ts                # GET (all), POST (create)
            └── [id]/route.ts           # GET (one), PUT (update), DELETE

lib/
└── adminAuth.ts                        # Admin middleware helper
```

---

## 🛠️ API Endpoints

### `GET /api/admin/courses`
- Lists all courses (including inactive)
- Requires admin role
- Returns courses with student count

### `POST /api/admin/courses`
- Creates new course
- Accepts `multipart/form-data` (for file upload)
- Uploads file to S3 and stores `s3FileKey` in database

### `GET /api/admin/courses/:id`
- Gets single course for editing
- Returns full course data

### `PUT /api/admin/courses/:id`
- Updates existing course
- Optionally replaces S3 file
- Deletes old file from S3 if new file uploaded

### `DELETE /api/admin/courses/:id`
- Deletes course from database
- Deletes S3 file
- Cascades to purchases, downloads, etc.

---

## 📝 Form Fields

### Required Fields
- Title
- Description
- Thumbnail URL
- Category
- Difficulty
- Duration
- Lessons (number)
- Price
- Original Price
- Instructor Name

### Optional Fields
- Course file (ZIP/PDF)
- What you'll learn (comma-separated)
- Prerequisites (comma-separated)
- Highlights (comma-separated)
- Target audience (comma-separated)
- Instructor bio
- Instructor credentials (comma-separated)
- Instructor avatar URL
- Video preview URL
- Featured (checkbox)
- Active (checkbox - edit only)

---

## 🎬 Complete Workflow

### Creating a Course

1. **Admin logs in** → Goes to `/admin`
2. **Clicks "Create New Course"** → Goes to `/admin/courses/new`
3. **Fills out form**:
   - Basic info (title, description, category, etc.)
   - Pricing ($99, original $199)
   - Learning outcomes (comma-separated)
   - Instructor details
   - Thumbnail URL
   - **Upload course file** (e.g., `advanced-hacking.zip` - 2.5 GB)
4. **Submits form**
5. **Backend**:
   - Validates admin role ✅
   - **Automatic upload strategy**:
     - Files < 100MB: Simple upload (fast)
     - Files ≥ 100MB: Multipart upload (10MB chunks, reliable)
   - Uploads file to S3: `courses/1736189022-advanced-hacking.zip`
   - Creates course in database with `s3FileKey`
6. **Redirects to `/admin`** → Course appears in list

**📦 Large File Support:**
- Supports files up to **5GB** (configurable to 10GB+)
- Automatic chunked upload for reliability
- See `LARGE_FILE_UPLOADS.md` for detailed guide

### User Downloads Course

1. User purchases course via Stripe
2. User goes to `/dashboard`
3. Clicks "Download Course"
4. Backend:
   - Verifies purchase ✅
   - Generates presigned S3 URL (expires 24hr)
   - Logs download in database
5. User downloads file directly from S3

---

## 🔧 Helper Script: Make Admin

Create `scripts/make-admin.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node scripts/make-admin.js <email>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    console.log(`✅ User ${user.email} is now an admin!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
```

**Usage**:
```bash
node scripts/make-admin.js your-email@example.com
```

---

## ⚠️ Important Notes

1. **Admin access is permanent** - There's no UI to demote admins (manually update DB)
2. **Large file uploads supported** - Up to 5GB (configurable to 10GB+). See `LARGE_FILE_UPLOADS.md` for:
   - Automatic multipart upload for files > 100MB
   - Best practices for compression
   - Direct S3 upload for 10GB+ files
3. **S3 costs** - Monitor S3 storage costs as course files accumulate
4. **No super admin** - All admins have equal privileges
5. **Cascade deletes** - Deleting a course deletes all purchases/downloads (be careful!)
6. **Upload progress** - Monitor server console logs for multipart upload progress

---

## 🚨 Troubleshooting

### "Access denied. Admin privileges required"
→ Make sure your user's `role` field is set to `"admin"` in the database

### File upload fails
→ Check AWS credentials in `.env`:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`
- `AWS_REGION`

### "Course not found" when editing
→ Course ID might be invalid or course was deleted

### File too large / Upload timeout
→ Current limit is 5GB. For larger files:

1. Update `next.config.js`:
```js
experimental: {
  serverActions: {
    bodySizeLimit: '10gb', // Increase as needed
  },
}
```

2. For files > 10GB, see `LARGE_FILE_UPLOADS.md` for:
   - Direct S3 client-side upload
   - Splitting courses into parts
   - Alternative delivery methods

---

## 🎉 You're All Set!

Your admin dashboard is now fully functional. You can:
- ✅ Create courses with file uploads
- ✅ Edit existing courses
- ✅ Delete courses
- ✅ View course statistics
- ✅ Manage course visibility (active/inactive, featured)

Happy course creation! 🚀
