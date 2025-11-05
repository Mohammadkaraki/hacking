'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import GlowButton from '@/components/ui/GlowButton';
import { useRouter } from 'next/navigation';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { value: '50,000+', label: 'Active Students', icon: '👥' },
    { value: '100+', label: 'Expert Courses', icon: '📚' },
    { value: '98%', label: 'Success Rate', icon: '🎯' },
    { value: '24/7', label: 'Support', icon: '💬' }
  ];

  const team = [
    {
      name: 'Alex Morgan',
      role: 'Founder & Lead Instructor',
      credentials: 'CEH, OSCP, CISSP',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070',
      bio: '15+ years in cybersecurity with Fortune 500 companies'
    },
    {
      name: 'Sarah Chen',
      role: 'Senior Security Researcher',
      credentials: 'OSCP, OSCE, GPEN',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070',
      bio: 'Zero-day vulnerability researcher and OSCP trainer'
    },
    {
      name: 'David Kumar',
      role: 'Web Security Expert',
      credentials: 'GWEB, OSWE, CEH',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070',
      bio: 'Bug bounty hunter with $500K+ in earnings'
    },
    {
      name: 'Emily Watson',
      role: 'Digital Forensics Lead',
      credentials: 'GCFE, GCFA, EnCE',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071',
      bio: 'Expert witness in cybercrime investigations'
    }
  ];

  const values = [
    {
      icon: '🎓',
      title: 'Quality Education',
      description: 'Industry-leading courses taught by certified professionals with real-world experience'
    },
    {
      icon: '🔒',
      title: 'Ethical Hacking',
      description: 'Teaching cybersecurity skills for legal, ethical purposes to protect and defend'
    },
    {
      icon: '🚀',
      title: 'Career Growth',
      description: 'Empowering students to launch and advance their cybersecurity careers'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Building a supportive community of learners and security professionals'
    }
  ];

  const milestones = [
    { year: '2020', event: 'CyberAcademy Founded', description: 'Started with a vision to democratize cybersecurity education' },
    { year: '2021', event: '10,000 Students', description: 'Reached our first major milestone with students worldwide' },
    { year: '2022', event: 'Platform Launch', description: 'Launched our custom learning platform with lifetime access' },
    { year: '2023', event: '50+ Courses', description: 'Expanded course catalog covering all cybersecurity domains' },
    { year: '2024', event: 'Industry Recognition', description: 'Named "Best Online Cybersecurity Platform" by TechEdu Awards' },
    { year: '2025', event: 'Global Expansion', description: 'Serving 50,000+ students across 150+ countries' }
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
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-accent-cyan via-white to-accent-blue bg-clip-text text-transparent">
              About CyberAcademy
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Empowering the next generation of cybersecurity professionals through world-class education and hands-on training.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
              Our Mission
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full"></div>
          </div>
          <p className="text-lg text-text-secondary leading-relaxed text-center max-w-4xl mx-auto">
            At CyberAcademy, we believe that cybersecurity knowledge should be accessible to everyone. Our mission is to provide high-quality, practical cybersecurity education that prepares students for real-world challenges. We combine expert instruction, hands-on labs, and cutting-edge content to create the ultimate learning experience.
          </p>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl p-6 hover:border-accent-cyan/40 transition-all"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
              <p className="text-text-secondary text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Meet Our Expert Team
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full mb-4"></div>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Learn from industry veterans with decades of combined experience in cybersecurity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl overflow-hidden hover:border-accent-cyan/40 transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-accent-cyan text-sm mb-2">{member.role}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.credentials.split(', ').map((cert, i) => (
                    <span key={i} className="px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
                <p className="text-text-secondary text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Our Journey
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-cyan"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-6 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-inherit`}>
                  <div className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-xl p-6">
                    <div className="inline-block px-4 py-1 bg-accent-cyan/20 text-accent-cyan font-bold rounded-full mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.event}</h3>
                    <p className="text-text-secondary text-sm">{milestone.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden md:flex w-4 h-4 bg-accent-cyan rounded-full border-4 border-bg-dark shadow-lg shadow-accent-cyan/50 flex-shrink-0 z-10"></div>

                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-accent-cyan/10 via-accent-blue/10 to-accent-cyan/10 border-2 border-accent-cyan/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Ready to Start Your Cybersecurity Journey?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students learning from industry experts and building successful careers in cybersecurity.
          </p>
          <GlowButton size="lg" onClick={() => router.push('/#courses')}>
            Explore Courses
          </GlowButton>
        </motion.div>
      </div>

        <Footer />
      </div>
    </div>
  );
}
