'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: GlowButtonProps) {
  const baseStyles = 'glow-button relative font-heading font-semibold rounded-lg transition-all duration-300 overflow-hidden';

  const variants = {
    primary: 'bg-accent-cyan text-primary-dark hover:bg-accent-cyan/90',
    secondary: 'bg-accent-blue text-primary-dark hover:bg-accent-blue/90',
    outline: 'border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
