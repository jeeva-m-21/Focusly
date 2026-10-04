import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const PlannerWeek: React.FC = () => {
  const { setView } = useFocusStore();

  const weekDays = [
    { day: 'Mon', date: 'Oct 21', scheduled: 5.5, deepWork: 4.0, capacity: 8.0, status: 'completed' },
    { day: 'Tue', date: 'Oct 22', scheduled: 4.0, deepWork: 3.5, capacity: 8.0, status: 'completed' },
    { day: 'Wed', date: 'Oct 23', scheduled: 6.0, deepWork: 4.5, capacity: 8.0, status: 'completed' },
    { day: 'Thu', date: 'Oct 24', scheduled: 5.0, deepWork: 4.0, capacity: 8.0, status: 'today' },
    { day: 'Fri', date: 'Oct 25', scheduled: 4.5, deepWork: 3.0, capacity: 8.0, status: 'upcoming' },
    { day: 'Sat', date: 'Oct 26', scheduled: 1.0, deepWork: 3.0, capacity: 5.0, status: 'upcoming' },
    { day: 'Sun', date: 'Oct 27', scheduled: 1.0, deepWork: 2.0, capacity: 4.0, status: 'upcoming' }
  ];

  const totalScheduled = weekDays.reduce((acc, d) => acc + d.scheduled, 0);
  const totalDeepWork = weekDays.reduce((acc, d) => acc + d.deepWork, 0);
  const totalLoad = totalScheduled + totalDeepWork;
  const academicCap = 40.0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
            Weekly Plan
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-1">
            Track class hours and study sessions across the week to maintain a balanced workload.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('planner-day')}
            icon={<Clock className="w-3.5 h-3.5 text-[#64676e] dark:text-[#9ba0a9]" />}
          >
            Day View
          </Button>
        </div>
      </div>

      {/* Weekly Capacity Visualizer Banner */}
      <Card className="p-5 bg-white dark:bg-[#14151a] border border-[#e8e5df] dark:border-[#232630]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] uppercase tracking-wide">
                Weekly Time Budget
              </span>
              <Badge variant={totalLoad > academicCap ? 'rose' : 'emerald'}>
                {totalLoad.toFixed(1)} / {academicCap} hrs Planned
              </Badge>
            </div>
            <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-1">
              Class hours: <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">{totalScheduled}h</span> • Study sessions: <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">{totalDeepWork}h</span> • Remaining buffer: <span className="font-semibold text-[#15803d] dark:text-[#34d399]">{(academicCap - totalLoad).toFixed(1)}h available</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-normal">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-500" />
              <span className="text-[#64676e] dark:text-[#9ba0a9]">Classes ({totalScheduled}h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span className="text-[#64676e] dark:text-[#9ba0a9]">Study Time ({totalDeepWork}h)</span>
            </div>
          </div>
        </div>

        {/* Stacked Capacity Bar */}
        <div className="h-3 w-full bg-[#f4f1eb] dark:bg-[#1a1c24] rounded-full overflow-hidden flex border border-[#e8e5df] dark:border-[#262832]">
          <div
            className="bg-slate-500 transition-all duration-300"
            style={{ width: `${(totalScheduled / academicCap) * 100}%` }}
            title="Classes"
          />
          <div
            className="bg-amber-500 transition-all duration-300"
            style={{ width: `${(totalDeepWork / academicCap) * 100}%` }}
            title="Study Time"
          />
        </div>
      </Card>

      {/* 7-Day Capacity Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayTotal = day.scheduled + day.deepWork;
          const isOver = dayTotal > day.capacity;
          const isToday = day.status === 'today';

          return (
            <Card
              key={day.day}
              className={`p-4 flex flex-col justify-between transition-all cursor-pointer ${
                isToday
                  ? 'border-[#1c1d21] dark:border-white ring-1 ring-[#1c1d21]/20 dark:ring-white/20 shadow-sm bg-white dark:bg-[#181922]'
                  : 'hover:border-[#d5d0c7] dark:hover:border-[#383b48] bg-white dark:bg-[#14151a]'
              }`}
              onClick={() => setView('planner-day')}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isToday ? 'text-[#1c1d21] dark:text-[#f0eff4]' : 'text-[#64676e] dark:text-[#9ba0a9]'}`}>
                    {day.day}
                  </span>
                  <span className="text-[11px] text-[#9da0a6] dark:text-[#676b76]">
                    {day.date}
                  </span>
                </div>

                {isToday && (
                  <span className="text-[9.5px] font-semibold uppercase bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] px-1.5 py-0.2 rounded mb-2 inline-block">
                    Today
                  </span>
                )}

                <div className="space-y-1 my-3">
                  <div className="text-xl font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4]">
                    {dayTotal.toFixed(1)}h
                  </div>
                  <div className="text-[11px] text-[#787b84] dark:text-[#8d929e] flex justify-between font-normal">
                    <span>Limit: {day.capacity}h</span>
                    <span className={isOver ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-[#15803d] dark:text-[#34d399]'}>
                      {isOver ? 'Full' : 'Good'}
                    </span>
                  </div>
                </div>

                {/* Vertical Bar Indicator */}
                <div className="h-24 w-full bg-[#f4f1eb] dark:bg-[#1f222b] rounded-lg p-1 flex flex-col justify-end gap-1">
                  <div
                    className="w-full bg-amber-500 rounded-xs transition-all"
                    style={{ height: `${(day.deepWork / 10) * 100}%` }}
                    title={`Study: ${day.deepWork}h`}
                  />
                  <div
                    className="w-full bg-slate-500 rounded-xs transition-all"
                    style={{ height: `${(day.scheduled / 10) * 100}%` }}
                    title={`Classes: ${day.scheduled}h`}
                  />
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#f0ede6] dark:border-[#22242c] text-[11px] text-[#787b84] dark:text-[#8d929e] flex items-center justify-between">
                <span>View Timeline</span>
                <ArrowRight className="w-3 h-3 text-[#9da0a6] dark:text-[#676b76]" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
