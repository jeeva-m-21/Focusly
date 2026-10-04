import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#1c1d21] dark:bg-[#f1f2f5] text-white dark:text-[#121316] hover:bg-[#2c2d33] dark:hover:bg-white shadow-xs border border-transparent',
    secondary: 'bg-[#f4f1eb] dark:bg-[#1f2129] text-[#1c1d21] dark:text-[#f0eff4] hover:bg-[#eae6de] dark:hover:bg-[#272a34] border border-[#e8e5df] dark:border-[#2a2d39]',
    outline: 'bg-white dark:bg-[#16171d] text-[#2c2d33] dark:text-[#e4e5eb] hover:bg-[#faf8f5] dark:hover:bg-[#1d1f27] border border-[#e8e5df] dark:border-[#282b36] shadow-xs',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs',
    ghost: 'text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#f4f1eb] dark:hover:bg-[#1a1c23] border border-transparent'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-xs px-3.5 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
