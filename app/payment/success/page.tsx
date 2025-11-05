'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your purchase...');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isProcessing) return; // Prevent double execution
    setIsProcessing(true);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setMessage('Invalid payment session');
      return;
    }

    // Verify the payment and get auto-login token
    const verifyPayment = async (retryCount = 0) => {
      try {
        setMessage('Processing your purchase...');

        const response = await fetch('/api/payments/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        // If webhook hasn't processed yet and we have retries left, wait and retry
        if (!data.autoLoginToken && retryCount < 5) {
          console.log(`Waiting for webhook... retry ${retryCount + 1}/5`);
          setMessage('Confirming your purchase...');
          setTimeout(() => verifyPayment(retryCount + 1), 2000); // Wait 2 seconds and retry
          return;
        }

        if (response.ok && data.autoLoginToken) {
          // Auto-login using the token
          setMessage('Logging you in...');

          const result = await signIn('credentials', {
            autoLoginToken: data.autoLoginToken,
            redirect: false,
          });

          if (result?.ok) {
            setStatus('success');
            setMessage('Purchase successful! Redirecting to your dashboard...');

            // Wait a bit longer for session to be fully established
            setTimeout(() => {
              window.location.href = '/dashboard'; // Use hard redirect to ensure session is loaded
            }, 1500);
          } else {
            console.error('Auto-login failed:', result?.error);
            // If auto-login fails, still show success but ask to login
            setStatus('success');
            setMessage('Purchase successful! Please check your email for login credentials.');

            setTimeout(() => {
              router.push('/auth/signin');
            }, 3000);
          }
        } else if (response.ok) {
          // Already logged in user or no auto-login needed
          setStatus('success');
          setMessage('Purchase successful! Redirecting to your dashboard...');

          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          throw new Error(data.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment. Please check your email for login credentials or contact support.');

        // Still redirect to signin after error
        setTimeout(() => {
          router.push('/auth/signin');
        }, 5000);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-primary-500/20 p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
            )}
            {status === 'success' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {status === 'loading' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'error' && 'Payment Error'}
          </h1>

          <p className="text-gray-400 mb-6">{message}</p>

          {status === 'error' && (
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-dark-900 font-semibold rounded-lg transition-colors"
            >
              Return to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
