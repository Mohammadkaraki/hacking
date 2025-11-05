import { LearningPathNode } from '@/types';

export const learningPath: LearningPathNode[] = [
  {
    id: '1',
    title: '🎮 Noob → Script Kiddie',
    level: 'Beginner',
    courses: 8,
    description: 'Master Linux CLI, networking basics, Kali tools. Learn to scan, enumerate, and recon like a pro.',
  },
  {
    id: '2',
    title: '⚔️ Script Kiddie → Hacker',
    level: 'Intermediate',
    courses: 12,
    description: 'Web exploitation (XSS, SQLi, RCE), password cracking, privilege escalation. Start pwning systems.',
  },
  {
    id: '3',
    title: '🔥 Hacker → Elite',
    level: 'Advanced',
    courses: 10,
    description: 'Zero-day hunting, custom exploit dev, malware coding, red team tactics. Go ghost mode.',
  },
  {
    id: '4',
    title: '💀 Elite → Legend',
    level: 'Expert',
    courses: 6,
    description: 'APT simulation, cloud pentesting, IoT pwning, full infrastructure domination. You are the threat.',
  },
];
