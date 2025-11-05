'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import { Course, Purchase } from '@/types';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [params.id, session]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseRes = await fetch(`/api/courses/${params.id}`);
      const courseData = await courseRes.json();
      setCourse(courseData);

      // Check if user has purchased this course
      if (session?.user) {
        const purchaseRes = await fetch(`/api/purchases/check/${params.id}`);
        if (purchaseRes.ok) {
          const purchaseData = await purchaseRes.json();
          setPurchase(purchaseData);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=/courses/${params.id}`);
      return;
    }

    setPurchasing(true);
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id }),
      });

      const { url } = await response.json();

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <GlowButton onClick={() => router.push('/')}>Back to Home</GlowButton>
        </div>
      </div>
    );
  }

  const hasPurchased = !!purchase;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Course Header */}
              <div>
                <div className="inline-block px-3 py-1 bg-accent-cyan/20 border border-accent-cyan/50 rounded-md text-accent-cyan text-sm font-mono mb-4">
                  {course.difficulty}
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-text-secondary">{course.description}</p>
              </div>

              {/* Course Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-card-border">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {!hasPurchased && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-accent-cyan"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xl font-semibold">Course Locked</p>
                      <p className="text-text-secondary">Purchase to unlock</p>
                    </div>
                  </div>
                )}
              </div>

              {/* What You'll Learn */}
              {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                <div className="bg-card-bg border border-card-border rounded-xl p-6">
                  <h2 className="text-2xl font-heading font-bold mb-4">
                    What You'll Learn
                  </h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Info */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6">
                <h2 className="text-2xl font-heading font-bold mb-4">
                  Course Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent-cyan"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Duration</div>
                      <div className="font-semibold">{course.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent-blue"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Lessons</div>
                      <div className="font-semibold">{course.lessons}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent-green"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Instructor</div>
                      <div className="font-semibold">{course.instructor}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-red/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent-red"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Rating</div>
                      <div className="font-semibold">{course.rating} / 5.0</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="bg-card-bg border border-card-border rounded-xl p-6">
                  <h2 className="text-2xl font-heading font-bold mb-4">
                    Prerequisites
                  </h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full" />
                        <span className="text-text-secondary">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-6">
                {!hasPurchased ? (
                  <>
                    {/* Pricing */}
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-4xl font-bold text-accent-cyan">
                          ${course.price}
                        </span>
                        <span className="text-xl text-text-secondary line-through">
                          ${course.originalPrice}
                        </span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-accent-green/20 text-accent-green text-sm font-semibold rounded">
                        {Math.round(
                          ((course.originalPrice - course.price) / course.originalPrice) * 100
                        )}
                        % OFF
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <GlowButton
                      fullWidth
                      size="lg"
                      onClick={handlePurchase}
                      disabled={purchasing}
                    >
                      {purchasing ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Processing...
                        </span>
                      ) : (
                        'Buy Now'
                      )}
                    </GlowButton>

                    {/* What's Included */}
                    <div className="pt-6 border-t border-card-border space-y-3">
                      <h3 className="font-semibold">This course includes:</h3>
                      <ul className="space-y-2">
                        {[
                          'Lifetime access',
                          'Downloadable resources',
                          'Certificate of completion',
                          '24/7 support',
                        ].map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                            <svg
                              className="w-4 h-4 text-accent-cyan"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Already Purchased */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-accent-green"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Course Purchased!</h3>
                      <p className="text-text-secondary mb-6">
                        You have full access to this course
                      </p>
                      <GlowButton
                        fullWidth
                        onClick={() => router.push('/dashboard')}
                      >
                        Go to Dashboard
                      </GlowButton>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
