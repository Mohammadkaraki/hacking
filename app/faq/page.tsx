'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = ['All', 'Courses', 'Payments', 'Access', 'Certificates', 'Technical', 'Account'];

  const faqs = [
    {
      category: 'Courses',
      question: 'Do I need prior programming experience?',
      answer: 'It depends on the course. Our beginner courses (marked as "Beginner") require no prior experience - we start from the basics. Intermediate and Advanced courses may require some foundational knowledge. Check each course\'s prerequisites section for specific requirements.'
    },
    {
      category: 'Courses',
      question: 'How long do I have access to the courses?',
      answer: 'You get lifetime access to all purchased courses! This includes all future updates, new content additions, and improvements. Learn at your own pace, anytime, anywhere.'
    },
    {
      category: 'Courses',
      question: 'Are the courses updated regularly?',
      answer: 'Yes! We regularly update our courses to reflect the latest tools, techniques, and security trends. All updates are free and automatically available to students who have purchased the course.'
    },
    {
      category: 'Courses',
      question: 'Can I download the course materials?',
      answer: 'Yes! Once you purchase a course, you can download all supplementary materials including PDFs, tools, scripts, and lab files. Video lessons are available for streaming only to protect content integrity.'
    },
    {
      category: 'Payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods through our secure payment processors: PayPal and Stripe. This includes credit cards (Visa, Mastercard, American Express), debit cards, and PayPal balance.'
    },
    {
      category: 'Payments',
      question: 'What is your refund policy?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with a course, request a refund within 30 days of purchase (provided you\'ve completed less than 30% of the content). Refunds are processed within 5-10 business days.'
    },
    {
      category: 'Payments',
      question: 'Do you offer discounts or promotions?',
      answer: 'Yes! We regularly run promotional sales offering significant discounts. Subscribe to our newsletter or follow us on social media to be notified of upcoming sales. We also offer special pricing for students and bulk purchases.'
    },
    {
      category: 'Payments',
      question: 'Can I purchase courses for my team?',
      answer: 'Absolutely! For team purchases of 5 or more licenses, contact our sales team at sales@cyberacademy.com for volume discounts and enterprise licensing options.'
    },
    {
      category: 'Access',
      question: 'Can I access courses on mobile devices?',
      answer: 'Yes! Our platform is fully responsive and works seamlessly on all devices - desktop, laptop, tablet, and smartphone. Learn on the go from any device with an internet connection.'
    },
    {
      category: 'Access',
      question: 'Do I need to download any software?',
      answer: 'Most courses can be taken entirely online through your web browser. Some advanced courses may require you to install specific tools (like Kali Linux, VirtualBox, or security tools), which we provide detailed instructions for.'
    },
    {
      category: 'Access',
      question: 'Can I share my account with others?',
      answer: 'No, account sharing is not permitted under our Terms of Service. Each account is for individual use only. For team access, please contact us about our enterprise licensing options.'
    },
    {
      category: 'Access',
      question: 'What happens if I forget my password?',
      answer: 'Simply click "Forgot Password" on the login page and follow the instructions. We\'ll send you a password reset link via email. If you continue to have issues, contact our support team.'
    },
    {
      category: 'Certificates',
      question: 'Will I get a certificate upon completion?',
      answer: 'Yes! Upon completing all lessons and assessments in a course, you\'ll receive a certificate of completion that you can add to your resume, LinkedIn profile, or portfolio.'
    },
    {
      category: 'Certificates',
      question: 'Are the certificates industry-recognized?',
      answer: 'Our certificates demonstrate completion of practical, hands-on training from industry experts. While they are not formal certifications like CEH or OSCP, they are valuable proof of skills for employers and can complement official certifications.'
    },
    {
      category: 'Certificates',
      question: 'Can I get a certificate if I only complete part of a course?',
      answer: 'Certificates are awarded only upon 100% completion of all course content including lessons, labs, and any required assessments. This ensures the certificate represents comprehensive knowledge.'
    },
    {
      category: 'Technical',
      question: 'What are the system requirements?',
      answer: 'Minimum requirements: Modern web browser (Chrome, Firefox, Safari, Edge), stable internet connection (5+ Mbps recommended), and 4GB+ RAM. For lab-heavy courses, 8GB+ RAM and a dual-core processor are recommended.'
    },
    {
      category: 'Technical',
      question: 'I\'m having trouble playing videos. What should I do?',
      answer: 'First, ensure you have a stable internet connection. Try clearing your browser cache, disabling browser extensions, or switching to a different browser. If issues persist, contact our technical support team.'
    },
    {
      category: 'Technical',
      question: 'Can I adjust video playback speed?',
      answer: 'Yes! Our video player supports variable playback speeds from 0.5x to 2x, allowing you to learn at your preferred pace. You can also enable subtitles where available.'
    },
    {
      category: 'Technical',
      question: 'Do I need a VPN to access the courses?',
      answer: 'No VPN is required to access course content. However, some courses teach VPN usage and setup as part of the curriculum. Our platform is accessible globally without restrictions.'
    },
    {
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'Click "Sign In" and choose to sign up with your email, or use our quick OAuth login with Google or GitHub. Follow the prompts to complete your registration - it takes less than a minute!'
    },
    {
      category: 'Account',
      question: 'Can I change my email address?',
      answer: 'Yes! Go to your Account Settings in the dashboard, update your email address, and verify the new email. Your purchase history and progress will remain intact.'
    },
    {
      category: 'Account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, contact our support team at support@cyberacademy.com. Please note that account deletion is permanent and you will lose access to all purchased courses.'
    },
    {
      category: 'Account',
      question: 'Is my personal data secure?',
      answer: 'Absolutely! We use industry-standard encryption and security measures to protect your data. We never sell your personal information. Read our Privacy Policy for full details on data protection.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-accent-cyan via-white to-accent-blue bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
              Find answers to common questions about our courses, platform, and services.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
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

      {/* Categories */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
                  : 'bg-card-bg border border-accent-cyan/30 text-text-secondary hover:text-white hover:border-accent-cyan/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {filteredFaqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
            <p className="text-text-secondary">Try a different search term or category</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl overflow-hidden hover:border-accent-cyan/40 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan text-xs font-bold rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  </div>
                  <motion.svg
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-6 h-6 text-accent-cyan flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 text-text-secondary leading-relaxed border-t border-accent-cyan/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-accent-cyan/10 via-accent-blue/10 to-accent-cyan/10 border-2 border-accent-cyan/30 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-heading font-bold mb-3 text-white">
            Still have questions?
          </h2>
          <p className="text-text-secondary mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:support@cyberacademy.com"
              className="px-6 py-3 bg-accent-cyan hover:bg-accent-blue text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
          </div>
        </motion.div>
      </div>

        <Footer />
      </div>
    </div>
  );
}
