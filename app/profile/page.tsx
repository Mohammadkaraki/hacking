'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';
import { Purchase } from '@/types';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'settings'>('profile');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPurchases();
    }
  }, [status]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases/my-courses');
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-bg-dark via-bg-dark/98 to-bg-dark">
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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-bg-dark via-bg-dark/98 to-bg-dark">
      {/* Background Effects */}
      <MatrixRainBright />
      <GridPatternBright />
      <ParticleFieldBright />
      <CursorTrail />

      {/* Main Content */}
      <div className="relative z-10">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan via-white to-accent-blue bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-text-secondary">Manage your account and view your learning progress</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center gap-4 mb-8"
          >
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'courses', label: 'My Courses', icon: '📚' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
                    : 'bg-card-bg border border-accent-cyan/30 text-text-secondary hover:text-white hover:border-accent-cyan/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-2xl p-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent-cyan/30">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent-cyan/20 flex items-center justify-center text-4xl font-bold text-accent-cyan">
                        {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-accent-green rounded-full border-4 border-card-bg"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {session.user?.name || 'Anonymous User'}
                  </h2>
                  <p className="text-text-secondary mb-4">{session.user?.email}</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                      <div className="text-sm text-text-secondary">Courses Enrolled</div>
                      <div className="text-2xl font-bold text-accent-cyan">{purchases.length}</div>
                    </div>
                    <div className="px-4 py-2 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
                      <div className="text-sm text-text-secondary">Member Since</div>
                      <div className="text-2xl font-bold text-accent-blue">
                        {new Date().getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* My Courses Tab */}
          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {purchases.length === 0 ? (
                <div className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No courses yet</h3>
                  <p className="text-text-secondary mb-6">Start your learning journey by enrolling in a course</p>
                  <button
                    onClick={() => router.push('/courses')}
                    className="px-8 py-3 bg-accent-cyan hover:bg-accent-blue text-white font-semibold rounded-lg transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {purchases.map((purchase, index) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => router.push(`/courses/${purchase.courseId}`)}
                      className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl overflow-hidden hover:border-accent-cyan/40 transition-all cursor-pointer group"
                    >
                      {purchase.course && (
                        <>
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={purchase.course.thumbnail}
                              alt={purchase.course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                              <span className="px-3 py-1 bg-accent-green text-white text-xs font-bold rounded-full">
                                Enrolled
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                              {purchase.course.title}
                            </h3>
                            <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                              {purchase.course.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-text-secondary">
                                Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
                              </span>
                              <span className="text-accent-cyan font-semibold">Continue →</span>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={session.user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-bg-dark border border-accent-cyan/30 rounded-lg text-white opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-text-secondary mt-2">Email cannot be changed</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={session.user?.name || ''}
                    disabled
                    className="w-full px-4 py-3 bg-bg-dark border border-accent-cyan/30 rounded-lg text-white opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-text-secondary mt-2">Name updates coming soon</p>
                </div>

                {/* Preferences */}
                <div className="pt-6 border-t border-accent-cyan/20">
                  <h3 className="text-lg font-bold text-white mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-text-secondary">Email notifications</span>
                      <input type="checkbox" className="w-5 h-5 rounded border-accent-cyan/30" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-text-secondary">Marketing emails</span>
                      <input type="checkbox" className="w-5 h-5 rounded border-accent-cyan/30" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-text-secondary">Course updates</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-accent-cyan/30" />
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-accent-red/20">
                  <h3 className="text-lg font-bold text-accent-red mb-4">Danger Zone</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-6 py-3 bg-accent-red/10 hover:bg-accent-red/20 border border-accent-red/30 text-accent-red font-semibold rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
      </div>
    </div>
  );
}
