'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function InstructorsPage() {
  const router = useRouter();

  const instructors = [
    {
      id: '1',
      name: 'Alex Morgan',
      role: 'Founder & Lead Instructor',
      specialization: 'Ethical Hacking & Penetration Testing',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070',
      credentials: ['CEH', 'OSCP', 'CISSP', 'CompTIA Security+'],
      bio: 'Alex Morgan is a certified ethical hacker (CEH) and penetration tester with over 10 years of experience in cybersecurity. He has worked with Fortune 500 companies and government agencies to secure their infrastructure. Alex is passionate about teaching and has helped over 50,000 students launch their cybersecurity careers.',
      courses: 15,
      students: 50000,
      rating: 4.9,
      expertise: ['Penetration Testing', 'Network Security', 'Web Security', 'Social Engineering']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Senior Security Researcher',
      specialization: 'Advanced Penetration Testing & Exploit Development',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070',
      credentials: ['OSCP', 'OSCE', 'GPEN', 'GXPN'],
      bio: 'Sarah Chen is an OSCP-certified penetration tester and security researcher. She has discovered multiple zero-day vulnerabilities and regularly contributes to open-source security tools. Sarah has trained security teams at major tech companies worldwide and specializes in advanced exploitation techniques.',
      courses: 8,
      students: 28000,
      rating: 4.9,
      expertise: ['OSCP Preparation', 'Buffer Overflow', 'Exploit Development', 'Active Directory']
    },
    {
      id: '3',
      name: 'David Kumar',
      role: 'Web Security Expert',
      specialization: 'Web Application Security & Bug Bounties',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070',
      credentials: ['GWEB', 'OSWE', 'CEH'],
      bio: 'David Kumar is a web application security expert and bug bounty hunter. He has found critical vulnerabilities in major platforms and earned over $500K in bug bounties. David specializes in training developers to build secure applications and teaching bug bounty hunting techniques.',
      courses: 12,
      students: 42000,
      rating: 4.8,
      expertise: ['OWASP Top 10', 'Bug Bounty', 'API Security', 'Secure Coding']
    },
    {
      id: '4',
      name: 'Emily Watson',
      role: 'Digital Forensics Lead',
      specialization: 'Digital Forensics & Incident Response',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071',
      credentials: ['GCFE', 'GCFA', 'EnCE', 'CHFI'],
      bio: 'Emily Watson is a digital forensics expert and certified incident responder with experience in both private sector and law enforcement. She has testified as an expert witness in numerous cybercrime cases and leads the incident response team at a Fortune 100 company.',
      courses: 6,
      students: 18000,
      rating: 4.9,
      expertise: ['Digital Forensics', 'Malware Analysis', 'Incident Response', 'Memory Forensics']
    },
    {
      id: '5',
      name: 'Michael Torres',
      role: 'Network Security Architect',
      specialization: 'Network Security & Infrastructure',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070',
      credentials: ['CCNP Security', 'CISSP', 'GCIA'],
      bio: 'Michael Torres is a network security architect with 15 years of experience designing and securing enterprise networks. He holds multiple networking and security certifications and has worked with global corporations to implement robust security infrastructure.',
      courses: 9,
      students: 32000,
      rating: 4.7,
      expertise: ['Network Security', 'Firewall Configuration', 'IDS/IPS', 'VPN']
    },
    {
      id: '6',
      name: 'James Park',
      role: 'Cloud Security Specialist',
      specialization: 'Cloud Security & DevSecOps',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2070',
      credentials: ['AWS Security', 'Azure Security', 'CCSP'],
      bio: 'James Park is a cloud security specialist with expertise in AWS, Azure, and GCP. He helps organizations implement secure cloud infrastructure and DevSecOps practices. James has secured cloud environments for startups to enterprise companies.',
      courses: 10,
      students: 35000,
      rating: 4.8,
      expertise: ['AWS Security', 'Azure Security', 'DevSecOps', 'Container Security']
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
              Meet Our Expert Instructors
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Learn from industry veterans with decades of combined experience in cybersecurity, ethical hacking, and penetration testing.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 border-2 border-accent-cyan/20 rounded-2xl overflow-hidden hover:border-accent-cyan/40 transition-all group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Name & Role */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{instructor.name}</h3>
                  <p className="text-accent-cyan text-sm font-semibold">{instructor.role}</p>
                  <p className="text-text-secondary text-xs mt-1">{instructor.specialization}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-accent-cyan/10 rounded-lg">
                    <div className="text-lg font-bold text-accent-cyan">{instructor.courses}</div>
                    <div className="text-xs text-text-secondary">Courses</div>
                  </div>
                  <div className="text-center p-3 bg-accent-blue/10 rounded-lg">
                    <div className="text-lg font-bold text-accent-blue">{(instructor.students / 1000).toFixed(0)}K+</div>
                    <div className="text-xs text-text-secondary">Students</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-lg font-bold text-yellow-500">{instructor.rating}</div>
                    <div className="text-xs text-text-secondary">Rating</div>
                  </div>
                </div>

                {/* Credentials */}
                <div>
                  <div className="text-sm font-semibold text-text-secondary mb-2">Certifications:</div>
                  <div className="flex flex-wrap gap-2">
                    {instructor.credentials.map((cert, i) => (
                      <span key={i} className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-xs font-bold rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-4">
                  {instructor.bio}
                </p>

                {/* Expertise */}
                <div>
                  <div className="text-sm font-semibold text-text-secondary mb-2">Expertise:</div>
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {instructor.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded">
                        +{instructor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* View Courses Button */}
                <button
                  onClick={() => router.push('/courses')}
                  className="w-full mt-4 px-6 py-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg text-accent-cyan font-semibold transition-colors"
                >
                  View Courses
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-accent-cyan/10 via-accent-blue/10 to-accent-cyan/10 border-2 border-accent-cyan/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Ready to Learn from the Best?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students learning from industry experts and building successful careers in cybersecurity.
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="px-8 py-4 bg-accent-cyan hover:bg-accent-blue text-white font-bold text-lg rounded-lg transition-colors shadow-lg shadow-accent-cyan/30"
          >
            Explore All Courses
          </button>
        </motion.div>
      </div>

        <Footer />
      </div>
    </div>
  );
}
