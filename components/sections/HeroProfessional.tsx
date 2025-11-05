'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import GlowButton from '@/components/ui/GlowButton';
import Image from 'next/image';

export default function HeroProfessional() {
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    { value: '10,000+', label: 'Active Students', icon: '👥' },
    { value: '50+', label: 'Expert Courses', icon: '📚' },
    { value: '95%', label: 'Success Rate', icon: '⭐' },
    { value: '24/7', label: 'Support', icon: '💬' },
  ];

  const features = [
    {
      title: 'Industry Certified',
      description: 'Courses aligned with CEH, OSCP, and CompTIA standards',
      icon: '🎓',
    },
    {
      title: 'Hands-On Labs',
      description: 'Practice in real-world scenarios with virtual environments',
      icon: '⚡',
    },
    {
      title: 'Expert Instructors',
      description: 'Learn from certified ethical hackers and security professionals',
      icon: '👨‍🏫',
    },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-dark to-card-bg">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#00ff9f 1px, transparent 1px), linear-gradient(90deg, #00ff9f 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient orbs - subtle */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full"
            >
              <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></span>
              <span className="text-accent-cyan text-sm font-medium">Trusted by 10,000+ Students</span>
            </motion.div>

            {/* Main Heading */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Master
                <span className="block mt-2 bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan bg-clip-text text-transparent">
                  Cybersecurity
                </span>
                <span className="block mt-2 text-text-heading">Skills That Matter</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-text-secondary leading-relaxed max-w-xl"
              >
                Join the next generation of security professionals. Learn ethical hacking,
                penetration testing, and advanced security techniques from industry experts.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <GlowButton size="lg" className="group">
                Get Started Free
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </GlowButton>

              <button className="px-8 py-4 text-lg font-heading font-semibold text-text-heading border-2 border-text-heading/20 rounded-lg hover:border-accent-cyan/50 hover:text-accent-cyan transition-all duration-300 group">
                View Courses
                <svg className="w-5 h-5 ml-2 inline transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid sm:grid-cols-3 gap-6 pt-8 border-t border-card-border/50"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <h3 className="font-heading font-semibold text-text-heading">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Stats & Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-card-bg to-primary-dark border border-accent-cyan/20 rounded-2xl p-8 shadow-2xl">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-accent-cyan/5 rounded-2xl blur-xl"></div>

              <div className="relative space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="bg-primary-dark/50 border border-accent-cyan/10 rounded-xl p-6 hover:border-accent-cyan/30 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="text-3xl mb-3">{stat.icon}</div>
                      <div className="text-3xl font-bold text-accent-cyan mb-1 group-hover:scale-110 transition-transform">
                        {stat.value}
                      </div>
                      <div className="text-sm text-text-secondary">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="bg-primary-dark/50 border border-accent-cyan/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold text-text-heading">Industry Recognition</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {['CEH Certified', 'OSCP Aligned', 'CompTIA Security+', 'ISO 27001'].map((cert, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="px-3 py-1.5 bg-accent-cyan/10 text-accent-cyan text-xs font-medium rounded-full border border-accent-cyan/30"
                      >
                        {cert}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Certificate</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Job Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>30-Day Refund</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-cyan/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent-blue/10 rounded-full blur-2xl"></div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-text-secondary/60"
          >
            <span className="text-xs uppercase tracking-wider font-medium">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
