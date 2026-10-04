import React, { useState } from 'react';
import { Flame, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';

export interface DayFocusData {
  day: string;
  label: string;
  hours: number;
  targetHours: number;
  sessions: number;
  topSubject: string;
  isToday?: boolean;
}

const mockWeeklyData: DayFocusData[] = [
  { day: 'Mon', label: 'Monday', hours: 3.5, targetHours: 3.4, sessions: 3, topSubject: 'MAT2002 Planar Graphs' },
  { day: 'Tue', label: 'Tuesday', hours: 5.1, targetHours: 3.4, sessions: 4, topSubject: 'CSE2005 POSIX Semaphores' },
  { day: 'Wed', label: 'Wednesday', hours: 4.0, targetHours: 3.4, sessions: 3, topSubject: 'CSE2006 Red-Black Trees' },
  { day: 'Thu', label: 'Thursday', hours: 3.2, targetHours: 3.4, sessions: 2, topSubject: 'ECE2001 Verilog Simulation', isToday: true },
  { day: 'Fri', label: 'Friday', hours: 2.7, targetHours: 3.4, sessions: 2, topSubject: 'CSE2004 B+ Tree Indexing' },
  { day: 'Sat', label: 'Saturday', hours: 0.0, targetHours: 2.0, sessions: 0, topSubject: 'Rest Day' },
  { day: 'Sun', label: 'Sunday', hours: 0.0, targetHours: 2.0, sessions: 0, topSubject: 'Weekly VTOP Review' }
];

export const WeeklyFocusWaveChart: React.FC<{ className?: string }> = ({ className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(3); // Default to Thursday (today)

  const maxHours = 6;
  const chartHeight = 160;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingBottom = 30;
  const paddingTop = 20;

  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const innerWidth = chartWidth - paddingX * 2;
  const stepX = innerWidth / (mockWeeklyData.length - 1);

  // Generate SVG coordinates for each day
  const points = mockWeeklyData.map((d, index) => {
    const x = paddingX + index * stepX;
    const y = paddingTop + innerHeight - (d.hours / maxHours) * innerHeight;
    return { x, y, data: d };
  });

  // Calculate smooth SVG cubic bezier path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, '');

  // Closed area path for gradient
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`;

  // Target reference line y coordinate
  const targetY = paddingTop + innerHeight - (3.4 / maxHours) * innerHeight;

  const currentHovered = hoveredIndex !== null ? mockWeeklyData[hoveredIndex] : mockWeeklyData[3];

  return (
    <Card className={className}>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#fffbeb] dark:bg-[#78350f]/30 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4]">Weekly Focus Velocity</span>
          </div>
        }
        subtitle="Daily hours studied vs. 3.4h consistency benchmark"
        badge={
          <Badge variant="amber">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>5-Day Streak</span>
          </Badge>
        }
      />
      <CardBody className="space-y-4">
        {/* Metric Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2 border-b border-[#f0ede6] dark:border-[#22242c]">
          <div className="p-2.5 rounded-xl bg-[#f8f6f2] dark:bg-[#181a22] border border-[#e8e5df] dark:border-[#262832]">
            <span className="text-[10.5px] text-[#787b84] dark:text-[#8d929e] block">Week Total</span>
            <span className="text-base font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">18.5 hrs</span>
            <span className="text-[10px] text-[#15803d] dark:text-[#34d399] font-medium block">77% of target</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8f6f2] dark:bg-[#181a22] border border-[#e8e5df] dark:border-[#262832]">
            <span className="text-[10.5px] text-[#787b84] dark:text-[#8d929e] block">Daily Average</span>
            <span className="text-base font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">3.7 hrs</span>
            <span className="text-[10px] text-[#787b84] dark:text-[#8d929e] block">Past 5 active days</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8f6f2] dark:bg-[#181a22] border border-[#e8e5df] dark:border-[#262832]">
            <span className="text-[10.5px] text-[#787b84] dark:text-[#8d929e] block">Peak Day</span>
            <span className="text-base font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">Tuesday</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">5.1 hrs focused</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8f6f2] dark:bg-[#181a22] border border-[#e8e5df] dark:border-[#262832]">
            <span className="text-[10.5px] text-[#787b84] dark:text-[#8d929e] block">Focus Blocks</span>
            <span className="text-base font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">14 blocks</span>
            <span className="text-[10px] text-[#15803d] dark:text-[#34d399] font-medium block">100% completion</span>
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div className="relative pt-2">
          {/* Active Hover Floating Detail Box */}
          {currentHovered && (
            <div className="flex flex-wrap items-center justify-between p-2.5 mb-2 rounded-xl bg-[#faf8f5] dark:bg-[#161820] border border-[#e8e5df] dark:border-[#252834] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">{currentHovered.label}</span>
                {currentHovered.isToday && (
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-700">
                    Today
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-[#1c1d21] dark:text-[#f0eff4]">
                  <strong>{currentHovered.hours.toFixed(1)} hrs</strong> studied
                </span>
                <span className="text-[#787b84] dark:text-[#8d929e]">
                  {currentHovered.sessions} deep sessions
                </span>
                <span className="text-[#64676e] dark:text-[#9ba0a9] truncate max-w-[150px] sm:max-w-none">
                  Focus: <strong>{currentHovered.topSubject}</strong>
                </span>
              </div>
            </div>
          )}

          {/* SVG Wave Visualizer */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[480px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 overflow-visible select-none"
              >
                <defs>
                  {/* Linear gradient fill for study area */}
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Target Baseline (3.4h benchmark) */}
                <line
                  x1={paddingX}
                  y1={targetY}
                  x2={chartWidth - paddingX}
                  y2={targetY}
                  stroke="#d5d0c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="dark:stroke-[#333744]"
                />
                <text
                  x={chartWidth - paddingX + 6}
                  y={targetY + 3.5}
                  fontSize="9.5"
                  fill="#9da0a6"
                  fontFamily="monospace"
                  className="dark:fill-[#656976]"
                >
                  3.4h goal
                </text>

                {/* Area Gradient */}
                <path d={areaD} fill="url(#waveGradient)" />

                {/* Main Curved Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points & Interactive Columns */}
                {points.map((pt, index) => {
                  const isHovered = hoveredIndex === index;
                  const isToday = pt.data.isToday;

                  return (
                    <g
                      key={pt.data.day}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onClick={() => setHoveredIndex(index)}
                    >
                      {/* Invisible hover capture column */}
                      <rect
                        x={pt.x - stepX / 2}
                        y={paddingTop}
                        width={stepX}
                        height={innerHeight}
                        fill="transparent"
                      />

                      {/* Vertical indicator line on hover or today */}
                      {(isHovered || isToday) && (
                        <line
                          x1={pt.x}
                          y1={paddingTop}
                          x2={pt.x}
                          y2={paddingTop + innerHeight}
                          stroke={isHovered ? '#f59e0b' : '#e8e5df'}
                          strokeWidth={isHovered ? '1.5' : '1'}
                          strokeDasharray={isHovered ? '2 2' : 'none'}
                          className="dark:stroke-[#353948]"
                        />
                      )}

                      {/* Point circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : isToday ? 5 : 3.5}
                        fill={isHovered ? '#f59e0b' : '#ffffff'}
                        stroke="#f59e0b"
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-all duration-150"
                      />

                      {/* Value label above point on hover */}
                      {isHovered && (
                        <g>
                          <rect
                            x={pt.x - 22}
                            y={pt.y - 24}
                            width={44}
                            height={18}
                            rx={4}
                            fill="#1c1d21"
                            className="dark:fill-[#f1f2f5]"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 12}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fill="#ffffff"
                            className="dark:fill-[#121316]"
                            fontFamily="monospace"
                          >
                            {pt.data.hours.toFixed(1)}h
                          </text>
                        </g>
                      )}

                      {/* Day of Week Label */}
                      <text
                        x={pt.x}
                        y={chartHeight - 6}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight={isToday || isHovered ? '700' : '500'}
                        fill={isToday || isHovered ? '#1c1d21' : '#787b84'}
                        className="dark:fill-[#f0eff4] transition-colors"
                      >
                        {pt.data.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
