'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function TermsOfService() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using CyberAcademy ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.`
    },
    {
      title: '2. User Accounts',
      content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must:

• Be at least 18 years old or have parental consent to use the Platform
• Provide accurate, current, and complete information during registration
• Maintain and promptly update your account information
• Notify us immediately of any unauthorized use of your account
• Not share your account credentials with others

CyberAcademy reserves the right to suspend or terminate accounts that violate these terms.`
    },
    {
      title: '3. Course Access and Usage',
      content: `Upon successful purchase of a course, you are granted:

• Lifetime access to course materials (unless otherwise specified)
• Non-exclusive, non-transferable right to view and download course content for personal use
• Access to course updates and improvements at no additional cost

You may NOT:
• Share, distribute, or resell course content
• Use course materials for commercial purposes without written permission
• Remove or modify copyright notices or watermarks
• Use automated tools to scrape or download bulk content
• Share your login credentials to allow others access to paid content`
    },
    {
      title: '4. Payment Terms',
      content: `All course prices are listed in USD and include applicable taxes. By making a purchase, you agree to:

• Pay all fees associated with your purchase
• Provide accurate payment information
• Authorize us to charge your payment method
• Accept that prices may change without notice for future purchases

We use secure third-party payment processors (PayPal, Stripe) to handle transactions. We do not store your complete payment card information.`
    },
    {
      title: '5. Refund Policy',
      content: `We offer a 30-day money-back guarantee for all course purchases. To request a refund:

• Submit a refund request within 30 days of purchase
• Provide a valid reason for the refund
• Have completed less than 30% of the course content

Refunds will NOT be issued if:
• More than 30 days have passed since purchase
• You have completed more than 30% of the course
• You have downloaded course materials extensively
• You have violated these Terms of Service

Refunds are processed within 5-10 business days and returned to your original payment method.`
    },
    {
      title: '6. Intellectual Property Rights',
      content: `All content on the Platform, including but not limited to:

• Course videos, text, images, and materials
• Platform design, code, and functionality
• Trademarks, logos, and brand assets
• Downloadable resources and tools

...are the exclusive property of CyberAcademy or its content creators and are protected by copyright, trademark, and other intellectual property laws.

Your purchase grants you a license to use course content for personal, educational purposes only. All rights not expressly granted are reserved.`
    },
    {
      title: '7. User Conduct and Prohibited Activities',
      content: `You agree NOT to:

• Use the Platform for any illegal purposes
• Harass, abuse, or harm other users or instructors
• Upload malware, viruses, or malicious code
• Attempt to gain unauthorized access to our systems
• Reverse engineer or decompile Platform software
• Use the Platform to distribute spam or unsolicited messages
• Impersonate others or misrepresent your identity
• Engage in activities that could damage our reputation

Violations may result in immediate account termination without refund.`
    },
    {
      title: '8. Educational Purpose and Disclaimer',
      content: `All cybersecurity courses are provided for EDUCATIONAL PURPOSES ONLY. You agree to:

• Use learned skills and techniques ethically and legally
• Obtain proper authorization before testing security on any systems
• Comply with all applicable laws and regulations
• Not use course content for malicious or illegal hacking activities

CyberAcademy is not responsible for any misuse of course content. Students are solely responsible for their actions and any legal consequences.`
    },
    {
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by law, CyberAcademy shall not be liable for:

• Any indirect, incidental, special, or consequential damages
• Loss of profits, data, or business opportunities
• Unauthorized access to your account or data
• Course content accuracy or completeness
• Third-party services or links on the Platform
• Interruptions or errors in Platform availability

Our total liability shall not exceed the amount you paid for the specific course in question.`
    },
    {
      title: '10. Third-Party Services',
      content: `The Platform integrates with third-party services including:

• Payment processors (PayPal, Stripe)
• Authentication providers (Google, GitHub)
• Cloud storage services (AWS S3)
• Analytics and tracking tools

Your use of these services is subject to their respective terms and privacy policies. We are not responsible for third-party service failures or data practices.`
    },
    {
      title: '11. Content Updates and Changes',
      content: `We reserve the right to:

• Update, modify, or remove course content at any time
• Discontinue courses or features without notice
• Change Platform functionality or design
• Update these Terms of Service

Significant changes to Terms will be communicated via email or Platform notification. Continued use after changes constitutes acceptance.`
    },
    {
      title: '12. Account Termination',
      content: `We may suspend or terminate your account if:

• You violate these Terms of Service
• You engage in fraudulent activity
• Your account is inactive for extended periods
• We are required to do so by law
• We discontinue the Platform or specific services

Upon termination:
• Your access to courses will be revoked
• No refunds will be issued for violations
• Downloaded materials must be deleted
• You may not create new accounts without permission`
    },
    {
      title: '13. Dispute Resolution',
      content: `Any disputes arising from these Terms or use of the Platform shall be:

• First attempted to be resolved through good-faith negotiation
• Governed by the laws of [Your Jurisdiction]
• Subject to the exclusive jurisdiction of courts in [Your Location]
• Not eligible for class action lawsuits (individual arbitration only)

You agree to informal dispute resolution before pursuing legal action.`
    },
    {
      title: '14. Miscellaneous',
      content: `**Severability:** If any provision of these Terms is found invalid, the remaining provisions continue in effect.

**Assignment:** You may not transfer your account or rights. We may transfer our rights and obligations.

**Waiver:** Our failure to enforce any provision does not constitute a waiver of that provision.

**Entire Agreement:** These Terms constitute the entire agreement between you and CyberAcademy regarding Platform use.`
    },
    {
      title: '15. Contact Information',
      content: `For questions about these Terms of Service, please contact us at:

**Email:** legal@cyberacademy.com
**Support:** support@cyberacademy.com

Last Updated: January 2025

By using CyberAcademy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`
    }
  ];

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
        {/* Background Effects */}
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
              Terms of Service
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Please read these terms carefully before using CyberAcademy. By accessing our platform, you agree to be bound by these terms and conditions.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="mb-8 last:mb-0"
            >
              <h2 className="text-2xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                {section.title}
              </h2>
              <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
              {index < sections.length - 1 && (
                <div className="mt-8 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent"></div>
              )}
            </motion.div>
          ))}

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 p-6 bg-accent-cyan/10 border-2 border-accent-cyan/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Important Notice</h3>
                <p className="text-text-secondary text-sm">
                  These Terms of Service are a legally binding agreement. If you have any questions or concerns, please contact our legal team at legal@cyberacademy.com before using the Platform.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

        <Footer />
      </div>
    </div>
  );
}
