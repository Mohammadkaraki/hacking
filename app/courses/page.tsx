'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import NeonCard from '@/components/ui/NeonCard';
import Badge from '@/components/ui/Badge';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';
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

  // Dropdown open states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const categories = ['All', 'Ethical Hacking', 'Penetration Testing', 'Web Security', 'Network Security', 'Digital Forensics', 'Cloud Security'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  useEffect(() => {
    fetchCourses();
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

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    // Sorting
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

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-bg-dark via-bg-dark/98 to-bg-dark">
      {/* Background Effects */}
      <MatrixRainBright />
      <GridPatternBright />
      <ParticleFieldBright />
      <CursorTrail />

      {/* Main Content */}
      <div className="relative z-10">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-accent-cyan via-white to-accent-blue bg-clip-text text-transparent">
              All Courses
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Explore our complete catalog of cybersecurity courses. Learn from experts and advance your career.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses by name, category, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-card-bg border-2 border-accent-cyan/30 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent-cyan transition-colors"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8 relative z-20">
        <div className="bg-card-bg border-2 border-accent-cyan/20 rounded-xl p-6 backdrop-blur-sm overflow-visible">
          <div className="grid md:grid-cols-4 gap-6 overflow-visible">
            {/* Category Filter */}
            <div className="relative overflow-visible">
              <label className="block text-sm font-semibold text-accent-cyan mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </label>
              <div className="relative overflow-visible">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full px-4 py-3 bg-gradient-to-br from-bg-dark via-bg-dark to-bg-dark/80 border-2 border-accent-cyan/30 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-lg focus:shadow-accent-cyan/20 hover:border-accent-cyan/50 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-accent-cyan/5 font-medium flex items-center justify-between"
                >
                  <span>{selectedCategory}</span>
                  <svg className={`w-5 h-5 text-accent-cyan transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-[100] w-full mt-2 bg-card-bg border-2 border-accent-cyan/40 rounded-lg shadow-2xl shadow-accent-cyan/20 overflow-hidden backdrop-blur-xl"
                  >
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-accent-cyan/20 transition-colors border-b border-accent-cyan/10 last:border-none ${
                          selectedCategory === category ? 'bg-accent-cyan/10 text-accent-cyan font-semibold' : 'text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="relative overflow-visible">
              <label className="block text-sm font-semibold text-accent-cyan mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Difficulty
              </label>
              <div className="relative overflow-visible">
                <button
                  onClick={() => setDifficultyOpen(!difficultyOpen)}
                  className="w-full px-4 py-3 bg-gradient-to-br from-bg-dark via-bg-dark to-bg-dark/80 border-2 border-accent-cyan/30 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-lg focus:shadow-accent-cyan/20 hover:border-accent-cyan/50 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-accent-cyan/5 font-medium flex items-center justify-between"
                >
                  <span>{selectedDifficulty}</span>
                  <svg className={`w-5 h-5 text-accent-cyan transition-transform duration-200 ${difficultyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {difficultyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-[100] w-full mt-2 bg-card-bg border-2 border-accent-cyan/40 rounded-lg shadow-2xl shadow-accent-cyan/20 overflow-hidden backdrop-blur-xl"
                  >
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => {
                          setSelectedDifficulty(difficulty);
                          setDifficultyOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-accent-cyan/20 transition-colors border-b border-accent-cyan/10 last:border-none ${
                          selectedDifficulty === difficulty ? 'bg-accent-cyan/10 text-accent-cyan font-semibold' : 'text-white'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sort By */}
            <div className="relative overflow-visible">
              <label className="block text-sm font-semibold text-accent-cyan mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort By
              </label>
              <div className="relative overflow-visible">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="w-full px-4 py-3 bg-gradient-to-br from-bg-dark via-bg-dark to-bg-dark/80 border-2 border-accent-cyan/30 rounded-lg text-white focus:outline-none focus:border-accent-cyan focus:shadow-lg focus:shadow-accent-cyan/20 hover:border-accent-cyan/50 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-accent-cyan/5 font-medium flex items-center justify-between"
                >
                  <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                  <svg className={`w-5 h-5 text-accent-cyan transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-[100] w-full mt-2 bg-card-bg border-2 border-accent-cyan/40 rounded-lg shadow-2xl shadow-accent-cyan/20 overflow-hidden backdrop-blur-xl"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-accent-cyan/20 transition-colors border-b border-accent-cyan/10 last:border-none ${
                          sortBy === option.value ? 'bg-accent-cyan/10 text-accent-cyan font-semibold' : 'text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 hover:from-accent-cyan/20 hover:to-accent-blue/20 border-2 border-accent-cyan/30 rounded-lg text-accent-cyan font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent-cyan/20 hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-4 border-t border-accent-cyan/20">
            <div className="flex items-center justify-between">
              <p className="text-text-secondary text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Showing <span className="text-accent-cyan font-bold text-base mx-1">{filteredCourses.length}</span> of <span className="text-accent-cyan font-bold text-base mx-1">{courses.length}</span> courses
              </p>
              {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery) && (
                <span className="text-xs bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full border border-accent-cyan/30 font-medium">
                  Filters Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"
            />
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-text-secondary mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-accent-cyan hover:bg-accent-blue text-white font-semibold rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => router.push(`/courses/${course.id}`)}
                className="cursor-pointer"
              >
                <NeonCard className="h-full">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={course.difficulty.toLowerCase() as any}>
                        {course.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2 line-clamp-2 hover:text-accent-cyan transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-text-secondary text-sm line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{course.students?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-accent-cyan/20">
                      <div>
                        <span className="text-2xl font-bold text-accent-cyan">${course.price}</span>
                        {course.originalPrice > course.price && (
                          <span className="ml-2 text-sm text-text-secondary line-through">${course.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-sm text-accent-cyan font-semibold">{course.category}</span>
                    </div>
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      </div>
    </div>
  );
}
