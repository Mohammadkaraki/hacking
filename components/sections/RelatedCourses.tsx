'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Course } from '@/types';
import Badge from '@/components/ui/Badge';
import { calculateDiscount } from '@/lib/utils/courseUtils';

interface RelatedCoursesProps {
  courses: Course[];
  title?: string;
}

export default function RelatedCourses({ courses, title = 'You May Also Like' }: RelatedCoursesProps) {
  const router = useRouter();

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Continue your learning journey with these hand-picked courses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course, index) => {
            const discount = calculateDiscount(course.price, course.originalPrice);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => router.push(`/courses/${course.id}`)}
                className="bg-card-bg border border-card-border rounded-xl overflow-hidden cursor-pointer hover:border-accent-cyan/50 transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={course.difficulty.toLowerCase() as any}>
                      {course.difficulty}
                    </Badge>
                  </div>

                  {discount > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-accent-red text-white text-xs font-bold rounded">
                      -{discount}%
                    </div>
                  )}

                  {/* Featured Badge */}
                  {course.featured && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-accent-cyan/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent-cyan transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {course.lessons} lessons
                    </span>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {course.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-4 border-t border-card-border">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-accent-cyan">
                        ${course.price.toFixed(2)}
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-text-secondary line-through">
                          ${course.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-accent-cyan font-semibold group-hover:underline">
                      Learn More →
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
