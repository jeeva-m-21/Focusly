import React, { useState } from 'react';
import { Calendar, Award } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';

interface DayCell {
  dayIndex: number;
  weekIndex: number;
  dateStr: string;
  hours: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export const ConsistencyHeatmap: React.FC<{ className?: string }> = ({ className }) => {
  const [hoveredCell, setHoveredCell] = useState<DayCell | null>(null);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = ['W1', 'W2', 'W3', 'W4 (Current)'];

  // 28 days of mock activity
  const gridData: DayCell[] = [];
  const hoursSequence = [
    2.5, 3.8, 4.0, 3.2, 2.0, 0.0, 1.5,
    3.0, 4.2, 3.5, 4.8, 3.0, 0.0, 2.0,
    3.2, 5.0, 4.5, 3.8, 3.0, 1.0, 2.5,
    3.5, 5.1, 4.0, 3.2, 2.7, 0.0, 0.0
  ];

  for (let w = 0; w < 4; w++) {
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      const hours = hoursSequence[idx];
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (hours >= 4.5) level = 4;
      else if (hours >= 3.0) level = 3;
      else if (hours >= 2.0) level = 2;
      else if (hours > 0) level = 1;

      gridData.push({
        dayIndex: d,
        weekIndex: w,
        dateStr: `Week ${w + 1}, ${daysOfWeek[d]}`,
        hours,
        level
      });
    }
  }

  const levelStyles = {
    0: 'bg-[#eeeae3] dark:bg-[#1f222b] border-[#e8e5df] dark:border-[#282b36]',
    1: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
    2: 'bg-emerald-300 dark:bg-emerald-800/80 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200',
    3: 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500 text-white',
    4: 'bg-emerald-700 dark:bg-emerald-400 border-emerald-800 dark:border-emerald-300 text-white dark:text-[#0c0d10]'
  };

  return (
    <Card className={className}>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#f0fdf4] dark:bg-[#064e3b]/30 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4]">Study Habit Consistency Matrix</span>
          </div>
        }
        subtitle="28-day historical study rhythm and deep work execution"
        badge={
          <Badge variant="emerald">
            <Award className="w-3.5 h-3.5" />
            <span>92% Consistency</span>
          </Badge>
        }
      />
      <CardBody>
        <div className="overflow-x-auto pb-1">
          <div className="min-w-[420px]">
            {/* Grid Days Header */}
            <div className="grid grid-cols-8 gap-2 mb-2 text-center text-[10.5px] font-mono text-[#787b84] dark:text-[#8d929e]">
              <div className="text-left font-sans text-[#9da0a6]">Week</div>
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Matrix Rows */}
            {weeks.map((weekLabel, wIdx) => {
              const weekCells = gridData.filter((c) => c.weekIndex === wIdx);

              return (
                <div key={weekLabel} className="grid grid-cols-8 gap-2 mb-2 items-center">
                  <div className="text-[11px] font-medium text-[#787b84] dark:text-[#8d929e] truncate">
                    {weekLabel}
                  </div>
                  {weekCells.map((cell) => {
                    const isHovered =
                      hoveredCell?.weekIndex === cell.weekIndex &&
                      hoveredCell?.dayIndex === cell.dayIndex;

                    return (
                      <div
                        key={`${cell.weekIndex}-${cell.dayIndex}`}
                        onMouseEnter={() => setHoveredCell(cell)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-8 rounded-lg border flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all duration-150 ${
                          levelStyles[cell.level]
                        } ${isHovered ? 'scale-110 shadow-sm ring-2 ring-emerald-500/50 z-10' : ''}`}
                      >
                        {cell.hours > 0 ? `${cell.hours.toFixed(1)}h` : '–'}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Matrix Legend & Hover readout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-2 border-t border-[#f0ede6] dark:border-[#20222a] text-xs text-[#64676e] dark:text-[#9ba0a9]">
              <div>
                {hoveredCell ? (
                  <span>
                    <strong className="text-[#1c1d21] dark:text-[#f0eff4]">{hoveredCell.dateStr}</strong>: {hoveredCell.hours > 0 ? `${hoveredCell.hours.toFixed(1)} hours logged` : 'Rest day'}
                  </span>
                ) : (
                  <span>Hover over any day block to inspect study intensity</span>
                )}
              </div>

              {/* Intensity Scale Legend */}
              <div className="flex items-center gap-1.5 text-[10.5px]">
                <span>Less</span>
                <span className="w-3.5 h-3.5 rounded bg-[#eeeae3] dark:bg-[#1f222b] border border-[#e8e5df] dark:border-[#282b36]" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-300 dark:bg-emerald-800/80 border border-emerald-400 dark:border-emerald-700" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-700 dark:bg-emerald-400 border border-emerald-800 dark:border-emerald-300" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
