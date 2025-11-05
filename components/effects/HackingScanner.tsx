'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HackingScanner() {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string[]>([]);

  useEffect(() => {
    const statuses = [
      'Scanning network ports...',
      'Port 22: SSH [OPEN]',
      'Port 80: HTTP [OPEN]',
      'Port 443: HTTPS [OPEN]',
      'Port 3306: MySQL [OPEN]',
      'Detecting vulnerabilities...',
      'CVE-2024-XXXX detected',
      'Analyzing security headers...',
      'Scan complete. 7 findings.',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < statuses.length) {
        setScanStatus((prev) => [...prev, statuses[index]]);
        setScanProgress(((index + 1) / statuses.length) * 100);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary-dark border border-accent-red/50 rounded-lg p-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></div>
          <span className="text-accent-red">VULNERABILITY SCAN</span>
        </div>
        <span className="text-text-secondary">{Math.round(scanProgress)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-card-bg rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-accent-red"
          initial={{ width: 0 }}
          animate={{ width: `${scanProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Scan Results */}
      <div className="space-y-1 max-h-32 overflow-hidden">
        {scanStatus.map((status, index) => {
          // Safety check for undefined status
          if (!status) return null;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${
                status.includes('[OPEN]')
                  ? 'text-accent-red'
                  : status.includes('CVE')
                  ? 'text-orange-400'
                  : status.includes('complete')
                  ? 'text-accent-green'
                  : 'text-text-secondary'
              }`}
            >
              {status.includes('[OPEN]') && '⚠ '}
              {status.includes('CVE') && '🔴 '}
              {status.includes('complete') && '✓ '}
              {status}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
