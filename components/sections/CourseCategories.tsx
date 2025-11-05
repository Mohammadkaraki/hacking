'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/categories';
import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';

export default function CourseCategories() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <SectionContainer className="bg-gradient-to-b from-black/50 to-primary-dark/50">
      <SectionHeading
        preheading="⚡ SELECT YOUR WEAPON"
        heading="Exploit Categories"
        subheading="Choose your attack vector and master the art of penetration"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring" }}
            onHoverStart={() => setHoveredId(category.id)}
            onHoverEnd={() => setHoveredId(null)}
            className="relative group"
          >
            <div
              onClick={() => router.push('/courses')}
              className="relative bg-black/60 backdrop-blur-xl border-2 border-accent-cyan/20 rounded-2xl p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:border-accent-cyan hover:scale-105 hover:shadow-2xl"
              style={{
                boxShadow: hoveredId === category.id ? `0 0 50px ${category.color}60, inset 0 0 30px ${category.color}20` : 'none',
                background: hoveredId === category.id
                  ? `linear-gradient(135deg, ${category.color}10 0%, black 100%)`
                  : 'rgba(0,0,0,0.6)',
              }}
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-6 opacity-70">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs font-mono text-gray-500 ml-2">root@cyberacademy:~$</span>
              </div>

              {/* Icon with animated background */}
              <div className="relative mb-6">
                <motion.div
                  animate={hoveredId === category.id ? {
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-7xl relative z-10"
                  style={{
                    filter: hoveredId === category.id ? `drop-shadow(0 0 20px ${category.color})` : 'none',
                  }}
                >
                  {category.icon}
                </motion.div>
                {/* Glowing orb behind icon */}
                {hoveredId === category.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.3 }}
                    className="absolute inset-0 rounded-full blur-3xl"
                    style={{ background: category.color }}
                  />
                )}
              </div>

              {/* Category Info */}
              <div className="space-y-3">
                <h3 className="text-2xl font-heading font-bold text-white group-hover:text-accent-cyan transition-colors">
                  {category.name}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Bottom Bar */}
              <div className="mt-6 pt-4 border-t border-accent-cyan/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-accent-cyan font-mono text-sm font-bold">
                    {category.courseCount} modules
                  </span>
                </div>
                <motion.div
                  animate={hoveredId === category.id ? { x: [0, 10, 0] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <svg
                    className="w-6 h-6 text-accent-cyan"
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
                </motion.div>
              </div>

              {/* Scanline effect */}
              {hoveredId === category.id && (
                <motion.div
                  initial={{ y: -100 }}
                  animate={{ y: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-accent-cyan/20 to-transparent pointer-events-none"
                />
              )}

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
