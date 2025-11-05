'use client';

import { motion } from 'framer-motion';

interface InstructorCardProps {
  name: string;
  bio?: string;
  avatar?: string;
  credentials?: string[];
  rating?: number;
  students?: number;
  courses?: number;
}

export default function InstructorCard({
  name,
  bio,
  avatar,
  credentials = [],
  rating,
  students,
  courses,
}: InstructorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg border border-card-border rounded-xl p-6 hover:border-accent-cyan/50 transition-colors"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full border-4 border-accent-cyan shadow-lg shadow-accent-cyan/30 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-accent-cyan/30">
              {name.charAt(0)}
            </div>
          )}
        </div>

        {/* Instructor Info */}
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-2xl font-heading font-bold mb-1">{name}</h3>
            <p className="text-text-secondary">Cybersecurity Expert & Instructor</p>
          </div>

          {/* Stats */}
          {(rating || students || courses) && (
            <div className="flex flex-wrap gap-4 mb-4">
              {rating && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-text-secondary">Instructor Rating</span>
                </div>
              )}
              {students && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="font-semibold">{students.toLocaleString()}</span>
                  <span className="text-text-secondary">Students</span>
                </div>
              )}
              {courses && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="font-semibold">{courses}</span>
                  <span className="text-text-secondary">Courses</span>
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {bio && <p className="text-text-secondary leading-relaxed mb-4">{bio}</p>}

          {/* Credentials */}
          {credentials.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-accent-cyan">Certifications & Credentials</h4>
              <div className="flex flex-wrap gap-2">
                {credentials.map((credential, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-full text-xs font-medium"
                  >
                    {credential}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
