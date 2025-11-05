'use client';

export default function GridPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
      <div className="absolute inset-0 grid-pattern"></div>
      {/* Glowing nodes at grid intersections */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-cyan rounded-full blur-sm animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent-blue rounded-full blur-sm animate-pulse animation-delay-200"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent-green rounded-full blur-sm animate-pulse animation-delay-400"></div>
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-accent-cyan rounded-full blur-sm animate-pulse animation-delay-600"></div>
    </div>
  );
}
