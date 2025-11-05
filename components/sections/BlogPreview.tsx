'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { blogPosts } from '@/data/blog';
import NeonCard from '@/components/ui/NeonCard';
import Badge from '@/components/ui/Badge';
import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedBackground from '@/components/effects/AnimatedBackground';

export default function BlogPreview() {
  const router = useRouter();
  return (
    <SectionContainer id="blog" className="bg-gradient-to-b from-black via-primary-dark/40 to-black relative overflow-hidden">
      <AnimatedBackground variant="particles" opacity={0.15} color="#ff3366" />
      <AnimatedBackground variant="scanline" opacity={0.08} color="#ff3366" />
      <AnimatedBackground variant="diagonal" opacity={0.1} color="#ff3366" />

      <SectionHeading
        preheading="💀 INTELLIGENCE BRIEFING"
        heading="Latest Attack Vectors"
        subheading="Real-world exploitation techniques, advanced methodologies, and cutting-edge research from the field"
      />

      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => router.push(`/blog/${post.slug}`)}
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
                  <span className="text-xs font-mono text-gray-500">article_{post.id}.md</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-xs font-mono text-green-500">PUBLISHED</span>
                </div>
              </div>

              {/* Thumbnail with Image */}
              <div className="relative h-56 bg-gradient-to-br from-accent-cyan/5 to-accent-blue/5 overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Scanline effect */}
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

                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent-cyan/50 group-hover:border-accent-cyan transition-colors"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-md text-xs text-accent-cyan font-mono font-bold hover:bg-accent-cyan/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-bold mb-3 line-clamp-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-cyan group-hover:to-accent-blue transition-all">
                  <span className="font-mono text-accent-cyan/70 text-sm mr-2">&gt;&gt;</span>
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-accent-cyan/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan font-mono text-xs font-bold">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <span className="text-xs text-gray-300 font-medium block">{post.author}</span>
                      <span className="text-xs text-gray-500 font-mono">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Read More Link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/blog/${post.slug}`);
                  }}
                  className="mt-4 w-full py-3 bg-accent-cyan/10 border border-accent-cyan/40 rounded-lg text-accent-cyan hover:bg-accent-cyan/20 hover:border-accent-cyan transition-all text-sm font-mono font-bold flex items-center justify-center gap-2 group/btn"
                >
                  <span>ACCESS_ARTICLE</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-20 right-4 flex items-center gap-2 z-20 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-accent-cyan/30">
                <span className="text-xs font-mono text-accent-cyan font-bold">NEW</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
            <span>load_more_intelligence.sh</span>
          </div>
          <button
            onClick={() => router.push('/blog')}
            className="px-8 py-4 bg-black/60 backdrop-blur-md border-2 border-accent-cyan/40 text-white rounded-xl font-mono font-semibold hover:bg-accent-cyan/10 hover:border-accent-cyan transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-accent-cyan">▸</span>
              VIEW_ALL_BRIEFINGS
              <span className="text-accent-cyan">◂</span>
            </span>
            <motion.div
              className="absolute inset-x-0 h-full bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </button>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
