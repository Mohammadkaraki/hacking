'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCountdown } from '@/lib/utils/courseUtils';
import { CountdownTime } from '@/types';

interface CountdownTimerProps {
  endDate: Date;
  onExpire?: () => void;
  variant?: 'large' | 'small';
  showLabels?: boolean;
}

export default function CountdownTimer({
  endDate,
  onExpire,
  variant = 'large',
  showLabels = true,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpire?.();
        return;
      }

      setTimeLeft(formatCountdown(difference));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (isExpired) {
    return (
      <div className="text-center text-text-secondary">
        <p className="text-sm">Sale has ended</p>
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    const size = variant === 'large' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl';
    const padding = variant === 'large' ? 'p-4 md:p-6' : 'p-2 md:p-3';

    return (
      <div className="flex flex-col items-center">
        <div
          className={`${padding} bg-gradient-to-br from-card-bg to-bg-dark border-2 border-accent-cyan rounded-xl relative overflow-hidden group`}
        >
          {/* Neon glow effect - static */}
          <div className="absolute inset-0 bg-accent-cyan/10 blur-xl group-hover:bg-accent-cyan/20 transition-all duration-300" />

          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-50" />

          {/* Value - NO ANIMATION on change to prevent flicker */}
          <div className="relative z-10">
            <span
              className={`${size} font-mono font-bold bg-gradient-to-br from-accent-cyan to-accent-blue bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]`}
            >
              {String(value).padStart(2, '0')}
            </span>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-cyan" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent-cyan" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent-cyan" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-cyan" />
        </div>

        {showLabels && (
          <span className="mt-2 text-xs md:text-sm text-text-secondary font-mono uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-2xl md:text-3xl text-accent-cyan font-mono opacity-60">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-2xl md:text-3xl text-accent-cyan font-mono opacity-60">:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl md:text-3xl text-accent-cyan font-mono opacity-60">:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
