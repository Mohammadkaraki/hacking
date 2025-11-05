'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseModule } from '@/types';

interface CourseCurriculumProps {
  modules: CourseModule[];
  isPurchased: boolean;
}

export default function CourseCurriculum({ modules, isPurchased }: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([modules[0]?.id]));

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (modules.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <p>Curriculum details coming soon...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const isExpanded = expandedModules.has(module.id);
        const lessonCount = module.lessons?.length || 0;
        const freeLessons = module.lessons?.filter(l => l.isFree) || [];

        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:border-accent-cyan/50 transition-colors"
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-card-border/20 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Module Number */}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-lg flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-accent-cyan/30">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Module Info */}
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg mb-1">{module.title}</h3>
                  {module.description && (
                    <p className="text-text-secondary text-sm line-clamp-2">
                      {module.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {module.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                    </span>
                    {freeLessons.length > 0 && (
                      <span className="px-2 py-0.5 bg-accent-green/20 text-accent-green rounded text-xs font-semibold">
                        {freeLessons.length} Free Preview
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expand Icon */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 ml-4"
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            {/* Module Lessons */}
            <AnimatePresence>
              {isExpanded && module.lessons && module.lessons.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-card-border"
                >
                  <div className="px-6 py-4 space-y-2">
                    {module.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-card-border/20 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {/* Play Icon */}
                            <div className="flex-shrink-0">
                              {lesson.isFree || isPurchased ? (
                                <div className="w-8 h-8 bg-accent-cyan/20 rounded-full flex items-center justify-center group-hover:bg-accent-cyan/30 transition-colors">
                                  <svg
                                    className="w-4 h-4 text-accent-cyan"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">
                                {lessonIndex + 1}. {lesson.title}
                              </h4>
                            </div>

                            {/* Lesson Duration & Status */}
                            <div className="flex items-center gap-3">
                              {lesson.isFree && (
                                <span className="px-2 py-1 bg-accent-green/20 text-accent-green rounded text-xs font-semibold">
                                  FREE
                                </span>
                              )}
                              <span className="text-xs text-text-secondary font-mono">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
