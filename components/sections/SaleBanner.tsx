'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUrgencyMessage } from '@/lib/utils/courseUtils';
import { SaleStatus } from '@/types';

interface SaleBannerProps {
  saleStatus: SaleStatus;
  courseId?: string; // Optional course ID to make dismissal course-specific
}

export default function SaleBanner({ saleStatus, courseId }: SaleBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Check if banner was previously dismissed (stored in localStorage)
    // Use course-specific key if courseId is provided
    const storageKey = courseId ? `saleBannerDismissed_${courseId}` : 'saleBannerDismissed';
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, [courseId]);

  useEffect(() => {
    if (!saleStatus.isActive || !saleStatus.endsAt || !saleStatus.timeRemaining) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(saleStatus.endsAt!).getTime();
      const difference = end - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const seconds = Math.floor(difference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      return {
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [saleStatus]);

  const handleDismiss = () => {
    setIsDismissed(true);
    const storageKey = courseId ? `saleBannerDismissed_${courseId}` : 'saleBannerDismissed';
    localStorage.setItem(storageKey, 'true');
  };

  if (!saleStatus.isActive || isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-accent-red via-accent-red/95 to-accent-red border-b-2 border-accent-red/40 overflow-hidden shadow-lg shadow-accent-red/20"
    >
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ backgroundSize: '200% 200%' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl flex-shrink-0"
            >
              🔥
            </motion.span>

            <div className="flex items-center gap-2 flex-wrap text-sm md:text-base">
              <span className="font-bold text-white">
                {saleStatus.discountPercentage && `${saleStatus.discountPercentage}% OFF`}
              </span>
              <span className="text-white/90 hidden sm:inline">•</span>
              <span className="text-white/90">
                Ends in:
              </span>

              {/* Inline compact countdown */}
              <div className="flex items-center gap-1 font-mono font-bold text-white">
                {timeLeft.days > 0 && (
                  <>
                    <span>{timeLeft.days}d</span>
                    <span className="opacity-60">:</span>
                  </>
                )}
                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span className="opacity-60">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span className="opacity-60">:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
