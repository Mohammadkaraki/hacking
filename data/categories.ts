import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: '💀 Advanced Pentesting',
    icon: '⚔️',
    courseCount: 24,
    description: 'Master offensive security tactics. Break systems, own networks, dominate infrastructure like a ghost in the machine.',
    color: '#ff0055',
  },
  {
    id: '2',
    name: '🎯 Web Exploitation',
    icon: '🕸️',
    courseCount: 18,
    description: 'XSS, SQLi, RCE, SSRF. Learn to weaponize web apps and exploit every layer from frontend to database.',
    color: '#00ff41',
  },
  {
    id: '3',
    name: '🔥 Red Team Operations',
    icon: '🎭',
    courseCount: 16,
    description: 'Think like an attacker. Full-stack adversary simulation, social engineering, and post-exploitation techniques.',
    color: '#ff3366',
  },
  {
    id: '4',
    name: '⚡ Network Hacking',
    icon: '📡',
    courseCount: 21,
    description: 'Sniff, spoof, intercept. Master packet analysis, MITM attacks, WiFi cracking, and network pivoting.',
    color: '#00d4ff',
  },
  {
    id: '5',
    name: '🧠 Malware Development',
    icon: '🦠',
    courseCount: 12,
    description: 'Code custom payloads, bypass AV/EDR, develop rootkits and C2 frameworks. Build tools that evade detection.',
    color: '#9d00ff',
  },
  {
    id: '6',
    name: '👁️ Cyber Forensics',
    icon: '🔬',
    courseCount: 15,
    description: 'Hunt threats, analyze artifacts, reverse engineer malware. Uncover the digital footprints attackers leave behind.',
    color: '#ffaa00',
  },
];
