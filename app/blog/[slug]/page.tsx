'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { blogPosts } from '@/data/blog';
import { notFound } from 'next/navigation';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Mock full content - in production this would come from CMS or markdown files
  const fullContent = {
    introduction: `Welcome to our comprehensive guide on ${post.title.toLowerCase()}. In this article, we'll dive deep into the topic and provide you with actionable insights and practical knowledge.`,
    sections: [
      {
        heading: 'Understanding the Basics',
        content: `Before we dive into the details, it's important to understand the fundamental concepts. This foundation will help you grasp the more advanced topics we'll cover later in this article.\n\nKey points to remember:\n• Always start with the basics before moving to advanced concepts\n• Practice regularly to reinforce your learning\n• Stay updated with the latest developments in the field\n• Join communities to learn from others' experiences`
      },
      {
        heading: 'Practical Applications',
        content: `Now that we've covered the theory, let's look at how these concepts apply in real-world scenarios. Understanding practical applications is crucial for mastering any cybersecurity skill.\n\nReal-world use cases include:\n• Enterprise security assessments\n• Bug bounty hunting\n• Penetration testing engagements\n• Security research and vulnerability disclosure`
      },
      {
        heading: 'Best Practices and Tips',
        content: `Based on years of experience in the field, here are some best practices that will help you succeed:\n\n1. Always obtain proper authorization before testing\n2. Document everything meticulously\n3. Follow responsible disclosure practices\n4. Continuously update your skills and knowledge\n5. Network with other professionals in the field\n\nRemember: ethical hacking requires responsibility and professionalism at all times.`
      },
      {
        heading: 'Tools and Resources',
        content: `To implement what you've learned, you'll need the right tools. Here are some essential resources:\n\n• Kali Linux - The industry-standard penetration testing platform\n• Burp Suite - For web application security testing\n• Metasploit - Exploitation framework and penetration testing tool\n• Wireshark - Network protocol analyzer\n• OWASP ZAP - Web application security scanner\n\nMake sure to practice in legal, controlled environments like HackTheBox, TryHackMe, or your own lab.`
      },
      {
        heading: 'Conclusion',
        content: `We've covered a lot of ground in this article. The key takeaway is that continuous learning and ethical practice are essential in cybersecurity. Whether you're just starting out or looking to advance your skills, remember that every expert was once a beginner.\n\nStay curious, stay ethical, and never stop learning!`
      }
    ]
  };

  // Get related posts
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

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

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/70 to-transparent"></div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 pb-20">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-accent-cyan/20 text-accent-cyan text-sm font-semibold rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-accent-cyan via-white to-accent-blue bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-accent-cyan/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-cyan/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-accent-cyan">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="font-semibold text-white">{post.author}</div>
                <div className="text-sm text-text-secondary">Security Expert</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-text-secondary leading-relaxed">
              {fullContent.introduction}
            </p>
          </div>

          {/* Article Sections */}
          {fullContent.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                {section.heading}
              </h2>
              <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-accent-cyan/20">
            <h3 className="text-lg font-bold text-white mb-4">Share this article:</h3>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg text-accent-cyan font-semibold transition-colors">
                Twitter
              </button>
              <button className="px-6 py-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg text-accent-cyan font-semibold transition-colors">
                LinkedIn
              </button>
              <button className="px-6 py-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg text-accent-cyan font-semibold transition-colors">
                Facebook
              </button>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-heading font-bold mb-8 text-center bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                  className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl overflow-hidden hover:border-accent-cyan/40 transition-all cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={relatedPost.thumbnail}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-accent-cyan transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/blog')}
            className="px-8 py-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border-2 border-accent-cyan/30 rounded-lg text-accent-cyan font-semibold transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </button>
        </div>
      </div>

        <Footer />
      </div>
    </div>
  );
}
