'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import Image from 'next/image';
import { Course } from '@/types';

export default function AllCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Typing effect
  const [displayText, setDisplayText] = useState('');
  const fullText = '> neural_network.initialize() --mode=elite --access=granted';

  // Dropdown states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const categories = ['All', 'Ethical Hacking', 'Penetration Testing', 'Web Security', 'Network Security', 'Digital Forensics', 'Cloud Security'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'newest', label: 'Latest' }
  ];

  // Category icons
  const categoryIcons: Record<string, string> = {
    'All': '🎯',
    'Ethical Hacking': '💀',
    'Penetration Testing': '⚔️',
    'Web Security': '🕷️',
    'Network Security': '🌐',
    'Digital Forensics': '🔬',
    'Cloud Security': '☁️'
  };

  useEffect(() => {
    fetchCourses();

    // Typing animation
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 40);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSortBy('popular');
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Beginner: 'from-green-400 to-emerald-500',
      Intermediate: 'from-cyan-400 to-blue-500',
      Advanced: 'from-orange-400 to-red-500',
      Expert: 'from-red-500 to-pink-600'
    };
    return colors[difficulty] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* PROFESSIONAL HACKER BACKGROUND - Enhanced with colors */}

      {/* Layer 1: Dynamic gradient base with green/cyan accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"></div>

      {/* Layer 2: Subtle color overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-950/20 via-transparent to-cyan-950/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-gray-950/50 to-green-950/30"></div>

      {/* Layer 3: Grid pattern (like home page) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 grid-pattern"></div>
      </div>

      {/* Layer 4: Glowing orbs for depth */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-green-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Layer 5: Subtle glowing nodes at grid intersections */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-500 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#00ff41]"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-cyan-500 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#00ffff]" style={{ animationDelay: '200ms' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#00ff99]" style={{ animationDelay: '400ms' }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse pointer-events-none shadow-[0_0_20px_#00ffff]" style={{ animationDelay: '600ms' }}></div>

      {/* Layer 6: More scattered glowing dots */}
      <div className="absolute top-1/2 left-1/5 w-1.5 h-1.5 bg-green-300 rounded-full blur-sm animate-pulse pointer-events-none" style={{ animationDelay: '800ms' }}></div>
      <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-cyan-300 rounded-full blur-sm animate-pulse pointer-events-none" style={{ animationDelay: '1000ms' }}></div>
      <div className="absolute top-1/5 left-2/3 w-1.5 h-1.5 bg-green-200 rounded-full blur-sm animate-pulse pointer-events-none" style={{ animationDelay: '1200ms' }}></div>

      {/* Layer 7: Vignette for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/80 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-20">
        <Navbar />

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Terminal Command */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 font-mono text-sm"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-blue-500/10 border border-green-500/30 rounded-lg backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,65,0.2)]">
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#00ff41]"
                />
                <span className="text-green-400">{displayText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-2 h-4 bg-green-500 inline-block ml-1"
                />
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none">
                <div className="relative inline-block">
                  <motion.span
                    className="bg-gradient-to-r from-white via-green-400 to-cyan-400 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    Neural Academy
                  </motion.span>
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-green-500/30 via-cyan-500/30 to-blue-500/30 rounded-2xl blur-3xl -z-10"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
                AI-powered cybersecurity training for elite professionals.{' '}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 font-bold"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  {filteredCourses.length} programs
                </motion.span>{' '}
                in quantum databank.
              </p>
            </motion.div>

            {/* Advanced Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl"
            >
              <div className="relative group">
                {/* Multi-layer glow */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-50 blur-xl"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-2xl transition duration-500" />

                {/* Search container */}
                <div className="relative bg-gradient-to-br from-black via-gray-900 to-black border-2 border-green-500/30 rounded-2xl p-1 backdrop-blur-2xl">
                  <div className="bg-black/90 rounded-xl relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-cyan-500/5 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Initialize quantum search protocol..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="relative w-full px-8 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg z-10"
                    />
                  </div>
                </div>

                {/* Animated search icon */}
                <motion.div
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-green-500 via-cyan-500 to-blue-500 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative bg-gradient-to-br from-gray-900/50 via-gray-900/30 to-gray-900/50 backdrop-blur-2xl border border-green-500/20 rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2300ff41' stroke-width='1'/%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px',
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '60px 60px'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              <div className="relative grid md:grid-cols-4 gap-6">
                {/* Category */}
                <div className="relative">
                  <label className="block text-xs font-bold text-green-400 mb-3 uppercase tracking-wider">
                    Category
                  </label>
                  <button
                    onClick={() => {
                      setCategoryOpen(!categoryOpen);
                      setDifficultyOpen(false);
                      setSortOpen(false);
                    }}
                    className="w-full px-5 py-4 bg-black/50 border border-green-500/30 rounded-xl text-left text-white hover:border-green-500/60 hover:bg-green-500/5 transition-all flex items-center justify-between group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="flex items-center gap-3 relative z-10">
                      <span className="text-2xl">{categoryIcons[selectedCategory]}</span>
                      <span className="font-semibold">{selectedCategory}</span>
                    </span>
                    <motion.svg
                      animate={{ rotate: categoryOpen ? 180 : 0 }}
                      className="w-5 h-5 text-green-400 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {categoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-50 w-full mt-3 bg-gray-900/95 backdrop-blur-xl border border-green-500/40 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setCategoryOpen(false);
                            }}
                            className={`w-full px-5 py-4 text-left transition-all flex items-center gap-3 border-b border-gray-800 last:border-none ${
                              selectedCategory === cat
                                ? 'bg-green-500/20 text-green-400 font-semibold'
                                : 'text-gray-300 hover:bg-green-500/10 hover:text-white'
                            }`}
                          >
                            <span className="text-2xl">{categoryIcons[cat]}</span>
                            <span>{cat}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Difficulty */}
                <div className="relative">
                  <label className="block text-xs font-bold text-green-400 mb-3 uppercase tracking-wider">
                    Difficulty
                  </label>
                  <button
                    onClick={() => {
                      setDifficultyOpen(!difficultyOpen);
                      setCategoryOpen(false);
                      setSortOpen(false);
                    }}
                    className="w-full px-5 py-4 bg-black/50 border border-green-500/30 rounded-xl text-left text-white hover:border-green-500/60 hover:bg-green-500/5 transition-all flex items-center justify-between group font-semibold relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">{selectedDifficulty}</span>
                    <motion.svg
                      animate={{ rotate: difficultyOpen ? 180 : 0 }}
                      className="w-5 h-5 text-green-400 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {difficultyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-50 w-full mt-3 bg-gray-900/95 backdrop-blur-xl border border-green-500/40 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {difficulties.map((diff) => (
                          <button
                            key={diff}
                            onClick={() => {
                              setSelectedDifficulty(diff);
                              setDifficultyOpen(false);
                            }}
                            className={`w-full px-5 py-4 text-left transition-all border-b border-gray-800 last:border-none ${
                              selectedDifficulty === diff
                                ? 'bg-green-500/20 text-green-400 font-semibold'
                                : 'text-gray-300 hover:bg-green-500/10 hover:text-white'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort */}
                <div className="relative">
                  <label className="block text-xs font-bold text-green-400 mb-3 uppercase tracking-wider">
                    Sort By
                  </label>
                  <button
                    onClick={() => {
                      setSortOpen(!sortOpen);
                      setCategoryOpen(false);
                      setDifficultyOpen(false);
                    }}
                    className="w-full px-5 py-4 bg-black/50 border border-green-500/30 rounded-xl text-left text-white hover:border-green-500/60 hover:bg-green-500/5 transition-all flex items-center justify-between group font-semibold relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                    <motion.svg
                      animate={{ rotate: sortOpen ? 180 : 0 }}
                      className="w-5 h-5 text-green-400 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-50 w-full mt-3 bg-gray-900/95 backdrop-blur-xl border border-green-500/40 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setSortOpen(false);
                            }}
                            className={`w-full px-5 py-4 text-left transition-all border-b border-gray-800 last:border-none ${
                              sortBy === opt.value
                                ? 'bg-green-500/20 text-green-400 font-semibold'
                                : 'text-gray-300 hover:bg-green-500/10 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear */}
                <div className="flex flex-col justify-end">
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-5 py-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl text-green-400 hover:from-green-500/20 hover:to-cyan-500/20 hover:border-green-500/60 transition-all flex items-center justify-center gap-3 group font-bold overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="relative z-10">Reset</span>
                  </motion.button>
                </div>
              </div>

              {/* Results */}
              <div className="mt-8 pt-6 border-t border-green-500/20 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing <span className="text-white font-bold mx-1">{filteredCourses.length}</span> of{' '}
                  <span className="text-white font-bold mx-1">{courses.length}</span> programs
                </div>
                {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full"
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-green-400 text-xs font-bold">Active Filters</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Courses Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="relative w-20 h-20 mb-6"
              >
                <div className="absolute inset-0 border-4 border-green-500/30 border-t-green-500 rounded-full" />
                <div className="absolute inset-2 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full" style={{ animation: 'spin 0.8s linear infinite reverse' }} />
              </motion.div>
              <p className="text-green-500 font-semibold">Initializing neural network...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="text-7xl mb-6 opacity-30">🔍</div>
              <h3 className="text-3xl font-bold text-white mb-4">No Programs Found</h3>
              <p className="text-gray-400 mb-8 text-lg">
                Try adjusting your search criteria or filters
              </p>
              <motion.button
                onClick={clearFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-green-500/30"
              >
                Reset All Filters
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="group cursor-pointer h-full"
                >
                  <div className="relative h-full">
                    {/* Multi-layer animated gradient border */}
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ backgroundSize: '200% 200%' }}
                    />
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl"
                      animate={{
                        backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      style={{ backgroundSize: '200% 200%' }}
                    />

                    <div className="relative h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-green-500/30 group-hover:border-green-500/60 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col backdrop-blur-xl">
                      {/* Image Header */}
                      <div className="relative h-56 overflow-hidden">
                        {/* Animated gradient mesh */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${
                              index % 3 === 0 ? 'rgba(0,255,65,0.2)' : index % 3 === 1 ? 'rgba(0,255,255,0.2)' : 'rgba(0,150,255,0.2)'
                            }, transparent)`,
                          }}
                          animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 180, 360],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{ duration: 10, repeat: Infinity }}
                        />

                        {/* Icon */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center z-20"
                          whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="text-8xl" style={{ filter: 'drop-shadow(0 0 30px rgba(0,255,65,0.8))' }}>
                            {categoryIcons[course.category]}
                          </div>
                        </motion.div>

                        {/* Difficulty Badge */}
                        <div className="absolute top-4 right-4 z-30">
                          <motion.div
                            className={`px-4 py-2 bg-gradient-to-r ${getDifficultyColor(course.difficulty)} rounded-lg backdrop-blur-sm shadow-lg`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {course.difficulty}
                            </span>
                          </motion.div>
                        </div>

                        {/* Category Tag */}
                        <div className="absolute bottom-4 left-4 z-30">
                          <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-green-500/50 rounded-lg text-xs font-semibold text-green-400 uppercase tracking-wider">
                            {course.category}
                          </span>
                        </div>

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-transparent z-10 opacity-50 group-hover:opacity-70 transition-opacity" />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Title */}
                        <motion.h3
                          className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-cyan-400 transition-all leading-tight"
                          whileHover={{ x: 5 }}
                        >
                          {course.title}
                        </motion.h3>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed flex-1">
                          {course.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-xs text-gray-500 mb-6 pb-5 border-b border-gray-800">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white font-semibold">{course.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{course.students?.toLocaleString() || 0} students</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <motion.span
                                className="text-3xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
                                whileHover={{ scale: 1.05 }}
                              >
                                ${course.price}
                              </motion.span>
                              {course.originalPrice > course.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${course.originalPrice}
                                </span>
                              )}
                            </div>
                            {course.originalPrice > course.price && (
                              <span className="text-xs font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                                Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1, x: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative w-14 h-14 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-green-500/60 transition-all overflow-hidden"
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                            <svg className="w-6 h-6 text-black relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
