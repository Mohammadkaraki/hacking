'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Course } from '@/types';
import NeonCard from '@/components/ui/NeonCard';
import Badge from '@/components/ui/Badge';
import GlowButton from '@/components/ui/GlowButton';
import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';

export default function FeaturedCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses?featured=true');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    const map: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'> = {
      Beginner: 'beginner',
      Intermediate: 'intermediate',
      Advanced: 'advanced',
      Expert: 'expert',
    };
    return map[difficulty] || 'default';
  };

  return (
    <SectionContainer id="courses" className="bg-gradient-to-b from-black via-primary-dark/50 to-black relative overflow-hidden">
      {/* Matrix rain effect background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #00ff41 0px, #00ff41 1px, transparent 1px, transparent 40px)',
        }}></div>
      </div>

      <SectionHeading
        preheading="💀 ARSENAL ACCESS GRANTED"
        heading="Choose Your Weapon"
        subheading="Elite training modules crafted by real hackers. Pick your exploit, master the art, own the system."
      />

      {loading ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full mx-auto"
          />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {courses.slice(0, 6).map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group"
          >
            <div className="relative bg-gradient-to-br from-black via-primary-dark/60 to-black border-2 border-accent-cyan/30 rounded-2xl overflow-hidden backdrop-blur-xl hover:border-accent-cyan transition-all duration-500 h-full flex flex-col">
              {/* Glitch overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 pointer-events-none z-10"
                animate={{
                  x: [-2, 2, -2],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                }}
              />

              {/* Terminal Header */}
              <div className="flex items-center justify-between gap-2 p-4 border-b border-accent-cyan/20 bg-black/40">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs font-mono text-gray-500">{course.category.toLowerCase().replace(/\s+/g, '_')}.exe</span>
                </div>
                <Badge variant={getDifficultyVariant(course.difficulty)}>
                  {course.difficulty}
                </Badge>
              </div>

              {/* Course Thumbnail with Hacker Icon */}
              <div className="relative h-48 bg-gradient-to-br from-accent-cyan/5 to-accent-blue/5 flex items-center justify-center overflow-hidden group">
                {/* Animated scan lines */}
                <motion.div
                  className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-accent-cyan/10 to-transparent"
                  animate={{
                    y: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5,
                  }}
                />

                <motion.div
                  className="text-7xl z-10 transition-all duration-500 group-hover:scale-125"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(0,255,65,0.5))',
                  }}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {course.category === 'Ethical Hacking' ? '💀' : course.category === 'Penetration Testing' ? '⚔️' : course.category === 'Web Security' ? '🕷️' : course.category === 'Network Security' ? '🌐' : course.category === 'Digital Forensics' ? '🔬' : '☁️'}
                </motion.div>

                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent-cyan/30 group-hover:border-accent-cyan transition-colors"></div>
              </div>

              {/* Course Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Course Title with typing cursor effect */}
                <h3 className="text-xl font-heading font-bold mb-3 line-clamp-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-cyan group-hover:to-accent-blue transition-all">
                  <span className="font-mono text-accent-cyan/70 text-sm mr-2">&gt;</span>
                  {course.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                  {course.description}
                </p>

                {/* Stats with Hacker Theme */}
                <div className="flex items-center justify-between text-xs font-mono mb-4 py-3 px-4 bg-black/50 rounded-lg border border-accent-cyan/20">
                  <div className="flex flex-col items-center">
                    <span className="text-accent-cyan mb-1">⏱️</span>
                    <span className="text-gray-400">{course.duration}</span>
                  </div>
                  <div className="w-px h-8 bg-accent-cyan/20"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-accent-cyan mb-1">📚</span>
                    <span className="text-gray-400">{course.lessons}x</span>
                  </div>
                  <div className="w-px h-8 bg-accent-cyan/20"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-accent-cyan mb-1">👥</span>
                    <span className="text-gray-400">{(course.students || 0) > 999 ? `${Math.floor((course.students || 0) / 1000)}K+` : (course.students || 0)}</span>
                  </div>
                </div>

                {/* Price Section with Access Button */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-accent-cyan font-mono">
                          ${course.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${course.originalPrice}
                        </span>
                      </div>
                      <span className="text-xs text-accent-cyan/70 font-mono">
                        ↳ {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>

                  <GlowButton
                    size="sm"
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="w-full"
                  >
                    <span className="font-mono">ACCESS_GRANTED</span>
                    <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </GlowButton>
                </div>

                {/* Prerequisites with Lock Icon */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-accent-cyan/20">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-accent-red text-base">🔒</span>
                      <div className="flex-1">
                        <span className="text-accent-red font-mono font-bold block mb-1">PREREQUISITES:</span>
                        <span className="text-gray-400">{course.prerequisites.join(' • ')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="absolute top-8 right-4 flex items-center gap-2 z-20">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="text-xs font-mono text-green-500 opacity-70">LIVE</span>
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16 relative z-10"
      >
        <div className="inline-flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-accent-cyan/60 font-mono text-sm">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ▸
            </motion.span>
            <span>EXPAND_ARSENAL.sh</span>
          </div>
          <GlowButton size="lg" variant="outline" onClick={() => router.push('/courses')}>
            <span className="font-mono">BROWSE_ALL_WEAPONS</span>
            <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </GlowButton>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
