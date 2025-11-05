'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { learningPath } from '@/data/learningPath';
import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowButton from '@/components/ui/GlowButton';

export default function LearningPath() {
  const router = useRouter();
  const levelColors = {
    Beginner: '#00ff9f',
    Intermediate: '#00d4ff',
    Advanced: '#ff9f00',
    Expert: '#ff3366',
  };

  return (
    <SectionContainer className="bg-gradient-to-b from-black via-primary-dark to-black relative overflow-hidden">
      {/* Circuit board background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #00ff41 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, #00ff41 1px, transparent 1px),
            radial-gradient(circle at 40% 20%, #00ff41 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Animated connecting lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <motion.path
            d="M 100 200 Q 300 100, 500 200 T 900 200"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff9f" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#ff3366" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <SectionHeading
        preheading="⚡ LEVEL UP SYSTEM"
        heading="Your Skill Tree"
        subheading="From noob to legendary hacker. Choose your path. Unlock your potential. Dominate the game."
      />

      <div className="relative">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between relative">
          {learningPath.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
              className="relative flex-1 group"
            >
              {/* Node - Hexagon Shape */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 180 }}
                  className="relative w-36 h-36 flex items-center justify-center cursor-pointer transition-all duration-500"
                  style={{
                    filter: `drop-shadow(0 0 30px ${levelColors[node.level]}80)`,
                  }}
                >
                  {/* Hexagon background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      background: `linear-gradient(135deg, ${levelColors[node.level]}20, black)`,
                      border: `3px solid ${levelColors[node.level]}`,
                    }}
                  />

                  {/* Pulsing glow effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      background: levelColors[node.level],
                      opacity: 0.1,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="text-5xl font-bold mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${levelColors[node.level]}, white)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      animate={{
                        textShadow: [
                          `0 0 10px ${levelColors[node.level]}40`,
                          `0 0 20px ${levelColors[node.level]}80`,
                          `0 0 10px ${levelColors[node.level]}40`,
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {index + 1}
                    </motion.div>
                    <div
                      className="text-xs font-mono font-bold uppercase tracking-wider"
                      style={{ color: levelColors[node.level] }}
                    >
                      {node.level}
                    </div>
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: levelColors[node.level] }}></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: levelColors[node.level] }}></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: levelColors[node.level] }}></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: levelColors[node.level] }}></div>
                </motion.div>

                {/* Info Card with Terminal Style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="mt-8 text-center max-w-[220px] relative"
                >
                  <div
                    className="bg-black/80 backdrop-blur-xl border-2 rounded-xl p-6 transition-all duration-500 hover:scale-105 relative overflow-hidden"
                    style={{
                      borderColor: `${levelColors[node.level]}40`,
                      boxShadow: `0 0 20px ${levelColors[node.level]}20`,
                    }}
                  >
                    {/* Terminal header dots */}
                    <div className="flex items-center gap-1.5 mb-4 opacity-50">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>

                    <h3 className="text-lg font-heading font-bold mb-3 text-white">{node.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{node.description}</p>

                    {/* Course badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border rounded-lg backdrop-blur-sm" style={{ borderColor: `${levelColors[node.level]}50` }}>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="text-base"
                      >
                        ⚡
                      </motion.span>
                      <span className="text-sm font-mono font-bold" style={{ color: levelColors[node.level] }}>
                        {node.courses} courses
                      </span>
                    </div>

                    {/* Scanline effect */}
                    <motion.div
                      className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
                      animate={{ y: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Animated Connecting Line */}
              {index < learningPath.length - 1 && (
                <div className="absolute top-[72px] left-1/2 w-full h-2 z-0 overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{
                      background: `linear-gradient(to right, ${levelColors[node.level]}, ${levelColors[learningPath[index + 1].level]})`,
                      opacity: 0.4,
                    }}
                  />
                  {/* Flowing energy effect */}
                  <motion.div
                    className="absolute top-0 left-0 h-full w-8"
                    style={{
                      background: `linear-gradient(to right, transparent, ${levelColors[learningPath[index + 1].level]}, transparent)`,
                      boxShadow: `0 0 20px ${levelColors[learningPath[index + 1].level]}`,
                    }}
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          {learningPath.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="flex gap-4 group"
            >
              {/* Node */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  className="relative w-20 h-20 flex items-center justify-center transition-all duration-500"
                  style={{
                    filter: `drop-shadow(0 0 20px ${levelColors[node.level]}60)`,
                  }}
                >
                  {/* Hexagon */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      background: `linear-gradient(135deg, ${levelColors[node.level]}20, black)`,
                      border: `3px solid ${levelColors[node.level]}`,
                    }}
                  />

                  <div className="relative z-10 text-center">
                    <div
                      className="text-2xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${levelColors[node.level]}, white)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                </motion.div>

                {/* Vertical Animated Line */}
                {index < learningPath.length - 1 && (
                  <div className="relative w-2 h-20 mt-2 overflow-hidden">
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to bottom, ${levelColors[node.level]}, ${levelColors[learningPath[index + 1].level]})`,
                        opacity: 0.4,
                      }}
                    />
                    <motion.div
                      className="absolute left-0 w-full h-6"
                      style={{
                        background: `linear-gradient(to bottom, transparent, ${levelColors[learningPath[index + 1].level]}, transparent)`,
                        boxShadow: `0 0 15px ${levelColors[learningPath[index + 1].level]}`,
                      }}
                      animate={{ y: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: index * 0.3 }}
                    />
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 pb-6">
                <div
                  className="bg-black/80 backdrop-blur-xl border-2 rounded-xl p-5 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden"
                  style={{
                    borderColor: `${levelColors[node.level]}40`,
                    boxShadow: `0 0 15px ${levelColors[node.level]}20`,
                  }}
                >
                  {/* Terminal header */}
                  <div className="flex items-center gap-1.5 mb-3 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>

                  <span
                    className="text-xs font-mono uppercase font-bold tracking-wider inline-block mb-2"
                    style={{ color: levelColors[node.level] }}
                  >
                    {node.level}
                  </span>
                  <h3 className="text-xl font-heading font-bold mb-2 text-white">{node.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{node.description}</p>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 border rounded-lg" style={{ borderColor: `${levelColors[node.level]}50` }}>
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.span>
                    <span className="text-xs font-mono font-bold" style={{ color: levelColors[node.level] }}>
                      {node.courses} courses
                    </span>
                  </div>

                  {/* Scanline */}
                  <motion.div
                    className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <GlowButton size="lg" onClick={() => router.push('/courses')}>
          View Full Roadmap
          <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </GlowButton>
      </motion.div>
    </SectionContainer>
  );
}
