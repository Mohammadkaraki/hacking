'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlowButton from '@/components/ui/GlowButton';

export default function HeroUltimate() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Photo Background with Unsplash */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-primary-dark/95"></div>
        </div>

        {/* Animated digital rain effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-accent-cyan"
              style={{
                left: `${(i * 2)}%`,
                height: '100px',
              }}
              animate={{
                y: [-100, 1200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Interactive light beam following mouse */}
        <div
          className="absolute inset-0 opacity-30 transition-all duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 255, 159, 0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-40 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-8 items-center py-8">
          {/* Left Side - Epic Content */}
          <div className="space-y-4">
            {/* Security Alert Badge */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-accent-red/20 border border-accent-red/50 rounded-lg backdrop-blur-md"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-accent-red rounded-full"
              />
              <span className="text-accent-red font-mono font-bold text-sm tracking-wider">
                SECURITY ALERT: UNAUTHORIZED ACCESS DETECTED
              </span>
            </motion.div>

            {/* Massive Title */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none">
                  <motion.span
                    className="block text-white"
                    animate={{
                      textShadow: [
                        '0 0 30px rgba(0, 255, 159, 0.5)',
                        '0 0 60px rgba(0, 255, 159, 0.8)',
                        '0 0 30px rgba(0, 255, 159, 0.5)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    HACK
                  </motion.span>

                  <span className="block relative">
                    <motion.span
                      className="relative z-10 bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-green bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ['0%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{ backgroundSize: '200% auto' }}
                    >
                      THE SYSTEM
                    </motion.span>

                    {/* Glitch effect overlay */}
                    <motion.span
                      className="absolute inset-0 text-accent-red"
                      animate={{
                        x: [-2, 2, -2],
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      THE SYSTEM
                    </motion.span>
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed"
              >
                Master <span className="text-accent-cyan font-bold">ethical hacking</span>,
                <span className="text-accent-cyan font-bold"> penetration testing</span>, and become an
                <span className="text-accent-green font-bold"> elite cybersecurity professional</span>
              </motion.p>
            </div>

            {/* Terminal-style info box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-black/60 backdrop-blur-md border border-accent-cyan/30 rounded-lg p-4 font-mono text-xs"
            >
              <div className="flex items-center gap-2 mb-2 text-accent-cyan">
                <span className="text-accent-green">root@cyberacademy</span>
                <span className="text-white">~</span>
                <span className="text-accent-cyan">$</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  _
                </motion.span>
              </div>
              <div className="space-y-2 text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="text-accent-green">✓</span>
                  <span>10,000+ Active Security Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-green">✓</span>
                  <span>50+ Industry-Certified Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-green">✓</span>
                  <span>Live Hacking Labs & Real-World Scenarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-green">✓</span>
                  <span>24/7 Expert Support & Community</span>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <GlowButton size="lg" className="text-lg px-8 py-3 group" onClick={() => router.push('/courses')}>
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Start Hacking Now
                  <motion.svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </GlowButton>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const coursesSection = document.getElementById('courses');
                  coursesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 text-lg bg-white/5 backdrop-blur-md border-2 border-white/20 text-white rounded-lg font-heading font-semibold hover:bg-white/10 hover:border-accent-cyan transition-all duration-300"
              >
                Featured Courses →
              </motion.button>
            </motion.div>
          </div>

          {/* Right Side - Interactive Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Panel */}
            <div className="relative bg-black/40 backdrop-blur-xl border border-accent-cyan/30 rounded-2xl p-5 shadow-2xl">
              {/* Animated corner brackets */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-accent-cyan rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-accent-cyan rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-accent-cyan rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-accent-cyan rounded-br-2xl"></div>

              <div className="space-y-4 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-accent-cyan/30">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-3 h-3 border-2 border-accent-cyan border-t-transparent rounded-full"
                    />
                    <span className="text-accent-cyan font-mono font-bold tracking-wider">
                      LIVE STATS
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary font-mono">REAL-TIME</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Students Active', value: '10,247', trend: '+12%', color: 'accent-cyan' },
                    { label: 'Courses Live', value: '50+', trend: '+5', color: 'accent-blue' },
                    { label: 'Success Rate', value: '95.7%', trend: '+2.3%', color: 'accent-green' },
                    { label: 'Labs Running', value: '1,429', trend: '+89', color: 'accent-red' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-accent-cyan/50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-xs text-text-secondary mb-2 uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className={`text-3xl font-bold text-${stat.color} mb-1`}>
                        {stat.value}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-accent-green">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{stat.trend}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                  <div className="text-sm font-semibold text-text-heading mb-3 uppercase tracking-wider">
                    Industry Certifications
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['CEH', 'OSCP', 'CompTIA', 'CISSP', 'CEH Master', 'GPEN'].map((cert, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1.5 bg-accent-cyan/20 text-accent-cyan text-xs font-mono font-bold rounded-md border border-accent-cyan/50 cursor-pointer hover:bg-accent-cyan/30 transition-colors"
                      >
                        {cert}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-3">
                  {[
                    { label: 'Network Security', progress: 95 },
                    { label: 'Web Application', progress: 88 },
                    { label: 'Malware Analysis', progress: 92 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">{item.label}</span>
                        <span className="text-accent-cyan font-mono">{item.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1.5, delay: 1 + index * 0.2 }}
                          className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0"
                animate={{
                  opacity: [0, 0.1, 0],
                  boxShadow: [
                    '0 0 0px rgba(0, 255, 159, 0)',
                    '0 0 40px rgba(0, 255, 159, 0.4)',
                    '0 0 0px rgba(0, 255, 159, 0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated scan line */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 159, 0.1) 50%, transparent 100%)',
          height: '200px',
        }}
        animate={{
          y: ['-200px', 'calc(100vh + 200px)'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </section>
  );
}
