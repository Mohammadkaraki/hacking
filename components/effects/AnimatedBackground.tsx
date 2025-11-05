'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'matrix' | 'grid' | 'particles' | 'scanline' | 'diagonal';
  opacity?: number;
  color?: string;
}

export default function AnimatedBackground({
  variant = 'matrix',
  opacity = 0.15,
  color = '#00ff41'
}: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Matrix Rain Effect */}
      {variant === 'matrix' && (
        <div className="absolute inset-0" style={{ opacity }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 font-mono text-xs"
              style={{
                left: `${i * 2.5}%`,
                color: color,
              }}
              animate={{
                y: ['0vh', '110vh'],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 3,
              }}
            >
              {Array.from({ length: 15 }).map((_, j) => (
                <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {/* Grid Pattern */}
      {variant === 'grid' && (
        <div
          className="absolute inset-0"
          style={{
            opacity,
            backgroundImage: `
              linear-gradient(0deg, ${color} 1px, transparent 1px),
              linear-gradient(90deg, ${color} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}

      {/* Floating Particles */}
      {variant === 'particles' && (
        <div className="absolute inset-0" style={{ opacity }}>
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: color,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Scanline Effect */}
      {variant === 'scanline' && (
        <motion.div
          className="absolute inset-x-0 h-[2px]"
          style={{
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            opacity,
          }}
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Diagonal Lines */}
      {variant === 'diagonal' && (
        <div className="absolute inset-0" style={{ opacity }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full"
              style={{
                top: `${30 + i * 20}%`,
                rotate: '-45deg',
                background: `linear-gradient(to right, transparent, ${color}, transparent)`,
              }}
              animate={{
                x: ['-100%', '200%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                delay: i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
