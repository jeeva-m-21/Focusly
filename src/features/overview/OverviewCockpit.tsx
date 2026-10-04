import React, { useState, useMemo } from 'react';
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
    setAmbientSound,
    openVtopSyncModal,
    vtopLastSyncedAt
  } = useFocusStore();

  // State for progressive disclosure
  const [isNextUpDetailsOpen, setIsNextUpDetailsOpen] = useState(false);
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);
  const [plannedNotice, setPlannedNotice] = useState(false);
  const [showReadinessTooltip, setShowReadinessTooltip] = useState(false);

  const cse2005Course = courses.find((c) => c.code === 'CSE2005') || courses[0];
  const cse2006Course = courses.find((c) => c.code === 'CSE2006') || courses[1];
  const highLoadTask = tasks.find((t) => t.id === 't-1') || tasks[0];

  // Compute scientific alertness: 10:45 AM
  const bioTelemetry = calculateCircadianAlertness(10.75, user?.chronotype || 'afternoon');

  // Unified Chronological Timeline Items (Dynamically generated from real scheduleBlocks & courses)
  const timeline: TimelineEntry[] = useMemo(() => {
    if (scheduleBlocks && scheduleBlocks.length > 0) {
      const sorted = [...scheduleBlocks].sort((a, b) => a.startTime.localeCompare(b.startTime));

      return sorted.map((block, idx) => {
        const course = courses.find((c) => c.code === block.courseCode);
        const isClass = block.type === 'lecture' || block.type === 'section';
        const isLab = block.type === 'section' || block.title.toLowerCase().includes('lab');

        return {
          id: `item-${block.id || idx}`,
          time: block.startTime,
          endTime: block.endTime,
          tag: isClass ? 'CLASS' : block.type === 'deep_work' ? 'FOCUS' : 'BUFFER',
          title: `${block.courseCode ? `${block.courseCode}: ` : ''}${block.title}`,
          subtitle: course ? `${course.name} · ${course.instructor}` : block.title,
          location: block.location || (course?.taQueue?.location || 'Academic Block'),
          instructor: course?.instructor,
          courseCode: block.courseCode,
          isCompleted: idx === 0,
          isCurrent: idx === 1,
          cognitiveLoad: block.cognitiveLoad || (isLab ? 'high' : 'medium'),
          details: {
            estimatedMinutes: 50,
            subtasks: [
              `Lecture session for ${block.courseCode || 'course'}`,
              `Review course handouts and practice problems`
            ],
            transitNote: block.location ? `Venue: ${block.location}` : undefined
          }
        };
      });
    }

    return [
      {
        id: 'item-1',
        time: '08:30',
        endTime: '09:20',
        tag: 'CLASS',
        title: 'CSE2005: Operating Systems (Slot A1)',
        subtitle: 'Process Scheduling, Context Switching & Dual-Mode Execution',
        location: 'SJT 411 (Silver Jubilee Tower)',
        instructor: 'Dr. K. Senthil Kumar',
        courseCode: 'CSE2005',
        isCompleted: true,
        cognitiveLoad: 'high',
        details: {
          estimatedMinutes: 50,
          subtasks: ['Reviewed kernel vs user mode transitions', 'Analyzed Round-Robin context switch overheads'],
          relatedNotes: 'CSE2005 Lecture 14: Semaphore & Mutex Invariants'
        }
      },
      {
        id: 'item-2',
        time: '09:30',
        endTime: '10:20',
        tag: 'CLASS',
        title: 'CSE2006: Data Structures & Algorithms (Slot B1)',
        subtitle: 'Red-Black Tree Insertion Balancing & AVL Double Rotations',
        location: 'TT 204 (Technology Tower)',
        instructor: 'Dr. Priya R',
        courseCode: 'CSE2006',
        isCurrent: true,
        cognitiveLoad: 'high',
        details: {
          estimatedMinutes: 50,
          subtasks: ['Prove 2^(bh) - 1 height lower bound for Red-Black trees', 'Left-Right double rotation code demo'],
          transitNote: '6 min walk via Periyar Central Library',
          taQueueInfo: `${cse2005Course?.taQueue.studentsInLine || 3} students currently queued at SJT 411 Cabin (~10m wait)`
        }
      },
      {
        id: 'item-3',
        time: '10:30',
        endTime: '11:20',
        tag: 'CLASS',
        title: 'MAT2002: Discrete Mathematics & Graph Theory (Slot C1)',
        subtitle: 'Planar Graphs, Euler Formula (V - E + F = 2) & Kuratowski Theorem',
        location: 'MB 112 (Main Building / Dr. MGR Block)',
        instructor: 'Dr. Ramesh Babu',
        courseCode: 'MAT2002',
        cognitiveLoad: 'high',
        details: {
          estimatedMinutes: 50,
          subtasks: ['Derive E <= 3V - 6 planar edge bound', 'Solve non-planarity for K5 and K3,3']
        }
      },
      {
        id: 'item-4',
        time: '11:30',
        endTime: '12:20',
        tag: 'CLASS',
        title: 'ECE2001: Digital Logic Design (Slot D1)',
        subtitle: 'Carry Lookahead Adders & Synchronous State Machine Design',
        location: 'TT 418 (Technology Tower)',
        instructor: 'Prof. Anitha M',
        courseCode: 'ECE2001',
        cognitiveLoad: 'high',
        details: {
          estimatedMinutes: 50,
          subtasks: ['Carry generate and propagate boolean equations', 'State transition minimization table']
        }
      },
      {
        id: 'item-5',
        time: '12:30',
        endTime: '13:45',
        tag: 'BUFFER',
        title: 'Foodys Gazebo Lunch & Circadian Recharge',
        subtitle: 'Central Dining Area & Outdoor Lawn · Restorative cognitive buffer',
        location: 'Foodys Central / Anna Auditorium Lawn'
      },
      {
        id: 'item-6',
        time: '14:00',
        endTime: '15:40',
        tag: 'CLASS',
        title: 'ECE2001: Digital Electronics Laboratory (Slot L15+L16)',
        subtitle: 'Verilog HDL Structural Modeling of 4-Bit ALU on FPGA Board',
        courseCode: 'ECE2001',
        location: 'TT 401 (Digital Electronics Lab)',
        cognitiveLoad: 'high',
        details: {
          estimatedMinutes: 100,
          subtasks: ['Synthesize Verilog HDL module in ModelSim', 'Verify testbench vectors for overflow flags']
        }
      },
      {
        id: 'item-7',
        time: '16:00',
        endTime: '17:30',
        tag: 'FOCUS',
        title: 'Periyar Central Library: Deep Focus Study Window',
        subtitle: 'POSIX Semaphores Lab implementation & thread synchronization',
        location: 'Periyar Central Library (Floor 2 Quiet Study Room)',
        courseCode: 'CSE2005',
        taskId: 't-1',
        isCompleted: tasks.find((t) => t.id === 't-1')?.completed || false,
        cognitiveLoad: 'high',
        details: {
          estimatedMinutes: 90,
          subtasks: ['Implement sem_wait and sem_post loops', 'Verify Valgrind zero leaks on exit']
        }
      },
      {
        id: 'item-8',
        time: '17:45',
        endTime: '18:30',
        tag: 'OFFICE_HOURS',
        title: 'SJT 411 Faculty Cabin Consultation',
        subtitle: 'Dr. K. Senthil Kumar · Operating Systems DA-1 Doubt Clearing',
        location: 'SJT 411 Faculty Cabin',
        courseCode: 'CSE2005',
        cognitiveLoad: 'medium',
        details: {
          taQueueInfo: `${cse2005Course?.taQueue.studentsInLine || 3} students in line (~10m wait)`
        }
      },
      {
        id: 'item-9',
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
  }, [scheduleBlocks, courses]);

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
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER CONTEXT (Quiet greeting, tight vertical whitespace)
         ───────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 border-b border-[#E7E5DF] dark:border-[#2A2D36] pb-3">
        <div>
          <h1 className="text-[30px] sm:text-[32px] font-bold text-[#18181A] dark:text-[#F3F4F6] tracking-tight leading-[36px]">
            Good morning, {user.name.split(' ')[0]}
          </h1>
          <p className="text-[12px] text-[#686A70] dark:text-[#A0A3AB] mt-0.5 font-normal leading-[16px]">
            Thursday · Day 1 · {user.institution || 'VIT Vellore'} · {user.term || 'Winter Semester 2025-26'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={openVtopSyncModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[#FCFBF8] dark:bg-[#1C1E24] text-[#686A70] dark:text-[#A0A3AB] border border-[#E7E5DF] dark:border-[#2A2D36] hover:border-[#F59E0B] transition-colors cursor-pointer group shadow-2xs"
            title="Click to sync timetable, courses, and attendance directly from VTOP"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A368] focus-pulse-node" />
            <span className="group-hover:text-[#18181A] dark:group-hover:text-white">
              {vtopLastSyncedAt ? 'VTOP Synced' : 'Sync College Portal (VTOP)'}
            </span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. LEVEL 1: WHAT SHOULD I DO NOW? (Upcoming Event Card)
             - Surface #FFFFFF, subtle neutral border with subtle orange emphasis
             - Starts in 45 min quiet contextual info
             - Start Focus Session dominant, View Details secondary
         ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="next-up-heading">
        <div className="rounded-2xl border border-[#E7E5DF] dark:border-[#2A2D36] bg-[#FFFFFF] dark:bg-[#15161A] p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all hover:border-[#F59E0B]/40">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] via-[#F59E0B]/60 to-transparent" />

          {/* Contextual status row */}
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.06em] font-semibold text-[#D97706] dark:text-[#F59E0B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] focus-pulse-node" />
              UP NEXT · 10:30 AM — 11:20 AM
            </span>

            <span className="text-[12px] font-mono font-normal text-[#96979B] dark:text-[#A0A3AB]">
              Starts in 45 min
            </span>
          </div>

          {/* Core Content: What & Where */}
          <div className="space-y-1">
            <div className="text-[12px] font-mono font-medium text-[#686A70] dark:text-[#A0A3AB]">
              CSE2006 · Data Structures and Algorithms (Slot B1)
            </div>
            <h2
              id="next-up-heading"
              className="text-[17px] sm:text-[18px] font-semibold text-[#18181A] dark:text-[#F3F4F6] tracking-tight leading-[26px]"
            >
              Red-Black Tree Balancing & AVL Double Rotations
            </h2>
            <p className="text-[13px] text-[#686A70] dark:text-[#A0A3AB] flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#96979B]" />
              <span>TT 204 (Technology Tower)</span>
              <span>·</span>
              <span>Dr. Priya R</span>
            </p>
          </div>

          {/* Action Row: Strict Hierarchy (Primary -> Secondary) */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#E7E5DF] dark:border-[#2A2D36]">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (highLoadTask) {
                  startDeepWork(highLoadTask.id, highLoadTask.title, 'CSE2006', 50);
                } else {
                  startDeepWork('t-1', 'CSE2006 Study Block', 'CSE2006', 50);
                }
                setView('focus-timer');
              }}
              icon={<Flame className="w-4 h-4 text-white" />}
              className="font-semibold text-xs px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white border-transparent shadow-xs"
            >
              Start Focus Session
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsNextUpDetailsOpen(!isNextUpDetailsOpen)}
              icon={isNextUpDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              className="text-xs font-medium text-[#686A70] dark:text-[#A0A3AB] border-[#E7E5DF] dark:border-[#2A2D36] hover:bg-[#FCFBF8] dark:hover:bg-[#1C1E24]"
            >
              {isNextUpDetailsOpen ? 'Hide Details' : 'View Details'}
            </Button>
          </div>

          {/* Progressive Disclosure Panel */}
          {isNextUpDetailsOpen && (
            <div className="mt-4 pt-4 border-t border-[#E7E5DF] dark:border-[#2A2D36] text-xs space-y-2.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
                  <span className="font-mono text-[10px] uppercase font-semibold text-[#686A70] dark:text-[#A0A3AB] block">
                    Campus Transit Advisory
                  </span>
                  <p className="text-[#18181A] dark:text-[#F3F4F6] mt-0.5">
                    6 min walk via Periyar Central Library. TT 204 classroom opens at 09:20 AM.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
                  <span className="font-mono text-[10px] uppercase font-semibold text-[#686A70] dark:text-[#A0A3AB] block">
                    Faculty Cabin Consultation
                  </span>
                  <p className="text-[#18181A] dark:text-[#F3F4F6] mt-0.5">
                    {cse2005Course?.taQueue.studentsInLine || 3} students currently in queue at SJT 411 (~10 min estimated wait).
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#96979B] dark:text-[#A0A3AB]">
                <span>Slides, handout & starter code available on Canvas</span>
                <button
                  onClick={() => setView('course-cs106b')}
                  className="font-medium text-[#18181A] dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
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
          3. RECOMMENDED NEXT: Intelligent Recommendation Module
             - Tells student WHAT, WHY, and ESTIMATED DURATION
             - Subtle orange emphasis on indicator and primary action
         ───────────────────────────────────────────────────────────── */}
      <section className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#15161A] border border-[#E7E5DF] dark:border-[#2A2D36] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#FFF7E6] dark:bg-[#F59E0B]/10 flex items-center justify-center shrink-0 border border-[#F59E0B]/20">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase font-semibold text-[10px] text-[#D97706] dark:text-[#F59E0B] tracking-[0.06em]">
                RECOMMENDED NEXT
              </span>
              <span className="text-[#96979B] dark:text-[#A0A3AB] text-[11px]">·</span>
              <span className="text-[#96979B] dark:text-[#A0A3AB] text-[11px] font-mono">10 min estimated</span>
            </div>
            <p className="text-[13px] text-[#18181A] dark:text-[#F3F4F6] font-medium">
              Review CS 106B dynamic memory notes
            </p>
            <p className="text-[11px] text-[#686A70] dark:text-[#A0A3AB]">
              Why: Reinforces pointer destructor concepts 25 minutes before lecture starts.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            startDeepWork('t-1', 'Review Lecture Notes', 'CS 106B', 10);
            setView('focus-timer');
          }}
          className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#18181A] dark:bg-white text-white dark:text-[#18181A] font-semibold text-xs hover:bg-black dark:hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          Start 10m review →
        </button>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. TODAY'S HORIZON: CONTINUOUS CHRONOLOGICAL RAIL
             - Time → Event → Current Position
             - Distinctive Focus Pulse concentric rings
             - Horizontal day progress indicator
         ───────────────────────────────────────────────────────────── */}
      <section aria-label="Day Chronology">
        <div className="flex items-center justify-between text-xs text-[#96979B] dark:text-[#A0A3AB] mb-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-[0.06em] text-[10px]">CHRONOLOGY</span>
            <span className="text-[10px] text-[#96979B]">· Time → Event → Current Position</span>
          </div>
          <span className="text-[10px]">Current Time: 10:45 AM</span>
        </div>

        {/* Continuous Connected Horizontal Rail with day progress */}
        <div className="relative py-4 px-3 sm:px-5 bg-[#FFFFFF] dark:bg-[#15161A] rounded-xl border border-[#E7E5DF] dark:border-[#2A2D36] shadow-xs overflow-x-auto">
          {/* Subtle Day Progress Background Rail Line */}
          <div className="absolute top-[32px] left-6 right-6 h-0.5 bg-[#E7E5DF] dark:bg-[#2A2D36] -z-0" />
          {/* Active progress fill to 10:45 AM position */}
          <div className="absolute top-[32px] left-6 w-[28%] h-0.5 bg-[#F59E0B] -z-0 transition-all duration-500" />

          <div className="flex items-start justify-between min-w-[540px] relative z-10">
            {/* 08:30 Focus (Completed - Muted) */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#96979B] dark:text-[#A0A3AB]">08:30</span>
              <div className="w-3.5 h-3.5 rounded-full bg-[#18181A] dark:bg-white border-2 border-white dark:border-[#15161A] shadow-xs my-1 flex items-center justify-center">
                <Check className="w-2 h-2 text-white dark:text-[#18181A]" />
              </div>
              <span className="text-xs font-normal text-[#96979B] dark:text-[#A0A3AB]">Peak Focus</span>
            </div>

            {/* 10:30 CS 106B (NOW) - Distinctive Focus Pulse Concentric Language */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono font-bold text-[#D97706] dark:text-[#F59E0B]">10:30</span>
              <div className="relative my-1 flex items-center justify-center">
                {/* Outer concentric pulse ring */}
                <div className="absolute w-6 h-6 rounded-full bg-[#F59E0B]/20 animate-ping opacity-60" />
                {/* Core focus node */}
                <div className="w-4 h-4 rounded-full bg-[#F59E0B] border-2 border-white dark:border-[#15161A] shadow-xs focus-pulse-node relative z-10" />
              </div>
              <span className="text-xs font-semibold text-[#18181A] dark:text-white">CS 106B</span>
              <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B] bg-[#FFF7E6] dark:bg-[#F59E0B]/20 px-1.5 py-0.2 rounded mt-0.5 border border-[#F59E0B]/30">
                ● NOW
              </span>
            </div>

            {/* 11:45 MATH 51 (Upcoming - Neutral) */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#96979B] dark:text-[#A0A3AB]">11:45</span>
              <div className="w-3 h-3 rounded-full bg-[#E7E5DF] dark:bg-[#383B4B] border-2 border-white dark:border-[#15161A] my-1.5" />
              <span className="text-xs font-normal text-[#18181A] dark:text-[#F3F4F6]">MATH 51</span>
            </div>

            {/* 14:00 P-Set 4 (Upcoming - Neutral) */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#96979B] dark:text-[#A0A3AB]">14:00</span>
              <div className="w-3 h-3 rounded-full bg-[#E7E5DF] dark:bg-[#383B4B] border-2 border-white dark:border-[#15161A] my-1.5" />
              <span className="text-xs font-normal text-[#18181A] dark:text-[#F3F4F6]">P-Set 4</span>
            </div>

            {/* 16:00 TA Queue (Upcoming - Neutral) */}
            <div className="flex flex-col items-center text-center w-24">
              <span className="text-[11px] font-mono text-[#96979B] dark:text-[#A0A3AB]">16:00</span>
              <div className="w-3 h-3 rounded-full bg-[#E7E5DF] dark:bg-[#383B4B] border-2 border-white dark:border-[#15161A] my-1.5" />
              <span className="text-xs font-normal text-[#18181A] dark:text-[#F3F4F6]">TA Queue</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LEVEL 2: UNIFIED CHRONOLOGICAL SCHEDULE
          (Clean dividers, no excessive nested card boxes)
         ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="schedule-heading" className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E5DF] dark:border-[#2A2D36] pb-2">
          <div>
            <h2 id="schedule-heading" className="text-[18px] font-bold text-[#18181A] dark:text-[#F3F4F6] leading-[24px]">
              Today's Schedule
            </h2>
            <p className="text-[12px] text-[#686A70] dark:text-[#A0A3AB] leading-[16px]">
              Unified chronological timeline of classes, problem sets, transit buffers and office hours
            </p>
          </div>

          <span className="text-[12px] font-mono text-[#96979B] dark:text-[#A0A3AB]">
            {timeline.length} events
          </span>
        </div>

        {/* Clean Academic Timeline with subtle dividers and state tints */}
        <div className="divide-y divide-[#E7E5DF] dark:divide-[#2A2D36]">
          {timeline.map((entry) => {
            const isExpanded = expandedTimelineId === entry.id;

            return (
              <div
                key={entry.id}
                className={`py-3.5 sm:py-4 transition-colors ${
                  entry.isCurrent
                    ? 'bg-[#FFFBF2] dark:bg-[#F59E0B]/5 -mx-3 px-3 rounded-xl border border-[#F59E0B]/25'
                    : entry.isCompleted
                    ? 'opacity-80'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Time & Tag */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-14 sm:w-16 shrink-0 pt-0.5">
                      <div
                        className={`font-mono text-xs ${
                          entry.isCurrent
                            ? 'font-bold text-[#D97706] dark:text-[#F59E0B]'
                            : entry.isCompleted
                            ? 'font-normal text-[#96979B] dark:text-[#6B7280]'
                            : 'font-semibold text-[#18181A] dark:text-[#F3F4F6]'
                        }`}
                      >
                        {entry.time}
                      </div>
                      {entry.endTime && (
                        <div className="font-mono text-[11px] text-[#96979B] dark:text-[#6B7280]">
                          {entry.endTime}
                        </div>
                      )}
                    </div>

                    {/* Middle: Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {/* Disciplined Semantic Tag Chip */}
                        <span
                          className={`text-[10px] font-mono font-medium uppercase tracking-[0.05em] px-2 py-0.5 rounded ${
                            entry.tag === 'FOCUS'
                              ? 'bg-[#FFF7E6] dark:bg-[#F59E0B]/15 text-[#D97706] dark:text-[#F59E0B] border border-[#F59E0B]/30'
                              : entry.tag === 'CLASS'
                              ? 'bg-[#FCFBF8] dark:bg-[#1C1E24] text-[#18181A] dark:text-[#F3F4F6] border border-[#E7E5DF] dark:border-[#2A2D36]'
                              : 'bg-[#FCFBF8] dark:bg-[#1C1E24] text-[#686A70] dark:text-[#A0A3AB] border border-[#E7E5DF] dark:border-[#2A2D36]'
                          }`}
                        >
                          {entry.tag}
                        </span>

                        {entry.courseCode && (
                          <span className="text-[11px] font-mono font-medium text-[#686A70] dark:text-[#A0A3AB]">
                            {entry.courseCode}
                          </span>
                        )}

                        {entry.isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B] bg-[#FFF7E6] dark:bg-[#F59E0B]/20 px-1.5 py-0.2 rounded border border-[#F59E0B]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] focus-pulse-node" />
                            NOW
                          </span>
                        )}

                        {entry.isCompleted && (
                          <span className="text-[11px] text-[#16A368] dark:text-[#10B981] font-semibold flex items-center gap-0.5">
                            ✓ Done
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-semibold text-[#18181A] dark:text-[#F3F4F6] leading-snug ${
                          entry.isCompleted ? 'line-through text-[#96979B] dark:text-[#6B7280]' : ''
                        }`}
                      >
                        {entry.title}
                      </h3>

                      {entry.subtitle && (
                        <p className="text-xs text-[#686A70] dark:text-[#A0A3AB] mt-0.5">
                          {entry.subtitle}
                        </p>
                      )}

                      {entry.location && (
                        <p className="text-[12px] text-[#96979B] dark:text-[#A0A3AB] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#96979B]" />
                          <span>{entry.location}</span>
                        </p>
                      )}

                      {/* Progressive Disclosure: Details */}
                      {isExpanded && entry.details && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36] text-xs space-y-2 animate-in fade-in duration-150">
                          {entry.details.estimatedMinutes && (
                            <div className="text-[11px] font-mono text-[#686A70] dark:text-[#A0A3AB]">
                              Estimated duration: <strong className="text-[#18181A] dark:text-white font-semibold">{entry.details.estimatedMinutes} minutes</strong>
                            </div>
                          )}

                          {entry.details.subtasks && entry.details.subtasks.length > 0 && (
                            <div>
                              <span className="font-mono text-[10px] uppercase font-semibold text-[#686A70] dark:text-[#A0A3AB] block mb-1">
                                Action Items:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-xs text-[#686A70] dark:text-[#A0A3AB]">
                                {entry.details.subtasks.map((st, i) => (
                                  <li key={i}>{st}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {entry.details.autograder && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-[#16A368] dark:text-[#10B981] px-2 py-0.5 rounded border border-[#16A368]/30 font-medium">
                                {entry.details.autograder.passing}/{entry.details.autograder.total} Tests Passing
                              </span>
                              {entry.details.autograder.leaks > 0 && (
                                <button
                                  onClick={() => openAutograder(entry.taskId!)}
                                  className="text-[11px] font-mono bg-rose-50 dark:bg-rose-950/40 text-[#DC5A63] dark:text-rose-400 px-2 py-0.5 rounded border border-[#DC5A63]/30 hover:underline cursor-pointer flex items-center gap-1 font-medium"
                                >
                                  <Terminal className="w-3 h-3" />
                                  <span>Inspect 1 Valgrind Leak →</span>
                                </button>
                              )}
                            </div>
                          )}

                          {entry.details.taQueueInfo && (
                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-[11px] text-[#686A70] dark:text-[#A0A3AB]">
                                {entry.details.taQueueInfo}
                              </span>
                              <button
                                onClick={() => joinTaQueue('cse2005')}
                                className="font-semibold text-xs text-[#18181A] dark:text-white hover:underline cursor-pointer"
                              >
                                Join Faculty Cabin Queue →
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
                        className="w-4 h-4 rounded border-[#E7E5DF] dark:border-[#2A2D36] text-[#18181A] dark:text-white focus:ring-0 cursor-pointer accent-[#18181A] dark:accent-white"
                        title="Mark task completed"
                      />
                    )}

                    {entry.tag === 'TASK' && !entry.isCompleted && (
                      <button
                        onClick={() => {
                          startDeepWork(entry.taskId!, entry.title, entry.courseCode);
                          setView('focus-timer');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        Focus
                      </button>
                    )}

                    {entry.details && (
                      <button
                        onClick={() =>
                          setExpandedTimelineId(isExpanded ? null : entry.id)
                        }
                        className="p-1 rounded-lg text-[#96979B] dark:text-[#A0A3AB] hover:text-[#18181A] dark:hover:text-white hover:bg-[#FCFBF8] dark:hover:bg-[#1C1E24] transition-colors cursor-pointer"
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
             - Clear anchor numbers + clean explanatory text underneath
             - No rainbow metrics, neutral + semantic green only
         ───────────────────────────────────────────────────────────── */}
      <section aria-label="Weekly Academic Performance" className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#96979B] dark:text-[#A0A3AB] font-mono">
          <span className="font-semibold uppercase tracking-[0.06em] text-[10px]">THIS WEEK</span>
          <span>PACE: +1.2H AHEAD</span>
        </div>

        {/* Compact Single Horizontal Module */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#15161A] border border-[#E7E5DF] dark:border-[#2A2D36] shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E5DF] dark:divide-[#2A2D36]">
          {/* Focus Hours */}
          <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
            <span className="text-[11px] font-mono uppercase font-semibold text-[#686A70] dark:text-[#A0A3AB] block">
              Study Focus
            </span>
            <div className="text-[22px] font-bold font-mono text-[#18181A] dark:text-[#F3F4F6] mt-0.5">
              18.5h
            </div>
            <p className="text-[12px] text-[#686A70] dark:text-[#A0A3AB] font-normal mt-0.5">
              Focused this week
            </p>
          </div>

          {/* Attendance Health */}
          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-mono uppercase font-semibold text-[#686A70] dark:text-[#A0A3AB] block">
              Attendance
            </span>
            <div className="text-[22px] font-bold font-mono text-[#18181A] dark:text-[#F3F4F6] mt-0.5">
              94.1%
            </div>
            <p className="text-[12px] text-[#16A368] dark:text-[#10B981] font-medium mt-0.5">
              Safe · 1 cushion remaining
            </p>
          </div>

          {/* Term GPA */}
          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-mono uppercase font-semibold text-[#686A70] dark:text-[#A0A3AB] block">
              Academic GPA
            </span>
            <div className="text-[22px] font-bold font-mono text-[#18181A] dark:text-[#F3F4F6] mt-0.5">
              3.88
            </div>
            <p className="text-[12px] text-[#686A70] dark:text-[#A0A3AB] font-normal mt-0.5">
              Dean's List · Honors
            </p>
          </div>

          {/* Focus Readiness with Informational Tooltip */}
          <div className="pt-2 sm:pt-0 sm:px-3 last:pr-0 relative">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono uppercase font-semibold text-[#686A70] dark:text-[#A0A3AB] block">
                Focus Readiness
              </span>
              <button
                type="button"
                onClick={() => setShowReadinessTooltip(!showReadinessTooltip)}
                className="text-[#96979B] hover:text-[#18181A] dark:hover:text-white cursor-pointer"
                title="What does this mean?"
              >
                <Info className="w-3 h-3" />
              </button>
            </div>

            <div className="text-[22px] font-bold font-mono text-[#16A368] dark:text-[#10B981] mt-0.5">
              High ↑
            </div>
            <p className="text-[12px] text-[#686A70] dark:text-[#A0A3AB] mt-0.5">
              Peak deep work window
            </p>

            {/* Explanatory Tooltip Popover */}
            {showReadinessTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-[#FFFFFF] dark:bg-[#1C1E24] rounded-xl border border-[#E7E5DF] dark:border-[#2A2D36] shadow-calm-lg text-xs z-30 animate-in fade-in duration-150">
                <p className="text-[#18181A] dark:text-[#F3F4F6] font-semibold mb-1">
                  Borbély Alertness Model
                </p>
                <p className="text-[#686A70] dark:text-[#A0A3AB] leading-relaxed text-[11px]">
                  Based on chronotype, sleep schedule, and cognitive load. Peak mental acuity is sustained between 1:30 and 5:30 PM today.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. LEVEL 4: OPTIONAL OPTIMIZATIONS (Study Window)
         ───────────────────────────────────────────────────────────── */}
      <section aria-label="Study Window Recommendation">
        <div className="p-5 rounded-xl bg-[#FCFBF8] dark:bg-[#15161A] border border-[#E7E5DF] dark:border-[#2A2D36] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-semibold text-[#D97706] dark:text-[#F59E0B] tracking-[0.06em] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              OPTIMAL STUDY WINDOW TODAY
            </span>

            <div className="text-[18px] font-bold text-[#18181A] dark:text-[#F3F4F6] leading-[24px]">
              1:30 PM — 5:30 PM
            </div>

            <p className="text-xs text-[#686A70] dark:text-[#A0A3AB]">
              <strong className="text-[#18181A] dark:text-white font-semibold">Recommended:</strong> P-Set 4 · Priority Queue Debugging.
              <span className="block text-[11px] text-[#96979B] dark:text-[#A0A3AB] mt-0.5">
                Why: Peak alertness window with no lecture overlap.
              </span>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={handlePlanRecommendedSession}
              icon={<CalendarDays className="w-4 h-4 text-white" />}
              className="text-xs font-bold px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white border-transparent"
            >
              Plan this session
            </Button>
          </div>
        </div>

        {plannedNotice && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-[#16A368]/30 text-xs font-medium text-[#16A368] dark:text-[#10B981] flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>P-Set 4 deep focus session has been scheduled from 1:30 PM to 3:30 PM in your timetable!</span>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. AMBIENT SOUNDSCAPE UTILITY (Quiet, Minimalist Dock)
         ───────────────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#E7E5DF] dark:border-[#2A2D36] bg-[#FCFBF8] dark:bg-[#15161A] text-xs">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-[#96979B] dark:text-[#A0A3AB]" />
          <span className="font-semibold text-[#18181A] dark:text-[#F3F4F6]">
            Focus Audio Ambience
          </span>
          <span className="text-[#96979B] dark:text-[#A0A3AB]">• Procedural sound generator</span>
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
                    ? 'bg-[#18181A] dark:bg-white text-white dark:text-[#18181A] font-semibold'
                    : 'bg-[#FFFFFF] dark:bg-[#1C1E24] text-[#686A70] dark:text-[#A0A3AB] hover:text-[#18181A] dark:hover:text-white border border-[#E7E5DF] dark:border-[#2A2D36]'
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
