# 🚀 Admin Dashboard - Quick Start

## Step 1: Make Yourself Admin (One-Time Setup)

Run this command with your email:
```bash
node scripts/make-admin.js your-email@example.com
```

Example:
```bash
node scripts/make-admin.js admin@cyberacademy.com
```

✅ You'll see: "User is now an admin!"

---

## Step 2: Access Admin Dashboard

1. Go to: **http://localhost:3000/admin**
2. You should see the admin dashboard

---

## Step 3: Create Your First Course

### Quick Form Guide

**Click "Create New Course"** and fill in:

#### ✅ Required Fields
- **Title**: "Advanced Web Hacking"
- **Description**: Full description of the course
- **Category**: Select from dropdown (Web Security, Ethical Hacking, etc.)
- **Difficulty**: Beginner/Intermediate/Advanced/Expert
- **Duration**: "20 hours"
- **Lessons**: 45
- **Price**: 99.99
- **Original Price**: 199.99
- **Instructor**: "John Doe"
- **Thumbnail URL**: "https://images.unsplash.com/photo-..."

#### 📋 Optional but Recommended
- **What You'll Learn**: Comma-separated (e.g., "Exploit SQL injection, Bypass WAFs, Exploit XSS")
- **Prerequisites**: "Basic networking, Linux experience"
- **Course File**: Upload ZIP file (up to 100MB supported)

#### 💡 Tips
- Use comma-separated values for arrays (Prerequisites, What You'll Learn, etc.)
- Featured checkbox → Shows on homepage
- File upload → Automatically uploads to S3

---

## Step 4: Edit/Delete Courses

From `/admin`:
- **Edit**: Click "Edit" → Modify fields → Save
- **Delete**: Click "Delete" → Confirm (⚠️ Cannot be undone!)

---

## 🎯 Admin URLs

| Page | URL |
|------|-----|
| Admin Dashboard | `/admin` |
| Create Course | `/admin/courses/new` |
| Edit Course | `/admin/courses/edit/[courseId]` |

---

## 📊 What You'll See

### Dashboard Stats
- Total Courses
- Active Courses
- Featured Courses
- Total Students (purchase count)

### Course Table
- Title, Category, Price
- Student count
- File size
- Status (Active/Inactive)
- Actions (Edit/Delete)

---

## 🔐 Security

Only users with `role = "admin"` can:
- Access `/admin` pages
- Call `/api/admin/*` endpoints
- Upload files to S3
- Delete courses

Regular users get **403 Forbidden**.

---

## ⚡ Quick Commands

```bash
# Make user admin
node scripts/make-admin.js user@example.com

# Start dev server
npm run dev

# Open Prisma Studio (view/edit database)
npx prisma studio

# Run migrations
npx prisma migrate dev
```

---

## 🐛 Common Issues

**"Access denied"**
→ Run `node scripts/make-admin.js your-email@example.com`

**File upload fails**
→ Check `.env` for AWS credentials:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`

**File too large**
→ Increase limit in `next.config.js` (currently 100MB)

---

## 📝 Example Course Creation

```
Title: "Advanced Penetration Testing"
Description: "Master advanced pentest techniques used by professional hackers..."
Category: "Penetration Testing"
Difficulty: "Advanced"
Duration: "30 hours"
Lessons: 60
Price: 149.99
Original Price: 299.99
Instructor: "Jane Smith"
Thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"

What You'll Learn (comma-separated):
Advanced network exploitation,
Windows privilege escalation,
Active Directory attacks,
Custom exploit development

Prerequisites:
OSCP certification or equivalent,
Strong Python skills,
Linux command line experience

Featured: ✅ (checked)

File: advanced-pentest-2024.zip (2.5 GB)
```

**Submit** → Course created! Appears on homepage (if featured).

---

## 🎉 That's It!

You're ready to manage courses. See `ADMIN_SETUP.md` for full documentation.
