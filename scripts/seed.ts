import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.download.deleteMany({});
  await prisma.purchase.deleteMany({});
  await prisma.courseReview.deleteMany({});
  await prisma.courseLesson.deleteMany({});
  await prisma.courseModule.deleteMany({});
  await prisma.course.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create sample courses with enhanced data
  const coursesData = [
    {
      title: 'Complete Ethical Hacking Bootcamp',
      description: 'Learn penetration testing from scratch with hands-on labs covering web, network, and wireless security.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
      difficulty: 'Beginner',
      duration: '40 hours',
      lessons: 280,
      price: 49.99,
      originalPrice: 199.99,
      category: 'Ethical Hacking',
      instructor: 'Alex Morgan',
      rating: 4.8,
      featured: true,
      active: true,

      // Sale data - ACTIVE SALE!
      saleActive: true,
      saleStartDate: new Date(),
      saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      discountPercentage: 75,

      // Rich content
      videoPreviewUrl: 'https://sample-videos.com/video123/preview.mp4',
      highlights: [
        'Industry-recognized certification preparation',
        'Real-world penetration testing scenarios',
        'Lifetime access to course materials',
        '24/7 instructor support'
      ],
      targetAudience: [
        'IT professionals looking to break into cybersecurity',
        'Students pursuing security certifications (CEH, OSCP)',
        'Network administrators wanting to understand vulnerabilities',
        'Anyone interested in ethical hacking careers'
      ],
      faqs: [
        {
          question: 'Do I need prior programming experience?',
          answer: 'No! This course is designed for beginners. We start from the basics and gradually build up your skills. Basic computer knowledge is all you need.'
        },
        {
          question: 'Will I get a certificate upon completion?',
          answer: 'Yes, you will receive a certificate of completion that you can add to your resume and LinkedIn profile.'
        },
        {
          question: 'How long do I have access to the course?',
          answer: 'You get lifetime access to all course materials, including future updates and new content additions.'
        },
        {
          question: 'Is this course updated for 2025?',
          answer: 'Absolutely! This course is regularly updated with the latest tools, techniques, and security trends.'
        }
      ],

      // Instructor details
      instructorBio: 'Alex Morgan is a certified ethical hacker (CEH) and penetration tester with over 10 years of experience in cybersecurity. He has worked with Fortune 500 companies and government agencies to secure their infrastructure. Alex is passionate about teaching and has helped over 50,000 students launch their cybersecurity careers.',
      instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070',
      instructorCredentials: ['CEH', 'OSCP', 'CISSP', 'CompTIA Security+'],

      lastContentUpdate: new Date('2025-01-15'),
      totalVideoHours: 40,

      prerequisites: ['Basic computer knowledge', 'Internet fundamentals'],
      whatYouLearn: [
        'Penetration testing fundamentals',
        'Network security and protocols',
        'Web application hacking',
        'Wireless security testing',
        'Social engineering techniques',
        'Writing professional pentest reports'
      ],
      s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
      s3FileKey: 'courses/ethical-hacking-bootcamp.zip',
      fileSize: BigInt(2048000000),
      fileType: 'zip',
    },
    {
      title: 'Advanced Penetration Testing with Kali Linux',
      description: 'Master advanced exploitation techniques, privilege escalation, and post-exploitation strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070',
      difficulty: 'Advanced',
      duration: '35 hours',
      lessons: 195,
      price: 79.99,
      originalPrice: 249.99,
      category: 'Penetration Testing',
      instructor: 'Sarah Chen',
      rating: 4.9,
      featured: true,
      active: true,

      // No active sale
      saleActive: false,

      highlights: [
        'Advanced exploitation frameworks',
        'Real penetration testing labs',
        'OSCP exam preparation',
        'Industry expert instruction'
      ],
      targetAudience: [
        'Security professionals with basic pentesting knowledge',
        'OSCP certification candidates',
        'Advanced ethical hackers',
        'Red team members'
      ],
      faqs: [
        {
          question: 'What prerequisites do I need?',
          answer: 'You should have completed a beginner ethical hacking course and be comfortable with Linux command line and basic networking concepts.'
        },
        {
          question: 'Does this prepare me for OSCP?',
          answer: 'Yes! This course is specifically designed to prepare you for the OSCP certification exam with similar labs and challenges.'
        }
      ],

      instructorBio: 'Sarah Chen is an OSCP-certified penetration tester and security researcher. She has discovered multiple zero-day vulnerabilities and regularly contributes to open-source security tools. Sarah has trained security teams at major tech companies worldwide.',
      instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070',
      instructorCredentials: ['OSCP', 'OSCE', 'GPEN', 'GXPN'],

      lastContentUpdate: new Date('2025-01-10'),
      totalVideoHours: 35,

      prerequisites: ['Basic Linux', 'Networking fundamentals', 'Previous hacking experience'],
      whatYouLearn: [
        'Advanced Metasploit Framework',
        'Buffer overflow exploitation',
        'Privilege escalation techniques',
        'Active Directory attacks',
        'Post-exploitation and persistence',
        'Custom exploit development'
      ],
      s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
      s3FileKey: 'courses/advanced-pentesting.zip',
      fileSize: BigInt(3145728000),
      fileType: 'zip',
    },
    {
      title: 'Web Application Security & OWASP Top 10',
      description: 'Identify and exploit web vulnerabilities including SQL injection, XSS, CSRF, and authentication flaws.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070',
      difficulty: 'Intermediate',
      duration: '28 hours',
      lessons: 156,
      price: 59.99,
      originalPrice: 179.99,
      category: 'Web Security',
      instructor: 'David Kumar',
      rating: 4.7,
      featured: true,
      active: true,

      // Sale data - Flash sale ending soon!
      saleActive: true,
      saleStartDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Started 2 days ago
      saleEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Ends in 2 days
      discountPercentage: 67,

      highlights: [
        'OWASP Top 10 2024 coverage',
        'Bug bounty hunting techniques',
        'Real-world vulnerable applications',
        'Web security certification prep'
      ],
      targetAudience: [
        'Web developers wanting to code securely',
        'Bug bounty hunters',
        'Application security testers',
        'DevSecOps engineers'
      ],
      faqs: [
        {
          question: 'Do I need to know how to code?',
          answer: 'Basic understanding of HTML, JavaScript, and how web applications work is recommended but not required. We explain concepts as we go.'
        },
        {
          question: 'Can I use this for bug bounties?',
          answer: 'Absolutely! Many of our students have found their first bugs using techniques from this course.'
        }
      ],

      instructorBio: 'David Kumar is a web application security expert and bug bounty hunter. He has found critical vulnerabilities in major platforms and earned over $500K in bug bounties. David specializes in training developers to build secure applications.',
      instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070',
      instructorCredentials: ['GWEB', 'OSWE', 'CEH'],

      lastContentUpdate: new Date('2025-01-20'),
      totalVideoHours: 28,

      prerequisites: ['Basic web development', 'HTTP protocol knowledge'],
      whatYouLearn: [
        'OWASP Top 10 vulnerabilities',
        'SQL injection techniques',
        'Cross-Site Scripting (XSS)',
        'CSRF and SSRF attacks',
        'Authentication bypass methods',
        'Secure coding practices'
      ],
      s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
      s3FileKey: 'courses/web-security-owasp.zip',
      fileSize: BigInt(1572864000),
      fileType: 'zip',
    },
    {
      title: 'Network Security & Firewall Configuration',
      description: 'Secure networks with proper firewall rules, IDS/IPS setup, and traffic analysis techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034',
      difficulty: 'Intermediate',
      duration: '32 hours',
      lessons: 178,
      price: 54.99,
      originalPrice: 189.99,
      category: 'Network Security',
      instructor: 'Michael Torres',
      rating: 4.6,
      featured: false,
      active: true,

      saleActive: false,

      highlights: [
        'Hands-on firewall configuration',
        'Real network security scenarios',
        'IDS/IPS deployment',
        'Network defense strategies'
      ],
      targetAudience: [
        'Network administrators',
        'System administrators',
        'Security engineers',
        'IT managers'
      ],
      faqs: [
        {
          question: 'What tools will we use?',
          answer: 'We cover industry-standard tools like pfSense, Snort, Suricata, Wireshark, and enterprise firewalls.'
        }
      ],

      instructorBio: 'Michael Torres is a network security architect with 15 years of experience designing and securing enterprise networks. He holds multiple networking and security certifications and has worked with global corporations.',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070',
      instructorCredentials: ['CCNP Security', 'CISSP', 'GCIA'],

      lastContentUpdate: new Date('2024-12-15'),
      totalVideoHours: 32,

      prerequisites: ['Networking basics', 'TCP/IP understanding'],
      whatYouLearn: [
        'Firewall configuration and management',
        'IDS/IPS implementation',
        'VPN setup and security',
        'Network traffic analysis',
        'DDoS mitigation strategies',
        'Network segmentation'
      ],
      s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
      s3FileKey: 'courses/network-security.zip',
      fileSize: BigInt(1835008000),
      fileType: 'zip',
    },
    {
      title: 'Digital Forensics & Incident Response',
      description: 'Learn how to investigate cyber crimes, analyze malware, and respond to security incidents effectively.',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070',
      difficulty: 'Advanced',
      duration: '45 hours',
      lessons: 215,
      price: 89.99,
      originalPrice: 299.99,
      category: 'Digital Forensics',
      instructor: 'Emily Watson',
      rating: 4.9,
      featured: true,
      active: true,

      saleActive: false,

      highlights: [
        'Professional forensics tools',
        'Malware analysis labs',
        'Incident response playbooks',
        'Expert witness training'
      ],
      targetAudience: [
        'Incident response team members',
        'SOC analysts',
        'Law enforcement',
        'Forensics investigators'
      ],
      faqs: [
        {
          question: 'Is this course suitable for law enforcement?',
          answer: 'Yes! This course covers chain of custody, legal considerations, and techniques used by law enforcement agencies.'
        },
        {
          question: 'What forensics tools will I learn?',
          answer: 'You will learn industry-standard tools like EnCase, FTK, Volatility, Autopsy, and more.'
        }
      ],

      instructorBio: 'Emily Watson is a digital forensics expert and certified incident responder with experience in both private sector and law enforcement. She has testified as an expert witness in numerous cybercrime cases and leads the incident response team at a Fortune 100 company.',
      instructorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071',
      instructorCredentials: ['GCFE', 'GCFA', 'EnCE', 'CHFI'],

      lastContentUpdate: new Date('2025-01-05'),
      totalVideoHours: 45,

      prerequisites: ['Operating systems', 'File systems knowledge', 'Basic programming'],
      whatYouLearn: [
        'Digital evidence collection',
        'Memory forensics analysis',
        'Malware reverse engineering',
        'Incident response procedures',
        'Log analysis and correlation',
        'Expert witness testimony'
      ],
      s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
      s3FileKey: 'courses/digital-forensics.zip',
      fileSize: BigInt(4194304000),
      fileType: 'zip',
    },
  ];

  const createdCourses = [];

  for (const courseData of coursesData) {
    const course = await prisma.course.create({
      data: courseData as any,
    });
    createdCourses.push(course);
    console.log(`✅ Created course: ${course.title}`);
  }

  // Add modules and lessons to the first course (Ethical Hacking Bootcamp)
  console.log('\n📚 Adding curriculum to courses...');

  const ethicalHackingCourse = createdCourses[0];

  const modules = [
    {
      title: 'Introduction to Ethical Hacking',
      description: 'Get started with the fundamentals of ethical hacking, legal considerations, and setting up your lab environment.',
      order: 1,
      duration: '4 hours',
      lessons: [
        { title: 'Welcome to the Course', duration: '10 min', order: 1, isFree: true },
        { title: 'What is Ethical Hacking?', duration: '15 min', order: 2, isFree: true },
        { title: 'Legal and Ethical Considerations', duration: '20 min', order: 3, isFree: true },
        { title: 'Setting Up Your Lab', duration: '45 min', order: 4, isFree: false },
        { title: 'Installing Kali Linux', duration: '30 min', order: 5, isFree: false },
        { title: 'Essential Tools Overview', duration: '40 min', order: 6, isFree: false },
      ],
    },
    {
      title: 'Reconnaissance & Information Gathering',
      description: 'Learn passive and active reconnaissance techniques to gather information about your targets.',
      order: 2,
      duration: '6 hours',
      lessons: [
        { title: 'Passive Reconnaissance Techniques', duration: '35 min', order: 1, isFree: false },
        { title: 'OSINT Tools and Resources', duration: '40 min', order: 2, isFree: false },
        { title: 'Active Reconnaissance with Nmap', duration: '50 min', order: 3, isFree: false },
        { title: 'DNS Enumeration', duration: '30 min', order: 4, isFree: false },
        { title: 'Subdomain Discovery', duration: '25 min', order: 5, isFree: false },
        { title: 'Google Dorking Mastery', duration: '45 min', order: 6, isFree: false },
      ],
    },
    {
      title: 'Network Scanning & Enumeration',
      description: 'Master network scanning tools and techniques to identify live hosts, open ports, and running services.',
      order: 3,
      duration: '8 hours',
      lessons: [
        { title: 'Understanding Network Protocols', duration: '30 min', order: 1, isFree: false },
        { title: 'Advanced Nmap Techniques', duration: '60 min', order: 2, isFree: false },
        { title: 'Service Version Detection', duration: '35 min', order: 3, isFree: false },
        { title: 'Vulnerability Scanning with Nessus', duration: '55 min', order: 4, isFree: false },
        { title: 'SMB Enumeration', duration: '40 min', order: 5, isFree: false },
        { title: 'SNMP Enumeration', duration: '30 min', order: 6, isFree: false },
      ],
    },
    {
      title: 'Web Application Hacking',
      description: 'Exploit common web vulnerabilities and learn how to secure web applications.',
      order: 4,
      duration: '10 hours',
      lessons: [
        { title: 'Web Application Architecture', duration: '25 min', order: 1, isFree: false },
        { title: 'SQL Injection Attacks', duration: '70 min', order: 2, isFree: false },
        { title: 'Cross-Site Scripting (XSS)', duration: '60 min', order: 3, isFree: false },
        { title: 'CSRF Attacks', duration: '40 min', order: 4, isFree: false },
        { title: 'File Upload Vulnerabilities', duration: '50 min', order: 5, isFree: false },
        { title: 'Authentication Bypass', duration: '55 min', order: 6, isFree: false },
      ],
    },
    {
      title: 'Wireless Network Hacking',
      description: 'Crack WiFi passwords and secure wireless networks using modern attack techniques.',
      order: 5,
      duration: '7 hours',
      lessons: [
        { title: 'Wireless Security Basics', duration: '20 min', order: 1, isFree: false },
        { title: 'WPA/WPA2 Attacks', duration: '60 min', order: 2, isFree: false },
        { title: 'Evil Twin Attacks', duration: '45 min', order: 3, isFree: false },
        { title: 'WPS Attacks', duration: '35 min', order: 4, isFree: false },
        { title: 'Post-Connection Attacks', duration: '50 min', order: 5, isFree: false },
      ],
    },
    {
      title: 'Social Engineering & Phishing',
      description: 'Understand psychological manipulation techniques and create convincing phishing campaigns.',
      order: 6,
      duration: '5 hours',
      lessons: [
        { title: 'Psychology of Social Engineering', duration: '30 min', order: 1, isFree: false },
        { title: 'Phishing Campaign Setup', duration: '50 min', order: 2, isFree: false },
        { title: 'Credential Harvesting', duration: '40 min', order: 3, isFree: false },
        { title: 'Pretexting and Vishing', duration: '35 min', order: 4, isFree: false },
      ],
    },
  ];

  for (const moduleData of modules) {
    const { lessons, ...moduleInfo } = moduleData;
    const createdModule = await prisma.courseModule.create({
      data: {
        ...moduleInfo,
        courseId: ethicalHackingCourse.id,
      },
    });

    for (const lessonData of lessons) {
      await prisma.courseLesson.create({
        data: {
          ...lessonData,
          moduleId: createdModule.id,
        },
      });
    }
    console.log(`  ✅ Added module: ${moduleInfo.title} with ${lessons.length} lessons`);
  }

  // Add reviews for courses
  console.log('\n⭐ Adding student reviews...');

  // Create demo users for reviews
  const reviewUser1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Davis',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080',
    },
  });

  const reviewUser2 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Thompson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2080',
    },
  });

  const reviewUser3 = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      email: 'mike@example.com',
      name: 'Mike Johnson',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070',
    },
  });

  const reviewUser4 = await prisma.user.upsert({
    where: { email: 'emma@example.com' },
    update: {},
    create: {
      email: 'emma@example.com',
      name: 'Emma Wilson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070',
    },
  });

  const reviewUser5 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      name: 'Alex Martinez',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070',
    },
  });

  const reviews = [
    {
      courseId: createdCourses[0].id,
      userId: reviewUser1.id,
      rating: 5,
      review: 'This course completely changed my career! The hands-on labs are incredibly practical and Alex explains complex concepts in a way that\'s easy to understand. I landed my first pentesting job within 3 months of completing this course. Highly recommended!',
      helpful: 42,
    },
    {
      courseId: createdCourses[0].id,
      userId: reviewUser2.id,
      rating: 4.5,
      review: 'Excellent course for beginners. The content is well-structured and builds up progressively. My only suggestion would be to add more advanced Active Directory attack techniques, but overall fantastic value for money.',
      helpful: 28,
    },
    {
      courseId: createdCourses[1].id,
      userId: reviewUser3.id,
      rating: 5,
      review: 'Sarah is an amazing instructor! This course prepared me perfectly for my OSCP exam. The buffer overflow section alone is worth the price. Passed OSCP on my first try thanks to this course.',
      helpful: 67,
    },
    {
      courseId: createdCourses[2].id,
      userId: reviewUser4.id,
      rating: 4.5,
      review: 'Great coverage of OWASP Top 10. I found my first bug bounty worth $500 using techniques from this course. The labs are realistic and the vulnerable applications are perfect for practice.',
      helpful: 35,
    },
    {
      courseId: createdCourses[2].id,
      userId: reviewUser5.id,
      rating: 5,
      review: 'As a developer, this course opened my eyes to so many vulnerabilities I was unknowingly creating. Now I write much more secure code. Essential for any web developer!',
      helpful: 19,
    },
  ];

  for (const review of reviews) {
    await prisma.courseReview.create({
      data: review,
    });
  }
  console.log(`✅ Added ${reviews.length} student reviews`);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${createdCourses.length} courses created`);
  console.log(`   - ${modules.length} modules added to "${ethicalHackingCourse.title}"`);
  console.log(`   - ${reviews.length} reviews added`);
  console.log(`   - ${createdCourses.filter(c => c.saleActive).length} courses on sale right now! 🔥`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
