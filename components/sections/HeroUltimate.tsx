'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HeroUltimate() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hackText, setHackText] = useState('');
  const [matrixColumns, setMatrixColumns] = useState<number[]>([]);

  const fullText = 'ACCESSING SECURE SYSTEM...';

  useEffect(() => {
    setMounted(true);

    // Matrix effect columns
    const cols = Array.from({ length: 50 }, (_, i) => i);
    setMatrixColumns(cols);

    // Typing effect
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setHackText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Background with image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
          alt="Hacking Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
      </div>

      {/* Matrix rain effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {matrixColumns.map((col) => (
          <motion.div
            key={col}
            className="absolute top-0 text-green-500 font-mono text-sm"
            style={{ left: `${col * 2}%` }}
            animate={{
              y: ['0vh', '100vh'],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 2,
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>{Math.random() > 0.5 ? '1' : '0'}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-30"
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(0deg, #00ff41 1px, transparent 1px),
          linear-gradient(90deg, #00ff41 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main Content */}
      <div className="relative z-40 w-full max-w-7xl mx-auto px-6 flex items-center justify-between gap-16">
        {/* Left Side - Main Content */}
        <div className="flex-1 space-y-8">
          {/* Typing indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-green-500 font-mono text-sm mb-8"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#00ff41]"
            />
            <span>{hackText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-green-500"
            />
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-4">
              <h1 className="text-7xl lg:text-8xl font-black leading-none">
                <div className="text-white mb-2">HACK</div>
                <div className="relative inline-block">
                  <motion.div
                    className="text-green-500"
                    animate={{
                      textShadow: [
                        '0 0 20px #00ff41',
                        '0 0 40px #00ff41',
                        '0 0 20px #00ff41',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    THE SYSTEM
                  </motion.div>
                  {/* Glitch bars */}
                  <motion.div
                    className="absolute -left-2 top-1/3 w-full h-1 bg-red-500"
                    animate={{ x: [-10, 10, -10], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <motion.div
                    className="absolute -right-2 top-2/3 w-full h-1 bg-cyan-500"
                    animate={{ x: [10, -10, 10], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3, delay: 0.1 }}
                  />
                </div>
              </h1>

              <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                Master <span className="text-green-500 font-semibold">offensive security</span>,
                penetration testing, and ethical hacking. From zero to elite hacker.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-8"
          >
            {[
              { label: 'Students', value: '15K+' },
              { label: 'Success', value: '97%' },
              { label: 'Courses', value: '50+' },
            ].map((stat, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="text-3xl font-black text-green-500 font-mono group-hover:text-green-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 pt-4"
          >
            <motion.button
              onClick={() => router.push('/courses')}
              className="group relative px-8 py-4 bg-green-500 text-black font-bold rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-green-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                <span>&gt;</span>
                <span>START_HACKING</span>
              </span>
            </motion.button>

            <motion.button
              onClick={() => {
                const coursesSection = document.getElementById('courses');
                coursesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 border-2 border-green-500/50 text-green-500 font-bold rounded-lg hover:bg-green-500/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              EXPLORE_COURSES
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side - Terminal Window */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:block flex-1 max-w-2xl"
        >
          <div className="relative">
            {/* Terminal */}
            <div className="bg-black/90 backdrop-blur-xl border-2 border-green-500/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.3)]">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 bg-green-500/10 border-b border-green-500/30">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs font-mono text-green-500">root@cyberacademy</span>
                </div>
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs font-mono text-green-500 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#00ff41]"></div>
                  CONNECTED
                </motion.div>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm space-y-2 h-[400px] overflow-hidden">
                <TerminalLine delay={0}>$ whoami</TerminalLine>
                <TerminalLine delay={0.4} color="text-green-500">elite_hacker</TerminalLine>

                <TerminalLine delay={0.8}>$ ls -la /skills</TerminalLine>
                <TerminalLine delay={1.2} color="text-green-400">drwxr-xr-x network_penetration</TerminalLine>
                <TerminalLine delay={1.4} color="text-green-400">drwxr-xr-x web_exploitation</TerminalLine>
                <TerminalLine delay={1.6} color="text-green-400">drwxr-xr-x privilege_escalation</TerminalLine>
                <TerminalLine delay={1.8} color="text-green-400">drwxr-xr-x exploit_development</TerminalLine>

                <TerminalLine delay={2.2}>$ cat /status/progress.txt</TerminalLine>
                <TerminalLine delay={2.6} color="text-cyan-400">[████████████████████] 100%</TerminalLine>
                <TerminalLine delay={3} color="text-yellow-400">[!] All systems compromised</TerminalLine>

                <TerminalLine delay={3.4}>$ sudo ./dominate_cybersecurity.sh</TerminalLine>
                <TerminalLine delay={3.8} color="text-green-500">[+] Access granted</TerminalLine>
                <TerminalLine delay={4.2} color="text-green-500">[+] Root privileges obtained</TerminalLine>
                <TerminalLine delay={4.6} color="text-green-500">[+++] YOU ARE NOW IN CONTROL</TerminalLine>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 5 }}
                  className="flex items-center gap-2 text-green-500 pt-4"
                >
                  <span>$</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-green-500"
                  />
                </motion.div>
              </div>

              {/* Terminal footer */}
              <div className="px-6 py-4 bg-green-500/5 border-t border-green-500/20 flex items-center justify-between text-xs font-mono">
                <div className="flex gap-6 text-gray-500">
                  <span>Lines: 847</span>
                  <span>Exploits: 1.2K</span>
                  <span>Success: 97%</span>
                </div>
                <div className="text-green-500">UTF-8</div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="absolute -top-4 -right-4 bg-green-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg"
            >
              <div className="text-2xl">⚡</div>
              <div className="text-xs">LIVE</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7, type: 'spring' }}
              className="absolute -bottom-4 -left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
            >
              <div className="text-2xl">🔥</div>
              <div className="text-xs">HOT</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-green-500/50"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-green-500/50"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-green-500/50"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-green-500/50"></div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            const coursesSection = document.getElementById('courses');
            coursesSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-xs text-green-500 font-mono">SCROLL_DOWN</span>
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Helper Component
function TerminalLine({
  children,
  delay,
  color = 'text-gray-300'
}: {
  children: React.ReactNode;
  delay: number;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={`${color} font-mono text-sm`}
    >
      {children}
    </motion.div>
  );
}
