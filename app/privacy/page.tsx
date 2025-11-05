'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect different types of information to provide and improve our services:

**Personal Information:**
• Name and email address (when you create an account)
• Profile information (avatar, bio, if provided)
• Payment information (processed securely by third-party providers)
• Authentication data from OAuth providers (Google, GitHub)

**Course Activity Data:**
• Course enrollments and progress
• Lesson completion status
• Quiz and assessment scores
• Downloaded course materials
• Review and rating submissions

**Technical Information:**
• IP address and geographic location
• Browser type and version
• Device information (type, OS, screen size)
• Referral sources and pages visited
• Session duration and interaction data
• Cookies and similar tracking technologies`
    },
    {
      title: '2. How We Use Your Information',
      content: `We use your data for the following purposes:

**Service Delivery:**
• Create and manage your account
• Process course purchases and provide access
• Track your learning progress
• Send transactional emails (purchase confirmations, password resets)
• Provide customer support

**Platform Improvement:**
• Analyze user behavior to improve courses and features
• Personalize content recommendations
• Conduct research and analytics
• Test new features and functionality

**Marketing Communications (with consent):**
• Send promotional emails about new courses
• Notify you of special offers and discounts
• Share platform updates and newsletters
• You can opt-out anytime through account settings

**Legal Compliance:**
• Comply with legal obligations
• Protect against fraud and abuse
• Enforce our Terms of Service
• Respond to legal requests`
    },
    {
      title: '3. Information Sharing and Disclosure',
      content: `We do NOT sell your personal information to third parties. We may share data with:

**Service Providers:**
• Payment processors (PayPal, Stripe) - for transaction processing
• Cloud hosting providers (AWS) - for secure storage
• Email service providers - for transactional and marketing emails
• Analytics tools (Google Analytics) - for usage insights

**Instructors:**
• Course creators may see aggregated, anonymized data about their courses
• Individual student data is not shared without explicit consent

**Legal Requirements:**
• When required by law, subpoena, or court order
• To protect our rights, property, or safety
• To investigate fraud or Terms of Service violations
• In connection with business transfers (mergers, acquisitions)

**With Your Consent:**
• When you explicitly agree to share information
• When you post public reviews or comments`
    },
    {
      title: '4. Data Security',
      content: `We implement industry-standard security measures to protect your data:

**Technical Safeguards:**
• SSL/TLS encryption for all data transmission
• Encrypted storage of sensitive information
• Secure authentication with OAuth 2.0
• Regular security audits and vulnerability assessments
• Firewall protection and intrusion detection

**Access Controls:**
• Limited employee access to personal data (need-to-know basis)
• Multi-factor authentication for administrative access
• Regular access reviews and permission audits

**Data Backup:**
• Regular automated backups of all data
• Redundant storage across multiple locations
• Disaster recovery procedures

While we strive to protect your data, no system is 100% secure. We cannot guarantee absolute security but commit to promptly addressing any breaches and notifying affected users as required by law.`
    },
    {
      title: '5. Cookies and Tracking Technologies',
      content: `We use cookies and similar technologies to enhance your experience:

**Essential Cookies:**
• Authentication and session management
• Security and fraud prevention
• Load balancing and performance

**Analytics Cookies:**
• Google Analytics for usage statistics
• Heatmaps and user behavior tracking
• Conversion tracking and A/B testing

**Marketing Cookies:**
• Remarketing and advertising
• Social media integration
• Email campaign tracking

**Cookie Management:**
You can control cookies through your browser settings. Note that disabling essential cookies may affect Platform functionality.

We use **NextAuth.js** for secure session management and authentication cookies.`
    },
    {
      title: '6. Third-Party Services',
      content: `Our Platform integrates with third-party services, each with their own privacy policies:

**Payment Processors:**
• PayPal: https://www.paypal.com/privacy
• Stripe: https://stripe.com/privacy

**Authentication Providers:**
• Google OAuth: https://policies.google.com/privacy
• GitHub OAuth: https://docs.github.com/en/site-policy/privacy-policies

**Cloud Services:**
• AWS S3: https://aws.amazon.com/privacy

**Analytics:**
• Google Analytics: https://policies.google.com/privacy

We are not responsible for the privacy practices of these third parties. Please review their policies independently.`
    },
    {
      title: '7. Your Rights and Choices',
      content: `Under GDPR, CCPA, and other privacy laws, you have the following rights:

**Access Rights:**
• Request a copy of your personal data
• View what data we have about you
• Obtain information about how we process your data

**Correction Rights:**
• Update or correct inaccurate information
• Complete incomplete data
• Update your profile at any time

**Deletion Rights ("Right to be Forgotten"):**
• Request deletion of your personal data
• Close your account permanently
• Note: Some data may be retained for legal compliance

**Portability Rights:**
• Export your data in a machine-readable format
• Transfer your data to another service

**Objection Rights:**
• Opt-out of marketing communications
• Object to automated decision-making
• Restrict certain data processing activities

**To Exercise Your Rights:**
Contact us at privacy@cyberacademy.com with your request. We will respond within 30 days.`
    },
    {
      title: '8. Data Retention',
      content: `We retain your information for as long as necessary to:

**Active Accounts:**
• Account data: Retained while your account is active
• Course progress: Lifetime access means indefinite retention
• Purchase history: Retained for at least 7 years (tax/legal requirements)

**Inactive Accounts:**
• After 3 years of inactivity, we may delete your account
• You will receive notification before deletion
• Reactivation possible within grace period

**Deleted Accounts:**
• Most data deleted within 90 days of account closure
• Backup retention: Up to 30 additional days
• Legal/financial records: Up to 7 years (legal requirement)

**Exceptions:**
• Aggregated, anonymized data may be retained indefinitely
• Data required for legal disputes or investigations
• Fraud prevention records`
    },
    {
      title: '9. Children\'s Privacy',
      content: `CyberAcademy is not intended for users under 18 years of age.

**Age Restrictions:**
• You must be 18+ to create an account
• Users under 18 require parental consent
• We do not knowingly collect data from children under 13

**If We Learn of Underage Users:**
• We will promptly delete their accounts
• Parents can request deletion by contacting us
• We will not penalize minors for age misrepresentation

Parents or guardians who believe their child has provided information to us should contact privacy@cyberacademy.com.`
    },
    {
      title: '10. International Data Transfers',
      content: `CyberAcademy operates globally, and your data may be transferred to and processed in countries other than your own.

**Data Transfer Mechanisms:**
• Standard Contractual Clauses (SCCs) for EU data transfers
• Adequacy decisions where applicable
• Your consent when required

**Data Storage Locations:**
• Primary servers: [Your Server Location]
• Backup servers: Multiple geographic locations
• CDN and edge locations worldwide

**Your Rights Remain Protected:**
• Regardless of processing location
• We ensure adequate safeguards
• You can object to international transfers`
    },
    {
      title: '11. California Privacy Rights (CCPA)',
      content: `California residents have additional rights under the CCPA:

**Right to Know:**
• What personal information we collect
• How we use and share your information
• Categories of third parties we share data with

**Right to Delete:**
• Request deletion of your personal information
• Subject to certain exceptions

**Right to Opt-Out:**
• We do NOT sell personal information
• Opt-out of marketing communications anytime

**Non-Discrimination:**
• We will not discriminate against you for exercising your rights
• Same quality of service regardless of privacy choices

**Authorized Agent:**
• You may designate an agent to make requests on your behalf
• Verification required

For CCPA requests: privacy@cyberacademy.com or call [Your Phone Number]`
    },
    {
      title: '12. European Union (GDPR) Rights',
      content: `EU residents have specific rights under GDPR:

**Legal Basis for Processing:**
• Contract performance (course delivery)
• Legitimate interests (platform improvement)
• Consent (marketing communications)
• Legal obligations (tax, fraud prevention)

**Data Protection Officer:**
For GDPR inquiries: dpo@cyberacademy.com

**Supervisory Authority:**
You have the right to lodge a complaint with your local data protection authority.

**Data Processing Locations:**
• Primary: EU-based servers (where applicable)
• Transfers outside EU: Protected by SCCs

**Withdrawal of Consent:**
• Withdraw consent anytime without penalty
• Does not affect lawfulness of prior processing`
    },
    {
      title: '13. Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time to reflect:

• Changes in our practices
• Legal or regulatory requirements
• New features or services
• User feedback

**Notification of Changes:**
• Email notification for material changes
• Platform notification banner
• "Last Updated" date at the bottom of this policy

**Your Continued Use:**
• Constitutes acceptance of updated policy
• Review regularly to stay informed
• Contact us with questions about changes`
    },
    {
      title: '14. Contact Us',
      content: `For questions, concerns, or requests regarding this Privacy Policy or your personal data:

**Email:**
• General inquiries: privacy@cyberacademy.com
• GDPR/EU inquiries: dpo@cyberacademy.com
• CCPA inquiries: privacy@cyberacademy.com

**Support Portal:**
• Visit our Help Center for privacy FAQs
• Submit a ticket for privacy-related requests

**Mailing Address:**
CyberAcademy Privacy Team
[Your Business Address]
[City, State, ZIP]
[Country]

**Response Time:**
We aim to respond to all privacy inquiries within 30 days.

**Last Updated:** January 2025

By using CyberAcademy, you acknowledge that you have read and understood this Privacy Policy.`
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
              Privacy Policy
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, protect, and share your personal information.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-accent-cyan">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>GDPR & CCPA Compliant</span>
            </div>
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
                <h3 className="text-lg font-bold text-white mb-2">Your Data, Your Rights</h3>
                <p className="text-text-secondary text-sm mb-3">
                  You have full control over your personal data. Contact us anytime to access, correct, or delete your information.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:privacy@cyberacademy.com" className="text-accent-cyan hover:text-accent-blue transition-colors text-sm font-semibold">
                    privacy@cyberacademy.com
                  </a>
                </div>
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
