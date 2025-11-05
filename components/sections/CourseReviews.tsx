'use client';

import { motion } from 'framer-motion';
import { CourseReview } from '@/types';
import { aggregateReviews, formatDate } from '@/lib/utils/courseUtils';

interface CourseReviewsProps {
  reviews: CourseReview[];
}

export default function CourseReviews({ reviews }: CourseReviewsProps) {
  const stats = aggregateReviews(reviews);

  const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-card-bg border border-card-border rounded-xl">
        <div className="w-16 h-16 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
        <p className="text-text-secondary">Be the first to review this course!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center border-r border-card-border pr-8">
            <div className="text-6xl font-bold text-accent-cyan mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(stats.averageRating)} size="lg" />
            <p className="mt-2 text-text-secondary">
              Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating] || 0;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{rating} star</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: rating * 0.1 }}
                      className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue"
                    />
                  </div>
                  <span className="text-sm text-text-secondary w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card-bg border border-card-border rounded-xl p-6 hover:border-accent-cyan/50 transition-colors"
          >
            {/* Reviewer Info */}
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {review.user?.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.name || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-accent-cyan"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-lg">
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              {/* Name and Rating */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
                    <p className="text-sm text-text-secondary">
                      {formatDate(review.createdAt || new Date())}
                    </p>
                  </div>
                  <StarRating rating={Math.round(review.rating)} size="sm" />
                </div>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-text-secondary leading-relaxed mb-4">{review.review}</p>

            {/* Helpful Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-card-border">
              <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-cyan transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                Helpful ({review.helpful})
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
