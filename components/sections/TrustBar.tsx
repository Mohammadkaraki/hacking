'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { stats } from '@/data/stats';

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold gradient-text">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function TrustBar() {
  return (
    <section className="py-16 bg-gradient-to-b from-black via-primary-dark/30 to-black border-y border-accent-cyan/20 relative overflow-hidden">
      {/* Binary matrix background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 font-mono text-xs text-accent-cyan leading-relaxed">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap">
              {Array.from({ length: 200 }).map((_, j) => Math.random() > 0.5 ? '1' : '0').join('')}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Certification Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-accent-cyan rounded-full"
              />
              <div className="text-accent-cyan font-mono text-sm uppercase tracking-wider">
                🏆 Elite Training • Recognized By Industry Leaders
              </div>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-2 h-2 bg-accent-cyan rounded-full"
              />
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
              {['OSCP', 'CEH', 'PNPT', 'eJPT', 'CISSP', 'GPEN'].map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="relative group"
                >
                  <div className="px-6 py-3 bg-black/80 backdrop-blur-sm border-2 border-accent-cyan/40 rounded-xl font-mono font-bold text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan/10 transition-all duration-300 relative overflow-hidden">
                    <span className="relative z-10">{cert}</span>
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-accent-cyan/20 opacity-0 group-hover:opacity-100"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid with Hacker Theme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-black via-primary-dark/60 to-black border-2 border-accent-cyan/30 rounded-xl p-6 text-center hover:border-accent-cyan transition-all duration-500 relative overflow-hidden backdrop-blur-xl">
                {/* Scanline effect */}
                <motion.div
                  className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Icon based on stat */}
                <div className="text-3xl mb-3">
                  {index === 0 ? '💀' : index === 1 ? '🎯' : index === 2 ? '⚔️' : '🔥'}
                </div>

                {/* Counter */}
                <div className="relative z-10">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </div>

                {/* Label */}
                <p className="text-gray-400 mt-3 text-xs md:text-sm font-mono uppercase tracking-wider">
                  {stat.label}
                </p>

                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent-cyan/40 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent-cyan/40 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent-cyan/40 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent-cyan/40 group-hover:border-accent-cyan transition-colors"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
