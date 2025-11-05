'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import MatrixRainBright from '@/components/effects/MatrixRainBright';
import GridPatternBright from '@/components/effects/GridPatternBright';
import ParticleFieldBright from '@/components/effects/ParticleFieldBright';
import CursorTrail from '@/components/effects/CursorTrail';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const hasVerifiedRef = useRef(false); // Use ref instead of state to persist across renders

  const verifyEmail = async () => {
    if (hasVerifiedRef.current) {
      console.log('⚠️ Verification already in progress, skipping...');
      return; // Prevent multiple calls
    }

    console.log('🔄 Starting verification process...');
    hasVerifiedRef.current = true;

    try {
      console.log('📡 Calling verification API with token:', token?.substring(0, 10) + '...');
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        console.log('✅ Verification successful!');
        setStatus('success');
        setMessage('Your email has been verified! Signing you in...');
        setUserEmail(data.user.email);

        // Auto sign-in the user using the auto-login token
        try {
          console.log('🔐 Attempting auto sign-in...');
          const signInResult = await signIn('credentials', {
            autoLoginToken: data.autoLoginToken,
            redirect: false,
          });

          if (signInResult?.ok) {
            console.log('✅ Auto sign-in successful! Redirecting...');
            // Redirect immediately to home
            router.push('/');
            router.refresh();
          } else {
            console.error('❌ Auto sign-in failed:', signInResult?.error);
            router.push('/auth/signin?verified=true');
          }
        } catch (signInError) {
          console.error('❌ Auto sign-in error:', signInError);
          router.push('/auth/signin?verified=true');
        }
      } else {
        console.error('❌ Verification failed:', data.error);
        setStatus('error');
        setMessage(data.error || 'Failed to verify email');
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    console.log('🔍 useEffect triggered - token:', token, 'hasVerified:', hasVerifiedRef.current);

    // Don't do anything on initial mount - wait for searchParams to be ready
    if (token === null) {
      console.log('⏳ Token is null, waiting...');
      return; // Still loading searchParams
    }

    if (token === '') {
      console.log('❌ Token is empty');
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    if (!hasVerifiedRef.current && token) {
      console.log('🚀 Starting verification...');
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16">
      {/* Background Effects */}
      <MatrixRainBright />
      <GridPatternBright />
      <ParticleFieldBright />
      <CursorTrail />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Card */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 shadow-2xl text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-cyan/20 rounded-full border border-accent-cyan/50 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-4 border-accent-cyan border-t-transparent rounded-full"
                />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                Verifying Your Email...
              </h2>
              <p className="text-text-secondary">
                Please wait while we verify your email address
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full border border-green-500/50 mb-4"
              >
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-heading font-bold gradient-text mb-2">
                Welcome to CyberAcademy! 🎉
              </h2>
              <p className="text-text-secondary mb-2">
                Your email has been verified successfully!
              </p>
              <p className="text-accent-cyan mb-6 font-semibold">
                You're all set to start learning
              </p>
              <div className="flex items-center justify-center gap-2 text-white text-sm bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg py-2 px-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full"
                />
                <span>Redirecting to homepage...</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full border border-red-500/50 mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-text-secondary mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <GlowButton fullWidth onClick={() => router.push('/auth/signup')}>
                  Create New Account
                </GlowButton>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full px-6 py-3 text-text-secondary hover:text-accent-cyan transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-text-secondary hover:text-accent-cyan transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
