'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';
import { Purchase } from '@/types';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    } else if (status === 'authenticated') {
      verifyPaymentAndFetchPurchases();
    }
  }, [status, router, searchParams]);

  const verifyPaymentAndFetchPurchases = async () => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    // If returning from Stripe with a session ID, verify the payment
    if (success === 'true' && sessionId) {
      try {
        const response = await fetch('/api/payments/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Payment verified:', data);
          alert('🎉 Payment successful! Your course is now available.');

          // Remove query params from URL
          router.replace('/dashboard');
        } else {
          console.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    }

    // Fetch purchases
    fetchPurchases();
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases/my-courses');
      const data = await response.json();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setPurchases(data);
      } else {
        console.error('Invalid purchases data:', data);
        setPurchases([]);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (courseId: string) => {
    setDownloadingCourseId(courseId);
    try {
      const response = await fetch(`/api/downloads/generate/${courseId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate download link');
      }

      const { downloadUrl } = await response.json();

      // Open download link in new tab
      window.open(downloadUrl, '_blank');

      alert('Download started! The link will expire in 24 hours.');
    } catch (error) {
      console.error('Error downloading course:', error);
      alert('Failed to generate download link. Please try again.');
    } finally {
      setDownloadingCourseId(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <MatrixRainBright />
        <GridPatternBright />
        <ParticleFieldBright />
        <CursorTrail />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full relative z-10"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-24 pb-16 px-4">
      {/* Background Effects */}
      <MatrixRainBright />
      <GridPatternBright />
      <ParticleFieldBright />
      <CursorTrail />
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2">
                My Dashboard
              </h1>
              <p className="text-text-secondary">
                Welcome back, {session?.user?.name || 'Student'}!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-card-border rounded-lg hover:border-accent-cyan transition-colors"
              >
                Browse Courses
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 border border-card-border rounded-lg hover:border-accent-red hover:text-accent-red transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card-bg border border-card-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-cyan"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">{purchases.length}</div>
                  <div className="text-sm text-text-secondary">Courses Owned</div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-card-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {purchases.filter((p) => p.status === 'completed').length}
                  </div>
                  <div className="text-sm text-text-secondary">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-card-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    ${purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-text-secondary">Total Spent</div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-card-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-red/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent-red"
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
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-sm text-text-secondary">Link Expiry</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Courses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-6">My Courses</h2>

          {purchases.length === 0 ? (
            <div className="bg-card-bg border border-card-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-cyan"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Courses Yet</h3>
              <p className="text-text-secondary mb-6">
                Start your cybersecurity journey today!
              </p>
              <GlowButton onClick={() => router.push('/')}>
                Browse Courses
              </GlowButton>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-card-bg border border-card-border rounded-xl overflow-hidden"
                >
                  {/* Course Image */}
                  <div className="relative aspect-video">
                    <img
                      src={purchase.course?.thumbnail || '/images/placeholder.jpg'}
                      alt={purchase.course?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {purchase.status === 'completed' ? (
                        <div className="px-3 py-1 bg-accent-green/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                          Owned
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-accent-red/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                          {purchase.status}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-bold mb-2 line-clamp-2">
                      {purchase.course?.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {purchase.course?.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {purchase.course?.lessons} lessons
                      </span>
                    </div>

                    <div className="text-sm text-text-secondary mb-4">
                      Purchased on{' '}
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </div>

                    {/* Download Button */}
                    {purchase.status === 'completed' && purchase.course?.s3FileKey ? (
                      <GlowButton
                        fullWidth
                        onClick={() => handleDownload(purchase.courseId)}
                        disabled={downloadingCourseId === purchase.courseId}
                      >
                        {downloadingCourseId === purchase.courseId ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Download Course
                          </span>
                        )}
                      </GlowButton>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Not Available
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
