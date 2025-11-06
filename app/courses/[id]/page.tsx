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
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 25%, #0f1419 50%, #1e293b 75%, #0a0e27 100%)' }}>
      {/* STUNNING PROFESSIONAL HACKER BACKGROUND - Enhanced Attraction */}

      {/* Layer 1: Deep rich gradient base */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-gray-900/95 to-slate-900/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-950/10 via-transparent to-cyan-950/10"></div>
      </div>

      {/* Layer 2: Animated flowing color spotlights */}
      <motion.div
        className="absolute inset-0 opacity-25"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(0,255,65,0.2) 0%, transparent 40%)',
            'radial-gradient(circle at 80% 80%, rgba(0,255,255,0.2) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, rgba(0,150,255,0.2) 0%, transparent 40%)',
            'radial-gradient(circle at 20% 20%, rgba(0,255,65,0.2) 0%, transparent 40%)',
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Layer 3: Prominent grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute inset-0 grid-pattern"></div>
      </div>

      {/* Layer 4: Enhanced Binary code rain - More visible */}
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`binary-${i}`}
            className="absolute font-mono text-sm leading-relaxed"
            style={{
              left: `${i * 5}%`,
              color: i % 3 === 0 ? '#00ff41' : i % 3 === 1 ? '#00ffff' : '#00ff99',
              textShadow: '0 0 5px currentColor',
            }}
            animate={{
              y: ['-100%', '100vh'],
            }}
            transition={{
              duration: Math.random() * 25 + 20,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 12,
            }}
          >
            {Array.from({ length: 30 }).map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Layer 5: Large atmospheric glowing orbs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-green-500/12 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-20 w-[450px] h-[450px] bg-cyan-500/12 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/3 w-[480px] h-[480px] bg-green-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Layer 6: More prominent glowing nodes */}
      <div className="absolute top-1/5 left-1/6 w-3 h-3 bg-green-400 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#00ff41]"></div>
      <div className="absolute top-2/5 right-1/5 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#00ffff]" style={{ animationDelay: '250ms' }}></div>
      <div className="absolute bottom-1/4 left-2/5 w-3 h-3 bg-green-500 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#00ff41]" style={{ animationDelay: '500ms' }}></div>
      <div className="absolute top-3/5 right-1/4 w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#0096ff]" style={{ animationDelay: '750ms' }}></div>
      <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-cyan-500 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_15px_#00ffff]" style={{ animationDelay: '1000ms' }}></div>
      <div className="absolute top-1/2 left-1/4 w-2.5 h-2.5 bg-green-300 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_15px_#00ff99]" style={{ animationDelay: '1250ms' }}></div>

      {/* Layer 7: Hexagonal tech pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2300ff41' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Layer 8: Scanline effect for terminal feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.15) 2px, rgba(0,255,65,0.15) 4px)',
        }}
      />

      {/* Layer 9: Vignette for depth and focus */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-950/70 pointer-events-none"></div>

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

        {/* Hero Section - PROFESSIONAL ENHANCED */}
        <div className="relative py-8 md:py-12">
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

                  {/* Title - ENHANCED WITH GLOW */}
                  <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="bg-gradient-to-r from-white via-green-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,65,0.3)]">
                      {course.title}
                    </span>
                  </motion.h1>

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

                  {/* Course Image/Video - ENHANCED WITH CYBERPUNK GLOW */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-video rounded-2xl overflow-hidden group"
                  >
                    {/* Multi-layer glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 opacity-30 blur-xl group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500"></div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/70 backdrop-blur-sm border-2 border-green-500/40 group-hover:border-green-500/70 transition-all duration-500">
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

        {/* Course Content Sections - CLEAN & PROFESSIONAL */}
        <div className="py-16 relative">
          <div className="relative z-10">
                {/* Content Tabs - CYBERPUNK STYLE */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 bg-gray-900/50 border-2 border-green-500/30 rounded-xl p-2 mb-8 overflow-x-auto backdrop-blur-xl">
                    {['overview', 'curriculum', 'reviews'].map((tab) => (
                      <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-6 py-3 font-bold capitalize transition-all duration-300 whitespace-nowrap rounded-lg overflow-hidden ${
                          activeTab === tab
                            ? 'text-black'
                            : 'text-gray-400 hover:text-green-400'
                        }`}
                      >
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{tab}</span>
                      </motion.button>
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
                      {/* What You'll Learn - CYBERPUNK ENHANCED */}
                      {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border-2 border-green-500/30 rounded-2xl p-8 shadow-xl shadow-green-500/10 backdrop-blur-sm overflow-hidden">
                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-cyan-500/10 blur-xl pointer-events-none"></div>
                          <h2 className="relative text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,65,0.3)]">
                            What You'll Learn
                          </h2>
                          <ul className="relative grid md:grid-cols-2 gap-4">
                            {course.whatYouLearn.map((item, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-3 group"
                              >
                                <svg
                                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 group-hover:text-cyan-500 transition-colors"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-gray-300 group-hover:text-white transition-colors">{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Prerequisites - CYBERPUNK */}
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border-2 border-cyan-500/30 rounded-2xl p-8 shadow-xl shadow-cyan-500/10 backdrop-blur-sm overflow-hidden">
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl pointer-events-none"></div>
                          <h2 className="relative text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                            Prerequisites
                          </h2>
                          <ul className="relative space-y-3">
                            {course.prerequisites.map((prereq, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-3 group"
                              >
                                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-green-500 transition-colors shadow-[0_0_10px_currentColor]" />
                                <span className="text-gray-300 group-hover:text-white transition-colors">{prereq}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Target Audience - CYBERPUNK */}
                      {course.targetAudience && course.targetAudience.length > 0 && (
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-8 shadow-xl shadow-purple-500/10 backdrop-blur-sm overflow-hidden">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl pointer-events-none"></div>
                          <h2 className="relative text-2xl font-heading font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            Who is this course for?
                          </h2>
                          <ul className="relative space-y-3">
                            {course.targetAudience.map((audience, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-3 group"
                              >
                                <svg
                                  className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5 group-hover:text-cyan-400 transition-colors"
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
                                <span className="text-gray-300 group-hover:text-white transition-colors">{audience}</span>
                              </motion.li>
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
              <div className={`sticky ${saleStatus.isActive ? 'top-36' : 'top-24'}`}>
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
      className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border-2 border-green-500/40 rounded-xl p-5 space-y-4 shadow-2xl shadow-green-500/20 backdrop-blur-xl overflow-hidden"
    >
      {/* Enhanced glow effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-green-500/20 blur-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
      {!hasPurchased ? (
        <>
          {/* Pricing - ENHANCED CYBERPUNK */}
          <div className="text-center pb-4 border-b border-green-500/30 mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-4xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,65,0.5)]"
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
