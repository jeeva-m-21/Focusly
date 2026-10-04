import React from 'react';
import { cn } from '../../utils/cn';
import { Sparkles, BookOpen, CheckCircle } from 'lucide-react';
import { CognitiveLoadLevel } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' | 'default';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  size = 'md'
}) => {
  const variantStyles = {
    emerald: 'bg-[#f0fdf4] dark:bg-[#064e3b]/30 text-[#15803d] dark:text-[#34d399] border-[#bbf7d0] dark:border-[#065f46]',
    amber: 'bg-[#fffbeb] dark:bg-[#78350f]/30 text-[#b45309] dark:text-[#fbbf24] border-[#fde68a] dark:border-[#92400e]',
    rose: 'bg-[#fff1f2] dark:bg-[#881337]/30 text-[#be123c] dark:text-[#f43f5e] border-[#fecdd3] dark:border-[#9f1239]',
    blue: 'bg-[#f1f5f9] dark:bg-[#1e293b]/40 text-[#334155] dark:text-[#94a3b8] border-[#cbd5e1] dark:border-[#334155]',
    slate: 'bg-[#f4f1eb] dark:bg-[#1a1c24] text-[#4b4e55] dark:text-[#9ba0a9] border-[#e8e5df] dark:border-[#272a35]',
    default: 'bg-[#f4f1eb] dark:bg-[#1a1c24] text-[#4b4e55] dark:text-[#9ba0a9] border-[#e8e5df] dark:border-[#272a35]'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-[11px] px-2.5 py-0.5 font-medium'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border leading-normal tracking-normal transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export const CognitiveLoadBadge: React.FC<{ load: CognitiveLoadLevel; className?: string }> = ({
  load,
  className
}) => {
  if (load === 'high') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#fffbeb] dark:bg-[#78350f]/30 text-[#92400e] dark:text-[#fbbf24] border border-[#fde68a] dark:border-[#92400e]',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Deep Focus
      </span>
    );
  }

  if (load === 'medium') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f5f9] dark:bg-[#1e293b]/40 text-[#334155] dark:text-[#94a3b8] border border-[#cbd5e1] dark:border-[#334155]',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Core Study
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f4f1eb] dark:bg-[#1a1c24] text-[#4b4e55] dark:text-[#9ba0a9] border border-[#e8e5df] dark:border-[#272a35]',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
      Quick Task
    </span>
  );
};
