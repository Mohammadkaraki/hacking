'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import GlowButton from '@/components/ui/GlowButton';
import SearchModal from '@/components/ui/SearchModal';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links - use anchors on homepage, routes elsewhere
  const navLinks = [
    { name: 'Home', href: '/', scrollTo: 'hero' },
    { name: 'Courses', href: '/courses', scrollTo: 'courses' },
    { name: 'About', href: '/about', scrollTo: 'why-choose-us' },
    { name: 'Blog', href: '/blog', scrollTo: 'blog' },
    { name: 'FAQ', href: '/faq', scrollTo: 'footer' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (isHomePage && link.scrollTo) {
      // On homepage, use smooth scroll to section
      e.preventDefault();
      const element = document.getElementById(link.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    } else if (!isHomePage && link.scrollTo && link.name === 'Home') {
      // Not on homepage and clicking Home - go to homepage
      router.push('/');
      setIsMobileMenuOpen(false);
    } else {
      // Navigate to the page
      e.preventDefault();
      router.push(link.href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary-dark/95 blur-backdrop shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center border border-accent-cyan/50">
              <span className="text-2xl">🛡️</span>
            </div>
            <span className="text-xl font-heading font-bold gradient-text">
              CyberAcademy
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-text-primary hover:text-accent-cyan transition-colors duration-300 font-medium relative group cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-cyan transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Desktop Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-4"
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-accent-cyan hover:text-accent-blue transition-colors hover:scale-110 transition-transform"
              aria-label="Search courses"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {status === 'authenticated' ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-text-primary hover:text-accent-cyan transition-colors px-4 py-2 font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="text-text-primary hover:text-accent-cyan transition-colors px-4 py-2 font-medium"
                >
                  Profile
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-text-primary hover:text-accent-red transition-colors px-4 py-2 font-medium"
                >
                  Sign Out
                </button>
                <div
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-3 py-2 bg-accent-cyan/10 rounded-lg border border-accent-cyan/30 cursor-pointer hover:bg-accent-cyan/20 transition-colors"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent-cyan">
                        {session.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-accent-cyan">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="text-text-primary hover:text-accent-cyan transition-colors px-4 py-2 font-medium"
                >
                  Login
                </button>
                <GlowButton size="sm" onClick={() => router.push('/auth/signin')}>
                  Start Learning
                </GlowButton>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card-bg border-t border-card-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-text-primary hover:text-accent-cyan transition-colors py-2 font-medium cursor-pointer"
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-card-border">
                {status === 'authenticated' ? (
                  <>
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-text-primary hover:text-accent-cyan transition-colors py-2 font-medium"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-text-primary hover:text-accent-cyan transition-colors py-2 font-medium"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left text-text-primary hover:text-accent-red transition-colors py-2 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push('/auth/signin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-text-primary hover:text-accent-cyan transition-colors py-2 font-medium"
                    >
                      Login
                    </button>
                    <GlowButton
                      fullWidth
                      onClick={() => {
                        router.push('/auth/signin');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Start Learning
                    </GlowButton>
                  </>
                )}
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 text-accent-cyan hover:bg-accent-cyan/10 transition-colors py-3 px-2 rounded-lg border border-accent-cyan/30 mt-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="font-medium">Search Courses</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
