'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import GlowButton from '@/components/ui/GlowButton';

export default function Hero() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const commands = [
      '$ sudo nmap -sV target.com',
      '$ Starting Nmap scan...',
      '$ PORT     STATE SERVICE',
      '$ 22/tcp   open  ssh',
      '$ 80/tcp   open  http',
      '$ 443/tcp  open  https',
      '$ Scan complete. 3 open ports found.',
    ];

    let commandIndex = 0;
    const terminal = terminalRef.current;

    const typeCommand = () => {
      if (!terminal || commandIndex >= commands.length) return;

      const line = document.createElement('div');
      line.className = 'text-accent-cyan font-mono text-sm mb-1';
      line.textContent = commands[commandIndex];
      terminal.appendChild(line);

      commandIndex++;
      setTimeout(typeCommand, 800);
    };

    setTimeout(typeCommand, 1000);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-pulse-slow animation-delay-400"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-accent-cyan text-sm font-mono uppercase tracking-wider mb-4"
            >
              LEVEL UP YOUR SECURITY SKILLS
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Master Cybersecurity{' '}
              <span className="gradient-text">From Zero to Hero</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary text-lg md:text-xl mb-8 leading-relaxed"
            >
              Industry-leading courses taught by certified ethical hackers and security
              experts. Start your journey into cybersecurity today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <GlowButton size="lg">
                Explore Courses
                <svg
                  className="w-5 h-5 ml-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </GlowButton>
              <GlowButton variant="outline" size="lg">
                <svg
                  className="w-5 h-5 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Demo
              </GlowButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 text-sm text-text-secondary"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-accent-cyan"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-accent-cyan"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span>50+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-accent-cyan"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Industry Certified</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Terminal Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card-bg rounded-lg border border-accent-cyan/30 overflow-hidden shadow-neon-cyan">
              {/* Terminal Header */}
              <div className="bg-primary-dark/80 px-4 py-3 flex items-center gap-2 border-b border-accent-cyan/30">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs font-mono text-text-secondary">
                  root@cyberacademy:~
                </span>
              </div>

              {/* Terminal Body */}
              <div className="p-6 h-80 overflow-hidden scanline-effect">
                <div ref={terminalRef} className="space-y-1"></div>
                <div className="flex items-center mt-2">
                  <span className="text-accent-cyan font-mono text-sm">$</span>
                  <div className="w-2 h-4 bg-accent-cyan ml-2 animate-pulse"></div>
                </div>
              </div>

              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent-cyan/5 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -right-8 w-16 h-16 bg-accent-blue/20 rounded-lg blur-xl"
            ></motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-accent-cyan/20 rounded-lg blur-xl"
            ></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-text-secondary"
        >
          <span className="text-xs font-mono">Scroll Down</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
