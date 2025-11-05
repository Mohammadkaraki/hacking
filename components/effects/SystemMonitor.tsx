'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SystemMonitor() {
  const [cpu, setCpu] = useState(45);
  const [memory, setMemory] = useState(62);
  const [network, setNetwork] = useState(78);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu((prev) => Math.min(95, Math.max(20, prev + (Math.random() - 0.5) * 10)));
      setMemory((prev) => Math.min(98, Math.max(40, prev + (Math.random() - 0.5) * 8)));
      setNetwork((prev) => Math.min(99, Math.max(30, prev + (Math.random() - 0.5) * 15)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getBarColor = (value: number) => {
    if (value > 80) return 'bg-accent-red';
    if (value > 60) return 'bg-orange-400';
    return 'bg-accent-green';
  };

  const Meter = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary font-mono">{label}</span>
        <span className={`font-mono font-bold ${value > 80 ? 'text-accent-red' : 'text-accent-cyan'}`}>
          {Math.round(value)}{unit}
        </span>
      </div>
      <div className="w-full h-2 bg-card-bg rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getBarColor(value)} transition-colors duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-primary-dark border border-accent-cyan/30 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          <span className="text-accent-cyan font-mono text-xs">SYSTEM MONITOR</span>
        </div>
        <span className="text-text-secondary text-xs font-mono">
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        <Meter label="CPU USAGE" value={cpu} unit="%" />
        <Meter label="MEMORY" value={memory} unit="%" />
        <Meter label="NETWORK" value={network} unit="%" />
      </div>

      {/* Active Processes */}
      <div className="mt-4 pt-4 border-t border-card-border">
        <div className="text-xs text-text-secondary font-mono mb-2">ACTIVE PROCESSES</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-accent-cyan">nmap.exe</span>
            <span className="text-text-secondary">2.4 MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent-cyan">burpsuite.jar</span>
            <span className="text-text-secondary">124 MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent-cyan">wireshark.exe</span>
            <span className="text-text-secondary">18.2 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
