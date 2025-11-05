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
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';
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
      const courseRes = await fetch(`/api/courses/${params.id}`);
      const courseData = await courseRes.json();
      setCourse(courseData);

      const status = calculateSaleStatus(courseData);
      setSaleStatus(status);

      const relatedRes = await fetch(
        `/api/courses/related?courseId=${params.id}&category=${courseData.category}&limit=3`
      );
      const relatedData = await relatedRes.json();
      setRelatedCourses(relatedData);

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
    // Allow guest checkout - no authentication required
    setPurchasing(true);
    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: params.id,
          // Include user email if logged in (optional)
          guestEmail: session?.user?.email || undefined
        }),
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
    <div className="min-h-screen relative bg-gradient-to-b from-bg-dark via-bg-dark/98 to-bg-dark">
      {/* Background Effects */}
      <MatrixRainBright />
      <GridPatternBright />
      <ParticleFieldBright />
      <CursorTrail />

      {/* Navbar - Always visible with proper z-index */}
      <Navbar />

      {/* Sale Banner - Below navbar but above content */}
      {saleStatus.isActive && (
        <div className="fixed top-20 left-0 right-0 z-40">
          <SaleBanner saleStatus={saleStatus} courseId={params.id} />
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 ${saleStatus.isActive ? 'pt-32' : 'pt-20'}`}>
        {/* Main Container with Consistent Grid */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - All Content (2/3) */}
            <div className="lg:col-span-2 space-y-8">

        {/* Hero Section - ENHANCED & OPTIMIZED FOR CONVERSION */}
        <div className="relative py-8 md:py-12">
          {/* Ambient background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -mx-4">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                    <button onClick={() => router.push('/')} className="hover:text-accent-cyan transition-colors">
                      Home
                    </button>
                    <span>/</span>
                    <button onClick={() => router.push('/')} className="hover:text-accent-cyan transition-colors">
                      Courses
                    </button>
                    <span>/</span>
                    <span>{course.category}</span>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mb-4 flex items-center gap-3">
                    <Badge variant={course.difficulty.toLowerCase() as any}>
                      {course.difficulty}
                    </Badge>
                    {saleStatus.isActive && saleStatus.discountPercentage && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-4 py-1.5 bg-gradient-to-r from-accent-red to-red-600 text-white text-sm font-bold rounded-full shadow-lg shadow-accent-red/30"
                      >
                        🔥 {saleStatus.discountPercentage}% OFF
                      </motion.div>
                    )}
                  </div>

                  {/* Title - LARGEST, MOST VISIBLE */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight bg-gradient-to-r from-white via-white to-accent-cyan bg-clip-text text-transparent">
                    {course.title}
                  </h1>

                  {/* Value Proposition / Description */}
                  <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed max-w-3xl">
                    {course.description}
                  </p>

                  {/* Social Proof - Above fold, near CTA */}
                  <div className="mb-6">
                    <CourseStats
                      rating={course.rating}
                      students={course.students || 0}
                      lastUpdated={course.lastContentUpdate || course.updatedAt}
                    />
                  </div>

                  {/* Primary CTA - ABOVE THE FOLD (Mobile) */}
                  <div className="lg:hidden mb-6">
                    <GlowButton
                      fullWidth
                      size="lg"
                      onClick={hasPurchased ? () => router.push('/dashboard') : handlePurchase}
                      disabled={purchasing}
                    >
                      {hasPurchased ? (
                        '✅ Go to Dashboard'
                      ) : purchasing ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Processing...
                        </span>
                      ) : (
                        <>
                          🔒 Enroll Now - ${currentPrice.toFixed(2)}
                          {discount > 0 && (
                            <span className="ml-2 line-through opacity-60 text-sm">
                              ${course.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </>
                      )}
                    </GlowButton>
                  </div>

                  {/* Course Image/Video - ENHANCED VISUAL */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-video rounded-2xl overflow-hidden border-2 border-accent-cyan/40 shadow-2xl shadow-accent-cyan/20 group"
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"></div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm">
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {!hasPurchased && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="text-center transform group-hover:scale-105 transition-transform duration-500">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="relative inline-block"
                              >
                                <div className="absolute inset-0 bg-accent-cyan/30 blur-2xl"></div>
                                <svg
                                  className="w-20 h-20 mx-auto mb-4 text-accent-cyan relative z-10 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                </svg>
                              </motion.div>
                              <p className="text-xl font-bold text-white mb-2">🔒 Unlock Full Access</p>
                              <p className="text-sm text-white/90">Enroll now to watch all lessons</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    </div>
                  </motion.div>
                </motion.div>
          </div>
        </div>

        {/* Course Content Sections - ENHANCED */}
        <div className="py-16 relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 -mx-4">
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
                {/* Content Tabs - ENHANCED */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 bg-card-bg/50 border border-accent-cyan/20 rounded-xl p-2 mb-8 overflow-x-auto backdrop-blur-sm">
                    {['overview', 'curriculum', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-3 font-semibold capitalize relative transition-all duration-300 whitespace-nowrap rounded-lg ${
                          activeTab === tab
                            ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
                            : 'text-text-secondary hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* What You'll Learn - ENHANCED */}
                      {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                        <div className="bg-gradient-to-br from-card-bg to-card-bg/50 border-2 border-accent-cyan/20 rounded-2xl p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
                          <h2 className="text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                            What You'll Learn
                          </h2>
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

                      {/* Prerequisites - ENHANCED */}
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="bg-gradient-to-br from-card-bg to-card-bg/50 border-2 border-accent-blue/20 rounded-2xl p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
                          <h2 className="text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
                            Prerequisites
                          </h2>
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

                      {/* Target Audience - ENHANCED */}
                      {course.targetAudience && course.targetAudience.length > 0 && (
                        <div className="bg-gradient-to-br from-card-bg to-card-bg/50 border-2 border-purple-500/20 rounded-2xl p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
                          <h2 className="text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-purple-400 to-accent-cyan bg-clip-text text-transparent">
                            Who is this course for?
                          </h2>
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
                      key="curriculum"
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
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="text-2xl font-heading font-bold mb-6">Student Reviews</h2>
                      <CourseReviews reviews={course.reviews || []} />
                    </motion.div>
                  )}
                </div>
          </div>
        </div>

            </div>

            {/* Right Column - Purchase Card (Desktop 1/3) - Sticky */}
            <div className="hidden lg:block lg:col-span-1">
              <div className={`sticky ${saleStatus.isActive ? 'top-36' : 'top-24'} relative`}>
                <PreviewCard
                  course={course}
                  hasPurchased={hasPurchased}
                  saleStatus={saleStatus}
                  discount={discount}
                  currentPrice={currentPrice}
                  purchasing={purchasing}
                  onPurchase={handlePurchase}
                  onGoToDashboard={() => router.push('/dashboard')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <RelatedCourses courses={relatedCourses} title="You May Also Like" />
        )}

        {/* Mobile Fixed Bottom CTA Bar - ENHANCED */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-card-bg via-card-bg to-card-bg/95 backdrop-blur-xl border-t-2 border-accent-cyan/50 p-4 shadow-2xl shadow-accent-cyan/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent truncate">
                  ${currentPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <div className="flex flex-col">
                    <span className="text-xs text-text-secondary line-through">
                      ${course.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-accent-red font-bold">
                      {discount}% OFF
                    </span>
                  </div>
                )}
              </div>
              {saleStatus.isActive && saleStatus.endsAt && (
                <p className="text-xs text-accent-red font-semibold truncate flex items-center gap-1">
                  <span className="animate-pulse">⏰</span> Limited time offer!
                </p>
              )}
            </div>
            <GlowButton
              onClick={hasPurchased ? () => router.push('/dashboard') : handlePurchase}
              disabled={purchasing}
              className="flex-shrink-0 transform active:scale-95 transition-transform"
              size="lg"
            >
              {hasPurchased ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Dashboard
                </span>
              ) : purchasing ? (
                'Processing...'
              ) : (
                <span className="font-bold">🚀 Enroll</span>
              )}
            </GlowButton>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}

// Preview Card Component for Desktop Sidebar - COMPACT & PROFESSIONAL
function PreviewCard({
  course,
  hasPurchased,
  saleStatus,
  discount,
  currentPrice,
  purchasing,
  onPurchase,
  onGoToDashboard,
}: {
  course: Course;
  hasPurchased: boolean;
  saleStatus: SaleStatus;
  discount: number;
  currentPrice: number;
  purchasing: boolean;
  onPurchase: () => void;
  onGoToDashboard: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/30 rounded-xl p-5 space-y-4 shadow-2xl shadow-accent-cyan/10 backdrop-blur-sm overflow-hidden"
    >
      {/* Decorative corner accents - smaller */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-accent-cyan/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent-blue/5 rounded-full blur-2xl"></div>

      <div className="relative z-10">
      {!hasPurchased ? (
        <>
          {/* Pricing - COMPACT */}
          <div className="text-center pb-4 border-b border-accent-cyan/20 mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-4xl font-bold bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan bg-clip-text text-transparent"
              >
                ${currentPrice.toFixed(2)}
              </motion.span>
              {discount > 0 && (
                <div className="flex flex-col items-start">
                  <span className="text-base text-text-secondary line-through">
                    ${course.originalPrice.toFixed(2)}
                  </span>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="px-2 py-0.5 bg-gradient-to-r from-accent-red to-red-600 text-white text-xs font-bold rounded-full"
                  >
                    {discount}% OFF
                  </motion.div>
                </div>
              )}
            </div>
            <p className="text-xs text-text-secondary">One-time payment • Lifetime access</p>
          </div>

          {/* Countdown Timer - COMPACT */}
          {saleStatus.isActive && saleStatus.endsAt && (
            <div className="bg-gradient-to-br from-accent-red/15 to-accent-red/5 border border-accent-red/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-lg"
                >
                  ⏰
                </motion.span>
                <p className="text-center text-xs font-bold text-accent-red">
                  Offer Ends In:
                </p>
              </div>
              <CountdownTimer endDate={saleStatus.endsAt} variant="small" showLabels={true} />
            </div>
          )}

          {/* Purchase Button - COMPACT */}
          <GlowButton
            fullWidth
            size="md"
            onClick={onPurchase}
            disabled={purchasing}
            className="transform hover:scale-[1.02] transition-transform duration-300"
          >
            {purchasing ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 font-bold">
                🚀 Enroll Now
              </span>
            )}
          </GlowButton>

          {/* Lifetime Access Badge - COMPACT */}
          <div className="flex items-center justify-center gap-1.5 pt-3 pb-1">
            <svg className="w-4 h-4 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-accent-cyan">
              Lifetime Access
            </span>
          </div>

          {/* Course Includes - COMPACT */}
          <div className="pt-4 border-t border-accent-cyan/20">
            <h3 className="text-sm font-bold mb-3 text-center bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
              What's Included:
            </h3>
            <TrustBadges />
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative inline-block mb-4"
          >
            <div className="absolute inset-0 bg-accent-green/30 rounded-full blur-xl"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-accent-green/30 to-accent-green/10 rounded-full flex items-center justify-center mx-auto border-2 border-accent-green/50">
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
          </motion.div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-accent-green to-green-400 bg-clip-text text-transparent">
            ✅ You Own This Course!
          </h3>
          <p className="text-text-secondary mb-6 text-sm">
            Access all lessons anytime
          </p>
          <GlowButton
            fullWidth
            onClick={onGoToDashboard}
            className="transform hover:scale-[1.02] transition-transform duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Continue Learning
            </span>
          </GlowButton>
        </div>
      )}
      </div>
    </motion.div>
  );
}
