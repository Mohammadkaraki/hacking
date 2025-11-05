'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import GlowButton from '@/components/ui/GlowButton';
import GlitchText from '@/components/effects/GlitchText';
import HackingScanner from '@/components/effects/HackingScanner';
import CodeEditor from '@/components/effects/CodeEditor';
import SystemMonitor from '@/components/effects/SystemMonitor';

export default function HeroEnhanced() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showElements, setShowElements] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Boot sequence
    const bootSequence = [
      { text: '> INITIALIZING CYBERACADEMY SYSTEMS...', delay: 100 },
      { text: '> LOADING SECURITY MODULES...', delay: 400 },
      { text: '> [██████████] 100%', delay: 600 },
      { text: '> CHECKING AUTHENTICATION...', delay: 800 },
      { text: '> DECRYPTING DATABASE...', delay: 1000 },
      { text: '> ✓ ACCESS GRANTED', delay: 1200 },
    ];

    let totalDelay = 0;
    const terminal = terminalRef.current;

    bootSequence.forEach((command, index) => {
      totalDelay += command.delay;
      setTimeout(() => {
        if (terminal) {
          const line = document.createElement('div');
          line.className = `font-mono text-xs mb-1 ${
            command.text.includes('✓')
              ? 'text-accent-green'
              : command.text.includes('[')
              ? 'text-accent-cyan'
              : 'text-text-secondary'
          }`;
          line.textContent = command.text;
          terminal.appendChild(line);

          // Scroll to bottom
          terminal.scrollTop = terminal.scrollHeight;

          if (index === bootSequence.length - 1) {
            setAccessGranted(true);
            setTimeout(() => setShowElements(true), 500);
          }
        }
      }, totalDelay);
    });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Background with Scan Lines */}
      <div className="absolute inset-0">
        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-red/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Scanning line effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(0deg, transparent 0%, rgba(0, 255, 159, 0.1) 50%, transparent 100%)',
            height: '2px',
          }}
          animate={{
            top: ['-2px', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Boot Terminal */}
            <div className="bg-black/80 border-2 border-accent-red/50 rounded-lg p-4 font-mono text-sm shadow-[0_0_30px_rgba(255,51,102,0.3)] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-accent-red/30">
                <div className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></div>
                <span className="text-accent-red text-xs">SYSTEM BOOT</span>
              </div>
              <div
                ref={terminalRef}
                className="space-y-1 h-32 overflow-hidden"
              ></div>
            </div>

            {/* Main Content - Appears after boot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: accessGranted ? 1 : 0, y: accessGranted ? 0 : 20 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div>
                <motion.p
                  className="text-accent-cyan text-sm font-mono uppercase tracking-wider mb-4 flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></span>
                  <GlitchText text="LEVEL UP YOUR SECURITY SKILLS" />
                </motion.p>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Master{' '}
                  <span className="relative inline-block">
                    <span className="gradient-text">Cybersecurity</span>
                    <motion.span
                      className="absolute inset-0 gradient-text opacity-50 blur-sm"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Cybersecurity
                    </motion.span>
                  </span>
                  <br />
                  <span className="text-accent-red">From Zero to Hero</span>
                </h1>

                <p className="text-text-secondary text-lg md:text-xl mb-8 leading-relaxed">
                  Industry-leading courses taught by{' '}
                  <span className="text-accent-cyan">certified ethical hackers</span> and
                  security experts. Start your journey into cybersecurity today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <GlowButton size="lg" className="group">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Explore Courses
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </motion.svg>
                  </span>
                </GlowButton>

                <GlowButton variant="outline" size="lg">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  </span>
                </GlowButton>
              </div>

              {/* Trust Indicators with Icons */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: '👥', label: '10,000+', sub: 'Students' },
                  { icon: '📚', label: '50+', sub: 'Courses' },
                  { icon: '🏆', label: '94%', sub: 'Success Rate' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="bg-card-bg/50 border border-accent-cyan/20 rounded-lg p-3 text-center backdrop-blur-sm hover:border-accent-cyan/50 transition-colors"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-accent-cyan font-bold font-mono">{item.label}</div>
                    <div className="text-xs text-text-secondary">{item.sub}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Multiple Interactive Panels */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: showElements ? 1 : 0, x: showElements ? 0 : 50 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showElements ? 1 : 0, y: showElements ? 0 : 20 }}
              transition={{ delay: 0.2 }}
            >
              <CodeEditor />
            </motion.div>

            {/* Bottom Grid - Scanner & Monitor */}
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showElements ? 1 : 0, y: showElements ? 0 : 20 }}
                transition={{ delay: 0.4 }}
              >
                <HackingScanner />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showElements ? 1 : 0, y: showElements ? 0 : 20 }}
                transition={{ delay: 0.6 }}
              >
                <SystemMonitor />
              </motion.div>
            </div>

            {/* Live Data Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showElements ? 1 : 0, y: showElements ? 0 : 20 }}
              transition={{ delay: 0.8 }}
              className="bg-primary-dark/80 border border-accent-green/30 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                <span className="text-accent-green font-mono text-xs">LIVE DATA STREAM</span>
              </div>
              <div className="space-y-1 font-mono text-xs h-20 overflow-hidden">
                {[
                  '192.168.1.105 → LOGIN ATTEMPT [BLOCKED]',
                  '10.0.0.23 → SQL INJECTION DETECTED',
                  '172.16.0.8 → XSS PAYLOAD SANITIZED',
                  '192.168.1.50 → BRUTE FORCE [PREVENTED]',
                ].map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.3 }}
                    className="text-accent-green"
                  >
                    <span className="text-text-secondary">[{new Date().toLocaleTimeString()}]</span>{' '}
                    {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: accessGranted ? 1 : 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-accent-cyan">SCROLL TO EXPLORE</span>
          <motion.div
            className="w-6 h-10 border-2 border-accent-cyan rounded-full flex items-start justify-center p-2"
            animate={{
              boxShadow: [
                '0 0 10px rgba(0, 255, 159, 0.3)',
                '0 0 20px rgba(0, 255, 159, 0.6)',
                '0 0 10px rgba(0, 255, 159, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-accent-cyan rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
