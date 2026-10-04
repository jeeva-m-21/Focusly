import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Pin,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  BookOpen,
  Filter,
  Sparkles,
  Zap,
  ArrowRight,
  X,
  AlertTriangle,
  School
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Task } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    tasks,
    courses,
    scheduleBlocks,
    user,
    toggleTask,
    togglePinTask,
    pinTaskToDate,
    startDeepWork,
    setView,
    openVtopSyncModal
  } = useFocusStore();

  // Current calendar viewing month: year = 2026, month = 9 (October, 0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // October
  const [selectedDateStr, setSelectedDateStr] = useState('2026-10-24'); // Today in simulation
  const [filterCourseId, setFilterCourseId] = useState<string>('all');
  const [filterPinnedOnly, setFilterPinnedOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'month' | 'two-weeks'>('month');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Month metadata
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDateStr('2026-10-24');
  };

  // Generate calendar grid days for Monday-first calendar
  // October 2026: Oct 1 is Thursday.
  // In Monday-indexed week (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday=0 to Monday=0 indexing: Sun(0)->6, Mon(1)->0, etc.
    return (day + 6) % 7;
  };

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const startDayOffset = getFirstDayOfWeek(currentYear, currentMonth);

  // Previous month padding
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth === 0 ? 11 : currentMonth - 1);

  interface CalendarDay {
    dayNumber: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    dateStr: string;
    isToday: boolean;
  }

  const calendarDays: CalendarDay[] = [];

  // 1. Previous month trailing days
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      dateStr,
      isToday: dateStr === '2026-10-24'
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: d,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true,
      dateStr,
      isToday: dateStr === '2026-10-24'
    });
  }

  // 3. Next month leading days to complete grid (multiples of 7)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      dateStr,
      isToday: dateStr === '2026-10-24'
    });
  }

  // Automatic deadline resolver for all tasks
  const getTaskDeadlineDate = (task: Task): string => {
    if (task.scheduledDate && /^\d{4}-\d{2}-\d{2}$/.test(task.scheduledDate)) {
      return task.scheduledDate;
    }
    if (!task.dueDate) return '2026-10-24';
    const lower = task.dueDate.toLowerCase();
    if (lower.includes('today') || lower.includes('thursday')) return '2026-10-24';
    if (lower.includes('tomorrow') || lower.includes('friday')) return '2026-10-25';
    if (lower.includes('yesterday') || lower.includes('wednesday')) return '2026-10-23';
    if (lower.includes('saturday')) return '2026-10-26';
    if (lower.includes('sunday')) return '2026-10-25';
    if (lower.includes('monday')) return '2026-10-27';
    if (lower.includes('tuesday')) return '2026-11-03';
    if (lower.includes('next week')) return '2026-10-30';
    const iso = task.dueDate.match(/\d{4}-\d{2}-\d{2}/);
    return iso ? iso[0] : '2026-10-24';
  };

  // Automatic Exam Deadlines & Milestones (VIT Continuous Assessment & FAT)
  const examMilestones = useMemo(() => {
    const examTasks = tasks.filter(
      (t) =>
        t.id.startsWith('task-exam-') ||
        t.title.toLowerCase().includes('fat') ||
        t.title.toLowerCase().includes('cat') ||
        t.title.toLowerCase().includes('exam')
    );

    if (examTasks.length > 0) {
      return examTasks.map((t, idx) => {
        const course = courses.find((c) => c.id === t.courseId);
        return {
          id: `ex-${t.id || idx}`,
          title: t.title,
          courseCode: course?.code || 'VIT',
          dateStr: t.dueDate || '2026-10-25',
          time: '10:00 AM',
          location: t.description?.split('·')[1]?.trim() || 'Academic Block',
          weight: '40%'
        };
      });
    }

    if (courses && courses.length > 0) {
      return courses.map((c, idx) => ({
        id: `ex-gen-${idx}`,
        title: `${c.code} Assessment (${c.name})`,
        courseCode: c.code,
        dateStr: `2026-10-${20 + ((idx * 2) % 10)}`,
        time: idx % 2 === 0 ? '09:30 AM' : '02:00 PM',
        location: `${c.taQueue?.location || 'Academic Block'}`,
        weight: '30%'
      }));
    }

    return [
      { id: 'ex-1', title: 'CSE2005 CAT-1 (Operating Systems)', courseCode: 'CSE2005', dateStr: '2026-10-18', time: '09:30 AM', location: 'SJT 411 (Slot A1)', weight: '15%' },
      { id: 'ex-2', title: 'CSE2006 CAT-1 (Data Structures)', courseCode: 'CSE2006', dateStr: '2026-10-20', time: '02:00 PM', location: 'TT 204 (Slot B1)', weight: '15%' },
      { id: 'ex-3', title: 'MAT2002 CAT-1 (Discrete Math)', courseCode: 'MAT2002', dateStr: '2026-10-22', time: '09:30 AM', location: 'MB 112 (Slot C1)', weight: '15%' },
      { id: 'ex-4', title: 'ECE2001 CAT-1 (Digital Logic)', courseCode: 'ECE2001', dateStr: '2026-10-24', time: '02:00 PM', location: 'TT 418 (Slot D1)', weight: '15%' },
      { id: 'ex-5', title: 'CSE2004 CAT-1 (DBMS)', courseCode: 'CSE2004', dateStr: '2026-10-26', time: '09:30 AM', location: 'SJT 314 (Slot E1)', weight: '15%' }
    ];
  }, [tasks, courses]);

  // Filter visible days if in 2-week view
  const visibleDays = viewMode === 'two-weeks'
    ? calendarDays.slice(14, 28) // middle 2 weeks encompassing Oct 19 - Nov 1
    : calendarDays;

  // Filter tasks based on automatically resolved deadline dates
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => {
      const taskDate = getTaskDeadlineDate(t);
      const matchesDate = taskDate === dateStr;
      const matchesCourse = filterCourseId === 'all' || t.courseId === filterCourseId;
      const matchesPinned = !filterPinnedOnly || t.pinned;
      return matchesDate && matchesCourse && matchesPinned;
    });
  };

  const getExamsForDate = (dateStr: string) => {
    return examMilestones.filter((e) => {
      const matchesCourse = filterCourseId === 'all' || e.courseCode.toLowerCase().replace(/\s/g, '').includes(filterCourseId.toLowerCase());
      return e.dateStr === dateStr && matchesCourse;
    });
  };

  // Selected date tasks & exams
  const selectedDateTasks = tasks.filter((t) => getTaskDeadlineDate(t) === selectedDateStr);
  const selectedDateExams = examMilestones.filter((e) => e.dateStr === selectedDateStr);
  const unpinnedBacklog = tasks.filter((t) => !t.pinned || !t.scheduledDate);

  const handleTogglePinWithConfetti = (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    togglePinTask(taskId);
  };

  const handlePinBacklogTask = (task: Task) => {
    pinTaskToDate(task.id, selectedDateStr);
  };

  // Format readable date
  const formatSelectedDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-medium bg-[#f4f1eb] dark:bg-[#1f212a] text-[#1c1d21] dark:text-[#f0eff4] px-2 py-0.5 rounded border border-[#e8e5df] dark:border-[#2a2d39]">
              {user.term || 'Winter Semester 2025-26'} • {user.institution || 'VIT Vellore'}
            </span>
            <span className="text-xs text-[#787b84] dark:text-[#8d929e]">Instructional Day Order: Day 1 - Day 5</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1c1d21] dark:text-[#f0eff4] mt-1 tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
            View course assignments, pinned focus blocks, and upcoming submission checkpoints.
          </p>
        </div>

        {/* View Controls & Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#f4f1eb] dark:bg-[#181920] p-0.5 rounded-lg border border-[#e8e5df] dark:border-[#2a2d39]">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-[#252834] text-[#1c1d21] dark:text-white shadow-xs'
                  : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('two-weeks')}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'two-weeks'
                  ? 'bg-white dark:bg-[#252834] text-[#1c1d21] dark:text-white shadow-xs'
                  : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
              }`}
            >
              2-Week Horizon
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleJumpToToday}
            className="text-xs font-medium"
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openVtopSyncModal}
            className="text-xs font-semibold border-[#F59E0B]/40 hover:bg-[#FFF7E6] dark:hover:bg-[#F59E0B]/10 text-[#D97706] dark:text-[#F59E0B] flex items-center gap-1.5"
            icon={<School className="w-3.5 h-3.5" />}
          >
            <span>Sync VTOP Schedule</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPinModalOpen(true)}
            icon={<Pin className="w-3.5 h-3.5" />}
            className="text-xs font-semibold"
          >
            Pin Task
          </Button>
        </div>
      </div>

      {/* Month Navigator & Filtering Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#14151a] border border-[#e8e5df] dark:border-[#232630] shadow-xs">
        {/* Month Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="p-1.5 rounded-lg border border-[#e8e5df] dark:border-[#2a2d39] text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#faf8f5] dark:hover:bg-[#1e2029] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4] min-w-36 text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="p-1.5 rounded-lg border border-[#e8e5df] dark:border-[#2a2d39] text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#faf8f5] dark:hover:bg-[#1e2029] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#787b84] dark:text-[#8d929e]">
            <Filter className="w-3.5 h-3.5" />
            <span>Course:</span>
          </div>

          <select
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-[#e8e5df] dark:border-[#2a2d39] bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] cursor-pointer"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>

          {/* Pinned-only toggle pill */}
          <button
            onClick={() => setFilterPinnedOnly(!filterPinnedOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              filterPinnedOnly
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-[#faf8f5] dark:bg-[#181920] text-[#64676e] dark:text-[#8d929e] border-[#e8e5df] dark:border-[#2a2d39]'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${filterPinnedOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Pinned Only</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop (Calendar Grid 8 cols + Day Inspector 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid Container (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#14151a] rounded-2xl border border-[#e8e5df] dark:border-[#232630] shadow-xs overflow-hidden">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 border-b border-[#e8e5df] dark:border-[#232630] bg-[#faf8f5] dark:bg-[#181920] text-center text-[11px] font-mono font-semibold text-[#787b84] dark:text-[#8d929e] py-2.5">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#f0ede6] dark:divide-[#232630]">
            {visibleDays.map((day, idx) => {
              const dayTasks = getTasksForDate(day.dateStr);
              const dayExams = getExamsForDate(day.dateStr);
              const isSelected = selectedDateStr === day.dateStr;

              return (
                <div
                  key={`${day.dateStr}-${idx}`}
                  onClick={() => setSelectedDateStr(day.dateStr)}
                  className={`min-h-[105px] sm:min-h-[120px] p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.08] ring-2 ring-inset ring-amber-500/40'
                      : day.isToday
                      ? 'bg-[#fcfbf9] dark:bg-[#161820]'
                      : day.isCurrentMonth
                      ? 'bg-white dark:bg-[#14151a] hover:bg-[#faf8f5] dark:hover:bg-[#181920]'
                      : 'bg-[#faf8f5]/40 dark:bg-[#101115]/50 opacity-40'
                  }`}
                >
                  {/* Cell Header: Date Number & Hover Pin Action */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                        day.isToday
                          ? 'bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] shadow-xs'
                          : isSelected
                          ? 'bg-amber-500 text-white'
                          : 'text-[#1c1d21] dark:text-[#f0eff4]'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {/* Quick Pin action button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDateStr(day.dateStr);
                        setIsPinModalOpen(true);
                      }}
                      title={`Pin a task to ${day.dateStr}`}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#f4f1eb] dark:hover:bg-[#252834] text-[#787b84] dark:text-[#8d929e] transition-opacity cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tasks & Exam Deadlines Mapped to this Day */}
                  <div className="space-y-1.5 my-1.5 flex-1">
                    {/* Exam Milestones */}
                    {dayExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="px-2 py-0.5 rounded-md bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/40 text-[9px] font-mono font-bold text-rose-700 dark:text-rose-300 truncate flex items-center gap-1"
                        title={`${exam.title} (${exam.time})`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="truncate">{exam.courseCode} Midterm</span>
                      </div>
                    ))}

                    {/* Assignment Deadlines */}
                    {dayTasks.slice(0, 3).map((task) => {
                      const course = courses.find((c) => c.id === task.courseId);

                      return (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDateStr(day.dateStr);
                          }}
                          className={`px-2 py-1 rounded-md border text-left transition-all ${
                            task.completed
                              ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 opacity-70'
                              : task.pinned
                              ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 text-[#1c1d21] dark:text-[#f0eff4]'
                              : 'bg-[#faf8f5] dark:bg-[#181920] border-[#e8e5df] dark:border-[#262834] text-[#2c2d33] dark:text-[#d1d5db]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-mono font-semibold text-[#1c1d21] dark:text-[#f0eff4] truncate">
                              {course?.code}
                            </span>
                            <span className="text-[8px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1 py-0.2 rounded">
                              DUE
                            </span>
                          </div>

                          <div className={`text-[10px] font-medium truncate mt-0.5 leading-tight ${task.completed ? 'line-through text-[#9da0a6]' : ''}`}>
                            {task.title}
                          </div>
                        </div>
                      );
                    })}

                    {dayTasks.length > 3 && (
                      <span className="text-[9.5px] font-mono text-[#787b84] dark:text-[#8d929e] block text-center">
                        +{dayTasks.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer Indicators */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#9da0a6] dark:text-[#6b7280]">
                    <span>{(dayTasks.length + dayExams.length) > 0 ? `${dayTasks.length + dayExams.length} items` : ''}</span>
                    {day.isToday && (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold uppercase">
                        Today
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Inspector & Task Pinning Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 bg-white dark:bg-[#14151a] border border-[#e8e5df] dark:border-[#232630] shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#f0ede6] dark:border-[#232630]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                <div>
                  <h3 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                    {formatSelectedDate(selectedDateStr)}
                  </h3>
                  <span className="text-[10px] text-[#787b84] dark:text-[#8d929e]">
                    {selectedDateTasks.length} task{selectedDateTasks.length === 1 ? '' : 's'} scheduled
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPinModalOpen(true)}
                className="text-[11px] font-medium"
              >
                + Pin Task
              </Button>
            </div>

            {/* Mapped Exam Deadlines for this Day */}
            {selectedDateExams.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Examination Milestones
                </span>
                {selectedDateExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#1c1d21] dark:text-[#f0eff4]">{exam.title}</h4>
                      <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-0.5 font-mono">{exam.time} • {exam.location}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-[#1a1518] px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      {exam.weight}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Mapped Deadlines & Pinned Tasks List */}
            <div className="mt-4 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#787b84] dark:text-[#8d929e] block">
                Deadlines & Deliverables Due This Day
              </span>

              {selectedDateTasks.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-[#faf8f5] dark:bg-[#181920] border border-dashed border-[#e8e5df] dark:border-[#2a2d39]">
                  <Pin className="w-5 h-5 text-[#9da0a6] dark:text-[#6b7280] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium text-[#64676e] dark:text-[#9ba0a9]">
                    No deadlines due on this date.
                  </p>
                  <p className="text-[11px] text-[#9da0a6] dark:text-[#6b7280] mt-0.5">
                    Select a task from below to pin or schedule it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedDateTasks.map((task) => {
                    const course = courses.find((c) => c.id === task.courseId);

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3.5 rounded-xl border transition-all ${
                          task.completed
                            ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 opacity-75'
                            : task.pinned
                            ? 'bg-[#fffdfa] dark:bg-[#1c1b17] border-amber-500/30 shadow-xs'
                            : 'bg-white dark:bg-[#16171d] border-[#e8e5df] dark:border-[#232630]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded bg-[#f4f1eb] dark:bg-[#252834] text-[#1c1d21] dark:text-[#f0eff4] border border-[#e8e5df] dark:border-[#2f3240]">
                              {course?.code}
                            </span>
                            <span className="text-[11px] text-[#787b84] dark:text-[#8d929e] font-mono">
                              {task.estimatedMinutes}m
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleTogglePinWithConfetti(task.id, e)}
                            title={task.pinned ? 'Unpin task' : 'Pin task'}
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              task.pinned
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'text-[#9da0a6] hover:text-[#1c1d21] dark:hover:text-white'
                            }`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${task.pinned ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>

                        {/* Title & Complete Check */}
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="mt-0.5 text-[#787b84] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#9da0a6] hover:text-[#1c1d21]" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-xs font-semibold leading-tight ${
                                task.completed
                                  ? 'line-through text-[#787b84] dark:text-[#8d929e]'
                                  : 'text-[#1c1d21] dark:text-[#f0eff4]'
                              }`}
                            >
                              {task.title}
                            </h4>

                            {task.dueDate && (
                              <span className="text-[10px] text-[#b45309] dark:text-[#fbbf24] mt-1 block">
                                Due: {task.dueDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f0ede6] dark:border-[#232630]">
                          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-medium text-[#64676e] dark:text-[#9ba0a9]">
                            <span className={`w-1.5 h-1.5 rounded-full ${task.cognitiveLoad === 'high' ? 'bg-amber-500' : task.cognitiveLoad === 'medium' ? 'bg-slate-400' : 'bg-zinc-400'}`} />
                            {task.cognitiveLoad === 'high' ? 'Deep Focus' : task.cognitiveLoad === 'medium' ? 'Core Study' : 'Quick Task'}
                          </span>

                          <button
                            onClick={() => {
                              startDeepWork(task.id, task.title, course?.code);
                              setView('focus-timer');
                            }}
                            className="text-[11px] font-semibold text-[#1c1d21] dark:text-white flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <span>Focus Now</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Unpinned Backlog Tray (Click to pin to this date) */}
            <div className="mt-6 pt-4 border-t border-[#f0ede6] dark:border-[#232630]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                  Unscheduled Backlog
                </span>
                <span className="text-[10px] font-mono text-[#787b84] dark:text-[#8d929e]">
                  {unpinnedBacklog.length} items
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {unpinnedBacklog.slice(0, 5).map((task) => {
                  const course = courses.find((c) => c.id === task.courseId);

                  return (
                    <div
                      key={task.id}
                      onClick={() => handlePinBacklogTask(task)}
                      className="p-2.5 rounded-xl border border-[#e8e5df] dark:border-[#252834] bg-[#faf8f5] dark:bg-[#181920] hover:border-amber-500/50 hover:bg-[#fffdfa] dark:hover:bg-[#1e1c17] transition-all cursor-pointer flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9.5px] font-mono font-medium text-[#64676e] dark:text-[#9ba0a9]">
                            {course?.code}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] truncate">
                          {task.title}
                        </p>
                      </div>

                      <button
                        title={`Pin to ${selectedDateStr}`}
                        className="p-1 rounded-md bg-white dark:bg-[#20222a] border border-[#e8e5df] dark:border-[#2e313d] text-[#64676e] dark:text-[#9ba0a9] group-hover:text-amber-600 dark:group-hover:text-amber-400 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Pin Task Dialog Modal */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#14151a] text-[#1c1d21] dark:text-[#f0eff4] rounded-2xl shadow-xl border border-[#e8e5df] dark:border-[#232630] overflow-hidden p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ede6] dark:border-[#232630] mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                    Pin Task to {formatSelectedDate(selectedDateStr)}
                  </h3>
                  <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                    Select an existing assignment from your backlog to pin.
                  </p>
                </div>
                <button
                  onClick={() => setIsPinModalOpen(false)}
                  className="p-1 rounded-md text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {tasks.map((task) => {
                  const course = courses.find((c) => c.id === task.courseId);
                  const isAlreadyPinnedToThisDate = task.scheduledDate === selectedDateStr && task.pinned;

                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        handlePinBacklogTask(task);
                        setIsPinModalOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isAlreadyPinnedToThisDate
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-[#faf8f5] dark:bg-[#181920] border-[#e8e5df] dark:border-[#232630] hover:border-[#1c1d21] dark:hover:border-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
                          {course?.code}
                        </span>
                        {isAlreadyPinnedToThisDate ? (
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            Already Pinned
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#787b84] dark:text-[#8d929e]">
                            Click to pin
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] truncate">
                        {task.title}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-[#f0ede6] dark:border-[#232630]">
                <Button variant="outline" size="sm" onClick={() => setIsPinModalOpen(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
