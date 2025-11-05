'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { testimonials } from '@/data/testimonials';
import NeonCard from '@/components/ui/NeonCard';
import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import Image from 'next/image';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const visibleTestimonials = testimonials.slice(activeIndex * 3, activeIndex * 3 + 3);

  return (
    <SectionContainer className="bg-gradient-to-b from-primary-dark via-black to-primary-dark relative overflow-hidden">
      {/* Hacker grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #00ff41 0px, #00ff41 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #00ff41 0px, #00ff41 1px, transparent 1px, transparent 20px)',
        }}></div>
      </div>

      <SectionHeading
        preheading="🔥 HALL OF HACKERS"
        heading="Legendary Exploits"
        subheading="Real hackers. Real breaches. Real money. See what our operatives achieved after training."
      />

      <div className="grid md:grid-cols-3 gap-8 mb-8 relative z-10">
        {visibleTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.2, type: "spring" }}
            whileHover={{ y: -10, scale: 1.03 }}
            className="group"
          >
            <div className="relative bg-gradient-to-br from-black via-primary-dark/50 to-black border-2 border-accent-cyan/30 rounded-2xl p-8 h-full backdrop-blur-xl hover:border-accent-cyan transition-all duration-500 overflow-hidden">
              {/* Terminal-style header */}
              <div className="flex items-center gap-2 mb-6 opacity-50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-mono text-gray-600">testimonial.log</span>
              </div>

              {/* Hacker Quote with terminal effect */}
              <div className="mb-6 relative">
                <div className="text-2xl text-accent-cyan/40 font-mono absolute -top-2 -left-2">&gt;&gt;</div>
                <p className="text-gray-300 leading-relaxed text-sm pl-6 font-mono">
                  {testimonial.quote}
                </p>
              </div>

              {/* Hacker Profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-accent-cyan/20">
                <div className="relative">
                  <motion.div
                    className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-accent-cyan/50 group-hover:border-accent-cyan"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </motion.div>
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-mono font-bold text-accent-cyan text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono">{testimonial.role}</p>
                </div>
              </div>

              {/* Career Transformation */}
              {testimonial.beforeRole && testimonial.afterRole && (
                <div className="mt-6 pt-4 border-t border-accent-cyan/20">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded text-red-400">
                      {testimonial.beforeRole}
                    </div>
                    <motion.svg
                      className="w-5 h-5 text-accent-cyan"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                    <div className="text-xs font-mono px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded text-green-400">
                      {testimonial.afterRole}
                    </div>
                  </div>
                </div>
              )}

              {/* Achievement Badge */}
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 border border-accent-cyan/40 rounded-lg backdrop-blur-sm">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="text-lg"
                  >
                    ⚡
                  </motion.span>
                  <span className="text-sm font-mono text-accent-cyan font-bold">
                    {testimonial.achievement}
                  </span>
                </div>
              </motion.div>

              {/* Glitch effect on hover */}
              <motion.div
                className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 pointer-events-none"
                animate={{
                  x: [-2, 2, -2],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                }}
              ></motion.div>

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-accent-cyan w-8'
                : 'bg-card-border hover:bg-accent-cyan/50'
            }`}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
