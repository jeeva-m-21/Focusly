import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from '../common/Card';

interface KpiCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  status?: 'emerald' | 'amber' | 'rose' | 'blue' | 'neutral';
  badge?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  icon,
  status = 'neutral',
  badge,
  onClick
}) => {
  const statusColors = {
    emerald: 'text-[#15803d] dark:text-[#34d399]',
    amber: 'text-[#b45309] dark:text-[#fbbf24]',
    rose: 'text-[#be123c] dark:text-[#f43f5e]',
    blue: 'text-[#334155] dark:text-[#94a3b8]',
    neutral: 'text-[#1c1d21] dark:text-[#f0eff4]'
  };

  const statusBg = {
    emerald: 'bg-[#f0fdf4] dark:bg-[#064e3b]/30 text-[#15803d] dark:text-[#34d399] border-[#bbf7d0] dark:border-[#065f46]',
    amber: 'bg-[#fffbeb] dark:bg-[#78350f]/30 text-[#b45309] dark:text-[#fbbf24] border-[#fde68a] dark:border-[#92400e]',
    rose: 'bg-[#fff1f2] dark:bg-[#881337]/30 text-[#be123c] dark:text-[#f43f5e] border-[#fecdd3] dark:border-[#9f1239]',
    blue: 'bg-[#f1f5f9] dark:bg-[#1e293b]/40 text-[#334155] dark:text-[#94a3b8] border-[#cbd5e1] dark:border-[#334155]',
    neutral: 'bg-[#f4f1eb] dark:bg-[#1a1c24] text-[#4b4e55] dark:text-[#9ba0a9] border-[#e8e5df] dark:border-[#272a35]'
  };

  return (
    <Card
      hoverEffect={true}
      onClick={onClick}
      className={cn(
        'p-4 flex flex-col justify-between cursor-default group transition-all duration-200',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#787b84] dark:text-[#8d929e] group-hover:text-[#1c1d21] dark:group-hover:text-white transition-colors">
          <div className="w-6 h-6 rounded-lg bg-[#f4f1eb] dark:bg-[#1c1e26] flex items-center justify-center text-[#787b84] dark:text-[#8d929e] group-hover:text-[#1c1d21] dark:group-hover:text-white transition-colors">
            {icon}
          </div>
          <span>{label}</span>
        </div>
        {badge && (
          <span
            className={cn(
              'text-[10px] font-medium px-2 py-0.5 rounded-full border shadow-2xs',
              statusBg[status]
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="my-2.5">
        <div className={cn('text-2xl font-bold tracking-tight font-sans transition-transform group-hover:translate-x-0.5 duration-150', statusColors[status])}>
          {value}
        </div>
      </div>

      <div className="text-[11.5px] text-[#64676e] dark:text-[#9ba0a9] flex items-center justify-between border-t border-[#f0ede6] dark:border-[#22242c] pt-2 font-normal">
        <span>{subtext}</span>
      </div>
    </Card>
  );
};
