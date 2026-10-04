import React, { useState, useMemo } from 'react';
import { BookOpen, PieChart } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { useFocusStore } from '../../store/useFocusStore';

interface CourseShare {
  id: string;
  code: string;
  name: string;
  hours: number;
  expectedHours: number;
  color: string;
  colorDark: string;
}

export const CourseDistributionDonut: React.FC<{ className?: string }> = ({ className }) => {
  const { courses } = useFocusStore();
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);

  const courseShares: CourseShare[] = useMemo(() => {
    if (courses && courses.length > 0) {
      return courses.slice(0, 6).map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        hours: (c.units || 3) * 2.5,
        expectedHours: (c.units || 3) * 2.0,
        color: c.color || '#F59E0B',
        colorDark: c.color || '#D97706'
      }));
    }

    return [
      { id: 'cse2005', code: 'CSE2005', name: 'Operating Systems', hours: 11.5, expectedHours: 10.0, color: '#F59E0B', colorDark: '#D97706' },
      { id: 'cse2006', code: 'CSE2006', name: 'Data Structures and Algorithms', hours: 8.5, expectedHours: 10.0, color: '#6366F1', colorDark: '#4F46E5' },
      { id: 'mat2002', code: 'MAT2002', name: 'Discrete Math & Graph Theory', hours: 9.0, expectedHours: 8.0, color: '#10B981', colorDark: '#059669' },
      { id: 'ece2001', code: 'ECE2001', name: 'Digital Logic Design', hours: 6.0, expectedHours: 6.0, color: '#EC4899', colorDark: '#DB2777' }
    ];
  }, [courses]);

  const totalHours = courseShares.reduce((sum, c) => sum + c.hours, 0);

  // SVG Donut geometry
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = courseShares.map((course) => {
    const percent = course.hours / totalHours;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -(accumulatedPercent * circumference);
    accumulatedPercent += percent;

    return {
      ...course,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset
    };
  });

  const selectedCourse = hoveredCourseId
    ? slices.find((c) => c.id === hoveredCourseId)
    : null;

  return (
    <Card className={className}>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#f0fdf4] dark:bg-[#064e3b]/30 text-emerald-600 dark:text-emerald-400">
              <PieChart className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4]">Study Time Allocation</span>
          </div>
        }
        subtitle="Distribution of weekly study hours across enrolled courses"
        badge={<Badge variant="slate">{totalHours.toFixed(1)}h Total</Badge>}
      />
      <CardBody>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Donut Chart Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 select-none"
            >
              {/* Background Ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#eeeae3"
                strokeWidth={strokeWidth}
                className="dark:stroke-[#232630]"
              />

              {/* Course Segments */}
              {slices.map((slice) => {
                const isHovered = hoveredCourseId === slice.id;
                return (
                  <circle
                    key={slice.id}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredCourseId(slice.id)}
                    onMouseLeave={() => setHoveredCourseId(null)}
                  />
                );
              })}
            </svg>

            {/* Center Text Information */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              {selectedCourse ? (
                <>
                  <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                    {selectedCourse.code}
                  </span>
                  <span className="text-base font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">
                    {selectedCourse.hours}h
                  </span>
                  <span className="text-[10px] text-[#787b84] dark:text-[#8d929e] font-medium">
                    {selectedCourse.percent}% share
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10.5px] uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                    Total
                  </span>
                  <span className="text-lg font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">
                    {totalHours.toFixed(1)}h
                  </span>
                  <span className="text-[10px] text-[#787b84] dark:text-[#8d929e]">
                    4 courses
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Course Legend & Breakdown Cards */}
          <div className="flex-1 w-full space-y-2">
            {slices.map((slice) => {
              const isHovered = hoveredCourseId === slice.id;
              const ratio = Math.round((slice.hours / slice.expectedHours) * 100);

              return (
                <div
                  key={slice.id}
                  onMouseEnter={() => setHoveredCourseId(slice.id)}
                  onMouseLeave={() => setHoveredCourseId(null)}
                  className={`p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                    isHovered
                      ? 'bg-[#f4f1eb] dark:bg-[#1f222b] border-[#cfcac1] dark:border-[#383d4c] shadow-xs'
                      : 'bg-white dark:bg-[#161820] border-[#e8e5df] dark:border-[#232630]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] truncate">
                          {slice.code}
                        </span>
                        <span className="text-[10px] text-[#787b84] dark:text-[#8d929e] truncate hidden sm:inline">
                          • {slice.name}
                        </span>
                      </div>
                      <div className="w-28 sm:w-36 bg-[#eeeae3] dark:bg-[#252834] h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, ratio)}%`,
                            backgroundColor: slice.color
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">
                      {slice.hours}h
                    </span>
                    <span className="text-[10px] text-[#787b84] dark:text-[#8d929e] block font-mono">
                      {slice.percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
