'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  downloadUrl: string | null;
  isGenerating: boolean;
  error?: string;
}

export default function DownloadModal({
  isOpen,
  onClose,
  courseTitle,
  downloadUrl,
  isGenerating,
  error,
}: DownloadModalProps) {
  const [timeRemaining, setTimeRemaining] = useState('24 hours');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (downloadUrl) {
      // Calculate expiry time (24 hours from now)
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 24);

      const updateTimer = () => {
        const now = new Date();
        const diff = expiryTime.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining('Expired');
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining(`${hours}h ${minutes}m`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [downloadUrl]);

  const handleCopyLink = () => {
    if (downloadUrl) {
      navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Simply navigate to the URL - S3 will handle the download with Content-Disposition header
      window.location.href = downloadUrl;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-br from-dark-800 to-dark-900 border-2 border-accent-cyan/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-400"
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
            </button>

            {/* Content */}
            <div className="text-center">
              {isGenerating ? (
                <>
                  {/* Generating State */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 mx-auto mb-6"
                  >
                    <svg
                      className="w-full h-full text-accent-cyan"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    Generating Secure Link
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Creating your encrypted download link...
                  </p>
                  <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue"
                    />
                  </div>
                </>
              ) : error ? (
                <>
                  {/* Error State */}
                  <div className="w-20 h-20 mx-auto mb-6 bg-accent-red/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-accent-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    Download Failed
                  </h2>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-accent-red hover:bg-accent-red/80 text-white font-semibold rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </>
              ) : downloadUrl ? (
                <>
                  {/* Success State */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-6 bg-accent-green/20 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-10 h-10 text-accent-green"
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
                  </motion.div>

                  <h2 className="text-2xl font-bold mb-2 text-white">
                    Download Ready!
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Your secure download link has been generated
                  </p>

                  {/* Course Info */}
                  <div className="bg-dark-700/50 border border-accent-cyan/30 rounded-lg p-4 mb-6 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-accent-cyan"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">
                          {courseTitle}
                        </div>
                        <div className="text-sm text-gray-400">
                          Course Materials
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <svg
                        className="w-5 h-5 text-accent-cyan flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <div className="text-sm font-semibold text-accent-cyan">
                        Secure Encrypted Link
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 mb-1">Expires In</div>
                        <div className="font-semibold text-white">{timeRemaining}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Security</div>
                        <div className="font-semibold text-white">256-bit SSL</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    <button
                      onClick={handleDownload}
                      className="w-full px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-blue hover:from-accent-cyan/80 hover:to-accent-blue/80 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-accent-cyan/50"
                    >
                      <span className="flex items-center justify-center gap-2">
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Start Download
                      </span>
                    </button>
                  </div>

                  {/* Warning Note */}
                  <p className="text-xs text-gray-500 mt-4">
                    ⚠️ This link will expire in 24 hours.
                  </p>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
