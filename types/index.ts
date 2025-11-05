export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  lessons: number;
  students?: number; // Optional - calculated from purchases
  price: number;
  originalPrice: number;
  category: string;
  locked?: boolean;
  prerequisites?: string[];
  whatYouLearn?: string[];
  instructor: string;
  rating: number;
  featured?: boolean;
  active?: boolean;

  // Sale/Discount fields
  saleActive?: boolean;
  saleStartDate?: Date | string;
  saleEndDate?: Date | string;
  discountPercentage?: number;

  // Rich content
  videoPreviewUrl?: string;
  highlights?: string[];
  targetAudience?: string[];
  faqs?: Array<{ question: string; answer: string }>;

  // Instructor details
  instructorBio?: string;
  instructorAvatar?: string;
  instructorCredentials?: string[];

  // Additional metadata
  lastContentUpdate?: Date | string;
  totalVideoHours?: number;

  // AWS S3 file information
  s3BucketName?: string;
  s3FileKey?: string;
  fileSize?: number;
  fileType?: string;

  // Related data
  modules?: CourseModule[];
  reviews?: CourseReview[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  stripePaymentIntentId: string;
  stripeSessionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  purchaseDate: Date;
  updatedAt: Date;
  course?: Course;
}

export interface Download {
  id: string;
  userId: string;
  courseId: string;
  downloadUrl: string;
  expiresAt: Date;
  downloaded: boolean;
  downloadedAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  course?: Course;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  courseCount: number;
  description: string;
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  achievement: string;
  quote: string;
  avatar: string;
  beforeRole?: string;
  afterRole?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}

export interface LearningPathNode {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  courses: number;
  description: string;
}

export interface StatCounter {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

// Course Module interface
export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  duration: string;
  lessons?: CourseLesson[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Course Lesson interface
export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  order: number;
  isFree: boolean;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Course Review interface
export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number; // 1-5
  review: string;
  helpful: number;
  user?: {
    id: string;
    name?: string;
    image?: string;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Sale Status interface
export interface SaleStatus {
  isActive: boolean;
  timeRemaining?: number; // milliseconds
  discountPercentage?: number;
  endsAt?: Date;
}

// Countdown Time interface
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
