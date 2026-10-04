import React from 'react';

interface FocuslyLogoProps {
  size?: number;
  className?: string;
  variant?: 'accent' | 'mono-black' | 'mono-white' | 'dark-accent';
}

export const FocuslySymbol: React.FC<FocuslyLogoProps> = ({
  size = 28,
  className = '',
  variant = 'accent'
}) => {
  // Stroke & fill colors matching the Stitch Focusly Brand System spec
  const strokeColor =
    variant === 'mono-white'
      ? '#FFFFFF'
      : variant === 'dark-accent'
      ? '#F4F4F5'
      : '#18181A';

  const dotColor =
    variant === 'mono-white'
      ? '#FFFFFF'
      : variant === 'mono-black'
      ? '#18181A'
      : '#F59E0B';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Focusly Brand Symbol"
    >
      {/* Outer Primary Momentum Orbit: 270-degree sweeping tapered arc */}
      <path
        d="M 60 12 A 48 48 0 1 1 24.5 92.8"
        stroke={strokeColor}
        strokeWidth="7.5"
        strokeLinecap="round"
      />
      {/* Inner Forward Progression Arc: Harmonious concentric trajectory */}
      <path
        d="M 60 32 A 28 28 0 0 1 87.2 67.5"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* Focal Center Point: Warm Amber student nucleus / clarity spark */}
      <circle cx="60" cy="60" r="9.5" fill={dotColor} />
      {/* Subtle Optical Coordinate Guide Point: Directional aperture dot */}
      <circle cx="21" cy="60" r="3.2" fill={dotColor} />
    </svg>
  );
};

export const FocuslyLogo: React.FC<{
  size?: number;
  showWordmark?: boolean;
  showSubtitle?: boolean;
  className?: string;
  variant?: 'accent' | 'mono-black' | 'mono-white' | 'dark-accent';
}> = ({
  size = 32,
  showWordmark = true,
  showSubtitle = false,
  className = '',
  variant = 'accent'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0 flex items-center justify-center">
        <FocuslySymbol size={size} variant={variant} />
      </div>
      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-[15px] leading-tight text-[#18181A] dark:text-[#F3F4F6]">
            Focus<span className="text-[#F59E0B]">ly</span>
          </span>
          {showSubtitle && (
            <span className="text-[9.5px] font-mono tracking-[0.14em] uppercase text-[#686A70] dark:text-[#96979B]">
              Academic OS
            </span>
          )}
        </div>
      )}
    </div>
  );
};
