import { Course, SaleStatus, CountdownTime, CourseReview } from '@/types';

/**
 * Calculate if a course sale is currently active
 */
export function calculateSaleStatus(course: Course): SaleStatus {
  if (!course.saleActive || !course.saleStartDate || !course.saleEndDate) {
    return {
      isActive: false,
    };
  }

  const now = new Date();
  const startDate = new Date(course.saleStartDate);
  const endDate = new Date(course.saleEndDate);

  const isActive = now >= startDate && now <= endDate;

  if (!isActive) {
    return {
      isActive: false,
    };
  }

  const timeRemaining = endDate.getTime() - now.getTime();

  return {
    isActive: true,
    timeRemaining,
    discountPercentage: course.discountPercentage || calculateDiscount(course.price, course.originalPrice),
    endsAt: endDate,
  };
}

/**
 * Calculate discount percentage from prices
 */
export function calculateDiscount(currentPrice: number, originalPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Format time remaining into countdown object
 */
export function formatCountdown(milliseconds: number): CountdownTime {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}

/**
 * Aggregate review statistics
 */
export function aggregateReviews(reviews: CourseReview[]): {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
} {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    const rating = Math.floor(review.rating);
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating]++;
    }
  });

  return {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
    ratingDistribution,
  };
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date in readable format
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Get urgency message based on time remaining
 */
export function getUrgencyMessage(timeRemaining: number): string {
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));

  if (hours < 1) {
    return 'Ending in less than 1 hour!';
  } else if (hours < 24) {
    return `Only ${hours} hour${hours > 1 ? 's' : ''} left!`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  }
}

/**
 * Calculate total course duration from modules
 */
export function calculateTotalDuration(modules: any[]): string {
  // Simple implementation - can be enhanced based on actual duration format
  const totalMinutes = modules.reduce((sum, module) => {
    const lessons = module.lessons || [];
    return sum + lessons.length * 15; // Assuming 15 min average per lesson
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}
