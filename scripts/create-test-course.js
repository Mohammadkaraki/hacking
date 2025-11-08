const { PrismaClient } = require('@prisma/client');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const prisma = new PrismaClient();

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createTestZipFile() {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(__dirname, 'test-course.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✅ Created test ZIP file: ${archive.pointer()} bytes`);
      resolve(zipPath);
    });

    archive.on('error', (err) => reject(err));
    archive.pipe(output);

    // Add dummy files to the ZIP
    archive.append('# Web Application Security Course\n\nWelcome to the course!', {
      name: 'README.md'
    });
    archive.append('console.log("Hello, hacker!");', {
      name: 'lesson1.js'
    });
    archive.append('<h1>SQL Injection Tutorial</h1>', {
      name: 'lesson2.html'
    });
    archive.append('def exploit():\n    print("Pentesting...")', {
      name: 'lesson3.py'
    });

    archive.finalize();
  });
}

async function uploadToS3(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const timestamp = Date.now();
  const s3Key = `courses/${timestamp}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: 'application/zip',
  });

  await s3Client.send(command);
  console.log(`✅ Uploaded to S3: ${s3Key}`);

  return {
    s3Key,
    fileSize: fileContent.length,
  };
}

async function createTestCourse() {
  try {
    console.log('🚀 Creating test course...\n');

    // Step 1: Create test ZIP file
    console.log('📦 Step 1: Creating test ZIP file...');
    const zipPath = await createTestZipFile();

    // Step 2: Upload to S3
    console.log('\n☁️  Step 2: Uploading to S3...');
    const { s3Key, fileSize } = await uploadToS3(zipPath);

    // Step 3: Create course in database
    console.log('\n💾 Step 3: Creating course in database...');
    const course = await prisma.course.create({
      data: {
        title: 'Advanced Web Application Security & Penetration Testing',
        description: 'Master the art of ethical hacking and web application security. This comprehensive course covers everything from basic vulnerabilities to advanced exploitation techniques. Learn to identify, exploit, and fix security flaws in modern web applications.',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
        difficulty: 'Advanced',
        duration: '40 hours',
        lessons: 156,
        price: 199.99,
        originalPrice: 399.99,
        category: 'Web Security',
        instructor: 'Dr. Alex Morgan',
        rating: 4.8,
        students: 3750,
        featured: true,

        // Arrays
        prerequisites: [
          'Basic understanding of HTTP/HTTPS protocols',
          'Familiarity with web technologies (HTML, CSS, JavaScript)',
          'Basic Linux command line knowledge',
          'Understanding of networking fundamentals',
          'Programming experience in at least one language'
        ],
        whatYouLearn: [
          'Identify and exploit SQL injection vulnerabilities',
          'Master Cross-Site Scripting (XSS) attacks and prevention',
          'Understand and exploit CSRF vulnerabilities',
          'Perform authentication and session hijacking',
          'Use Burp Suite for professional penetration testing',
          'Conduct comprehensive security audits',
          'Write detailed penetration testing reports',
          'Implement secure coding practices'
        ],
        highlights: [
          '40+ hours of hands-on video content',
          '150+ real-world labs and exercises',
          'OWASP Top 10 comprehensive coverage',
          'Burp Suite Pro walkthrough',
          'Bug bounty hunting techniques',
          'Capture The Flag (CTF) challenges',
          'Certificate of completion',
          'Lifetime access to course materials'
        ],
        targetAudience: [
          'Security professionals looking to specialize in web app security',
          'Penetration testers wanting to enhance their skills',
          'Developers interested in secure coding practices',
          'Bug bounty hunters seeking systematic methodology',
          'IT professionals transitioning to cybersecurity',
          'Computer science students with security focus'
        ],
        instructorCredentials: [
          'Ph.D. in Computer Security',
          '15+ years in cybersecurity industry',
          'OSCP, OSWE, CEH certified',
          'Former security consultant at Fortune 500 companies',
          'Published researcher in web security',
          'Active bug bounty hunter ($100K+ earnings)'
        ],

        // Media
        videoPreviewUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        instructorBio: 'Dr. Alex Morgan is a renowned cybersecurity expert with over 15 years of experience in penetration testing and secure software development. He has helped numerous Fortune 500 companies secure their web applications and has discovered critical vulnerabilities in major platforms. Alex holds advanced certifications including OSCP, OSWE, and CEH, and has published multiple research papers on web application security.',
        instructorAvatar: 'https://i.pravatar.cc/300?img=33',
        totalVideoHours: 42.5,

        // S3 File info
        s3BucketName: process.env.AWS_S3_BUCKET_NAME,
        s3FileKey: s3Key,
        fileSize: BigInt(fileSize),
        fileType: 'application/zip',

        lastContentUpdate: new Date(),
        active: true,
      },
    });

    console.log(`✅ Course created: ${course.id} - ${course.title}\n`);

    // Step 4: Create curriculum modules
    console.log('📚 Step 4: Creating curriculum modules...');

    const module1 = await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: 'Introduction to Web Application Security',
        description: 'Understand the fundamentals of web security and the hacker mindset',
        order: 1,
        duration: '4 hours',
      },
    });

    await prisma.courseLesson.createMany({
      data: [
        { moduleId: module1.id, title: 'Welcome to the Course', duration: '5:30', order: 1, isFree: true },
        { moduleId: module1.id, title: 'Setting Up Your Lab Environment', duration: '15:45', order: 2, isFree: true },
        { moduleId: module1.id, title: 'Understanding the OWASP Top 10', duration: '22:10', order: 3, isFree: false },
        { moduleId: module1.id, title: 'HTTP Protocol Deep Dive', duration: '28:30', order: 4, isFree: false },
        { moduleId: module1.id, title: 'Installing Burp Suite Professional', duration: '18:20', order: 5, isFree: false },
      ],
    });

    const module2 = await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: 'SQL Injection Attacks',
        description: 'Master database exploitation techniques',
        order: 2,
        duration: '8 hours',
      },
    });

    await prisma.courseLesson.createMany({
      data: [
        { moduleId: module2.id, title: 'Introduction to SQL Injection', duration: '12:15', order: 1, isFree: false },
        { moduleId: module2.id, title: 'Union-Based SQL Injection', duration: '25:40', order: 2, isFree: false },
        { moduleId: module2.id, title: 'Blind SQL Injection Techniques', duration: '32:20', order: 3, isFree: false },
        { moduleId: module2.id, title: 'Time-Based SQL Injection', duration: '28:15', order: 4, isFree: false },
        { moduleId: module2.id, title: 'SQLMap Tool Mastery', duration: '35:50', order: 5, isFree: false },
        { moduleId: module2.id, title: 'Bypassing WAF Protection', duration: '42:30', order: 6, isFree: false },
      ],
    });

    const module3 = await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: 'Cross-Site Scripting (XSS)',
        description: 'Learn to find and exploit XSS vulnerabilities',
        order: 3,
        duration: '6 hours',
      },
    });

    await prisma.courseLesson.createMany({
      data: [
        { moduleId: module3.id, title: 'Understanding XSS Attacks', duration: '15:20', order: 1, isFree: false },
        { moduleId: module3.id, title: 'Reflected XSS Exploitation', duration: '22:45', order: 2, isFree: false },
        { moduleId: module3.id, title: 'Stored XSS Attacks', duration: '28:10', order: 3, isFree: false },
        { moduleId: module3.id, title: 'DOM-Based XSS', duration: '32:35', order: 4, isFree: false },
        { moduleId: module3.id, title: 'XSS Filter Bypass Techniques', duration: '38:20', order: 5, isFree: false },
      ],
    });

    console.log('✅ Created 3 modules with lessons\n');

    // Step 5: Create FAQs
    console.log('❓ Step 5: Creating FAQs...');
    await prisma.course.update({
      where: { id: course.id },
      data: {
        faqs: [
          {
            question: 'Do I need prior hacking experience?',
            answer: 'While prior experience is helpful, this course starts with fundamentals and gradually builds up to advanced topics. Basic understanding of web technologies and networking is recommended.'
          },
          {
            question: 'Will I get access to Burp Suite Pro?',
            answer: 'The course covers Burp Suite extensively. While we demonstrate Pro features, you can follow along with the free Community Edition. Pro version is recommended but not required.'
          },
          {
            question: 'Is this course legal?',
            answer: 'Yes! This course teaches ethical hacking for defensive purposes. All labs are conducted in controlled environments. We emphasize legal and responsible disclosure practices.'
          },
          {
            question: 'How long do I have access to the course?',
            answer: 'You get lifetime access to the course materials, including all future updates. Learn at your own pace with no time restrictions.'
          },
          {
            question: 'Do you provide a certificate?',
            answer: 'Yes, upon completion of all modules and passing the final assessment, you will receive a certificate of completion that you can add to your LinkedIn profile.'
          }
        ],
      },
    });
    console.log('✅ Created 5 FAQs\n');

    // Step 6: Create seed reviews
    console.log('⭐ Step 6: Creating seed reviews...');

    const reviewer1 = await prisma.user.create({
      data: {
        email: `seed-sarah-johnson-${Date.now()}@reviews.local`,
        name: 'Sarah Johnson',
        image: 'https://i.pravatar.cc/150?img=5',
      },
    });

    await prisma.courseReview.create({
      data: {
        courseId: course.id,
        userId: reviewer1.id,
        rating: 5,
        review: 'This course is absolutely phenomenal! Dr. Morgan explains complex security concepts in a way that is easy to understand. The hands-on labs are incredibly valuable and the real-world examples make everything click. Worth every penny!',
      },
    });

    const reviewer2 = await prisma.user.create({
      data: {
        email: `seed-michael-chen-${Date.now()}@reviews.local`,
        name: 'Michael Chen',
        image: 'https://i.pravatar.cc/150?img=12',
      },
    });

    await prisma.courseReview.create({
      data: {
        courseId: course.id,
        userId: reviewer2.id,
        rating: 5,
        review: 'As a developer, this course opened my eyes to so many vulnerabilities I was unknowingly creating. The secure coding practices section alone was worth the investment. Highly recommended for developers and security professionals alike.',
      },
    });

    const reviewer3 = await prisma.user.create({
      data: {
        email: `seed-emily-rodriguez-${Date.now()}@reviews.local`,
        name: 'Emily Rodriguez',
        image: 'https://i.pravatar.cc/150?img=9',
      },
    });

    await prisma.courseReview.create({
      data: {
        courseId: course.id,
        userId: reviewer3.id,
        rating: 4.5,
        review: 'Excellent course with comprehensive content. The Burp Suite tutorials are top-notch. My only minor complaint is that some videos could be a bit shorter, but the quality of instruction is superb.',
      },
    });

    const reviewer4 = await prisma.user.create({
      data: {
        email: `seed-david-kumar-${Date.now()}@reviews.local`,
        name: 'David Kumar',
        image: 'https://i.pravatar.cc/150?img=15',
      },
    });

    await prisma.courseReview.create({
      data: {
        courseId: course.id,
        userId: reviewer4.id,
        rating: 5,
        review: 'I have taken several security courses, and this is by far the most practical and well-structured. Dr. Morgan\'s industry experience really shows. The bug bounty techniques section helped me land my first bounty within a month!',
      },
    });

    console.log('✅ Created 4 seed reviews\n');

    // Step 7: Update course rating based on reviews
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: course.id },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.course.update({
      where: { id: course.id },
      data: { rating: avgRating },
    });

    console.log(`✅ Updated course rating to ${avgRating.toFixed(1)}\n`);

    // Clean up temp ZIP file
    fs.unlinkSync(zipPath);
    console.log('🧹 Cleaned up temporary files\n');

    console.log('=' .repeat(60));
    console.log('✅ SUCCESS! Test course created successfully!');
    console.log('=' .repeat(60));
    console.log(`Course ID: ${course.id}`);
    console.log(`Course Title: ${course.title}`);
    console.log(`Students: ${course.students}`);
    console.log(`Rating: ${course.rating.toFixed(1)}`);
    console.log(`S3 File: ${s3Key}`);
    console.log(`File Size: ${(fileSize / 1024).toFixed(2)} KB`);
    console.log(`\nView course at: http://localhost:3000/courses/${course.id}`);
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error creating test course:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestCourse();
