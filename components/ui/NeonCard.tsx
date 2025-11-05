'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  cornerAccent?: boolean;
}

export default function NeonCard({
  children,
  className = '',
  hoverEffect = true,
  cornerAccent = false,
}: NeonCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -8, scale: 1.02 } : {}}
      className={`
        relative bg-card-bg rounded-lg p-6
        neon-border
        ${hoverEffect ? 'card-lift' : ''}
        ${cornerAccent ? 'corner-accent' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
