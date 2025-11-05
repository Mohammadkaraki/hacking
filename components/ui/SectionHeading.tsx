'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  preheading?: string;
  heading: string;
  subheading?: string;
  centered?: boolean;
}

export default function SectionHeading({
  preheading,
  heading,
  subheading,
  centered = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      {preheading && (
        <p className="text-accent-cyan text-sm font-mono uppercase tracking-wider mb-3">
          {preheading}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {heading}
        <span className="block h-1 w-24 bg-gradient-to-r from-accent-cyan to-accent-blue mt-4 ${centered ? 'mx-auto' : ''}"></span>
      </h2>
      {subheading && (
        <p className="text-text-secondary text-lg md:text-xl max-w-3xl ${centered ? 'mx-auto' : ''}">
          {subheading}
        </p>
      )}
    </motion.div>
  );
}
