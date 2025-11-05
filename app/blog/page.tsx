'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { blogPosts } from '@/data/blog';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function BlogPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Get all unique tags
  const allTags = ['All', ...Array.from(new Set(blogPosts.flatMap(post => post.tags)))];

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

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

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-accent-cyan via-white to-accent-blue bg-clip-text text-transparent">
              Blog & Resources
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Stay updated with the latest cybersecurity trends, tutorials, and insights from our expert team.
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
                placeholder="Search articles..."
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

      {/* Tags Filter */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                selectedTag === tag
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
                  : 'bg-card-bg border border-accent-cyan/30 text-text-secondary hover:text-white hover:border-accent-cyan/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-text-secondary">Try a different search term or tag</p>
          </motion.div>
        ) : (
          <>
            {/* Featured Post */}
            {!searchQuery && selectedTag === 'All' && filteredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div
                  onClick={() => router.push(`/blog/${filteredPosts[0].slug}`)}
                  className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/30 rounded-2xl overflow-hidden hover:border-accent-cyan/50 transition-all cursor-pointer group"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <img
                        src={filteredPosts[0].thumbnail}
                        alt={filteredPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent md:bg-gradient-to-r"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-accent-cyan text-white text-sm font-bold rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm text-accent-cyan font-semibold">{filteredPosts[0].author}</span>
                        <span className="text-text-secondary">•</span>
                        <span className="text-sm text-text-secondary">{filteredPosts[0].date}</span>
                        <span className="text-text-secondary">•</span>
                        <span className="text-sm text-text-secondary">{filteredPosts[0].readTime}</span>
                      </div>
                      <h2 className="text-3xl font-heading font-bold mb-4 text-white group-hover:text-accent-cyan transition-colors">
                        {filteredPosts[0].title}
                      </h2>
                      <p className="text-text-secondary mb-6 line-clamp-3">
                        {filteredPosts[0].excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filteredPosts[0].tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-xs font-semibold rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Regular Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(searchQuery || selectedTag !== 'All' ? 0 : 1).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl overflow-hidden hover:border-accent-cyan/40 transition-all cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                      <span className="text-accent-cyan font-semibold">{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-3 text-white group-hover:text-accent-cyan transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-accent-cyan/10 text-accent-cyan text-xs font-semibold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-accent-cyan/10 via-accent-blue/10 to-accent-cyan/10 border-2 border-accent-cyan/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Get the latest cybersecurity articles, tutorials, and course updates delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-card-bg border border-accent-cyan/30 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent-cyan"
            />
            <button className="px-8 py-3 bg-accent-cyan hover:bg-accent-blue text-white font-semibold rounded-lg transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

        <Footer />
      </div>
    </div>
  );
}
