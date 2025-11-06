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
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,255,65,0.1)] border-b border-green-500/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            {/* Clean Minimal Logo - Sharp Angular Design */}
            <motion.div
              className="relative w-12 h-12"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.6))' }}
              >
                {/* Angular "X" Shape - Exploit/Attack Symbol */}
                <path
                  d="M 15,15 L 35,15 L 50,35 L 65,15 L 85,15 L 60,50 L 85,85 L 65,85 L 50,65 L 35,85 L 15,85 L 40,50 Z"
                  fill="#00ff41"
                  stroke="none"
                />
              </svg>
            </motion.div>

            {/* Brand Name - Clean Professional */}
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none">
                <span className="text-white group-hover:text-green-400 transition-colors duration-300">
                  XPLOIT
                </span>
              </span>
              <span className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
                Security Academy
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative text-gray-300 hover:text-green-500 transition-colors duration-300 text-base font-semibold px-5 py-2 group cursor-pointer"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
              >
                <span className="relative z-10">{link.name}</span>
                {/* Hover background */}
                <motion.div
                  className="absolute inset-0 bg-green-500/10 rounded-lg border border-green-500/0 group-hover:border-green-500/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
                {/* Active indicator */}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-cyan-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* Desktop Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-3"
          >
            {/* Search Button */}
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500 rounded-lg flex items-center justify-center text-green-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search courses"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </motion.button>

            {status === 'authenticated' ? (
              <>
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 text-gray-300 hover:text-green-500 transition-colors font-mono text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.button>
                <motion.button
                  onClick={() => router.push('/profile')}
                  className="px-4 py-2 text-gray-300 hover:text-green-500 transition-colors font-mono text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Profile
                </motion.button>
                <motion.button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-gray-300 hover:text-red-500 transition-colors font-mono text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
                <motion.div
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/30 cursor-pointer hover:bg-green-500/20 hover:border-green-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-7 h-7 rounded-full border-2 border-green-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-black">
                        {session.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-mono font-bold text-green-500">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </motion.div>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => router.push('/auth/signin')}
                  className="px-5 py-2 text-gray-300 hover:text-green-500 transition-colors font-mono text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => router.push('/auth/signin')}
                  className="relative px-6 py-2.5 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-mono font-black text-sm rounded-lg overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center gap-2">
                    <span>&gt;</span>
                    <span>GET_ACCESS</span>
                  </span>
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl"></div>
                  </div>
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-10 h-10 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center text-green-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-green-500/20"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-green-500 hover:bg-green-500/10 transition-all py-3 px-4 font-mono text-sm font-medium cursor-pointer rounded-lg border border-transparent hover:border-green-500/30"
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 space-y-2 border-t border-green-500/20">
                {status === 'authenticated' ? (
                  <>
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-300 hover:text-green-500 hover:bg-green-500/10 transition-all py-3 px-4 font-mono text-sm font-medium rounded-lg border border-transparent hover:border-green-500/30"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-300 hover:text-green-500 hover:bg-green-500/10 transition-all py-3 px-4 font-mono text-sm font-medium rounded-lg border border-transparent hover:border-green-500/30"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left text-gray-300 hover:text-red-500 hover:bg-red-500/10 transition-all py-3 px-4 font-mono text-sm font-medium rounded-lg border border-transparent hover:border-red-500/30"
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
                      className="w-full text-left text-gray-300 hover:text-green-500 hover:bg-green-500/10 transition-all py-3 px-4 font-mono text-sm font-medium rounded-lg border border-transparent hover:border-green-500/30"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        router.push('/auth/signin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-cyan-500 text-black font-mono font-black text-sm py-3 rounded-lg hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>&gt;</span>
                        <span>GET_ACCESS</span>
                      </span>
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 text-green-500 bg-green-500/10 hover:bg-green-500/20 transition-all py-3 px-4 rounded-lg border border-green-500/30 hover:border-green-500 mt-4 font-mono text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span>Search Courses</span>
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
