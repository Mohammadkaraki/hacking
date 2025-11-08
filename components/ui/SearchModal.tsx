'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Badge from './Badge';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail: string;
  price: number;
  rating: number;
  students?: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure we only render on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input and freeze body scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      // Focus input
      if (inputRef.current) {
        inputRef.current.focus();
      }

      // Freeze body scroll - simple overflow hidden
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore body scroll when modal closes
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Search courses
  useEffect(() => {
    const searchCourses = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/courses/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCourses, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectCourse(results[selectedIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelectCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
    onClose();
    setSearchQuery('');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        style={{
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -30 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="w-full max-w-4xl bg-gradient-to-b from-black via-[#0a0d1a] to-black border-2 border-green-500/40 rounded-3xl shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 0 100px rgba(0, 255, 65, 0.4), 0 25px 80px rgba(0, 0, 0, 0.6)',
            maxHeight: '85vh'
          }}
        >
          {/* Top glow accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>

          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `
              linear-gradient(0deg, #00ff41 1px, transparent 1px),
              linear-gradient(90deg, #00ff41 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>

          {/* Search Header */}
          <div className="relative border-b border-green-500/20 bg-black/40 backdrop-blur-xl">
            <div className="relative flex items-center gap-4 p-8">
              {/* Search Icon */}
              <div className="flex-shrink-0">
                <motion.div
                  className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border-2 border-green-500/50 relative"
                  animate={{ borderColor: ['rgba(0, 255, 65, 0.5)', 'rgba(0, 255, 65, 0.8)', 'rgba(0, 255, 65, 0.5)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {/* Pulsing dot */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>

              {/* Search Input */}
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, topics, skills..."
                  className="w-full bg-transparent text-white text-xl font-medium placeholder-gray-500 focus:outline-none"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                />
                <div className="mt-1 text-xs text-gray-600 font-medium">
                  Try: <span className="text-green-500/70">Ethical Hacking</span>, <span className="text-green-500/70">Web Security</span>, <span className="text-green-500/70">Penetration Testing</span>
                </div>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-3 border-green-400 border-t-transparent rounded-full"
                />
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center hover:bg-green-500/10 rounded-xl transition-all border border-transparent hover:border-green-500/30 group"
              >
                <svg
                  className="w-6 h-6 text-gray-500 group-hover:text-green-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-black/20">
            {searchQuery.trim().length < 2 ? (
              // Empty state - show tips
              <div className="p-12 text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-2xl flex items-center justify-center border-2 border-green-500/30 relative"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg
                    className="w-10 h-10 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-green-400"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">Search Courses</h3>
                <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
                  Find the perfect course to level up your cybersecurity skills
                </p>
                <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
                  {['Web Security', 'Ethical Hacking', 'Penetration Testing', 'Network Security'].map((term) => (
                    <motion.button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 border-2 border-green-500/30 hover:border-green-500/60 rounded-xl text-sm text-green-400 font-semibold transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-green-500/20">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <kbd className="px-2.5 py-1.5 bg-black rounded-lg border-2 border-green-500/30 text-green-400 font-mono text-xs font-bold">↑↓</kbd>
                      <span className="text-gray-400">navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2.5 py-1.5 bg-black rounded-lg border-2 border-green-500/30 text-green-400 font-mono text-xs font-bold">Enter</kbd>
                      <span className="text-gray-400">select</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2.5 py-1.5 bg-black rounded-lg border-2 border-green-500/30 text-green-400 font-mono text-xs font-bold">Esc</kbd>
                      <span className="text-gray-400">close</span>
                    </span>
                  </p>
                </div>
              </div>
            ) : loading ? (
              // Loading state
              <div className="p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 mx-auto border-4 border-accent-cyan border-t-transparent rounded-full"
                />
                <p className="mt-4 text-text-secondary">Searching courses...</p>
              </div>
            ) : results.length === 0 ? (
              // No results
              <div className="p-12 text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center border-2 border-red-500/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg
                    className="w-10 h-10 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">No Matches Found</h3>
                <p className="text-gray-400 text-base mb-6">
                  We couldn't find any courses matching "<span className="text-white font-semibold">{searchQuery}</span>"
                </p>
                <motion.button
                  onClick={() => {
                    router.push('/courses');
                    onClose();
                  }}
                  className="px-8 py-3 bg-green-500/10 hover:bg-green-500/20 border-2 border-green-500/30 hover:border-green-500/60 rounded-xl text-green-400 font-bold transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse All Courses
                </motion.button>
              </div>
            ) : (
              // Results list
              <div className="py-3 px-4">
                {results.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative w-full text-left p-4 flex items-center gap-5 rounded-xl mb-2 transition-all duration-200 border-2 cursor-pointer ${
                      selectedIndex === index
                        ? 'bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/10'
                        : 'bg-black/30 border-transparent hover:bg-green-500/5 hover:border-green-500/20'
                    }`}
                  >
                    {/* Invisible overlay for hover detection */}
                    <div
                      className="absolute inset-0 z-10"
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleSelectCourse(course.id)}
                    />

                    {/* Course Thumbnail */}
                    <div className="flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 border-green-500/30 relative group">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {selectedIndex === index && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-bold text-base truncate">{course.title}</h4>
                        <Badge variant={course.difficulty.toLowerCase() as any}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1 mb-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {course.rating}
                        </span>
                        <span className="text-gray-500">{course.category}</span>
                        <span className="text-green-400 font-bold text-sm">${course.price}</span>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={selectedIndex === index ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                          selectedIndex === index
                            ? 'bg-green-500/20 border-green-500'
                            : 'border-green-500/20'
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${selectedIndex === index ? 'text-green-400' : 'text-gray-600'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with shortcuts (only when there are results) */}
          {results.length > 0 && (
            <div className="border-t-2 border-green-500/20 px-8 py-4 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-xs">
                  <span className="flex items-center gap-2">
                    <kbd className="px-3 py-2 bg-black rounded-lg border-2 border-green-500/30 text-green-400 font-mono font-bold shadow-lg">↑↓</kbd>
                    <span className="text-gray-400 font-medium">Navigate</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-3 py-2 bg-black rounded-lg border-2 border-green-500/30 text-green-400 font-mono font-bold shadow-lg">Enter</kbd>
                    <span className="text-gray-400 font-medium">Select</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-3 py-2 bg-black rounded-lg border-2 border-green-500/30 text-green-400 font-mono font-bold shadow-lg">Esc</kbd>
                    <span className="text-gray-400 font-medium">Close</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/30">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-400 font-bold text-sm">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document root level
  return createPortal(modalContent, document.body);
}
