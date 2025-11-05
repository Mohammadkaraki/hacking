interface BadgeProps {
  children: React.ReactNode;
  variant?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/50',
    intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    expert: 'bg-red-500/20 text-red-400 border-red-500/50',
    default: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-mono
        border uppercase tracking-wider
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
