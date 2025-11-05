'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import SaleBanner from '@/components/sections/SaleBanner';
import CourseCurriculum from '@/components/sections/CourseCurriculum';
import CourseReviews from '@/components/sections/CourseReviews';
import InstructorCard from '@/components/sections/InstructorCard';
import RelatedCourses from '@/components/sections/RelatedCourses';
import FAQSection from '@/components/sections/FAQSection';
import GlowButton from '@/components/ui/GlowButton';
import Badge from '@/components/ui/Badge';
import CountdownTimer from '@/components/ui/CountdownTimer';
import TrustBadges from '@/components/ui/TrustBadges';
import CourseStats from '@/components/ui/CourseStats';
import { Course, Purchase, SaleStatus } from '@/types';
import { calculateSaleStatus, calculateDiscount } from '@/lib/utils/courseUtils';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [saleStatus, setSaleStatus] = useState<SaleStatus>({ isActive: false });

  useEffect(() => {
    fetchCourseData();
  }, [params.id, session]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseRes = await fetch(`/api/courses/${params.id}`);
      const courseData = await courseRes.json();
      setCourse(courseData);

      // Calculate sale status
      const status = calculateSaleStatus(courseData);
      setSaleStatus(status);

      // Fetch related courses
      const relatedRes = await fetch(
        `/api/courses/related?courseId=${params.id}&category=${courseData.category}&limit=3`
      );
      const relatedData = await relatedRes.json();
      setRelatedCourses(relatedData);

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
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id }),
      });

      const { url } = await response.json();

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
  const discount = calculateDiscount(course.price, course.originalPrice);
  const currentPrice = saleStatus.isActive ? course.price : course.originalPrice;

  return (
    <div className="min-h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Sale Banner */}
      {saleStatus.isActive && <SaleBanner saleStatus={saleStatus} />}

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-bg-dark via-bg-dark/95 to-transparent py-12 border-b border-card-border">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Course Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                    <button onClick={() => router.push('/')} className="hover:text-accent-cyan">
                      Home
                    </button>
                    <span>/</span>
                    <button onClick={() => router.push('/')} className="hover:text-accent-cyan">
                      Courses
                    </button>
                    <span>/</span>
                    <span>{course.category}</span>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mb-4">
                    <Badge variant={course.difficulty.toLowerCase() as any}>
                      {course.difficulty}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
                    {course.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-text-secondary mb-6">{course.description}</p>

                  {/* Stats */}
                  <CourseStats
                    rating={course.rating}
                    students={course.students || 0}
                    lastUpdated={course.lastContentUpdate || course.updatedAt}
                  />
                </motion.div>
              </div>

              {/* Right Column - Preview Card (Desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <PreviewCard
                    course={course}
                    hasPurchased={hasPurchased}
                    saleStatus={saleStatus}
                    discount={discount}
                    purchasing={purchasing}
                    onPurchase={handlePurchase}
                    onGoToDashboard={() => router.push('/dashboard')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content Column */}
              <div className="lg:col-span-2">
                {/* Course Image/Video */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-card-border group">
                    {course.videoPreviewUrl ? (
                      <video
                        controls
                        poster={course.thumbnail}
                        className="w-full h-full object-cover"
                      >
                        <source src={course.videoPreviewUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <>
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!hasPurchased && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center">
                              <svg
                                className="w-20 h-20 mx-auto mb-4 text-accent-cyan"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-2xl font-bold mb-2">Course Locked</p>
                              <p className="text-text-secondary">Purchase to unlock full content</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Content Tabs */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 border-b border-card-border mb-6">
                    {['overview', 'curriculum', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-3 font-semibold capitalize relative transition-colors ${
                          activeTab === tab ? 'text-accent-cyan' : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* What You'll Learn */}
                      {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                        <div className="bg-card-bg border border-card-border rounded-xl p-6">
                          <h2 className="text-2xl font-heading font-bold mb-6">What You'll Learn</h2>
                          <ul className="grid md:grid-cols-2 gap-4">
                            {course.whatYouLearn.map((item, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <svg
                                  className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-0.5"
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

                      {/* Prerequisites */}
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="bg-card-bg border border-card-border rounded-xl p-6">
                          <h2 className="text-2xl font-heading font-bold mb-4">Prerequisites</h2>
                          <ul className="space-y-3">
                            {course.prerequisites.map((prereq, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0" />
                                <span className="text-text-secondary">{prereq}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Target Audience */}
                      {course.targetAudience && course.targetAudience.length > 0 && (
                        <div className="bg-card-bg border border-card-border rounded-xl p-6">
                          <h2 className="text-2xl font-heading font-bold mb-4">Who is this course for?</h2>
                          <ul className="space-y-3">
                            {course.targetAudience.map((audience, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <svg
                                  className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5"
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
                                <span className="text-text-secondary">{audience}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Instructor */}
                      <InstructorCard
                        name={course.instructor}
                        bio={course.instructorBio}
                        avatar={course.instructorAvatar}
                        credentials={course.instructorCredentials}
                        rating={course.rating}
                        students={course.students}
                      />

                      {/* FAQ */}
                      {course.faqs && Array.isArray(course.faqs) && course.faqs.length > 0 && (
                        <div>
                          <h2 className="text-2xl font-heading font-bold mb-6">
                            Frequently Asked Questions
                          </h2>
                          <FAQSection faqs={course.faqs} />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'curriculum' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="text-2xl font-heading font-bold mb-6">Course Curriculum</h2>
                      <CourseCurriculum
                        modules={course.modules || []}
                        isPurchased={hasPurchased}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="text-2xl font-heading font-bold mb-6">Student Reviews</h2>
                      <CourseReviews reviews={course.reviews || []} />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Sidebar (Desktop) */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="space-y-6">
                  {/* Additional course info or ads can go here */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <RelatedCourses courses={relatedCourses} title="You May Also Like" />
        )}

        {/* Mobile Preview Card */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card-bg border-t-2 border-accent-cyan p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-accent-cyan">
                  ${currentPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="text-sm text-text-secondary line-through">
                    ${course.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {saleStatus.isActive && saleStatus.endsAt && (
                <p className="text-xs text-accent-red">Sale ends soon!</p>
              )}
            </div>
            <GlowButton
              onClick={hasPurchased ? () => router.push('/dashboard') : handlePurchase}
              disabled={purchasing}
            >
              {hasPurchased ? 'Go to Dashboard' : purchasing ? 'Processing...' : 'Buy Now'}
            </GlowButton>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Separate Preview Card Component for reusability
function PreviewCard({
  course,
  hasPurchased,
  saleStatus,
  discount,
  purchasing,
  onPurchase,
  onGoToDashboard,
}: {
  course: Course;
  hasPurchased: boolean;
  saleStatus: SaleStatus;
  discount: number;
  purchasing: boolean;
  onPurchase: () => void;
  onGoToDashboard: () => void;
}) {
  const currentPrice = saleStatus.isActive ? course.price : course.originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card-bg border-2 border-card-border rounded-xl p-6 space-y-6 shadow-xl shadow-black/20"
    >
      {!hasPurchased ? (
        <>
          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl font-bold text-accent-cyan">
                ${currentPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-xl text-text-secondary line-through">
                  ${course.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <div className="inline-block px-3 py-1 bg-accent-red text-white text-sm font-bold rounded">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          {saleStatus.isActive && saleStatus.endsAt && (
            <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-4">
              <p className="text-center text-sm font-semibold text-accent-red mb-3">
                ⏰ Sale Ends In:
              </p>
              <CountdownTimer endDate={saleStatus.endsAt} variant="small" showLabels={true} />
            </div>
          )}

          {/* Purchase Button */}
          <GlowButton
            fullWidth
            size="lg"
            onClick={onPurchase}
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
              '🔒 Buy Now'
            )}
          </GlowButton>

          <div className="text-center text-xs text-text-secondary">
            30-day money-back guarantee
          </div>

          {/* Course Includes */}
          <div className="pt-6 border-t border-card-border">
            <h3 className="font-semibold mb-4">This course includes:</h3>
            <TrustBadges />
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-accent-green"
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
          <h3 className="text-xl font-bold mb-2">✅ Course Purchased!</h3>
          <p className="text-text-secondary mb-6">
            You have full access to this course
          </p>
          <GlowButton fullWidth onClick={onGoToDashboard}>
            Go to Dashboard
          </GlowButton>
        </div>
      )}
    </motion.div>
  );
}
