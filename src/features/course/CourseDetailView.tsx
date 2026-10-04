import React, { useState } from 'react';
import {
  ExternalLink,
  Download,
  Code,
  Flame,
  CheckCircle2,
  AlertCircle,
  FileText,
  GraduationCap,
  Calendar,
  BookOpen,
  Terminal,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, CognitiveLoadBadge } from '../../components/common/Badge';

export const CourseDetailView: React.FC = () => {
  const {
    courses,
    tasks,
    notes,
    examTopics,
    joinTaQueue,
    setView,
    startDeepWork,
    openAutograder
  } = useFocusStore();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'cse2005');
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'notes' | 'exams' | 'progress'>('overview');
  const [queueJoined, setQueueJoined] = useState(false);

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseTasks = tasks.filter((t) => t.courseId === course.id);
  const courseNotes = notes.filter((n) => n.courseId === course.id);
  const courseTopics = examTopics.filter((et) => et.courseId === course.id);

  const handleJoinQueue = () => {
    joinTaQueue(course.id);
    setQueueJoined(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Course Selector Bar */}
      <div className="flex items-center justify-between border-b border-[#e8e5df] dark:border-[#22242f] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCourseId === c.id
                  ? 'bg-[#1c1d21] text-white dark:bg-white dark:text-[#121316] shadow-xs'
                  : 'bg-[#f4f1eb] dark:bg-[#181922] text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white'
              }`}
            >
              <span>{c.code}</span>
              {selectedCourseId === c.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-[#9da0a6] dark:text-[#676b76] hidden sm:inline">
          COURSE WORKSPACE
        </span>
      </div>

      {/* Course Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase bg-[#f4f1eb] dark:bg-[#1e202a] text-[#1c1d21] dark:text-[#f0eff4] px-2.5 py-0.5 rounded border border-[#e8e5df] dark:border-[#2b2e3c]">
                {course.code} • {course.units} Units • Fall Quarter
              </span>
              <span className="text-xs text-[#64676e] dark:text-[#9ba0a9]">
                {course.instructor}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] mt-1.5 tracking-tight">
              {course.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#64676e] dark:text-[#9ba0a9] mt-1 max-w-2xl leading-relaxed">
              Complete course workspace with assignments, autograder status, lecture notes, syllabus roadmap, and office hours queue.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://edstem.org', '_blank')}
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              className="text-xs font-medium"
            >
              EdStem Forum
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const topTask = courseTasks[0];
                startDeepWork(topTask?.id, topTask?.title || `${course.code} Study Session`, course.code);
                setView('focus-timer');
              }}
              icon={<Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
              className="text-xs font-semibold"
            >
              Start {course.code} Focus
            </Button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex items-center gap-2 border-t border-[#f4f1eb] dark:border-[#1e2029] mt-6 pt-3 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'assignments', label: `Assignments (${courseTasks.length})` },
            { id: 'notes', label: `Notes (${courseNotes.length})` },
            { id: 'exams', label: `Exams & Topics (${courseTopics.length})` },
            { id: 'progress', label: 'Progress & Grading' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1c1d21] text-white dark:bg-white dark:text-[#121316] font-bold shadow-2xs'
                  : 'text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#f4f1eb] dark:hover:bg-[#1b1c24]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview Workspace */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top 2 Cards: COURSE PROGRESS & UPCOMING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Card: COURSE PROGRESS */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                  COURSE PROGRESS
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  Dean's List Pace
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
                    82%
                  </div>
                  <span className="text-xs font-mono text-[#787b84] dark:text-[#8d929e]">
                    6 / 8 milestones completed
                  </span>
                </div>

                <div className="h-2.5 bg-[#f4f1eb] dark:bg-[#1e202a] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
                </div>
              </div>

              <div className="pt-2 border-t border-[#f4f1eb] dark:border-[#1e2029] text-xs text-[#64676e] dark:text-[#9ba0a9] flex items-center justify-between">
                <span>Attendance: {course.attendance.attended}/{course.attendance.total} classes</span>
                <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">Current Standing: A (95.2%)</span>
              </div>
            </div>

            {/* Right Card: UPCOMING */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                  UPCOMING DEADLINES & EXAMS
                </span>
                <span className="text-xs text-[#787b84] dark:text-[#8d929e]">Week 5</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fffdf9] dark:bg-[#18171e] border border-amber-200 dark:border-amber-900/40 text-xs">
                  <div>
                    <h4 className="font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                      Assignment 4: PriorityQueue.cpp
                    </h4>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-mono">
                      Due Tomorrow at 11:59 PM
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60">
                    1 Leak
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfbf9] dark:bg-[#161720] border border-[#e8e5df] dark:border-[#22242f] text-xs">
                  <div>
                    <h4 className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
                      Continuous Assessment 1 (SJT 411)
                    </h4>
                    <span className="text-[11px] text-[#787b84] dark:text-[#8d929e] font-mono">
                      Oct 18, 7:00 PM • 90 min
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64676e] dark:text-[#9ba0a9]">In 14 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: CURRENT TOPIC & RESOURCES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* CURRENT TOPIC (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                  CURRENT TOPIC (WEEK 5)
                </span>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold">
                  Active Unit
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
                  Recursion, Pointers & Binary Heap Optimization
                </h3>
                <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-1 leading-relaxed">
                  Focusing on pointer manipulation, dynamic memory allocation with new[]/delete[], binary min-heap array representations, and O(log n) enqueue/dequeue algorithms.
                </p>
              </div>

              {/* Autograder Test Suite Status Banner */}
              <div className="p-3.5 rounded-xl bg-[#fff1f2] dark:bg-[#201317] border border-[#fecdd3] dark:border-[#881337]/50 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#be123c] dark:text-rose-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Autograder Inspection Required</span>
                  </div>
                  <p className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                    18/20 tests passing. Valgrind leak identified in resize() dynamic array allocation.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAutograder('t-1')}
                  className="text-xs font-mono shrink-0"
                >
                  Open Autograder
                </Button>
              </div>
            </div>

            {/* RESOURCES (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                COURSE RESOURCES
              </span>

              <div className="space-y-2 text-xs">
                {[
                  { title: 'Lecture 14: Dynamic Arrays & Heaps', type: 'Slides & Audio' },
                  { title: 'Problem Set 4 Handout & Starter Repo', type: 'GitHub' },
                  { title: 'Practice Quiz 3: BST Invariants', type: 'Canvas Quiz' },
                  { title: 'Section Handout 4: Recursion Solutions', type: 'PDF' }
                ].map((res, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl border border-[#e8e5df] dark:border-[#22242f] bg-[#fcfbf9] dark:bg-[#171822] flex items-center justify-between hover:border-[#1c1d21] dark:hover:border-white transition-all cursor-pointer group"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="font-semibold text-[#1c1d21] dark:text-[#f0eff4] truncate">
                        {res.title}
                      </h4>
                      <span className="text-[10px] text-[#787b84] dark:text-[#8d929e] font-mono">
                        {res.type}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9da0a6] group-hover:text-[#1c1d21] dark:group-hover:text-white shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: TA OFFICE HOURS QUEUE */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1d21] dark:text-[#f0eff4]">
                  TA OFFICE HOURS QUEUE • DURAND 353
                </h4>
              </div>
              <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                Current wait: <strong className="text-[#1c1d21] dark:text-[#f0eff4] font-mono">{course.taQueue.studentsInLine} students ahead</strong> (~{course.taQueue.waitMinutes} minutes). In-person TA queue active.
              </p>
            </div>

            <Button
              variant={queueJoined ? 'outline' : 'primary'}
              size="sm"
              onClick={handleJoinQueue}
              className="text-xs font-semibold shrink-0"
            >
              {queueJoined ? 'You are in line (#5)' : 'Join Queue →'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-3 animate-in fade-in">
          {courseTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-[#e8e5df] dark:border-[#22242f] bg-white dark:bg-[#14151c] flex items-center justify-between gap-4 shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">{t.title}</span>
                  <span className="text-xs text-[#787b84] dark:text-[#8d929e]">• {t.dueDate}</span>
                </div>
                <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">{t.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {t.autograder && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAutograder(t.id)}
                    className="text-xs font-mono"
                  >
                    Autograder ({t.autograder.testsPassing}/{t.autograder.testsTotal})
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    startDeepWork(t.id, t.title, course.code);
                    setView('focus-timer');
                  }}
                  className="text-xs font-semibold"
                >
                  Start Focus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-3 animate-in fade-in">
          {courseNotes.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl border border-[#e8e5df] dark:border-[#22242f] bg-white dark:bg-[#14151c] shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">{n.title}</h4>
                <span className="text-[11px] text-[#787b84] dark:text-[#8d929e]">{n.timestamp}</span>
              </div>
              <p className="text-xs text-[#64676e] dark:text-[#9ba0a9]">{n.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Exams & Topics */}
      {activeTab === 'exams' && (
        <div className="space-y-3 animate-in fade-in">
          {courseTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-xl border border-[#e8e5df] dark:border-[#22242f] bg-white dark:bg-[#14151c] flex items-center justify-between gap-4 shadow-2xs"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">{topic.topic}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-32 h-1.5 bg-[#f4f1eb] dark:bg-[#1e202a] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${topic.confidencePercent}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">
                    {topic.confidencePercent}% Mastery
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('exam-prep')}
                className="text-xs shrink-0"
              >
                Review Topic
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Progress & Grading */}
      {activeTab === 'progress' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1d21] dark:text-[#f0eff4]">
              Syllabus Grading Weights
            </h3>
            <div className="space-y-2">
              {course.gradingWeights.map((w, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#f4f1eb] dark:border-[#1e2029]">
                  <span className="text-[#64676e] dark:text-[#9ba0a9]">{w.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#787b84]">{w.weightPercent}% weight</span>
                    <span className="font-mono font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                      {w.score ? `${w.score}%` : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
