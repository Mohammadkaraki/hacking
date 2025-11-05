import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Advanced SQL Injection Techniques: Bypassing Modern WAFs',
    excerpt: 'Deep dive into sophisticated SQL injection methods that penetrate Web Application Firewalls. Learn time-based blind SQLi, second-order injections, and filter evasion techniques used in real-world penetration tests.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    author: 'Marcus Blake',
    date: '2025-01-15',
    readTime: '15 min read',
    tags: ['SQLi', 'Web Exploitation', 'WAF Bypass'],
    slug: 'advanced-sql-injection-waf-bypass',
  },
  {
    id: '2',
    title: 'Privilege Escalation in Active Directory: Complete Attack Path',
    excerpt: 'Comprehensive guide to escalating privileges in Windows Active Directory environments. Covers Kerberoasting, AS-REP Roasting, GPP passwords, LAPS exploitation, and DCSync attacks with real-world attack scenarios.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    author: 'Elena Volkov',
    date: '2025-01-12',
    readTime: '18 min read',
    tags: ['Active Directory', 'Privilege Escalation', 'Red Team'],
    slug: 'active-directory-privilege-escalation',
  },
  {
    id: '3',
    title: 'Building Custom Exploit Payloads: From BOF to RCE',
    excerpt: 'Masterclass on developing custom exploits from buffer overflow to remote code execution. Covers shellcode development, ASLR/DEP bypass, ROP chains, and heap spraying techniques with practical examples.',
    thumbnail: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=2032&auto=format&fit=crop',
    author: 'Dr. James Chen',
    date: '2025-01-08',
    readTime: '22 min read',
    tags: ['Exploit Development', 'Buffer Overflow', 'RCE'],
    slug: 'custom-exploit-payload-development',
  },
];
