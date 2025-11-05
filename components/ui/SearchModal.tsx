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
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-3xl bg-card-bg border-2 border-accent-cyan/40 rounded-2xl shadow-2xl shadow-accent-cyan/30 overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 0 80px rgba(0, 255, 159, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh'
          }}
        >
          {/* Search Header */}
          <div className="relative border-b border-accent-cyan/20">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-accent-blue/5 to-accent-cyan/5"></div>

            <div className="relative flex items-center gap-4 p-6">
              {/* Search Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center border border-accent-cyan/50">
                  <svg
                    className="w-5 h-5 text-accent-cyan"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Search Input */}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses... (e.g., 'web security', 'ethical hacking')"
                className="flex-1 bg-transparent text-white text-lg placeholder-text-secondary focus:outline-none"
              />

              {/* Loading Indicator */}
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-accent-cyan border-t-transparent rounded-full"
                />
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-accent-cyan/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-text-secondary hover:text-accent-cyan transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {searchQuery.trim().length < 2 ? (
              // Empty state - show tips
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-cyan/10 rounded-xl flex items-center justify-center border border-accent-cyan/30">
                  <svg
                    className="w-8 h-8 text-accent-cyan"
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
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Quick Search</h3>
                <p className="text-text-secondary text-sm mb-6">
                  Type at least 2 characters to start searching
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Web Security', 'Ethical Hacking', 'Penetration Testing', 'Network Security'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg text-sm text-accent-cyan font-medium transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-accent-cyan/20">
                  <p className="text-xs text-text-secondary">
                    <kbd className="px-2 py-1 bg-bg-dark rounded border border-accent-cyan/30 text-accent-cyan font-mono">↑</kbd>
                    <kbd className="px-2 py-1 bg-bg-dark rounded border border-accent-cyan/30 text-accent-cyan font-mono ml-1">↓</kbd>
                    <span className="mx-2">to navigate</span>
                    <kbd className="px-2 py-1 bg-bg-dark rounded border border-accent-cyan/30 text-accent-cyan font-mono">Enter</kbd>
                    <span className="mx-2">to select</span>
                    <kbd className="px-2 py-1 bg-bg-dark rounded border border-accent-cyan/30 text-accent-cyan font-mono">Esc</kbd>
                    <span className="mx-2">to close</span>
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
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-red/10 rounded-xl flex items-center justify-center border border-accent-red/30">
                  <svg
                    className="w-8 h-8 text-accent-red"
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
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No courses found</h3>
                <p className="text-text-secondary text-sm">
                  Try adjusting your search terms or browse all courses
                </p>
                <button
                  onClick={() => {
                    router.push('/courses');
                    onClose();
                  }}
                  className="mt-4 px-6 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg text-accent-cyan font-medium transition-colors"
                >
                  Browse All Courses
                </button>
              </div>
            ) : (
              // Results list
              <div className="py-2">
                {results.map((course, index) => (
                  <motion.button
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectCourse(course.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-colors ${
                      selectedIndex === index
                        ? 'bg-accent-cyan/10 border-l-2 border-accent-cyan'
                        : 'hover:bg-accent-cyan/5 border-l-2 border-transparent'
                    }`}
                  >
                    {/* Course Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-accent-cyan/30">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold truncate">{course.title}</h4>
                        <Badge variant={course.difficulty.toLowerCase() as any} size="sm">
                          {course.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-1 mb-1">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {course.rating}
                        </span>
                        <span>{course.category}</span>
                        <span className="text-accent-cyan font-bold">${course.price}</span>
                      </div>
                    </div>

                    {/* Enter icon for selected */}
                    {selectedIndex === index && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-accent-cyan/20 rounded flex items-center justify-center border border-accent-cyan/50">
                          <svg
                            className="w-4 h-4 text-accent-cyan"
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
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer with shortcuts (only when there are results) */}
          {results.length > 0 && (
            <div className="border-t border-accent-cyan/20 px-6 py-3 bg-accent-cyan/5">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-4">
                  <span>
                    <kbd className="px-2 py-1 bg-bg-dark rounded border border-accent-cyan/30 text-accent-cyan font-mono">↑↓</kbd>
                    <span className="ml-1">Navigate</span>
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-bg-dark rounded border border-accent-cyan/30 text-accent-cyan font-mono">Enter</kbd>
                    <span className="ml-1">Open</span>
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-bg-dark rounded border border-accent-cyan/30 text-accent-cyan font-mono">Esc</kbd>
                    <span className="ml-1">Close</span>
                  </span>
                </div>
                <span className="text-accent-cyan font-medium">{results.length} results</span>
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
