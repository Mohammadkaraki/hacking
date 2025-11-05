'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/categories';
import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import Image from 'next/image';

export default function CourseCategories() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SectionContainer className="bg-gradient-to-b from-black via-[#0a0d1a] to-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-15">
        <Image
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
      </div>

      {/* Matrix rain effect */}
      <div className="absolute inset-0 overflow-hidden opacity-15">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 text-accent-cyan font-mono text-xs"
            style={{ left: `${i * 3.33}%` }}
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

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-20"
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `
          linear-gradient(0deg, #00d4ff 1px, transparent 1px),
          linear-gradient(90deg, #00d4ff 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-cyan/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-blue/20 rounded-full blur-[120px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 4 }}
      />

      {/* Diagonal lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-accent-cyan to-transparent"
            style={{ top: `${30 + i * 20}%`, rotate: '-45deg' }}
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

      <div className="relative z-10">
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
                className="relative bg-black/60 backdrop-blur-xl border-2 border-accent-cyan/20 rounded-2xl p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:border-accent-cyan hover:scale-105"
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
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
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
      </div>
    </SectionContainer>
  );
}
