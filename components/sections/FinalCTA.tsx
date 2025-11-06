'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import GlowButton from '@/components/ui/GlowButton';
import AnimatedBackground from '@/components/effects/AnimatedBackground';
import Image from 'next/image';

export default function FinalCTA() {
  const router = useRouter();
  const [activeUsers, setActiveUsers] = useState(847);
  const [glitchText, setGlitchText] = useState('INITIATE');

  useEffect(() => {
    // Simulate active users count fluctuation
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    // Glitch effect on text
    const glitchInterval = setInterval(() => {
      const glitchVariants = ['1N1T1@T3', 'INIT!ATE', 'IN!T!ATE', 'INITIATE'];
      setGlitchText(glitchVariants[Math.floor(Math.random() * glitchVariants.length)]);
      setTimeout(() => setGlitchText('INITIATE'), 100);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <section className="relative py-32 px-4 md:px-8 lg:px-16 overflow-hidden bg-black">
      {/* Intense Background Effects */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
          alt="Cyber Background"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
      </div>

      <AnimatedBackground variant="matrix" opacity={0.15} color="#00ff41" />
      <AnimatedBackground variant="grid" opacity={0.12} color="#00ff41" />
      <AnimatedBackground variant="particles" opacity={0.1} color="#00ff41" />

      {/* Animated scanlines */}
      <motion.div
        className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-30"
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[200px]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-red-500/15 rounded-full blur-[200px]"
        animate={{
          scale: [1.4, 1, 1.4],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 6 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Terminal-Style Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* System Status */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#ff0000]"
            />
            <span className="text-red-500 font-mono text-sm tracking-wider">SYSTEM_BREACH_DETECTED</span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#ff0000]"
            />
          </div>

          {/* Main Terminal Window */}
          <div className="max-w-5xl mx-auto bg-black/90 backdrop-blur-xl border-2 border-red-500/40 rounded-xl overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.4)]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-red-500/10 border-b border-red-500/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                </div>
                <span className="text-xs font-mono text-red-400">root@cyberacademy:/exploit#</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-mono text-green-400">{activeUsers} HACKERS_ONLINE</span>
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-10 md:p-16 space-y-8">
              {/* Typing animation */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-mono text-left space-y-2 text-sm text-gray-400 mb-12"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-green-500">$ sudo su</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-yellow-400">[!] Elevating privileges...</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 1.5 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-green-500">[+] Root access granted</span>
                </motion.div>
              </motion.div>

              {/* Main Headline */}
              <div className="text-center space-y-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black font-heading leading-none"
                >
                  <div className="text-white mb-3">YOUR ACCESS IS</div>
                  <div className="relative inline-block">
                    <motion.span
                      className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-cyan-500"
                      animate={{
                        backgroundPosition: ['0%', '100%', '0%'],
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                      style={{ backgroundSize: '200% 200%' }}
                    >
                      PENDING
                    </motion.span>
                    {/* Glitch bars */}
                    <motion.div
                      className="absolute -left-2 top-1/3 w-full h-1 bg-red-500"
                      animate={{ x: [-10, 10, -10], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
                    />
                  </div>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.3 }}
                  className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-mono"
                >
                  <span className="text-red-500">&gt;&gt;</span> You&apos;ve seen the arsenal. You&apos;ve read the exploits.
                  <br />
                  <span className="text-green-500">Now breach the system and claim your position among the elite.</span>
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.6, type: 'spring' }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
              >
                <motion.button
                  onClick={() => router.push('/courses')}
                  className="group relative px-10 py-5 bg-gradient-to-r from-red-500 to-green-500 text-black font-black rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.5)] font-mono text-lg"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0,255,65,0.8)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-green-400"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center gap-3">
                    <span>&gt;&gt;</span>
                    <span>{glitchText}_ATTACK_SEQUENCE</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      _
                    </motion.span>
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => router.push('/about')}
                  className="group px-10 py-5 border-2 border-red-500/50 text-red-500 font-black rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-all font-mono text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-3">
                    <span>SYSTEM_INFO</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Elite Features Grid - Hacker Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          {/* Feature 1 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-75 blur transition-opacity"></div>
            <div className="relative bg-black/90 border-2 border-green-500/30 rounded-xl p-8 backdrop-blur-xl group-hover:border-green-500 transition-all overflow-hidden">
              {/* Scan line effect */}
              <motion.div
                className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-green-500/20 to-transparent"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10">
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  💀
                </motion.div>
                <h3 className="text-xl font-black text-green-500 mb-3 font-mono">HANDS-ON_LABS</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Real vulnerable systems to exploit. No simulations. Actual penetration testing environments where you root machines and steal flags.
                </p>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-green-500/30 group-hover:border-green-500 transition-colors"></div>
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-green-500/30 group-hover:border-green-500 transition-colors"></div>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl opacity-0 group-hover:opacity-75 blur transition-opacity"></div>
            <div className="relative bg-black/90 border-2 border-red-500/30 rounded-xl p-8 backdrop-blur-xl group-hover:border-red-500 transition-all overflow-hidden">
              {/* Scan line effect */}
              <motion.div
                className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-red-500/20 to-transparent"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  🔥
                </motion.div>
                <h3 className="text-xl font-black text-red-500 mb-3 font-mono">UPDATED_WEEKLY</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Fresh exploits, new CVEs, latest attack vectors. Our content evolves with the threat landscape. Stay ahead of defenders.
                </p>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-red-500/30 group-hover:border-red-500 transition-colors"></div>
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-red-500/30 group-hover:border-red-500 transition-colors"></div>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-75 blur transition-opacity"></div>
            <div className="relative bg-black/90 border-2 border-cyan-500/30 rounded-xl p-8 backdrop-blur-xl group-hover:border-cyan-500 transition-all overflow-hidden">
              {/* Scan line effect */}
              <motion.div
                className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 2 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  👾
                </motion.div>
                <h3 className="text-xl font-black text-cyan-500 mb-3 font-mono">ELITE_COMMUNITY</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Join 15K+ hackers in our encrypted channels. Share zero-days, collaborate on CTFs, and network with security professionals worldwide.
                </p>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-500 transition-colors"></div>
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-500 transition-colors"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-red-500/10 border-2 border-yellow-500/40 rounded-lg p-6 backdrop-blur-xl overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative z-10 flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-3xl"
              >
                ⚠️
              </motion.div>
              <div className="flex-1">
                <h4 className="text-yellow-500 font-black mb-2 font-mono text-lg">WARNING: ETHICAL_USE_ONLY</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  All training is for authorized penetration testing, bug bounties, CTF competitions, and defensive security only. Unauthorized access to systems is illegal. Use your skills ethically.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Corner brackets for entire section */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-green-500/30"></div>
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-green-500/30"></div>
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-green-500/30"></div>
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-green-500/30"></div>
    </section>
  );
}
