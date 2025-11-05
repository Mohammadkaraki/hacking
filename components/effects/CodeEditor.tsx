'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CodeEditor() {
  const [lines, setLines] = useState<string[]>([]);

  const codeLines = [
    'import socket',
    'import sys',
    '',
    'def exploit_target(ip):',
    '    print(f"[+] Connecting to {ip}...")',
    '    sock = socket.socket()',
    '    sock.connect((ip, 443))',
    '    ',
    '    payload = b"\\x90" * 1000',
    '    sock.send(payload)',
    '    print("[+] Exploit sent!")',
    '    ',
    '    response = sock.recv(1024)',
    '    print(f"[+] Response: {response}")',
    '',
    'if __name__ == "__main__":',
    '    exploit_target("192.168.1.100")',
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < codeLines.length) {
        setLines((prev) => [...prev, codeLines[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const getHighlightedLine = (line: string) => {
    // Handle undefined or empty lines
    if (!line || line.length === 0) {
      return <span className="text-text-secondary"> </span>;
    }

    if (line.includes('import')) {
      return <span className="text-purple-400">{line}</span>;
    } else if (line.includes('def ') || line.includes('if ')) {
      return <span className="text-pink-400">{line}</span>;
    } else if (line.includes('print')) {
      return (
        <>
          <span className="text-yellow-400">print</span>
          {line.replace('print', '')}
        </>
      );
    } else if (line.includes('"') || line.includes("'")) {
      return <span className="text-accent-green">{line}</span>;
    } else if (line.includes('#')) {
      return <span className="text-text-secondary italic">{line}</span>;
    }
    return <span className="text-accent-cyan">{line}</span>;
  };

  return (
    <div className="bg-[#1e1e1e] border border-accent-cyan/30 rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-accent-cyan/20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-text-secondary text-xs font-mono ml-3">exploit.py</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span>Python</span>
          <span>UTF-8</span>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 font-mono text-sm h-64 overflow-hidden">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <span className="text-text-secondary/50 mr-4 select-none w-6 text-right">
              {index + 1}
            </span>
            <span className="flex-1">{getHighlightedLine(line)}</span>
            {index === lines.length - 1 && (
              <span className="animate-pulse text-accent-cyan">|</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
