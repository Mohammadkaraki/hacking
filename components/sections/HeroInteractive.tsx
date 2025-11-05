'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import GlowButton from '@/components/ui/GlowButton';

export default function HeroInteractive() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const fullText = 'ACCESS GRANTED';
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Dark overlay for hacking effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-primary-dark/95 to-black/90 z-10"></div>

        {/* Simulated hacking background pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff9f' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Animated grid lines */}
        <div className="absolute inset-0 z-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent"
              style={{
                width: '100%',
                top: `${i * 5}%`,
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleX: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Mouse parallax effect */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 159, 0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-40 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full text-center"
      >
        {/* Glitch effect on main title */}
        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Access Granted Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block mb-6"
            >
              <div className="px-6 py-3 bg-accent-cyan/10 border-2 border-accent-cyan rounded-lg backdrop-blur-sm">
                <span className="text-accent-cyan text-xl font-mono font-bold tracking-wider">
                  &gt; {typedText}
                  <span className="animate-pulse">_</span>
                </span>
              </div>
            </motion.div>

            {/* Main Heading with Multiple Layers */}
            <div className="relative">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 relative">
                <motion.span
                  className="block text-white"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(0, 255, 159, 0.5)',
                      '0 0 40px rgba(0, 255, 159, 0.8)',
                      '0 0 20px rgba(0, 255, 159, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  MASTER
                </motion.span>

                <motion.span
                  className="block bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: '200%' }}
                >
                  CYBERSECURITY
                </motion.span>

                <motion.span className="block text-accent-red mt-2">
                  BECOME ELITE
                </motion.span>
              </h1>

              {/* Glitch layers */}
              <motion.h1
                className="absolute inset-0 text-6xl md:text-7xl lg:text-8xl font-bold opacity-70"
                animate={{
                  x: [0, -2, 2, 0],
                  opacity: [0, 0.3, 0],
                }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
                style={{ color: '#00ff9f' }}
              >
                <span className="block">MASTER</span>
                <span className="block">CYBERSECURITY</span>
                <span className="block mt-2">BECOME ELITE</span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Learn <span className="text-accent-cyan font-semibold">Ethical Hacking</span>,
            <span className="text-accent-cyan font-semibold"> Penetration Testing</span>, and
            <span className="text-accent-cyan font-semibold"> Advanced Security</span> from certified experts
          </motion.p>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <GlowButton size="lg" className="group text-xl px-10 py-5">
            <span className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Start Your Journey
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </GlowButton>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-10 py-5 text-xl bg-transparent border-2 border-accent-cyan text-accent-cyan rounded-lg font-heading font-semibold hover:bg-accent-cyan/10 transition-all duration-300 flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: '10K+', label: 'Students', icon: '👥' },
            { value: '50+', label: 'Courses', icon: '🎯' },
            { value: '95%', label: 'Success', icon: '🏆' },
            { value: '24/7', label: 'Support', icon: '💡' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="bg-black/50 backdrop-blur-md border border-accent-cyan/30 rounded-xl p-6 hover:border-accent-cyan hover:shadow-neon-cyan transition-all duration-300"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-accent-cyan mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-accent-cyan text-xs font-mono uppercase tracking-wider">
              Explore Courses
            </span>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 10px rgba(0, 255, 159, 0.3)',
                  '0 0 30px rgba(0, 255, 159, 0.8)',
                  '0 0 10px rgba(0, 255, 159, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-12 border-2 border-accent-cyan rounded-full flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-accent-cyan rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 border-t-2 border-l-2 border-accent-cyan/30 z-30"></div>
      <div className="absolute top-0 right-0 w-64 h-64 border-t-2 border-r-2 border-accent-cyan/30 z-30"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 border-b-2 border-l-2 border-accent-cyan/30 z-30"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 border-b-2 border-r-2 border-accent-cyan/30 z-30"></div>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 z-50 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, transparent 0%, rgba(0, 255, 159, 0.05) 50%, transparent 100%)',
          height: '100%',
        }}
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </section>
  );
}
