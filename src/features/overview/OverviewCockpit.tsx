import React, { useState } from 'react';
import {
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  BookOpen,
  MapPin,
  Terminal,
  Footprints,
  Plus,
  Check,
  Zap,
  Users,
  AlertCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ChevronRight,
  Info,
  CalendarDays,
  Target
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../../components/common/Button';
import { Badge, CognitiveLoadBadge } from '../../components/common/Badge';
import { calculateCircadianAlertness } from '../../algorithms/circadianModel';
import { soundscapes } from '../../utils/soundscapes';

interface TimelineEntry {
  id: string;
  time: string;
  endTime?: string;
  tag: 'CLASS' | 'TASK' | 'BUFFER' | 'FOCUS' | 'OFFICE_HOURS';
  title: string;
  subtitle?: string;
  location?: string;
  instructor?: string;
  courseCode?: string;
  isCurrent?: boolean;
  isCompleted?: boolean;
  taskId?: string;
  cognitiveLoad?: 'low' | 'medium' | 'high' | 'admin';
  details?: {
    estimatedMinutes?: number;
    subtasks?: string[];
    relatedNotes?: string;
    taQueueInfo?: string;
    autograder?: { passing: number; total: number; leaks: number };
    transitNote?: string;
  };
}

export const OverviewCockpit: React.FC = () => {
  const {
    user,
    tasks,
    courses,
    scheduleBlocks,
    setView,
    startDeepWork,
    toggleTask,
    openAutograder,
    joinTaQueue,
    setQuickBlockModal,
    addScheduleBlock,
    activeDeepWork,
    setAmbientSound
  } = useFocusStore();

  // State for progressive disclosure
  const [isNextUpDetailsOpen, setIsNextUpDetailsOpen] = useState(false);
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);
  const [plannedNotice, setPlannedNotice] = useState(false);
  const [showReadinessTooltip, setShowReadinessTooltip] = useState(false);

  const cs106bCourse = courses.find((c) => c.id === 'cs106b');
  const math51Course = courses.find((c) => c.id === 'math51');
  const highLoadTask = tasks.find((t) => t.id === 't-1');

  // Compute scientific alertness: 10:45 AM
  const bioTelemetry = calculateCircadianAlertness(10.75, user?.chronotype || 'afternoon');

  // Unified Chronological Timeline Items
  const timeline: TimelineEntry[] = [
    {
      id: 'item-1',
      time: '08:30',
      endTime: '10:00',
      tag: 'FOCUS',
      title: 'Circadian Peak Focus Window',
      subtitle: 'Morning deep work block · Tree invariants & algorithmic recursion',
      courseCode: 'CS 106B',
      isCompleted: true,
      cognitiveLoad: 'high',
      details: {
        estimatedMinutes: 90,
        subtasks: ['Reviewed binary search tree properties', 'Completed recursion trace problem set'],
        relatedNotes: 'CS 106B Lecture 11: Tree Invariants'
      }
    },
    {
      id: 'item-2',
      time: '10:30',
      endTime: '11:20',
      tag: 'CLASS',
      title: 'CS 106B: Programming Abstractions',
      subtitle: 'Linked Lists, Pointers & Destructor Implementations',
      location: 'Hewlett Teaching Center 200',
      instructor: 'Prof. Keith Schwarz',
      courseCode: 'CS 106B',
      isCurrent: true,
      cognitiveLoad: 'high',
      details: {
        estimatedMinutes: 50,
        subtasks: ['Dynamic memory deallocation rules', 'Self-assignment guard in operator='],
        transitNote: '15 min buffer advised from Durand / Quad',
        taQueueInfo: `${cs106bCourse?.taQueue.studentsInLine || 4} students currently queued at Durand 353 (~12m wait)`
      }
    },
    {
      id: 'item-3',
      time: '11:20',
      endTime: '11:45',
      tag: 'BUFFER',
      title: 'Campus Transit Buffer',
      subtitle: 'Hewlett Teaching Center → Sloan Math Corner (6 min walk · 0.35 mi)',
      location: 'Main Quad Transit Path',
      details: {
        estimatedMinutes: 25,
        transitNote: 'Dijkstra shortest path router estimates 6m walk or 3m bike.'
      }
    },
    {
      id: 'item-4',
      time: '11:45',
      endTime: '12:35',
      tag: 'CLASS',
      title: 'MATH 51: Linear Algebra & Multivariable Calculus',
      subtitle: 'Eigenbasis, Characteristic Polynomial & SVD Proofs',
      location: 'Sloan Math Corner 380',
      instructor: 'Prof. Jonathan Luk',
      courseCode: 'MATH 51',
      cognitiveLoad: 'high',
      details: {
        estimatedMinutes: 50,
        subtasks: ['Review Gram-Schmidt projection formula', 'Prepare discussion question on orthogonal matrices']
      }
    },
    {
      id: 'item-5',
      time: '12:45',
      endTime: '13:30',
      tag: 'BUFFER',
      title: 'Lunch & Cognitive Rest Recovery',
      subtitle: 'Tressider Memorial Union · Off-screen restorative buffer',
      location: 'Tressider Union'
    },
    {
      id: 'item-6',
      time: '14:00',
      endTime: '15:30',
      tag: 'TASK',
      title: 'P-Set 4: PriorityQueue Debugging',
      subtitle: 'Dynamic array resize delete[] leak resolution & edge case testing',
      courseCode: 'CS 106B',
      taskId: 't-1',
      isCompleted: tasks.find((t) => t.id === 't-1')?.completed || false,
      cognitiveLoad: 'high',
      details: {
        estimatedMinutes: 90,
        subtasks: ['Fix valgrind delete[] memory leak in pq_heap.cpp', 'Pass autograder test 19 & 20'],
        autograder: { passing: 18, total: 20, leaks: 1 }
      }
    },
    {
      id: 'item-7',
      time: '16:00',
      endTime: '16:45',
      tag: 'OFFICE_HOURS',
      title: 'Durand 353 TA Queue Consultation',
      subtitle: 'CS 106B Section Leader Helper Suite · Heap memory review',
      location: 'Durand Building 353',
      courseCode: 'CS 106B',
      cognitiveLoad: 'medium',
      details: {
        taQueueInfo: `${cs106bCourse?.taQueue.studentsInLine || 4} students in line (~12m wait)`
      }
    },
    {
      id: 'item-8',
      time: '17:00',
      endTime: '17:45',
      tag: 'TASK',
      title: 'Review Lecture Notes: Matrix Kernel & Image',
      subtitle: 'Synthesize lecture audio notes into cheat sheet for Friday discussion',
      courseCode: 'MATH 51',
      taskId: 't-8',
      isCompleted: tasks.find((t) => t.id === 't-8')?.completed || false,
      cognitiveLoad: 'medium',
      details: {
        estimatedMinutes: 45,
        subtasks: ['Verify kernel nullity theorem', 'Summarize column space projection']
      }
    }
  ];

  // Action: Plan the recommended session directly onto the schedule
  const handlePlanRecommendedSession = () => {
    addScheduleBlock({
      id: `sb-opt-${Date.now()}`,
      startTime: '13:30',
      endTime: '15:30',
      title: 'P-Set 4: Priority Queue Deep Focus Session',
      type: 'deep_work',
      courseCode: 'CS 106B',
      cognitiveLoad: 'high',
      location: 'Gates Information Sciences Building'
    });
    setPlannedNotice(true);
    setTimeout(() => setPlannedNotice(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER CONTEXT (Quiet, uncluttered student OS greeting)
         ───────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece8df] dark:border-[#22242f] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
            Good morning, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#787b84] dark:text-[#8d929e] mt-1 font-medium">
            Thursday · October 24 · Stanford University · Fall '24 Week 5
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#f2efe9] dark:bg-[#1a1b24] text-[#64676e] dark:text-[#9ba0a9] border border-[#e2ded5] dark:border-[#262836]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Sync · 10:45 AM
          </span>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. LEVEL 1: WHAT SHOULD I DO NOW? (Single dominant Hero Card)
         ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="next-up-heading">
        <div className="rounded-2xl border-2 border-[#1c1d21] dark:border-white/90 bg-white dark:bg-[#14151c] p-6 sm:p-7 shadow-sm transition-all relative overflow-hidden">
          {/* Subtle status indicator */}
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider font-bold text-[#b45309] dark:text-[#fbbf24] bg-[#fffbeb] dark:bg-[#78350f]/30 px-2 py-0.5 rounded border border-[#fde68a] dark:border-[#92400e]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              UP NEXT · 10:30 AM → 11:20 AM
            </span>

            <span className="text-xs font-mono font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
              Starts in 45 min
            </span>
          </div>

          {/* Core Content: What & Where */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-[#787b84] dark:text-[#8d929e]">
              CS 106B · Programming Abstractions
            </div>
            <h2
              id="next-up-heading"
              className="text-xl sm:text-2xl font-black text-[#1c1d21] dark:text-[#f0eff4] tracking-tight leading-snug"
            >
              Linked Lists, Pointers & Destructor Implementations
            </h2>
            <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#9da0a6]" />
              <span>Hewlett Teaching Center 200</span>
              <span>·</span>
              <span>Prof. Keith Schwarz</span>
            </p>
          </div>

          {/* Action Row: Strict Hierarchy (Primary -> Secondary) */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#f2efe9] dark:border-[#20222d]">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (highLoadTask) {
                  startDeepWork(highLoadTask.id, highLoadTask.title, 'CS 106B', 50);
                } else {
                  startDeepWork('t-1', 'CS 106B Preparation', 'CS 106B', 50);
                }
                setView('focus-timer');
              }}
              icon={<Flame className="w-4 h-4 fill-amber-400 text-amber-400" />}
              className="font-bold text-xs px-5 shadow-xs"
            >
              Start Focus Session
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsNextUpDetailsOpen(!isNextUpDetailsOpen)}
              icon={isNextUpDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              className="text-xs font-semibold text-[#5a5d64] dark:text-[#9ba0a9]"
            >
              {isNextUpDetailsOpen ? 'Hide Details' : 'View Details'}
            </Button>
          </div>

          {/* Progressive Disclosure Panel */}
          {isNextUpDetailsOpen && (
            <div className="mt-4 pt-4 border-t border-[#f4f1eb] dark:border-[#1e202a] text-xs space-y-2.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#181a24] border border-[#e8e5df] dark:border-[#262836]">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
                    Campus Transit Advisory
                  </span>
                  <p className="text-[#1c1d21] dark:text-[#f0eff4] mt-0.5">
                    15 min walk buffer recommended. Hewlett 200 doors open at 10:20 AM.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#181a24] border border-[#e8e5df] dark:border-[#262836]">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
                    Durand Office Hours Status
                  </span>
                  <p className="text-[#1c1d21] dark:text-[#f0eff4] mt-0.5">
                    {cs106bCourse?.taQueue.studentsInLine || 4} students currently in queue (~12 min estimated wait).
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#787b84] dark:text-[#8d929e]">
                <span>Slides, handout & starter code available on Canvas</span>
                <button
                  onClick={() => setView('course-cs106b')}
                  className="font-bold text-[#1c1d21] dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open CS 106B Course Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. RECOMMENDED NEXT ACTION (Intelligence Engine)
         ───────────────────────────────────────────────────────────── */}
      <section className="p-4 rounded-xl bg-[#f7f5ef] dark:bg-[#15161f] border border-[#e4dfd4] dark:border-[#222432] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono uppercase font-bold text-[10px] text-amber-800 dark:text-amber-300 block tracking-wider">
              RECOMMENDED NEXT
            </span>
            <p className="text-[#1c1d21] dark:text-[#f0eff4] mt-0.5 font-medium">
              Review CS 106B dynamic memory notes for 10 minutes before the 11:45 MATH 51 lecture.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            startDeepWork('t-1', 'Review Lecture Notes', 'CS 106B', 10);
            setView('focus-timer');
          }}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
        >
          Start 10m review →
        </button>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. TODAY'S HORIZON: CONTINUOUS CHRONOLOGICAL RAIL
         ───────────────────────────────────────────────────────────── */}
      <section aria-label="Day Chronology">
        <div className="flex items-center justify-between text-xs text-[#787b84] dark:text-[#8d929e] mb-2 font-mono">
          <span className="font-bold uppercase tracking-wider text-[10.5px]">CHRONOLOGY</span>
          <span className="text-[10px]">TIME → EVENT → CURRENT POSITION</span>
        </div>

        {/* Continuous Connected Horizontal Rail */}
        <div className="relative py-3 px-2 sm:px-4 bg-white dark:bg-[#14151c] rounded-2xl border border-[#e8e5df] dark:border-[#22242f] shadow-2xs overflow-x-auto">
          {/* Background Rail Line */}
          <div className="absolute top-[28px] left-6 right-6 h-0.5 bg-[#e4dfd4] dark:bg-[#262836] -z-0" />

          <div className="flex items-start justify-between min-w-[520px] relative z-10">
            {/* 08:30 Focus */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">08:30</span>
              <div className="w-3.5 h-3.5 rounded-full bg-[#1c1d21] dark:bg-white border-2 border-white dark:border-[#14151c] shadow-xs my-1 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white dark:text-[#14151c]" />
              </div>
              <span className="text-xs font-medium text-[#787b84] dark:text-[#8d929e]">Peak Focus</span>
            </div>

            {/* 10:30 CS 106B (NOW) */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono font-bold text-[#b45309] dark:text-[#fbbf24]">10:30</span>
              <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-[#14151c] ring-3 ring-amber-400/40 my-1 animate-pulse" />
              <span className="text-xs font-bold text-[#1c1d21] dark:text-white">CS 106B</span>
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1 rounded mt-0.5">
                ● NOW
              </span>
            </div>

            {/* 11:45 MATH 51 */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">11:45</span>
              <div className="w-3 h-3 rounded-full bg-[#bbb7ad] dark:bg-[#383b4b] border-2 border-white dark:border-[#14151c] my-1.5" />
              <span className="text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">MATH 51</span>
            </div>

            {/* 14:00 P-Set 4 */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">14:00</span>
              <div className="w-3 h-3 rounded-full bg-[#bbb7ad] dark:bg-[#383b4b] border-2 border-white dark:border-[#14151c] my-1.5" />
              <span className="text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">P-Set 4</span>
            </div>

            {/* 16:00 TA Queue */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">16:00</span>
              <div className="w-3 h-3 rounded-full bg-[#bbb7ad] dark:bg-[#383b4b] border-2 border-white dark:border-[#14151c] my-1.5" />
              <span className="text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">TA Queue</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LEVEL 2: UNIFIED CHRONOLOGICAL SCHEDULE
          (Clean dividers, no excessive nested card boxes)
         ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="schedule-heading" className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#ece8df] dark:border-[#22242f] pb-2">
          <div>
            <h2 id="schedule-heading" className="text-base font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              Today's Schedule
            </h2>
            <p className="text-xs text-[#787b84] dark:text-[#8d929e]">
              Unified chronological timeline of classes, problem sets, transit buffers and office hours
            </p>
          </div>

          <span className="text-xs font-mono text-[#787b84] dark:text-[#8d929e]">
            {timeline.length} events
          </span>
        </div>

        {/* Clean Timeline List with subtle dividers */}
        <div className="divide-y divide-[#ece8df] dark:divide-[#1f212c]">
          {timeline.map((entry) => {
            const isExpanded = expandedTimelineId === entry.id;

            return (
              <div
                key={entry.id}
                className={`py-3.5 sm:py-4 transition-colors ${
                  entry.isCurrent ? 'bg-amber-50/30 dark:bg-amber-950/10 -mx-3 px-3 rounded-xl' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Time & Tag */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-14 sm:w-16 shrink-0 pt-0.5">
                      <div className="font-mono text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                        {entry.time}
                      </div>
                      {entry.endTime && (
                        <div className="font-mono text-[10.5px] text-[#9da0a6] dark:text-[#676b76]">
                          {entry.endTime}
                        </div>
                      )}
                    </div>

                    {/* Middle: Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {/* Semantic Tag Chip */}
                        <span
                          className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            entry.tag === 'CLASS'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                              : entry.tag === 'TASK'
                              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                              : entry.tag === 'FOCUS'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : entry.tag === 'OFFICE_HOURS'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {entry.tag}
                        </span>

                        {entry.courseCode && (
                          <span className="text-[10.5px] font-mono font-semibold text-[#64676e] dark:text-[#9ba0a9]">
                            {entry.courseCode}
                          </span>
                        )}

                        {entry.isCurrent && (
                          <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/60 px-1.5 rounded">
                            ● NOW
                          </span>
                        )}

                        {entry.isCompleted && (
                          <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                            ✓ Done
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-bold text-[#1c1d21] dark:text-[#f0eff4] leading-snug ${
                          entry.isCompleted ? 'line-through text-[#9da0a6] dark:text-[#676b76]' : ''
                        }`}
                      >
                        {entry.title}
                      </h3>

                      {entry.subtitle && (
                        <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                          {entry.subtitle}
                        </p>
                      )}

                      {entry.location && (
                        <p className="text-[11.5px] text-[#787b84] dark:text-[#8d929e] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#9da0a6]" />
                          <span>{entry.location}</span>
                        </p>
                      )}

                      {/* Progressive Disclosure: Details */}
                      {isExpanded && entry.details && (
                        <div className="mt-3 p-3 rounded-xl bg-[#faf8f5] dark:bg-[#181924] border border-[#e8e5df] dark:border-[#262836] text-xs space-y-2 animate-in fade-in duration-150">
                          {entry.details.estimatedMinutes && (
                            <div className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">
                              Estimated duration: <strong className="text-[#1c1d21] dark:text-white">{entry.details.estimatedMinutes} minutes</strong>
                            </div>
                          )}

                          {entry.details.subtasks && entry.details.subtasks.length > 0 && (
                            <div>
                              <span className="font-mono text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e] block mb-1">
                                Action Items:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-xs text-[#52555d] dark:text-[#a0a5b2]">
                                {entry.details.subtasks.map((st, i) => (
                                  <li key={i}>{st}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {entry.details.autograder && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10.5px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                {entry.details.autograder.passing}/{entry.details.autograder.total} Tests Passing
                              </span>
                              {entry.details.autograder.leaks > 0 && (
                                <button
                                  onClick={() => openAutograder(entry.taskId!)}
                                  className="text-[10.5px] font-mono bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900 hover:underline cursor-pointer flex items-center gap-1"
                                >
                                  <Terminal className="w-3 h-3" />
                                  <span>Inspect 1 Valgrind Leak →</span>
                                </button>
                              )}
                            </div>
                          )}

                          {entry.details.taQueueInfo && (
                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-[11px] text-[#64676e] dark:text-[#9ba0a9]">
                                {entry.details.taQueueInfo}
                              </span>
                              <button
                                onClick={() => joinTaQueue('cs106b')}
                                className="font-bold text-xs text-[#1c1d21] dark:text-white hover:underline cursor-pointer"
                              >
                                Join Durand Queue →
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    {entry.tag === 'TASK' && entry.taskId && (
                      <input
                        type="checkbox"
                        checked={entry.isCompleted}
                        onChange={() => toggleTask(entry.taskId!)}
                        className="w-4 h-4 rounded border-[#d5d0c7] dark:border-[#383b48] text-[#1c1d21] dark:text-white focus:ring-0 cursor-pointer accent-[#1c1d21] dark:accent-white"
                        title="Mark task completed"
                      />
                    )}

                    {entry.tag === 'TASK' && !entry.isCompleted && (
                      <button
                        onClick={() => {
                          startDeepWork(entry.taskId!, entry.title, entry.courseCode);
                          setView('focus-timer');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                      >
                        Focus
                      </button>
                    )}

                    {entry.details && (
                      <button
                        onClick={() =>
                          setExpandedTimelineId(isExpanded ? null : entry.id)
                        }
                        className="p-1 rounded-lg text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#f2efe9] dark:hover:bg-[#1a1b24] transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand details'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. LEVEL 3: HOW AM I DOING? (Quiet, single-row KPI summary)
         ───────────────────────────────────────────────────────────── */}
      <section aria-label="Weekly Academic Performance" className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#787b84] dark:text-[#8d929e] font-mono">
          <span className="font-bold uppercase tracking-wider text-[10.5px]">THIS WEEK</span>
          <span>PACE: +1.2H AHEAD</span>
        </div>

        {/* Compact Single Horizontal Module */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#f0ede6] dark:divide-[#22242f]">
          {/* Focus Hours */}
          <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
            <span className="text-[10.5px] font-mono uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
              Study Focus
            </span>
            <div className="text-xl font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4] mt-0.5">
              18.5h
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              77% of 24h target
            </p>
          </div>

          {/* Attendance Health */}
          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[10.5px] font-mono uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
              Attendance
            </span>
            <div className="text-xl font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4] mt-0.5">
              94.1%
            </div>
            <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
              Safe ✓ (1 buffer remaining)
            </p>
          </div>

          {/* Term GPA */}
          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[10.5px] font-mono uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
              Academic GPA
            </span>
            <div className="text-xl font-bold font-mono text-[#1c1d21] dark:text-[#f0eff4] mt-0.5">
              3.88
            </div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              Dean's List standing ★
            </p>
          </div>

          {/* Focus Readiness with Informational Tooltip */}
          <div className="pt-2 sm:pt-0 sm:px-3 last:pr-0 relative">
            <div className="flex items-center gap-1">
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
                Focus Readiness
              </span>
              <button
                type="button"
                onClick={() => setShowReadinessTooltip(!showReadinessTooltip)}
                className="text-[#9da0a6] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
                title="What does this mean?"
              >
                <Info className="w-3 h-3" />
              </button>
            </div>

            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              High ↑
            </div>
            <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-0.5">
              Best window for deep work
            </p>

            {/* Explanatory Tooltip Popover */}
            {showReadinessTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white dark:bg-[#1b1c26] rounded-xl border border-[#e8e5df] dark:border-[#282a3a] shadow-calm-lg text-xs z-30 animate-in fade-in duration-150">
                <p className="text-[#1c1d21] dark:text-[#f0eff4] font-semibold mb-1">
                  Borbély Alertness Model
                </p>
                <p className="text-[#64676e] dark:text-[#9ba0a9] leading-relaxed text-[11px]">
                  Based on your chronotype, time awake, and academic schedule. Process C harmonic peak provides optimal mental acuity between 1:30 and 5:30 PM.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. LEVEL 4: OPTIONAL OPTIMIZATIONS (Actionable Recommendation)
         ───────────────────────────────────────────────────────────── */}
      <section aria-label="Study Window Recommendation">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-white to-white dark:from-amber-950/20 dark:via-[#151620] dark:to-[#14151c] border border-amber-200/90 dark:border-amber-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              YOUR BEST STUDY WINDOW TODAY
            </span>

            <div className="text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              1:30 PM — 5:30 PM
            </div>

            <p className="text-xs text-[#64676e] dark:text-[#9ba0a9]">
              <strong className="text-[#1c1d21] dark:text-white font-semibold">Recommended:</strong> P-Set 4 · Priority Queue Debugging.
              <span className="block text-[11px] text-[#787b84] dark:text-[#8d929e] mt-0.5">
                Why: Your focus quality is typically highest in this period and you have no lectures scheduled.
              </span>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={handlePlanRecommendedSession}
              icon={<CalendarDays className="w-4 h-4 text-amber-400" />}
              className="text-xs font-bold px-4 py-2"
            >
              Plan this session
            </Button>
          </div>
        </div>

        {plannedNotice && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>P-Set 4 deep focus session has been scheduled from 1:30 PM to 3:30 PM in your timetable!</span>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. AMBIENT SOUNDSCAPE UTILITY (Quiet, Minimalist Dock)
         ───────────────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#ece8df] dark:border-[#22242f] bg-[#faf8f5] dark:bg-[#121319] text-xs">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-[#787b84] dark:text-[#8d929e]" />
          <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
            Focus Audio Ambience
          </span>
          <span className="text-[#787b84] dark:text-[#8d929e]">• Procedural sound generator</span>
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: 'off', label: 'Off' },
            { id: 'brown-noise', label: 'Brown Noise' },
            { id: 'rain', label: 'Rain' },
            { id: 'library', label: 'Library' }
          ].map((mode) => {
            const isActive = activeDeepWork.ambientSound === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setAmbientSound(mode.id as any);
                  soundscapes.play(mode.id as any);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] font-semibold'
                    : 'bg-white dark:bg-[#1b1c26] text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white border border-[#e4dfd4] dark:border-[#252735]'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
