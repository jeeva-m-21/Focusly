import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  subtle?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  subtle = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200 ease-out',
        subtle
          ? 'bg-[#f4f1eb]/70 dark:bg-[#181920]/70 border-[#e8e5df] dark:border-[#232630] text-[#1c1d21] dark:text-[#f0eff4]'
          : 'bg-white dark:bg-[#14151a] border-[#e8e5df] dark:border-[#232630] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs',
        hoverEffect && 'hover:border-[#cfcac1] dark:hover:border-[#383b48] hover:shadow-calm-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, badge, className }) => {
  return (
    <div className={cn('px-5 py-3.5 border-b border-[#f0ede6] dark:border-[#20222a] flex items-center justify-between gap-4', className)}>
      <div>
        <div className="flex items-center gap-2">
          {typeof title === 'string' ? (
            <h3 className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">{title}</h3>
          ) : (
            title
          )}
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5 leading-normal">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn('p-5', className)}>{children}</div>;
};
