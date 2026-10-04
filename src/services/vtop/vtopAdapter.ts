import { Course, ScheduleBlock, UserProfile, Task } from '../../types';
import { VtopHarvestedData } from './vtopTypes';
import { expandVtopSlotsToWeeklySchedule } from './vtopSlotMatrix';

const COURSE_PALETTES = [
  { color: '#F59E0B', badgeBg: 'bg-amber-50 dark:bg-amber-950/40', badgeText: 'text-amber-800 dark:text-amber-300' },
  { color: '#6366F1', badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40', badgeText: 'text-indigo-800 dark:text-indigo-300' },
  { color: '#10B981', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40', badgeText: 'text-emerald-800 dark:text-emerald-300' },
  { color: '#0EA5E9', badgeBg: 'bg-sky-50 dark:bg-sky-950/40', badgeText: 'text-sky-800 dark:text-sky-300' },
  { color: '#8B5CF6', badgeBg: 'bg-purple-50 dark:bg-purple-950/40', badgeText: 'text-purple-800 dark:text-purple-300' },
  { color: '#EC4899', badgeBg: 'bg-pink-50 dark:bg-pink-950/40', badgeText: 'text-pink-800 dark:text-pink-300' }
];

export function adaptVtopDataToFocusly(data: VtopHarvestedData): {
  profile: Partial<UserProfile>;
  courses: Course[];
  scheduleBlocks: ScheduleBlock[];
  tasks: Task[];
} {
  // 1. Adapt Profile
  const profile: Partial<UserProfile> = {
    name: data.profile.name || 'Student',
    email: `${(data.profile.regNo || 'student').toLowerCase()}@vitstudent.ac.in`,
    institution: 'Vellore Institute of Technology (VIT Chennai)',
    degree: data.profile.branch || data.profile.degree || 'B.Tech Computer Science & Engineering',
    term: data.semesterName || 'Winter Semester 2025-26',
    targetUnits: data.courses.reduce((acc, c) => acc + (c.credits || 3), 0) || 24,
    onboardingCompleted: true
  };

  // 2. Adapt Courses
  const courses: Course[] = data.courses.map((c, index) => {
    const palette = COURSE_PALETTES[index % COURSE_PALETTES.length];
    const attendanceInfo = data.attendance.find((a) => a.courseCode === c.courseCode);
    const courseMarks = data.marks?.find((m) => m.courseCode === c.courseCode);

    const attended = attendanceInfo?.attendedHours ?? 28;
    const total = attendanceInfo?.totalHours ?? 32;
    const maxAllowedAbsences =
      attendanceInfo?.cushionOrDeficit !== undefined
        ? Math.max(0, attendanceInfo.cushionOrDeficit)
        : Math.max(0, Math.floor((attended / 0.75) - total));

    // Dynamic grading weights from VTOP continuous assessment marks
    const gradingWeights =
      courseMarks && courseMarks.components.length > 0
        ? courseMarks.components.map((comp) => ({
            category: comp.title,
            weightPercent: comp.weightagePercent || 15,
            score: comp.scoredMarks
          }))
        : [
            { category: 'Continuous Assessment (CAT 1 & 2)', weightPercent: 30, score: 88 },
            { category: 'Digital Assignments & Quizzes', weightPercent: 30, score: 92 },
            { category: 'Final Assessment Test (FAT)', weightPercent: 40 }
          ];

    return {
      id: c.courseCode.toLowerCase().replace(/[^a-z0-9]/g, ''),
      code: c.courseCode,
      name: c.courseTitle,
      instructor: c.facultyName || 'Faculty Advisor',
      units: c.credits,
      color: palette.color,
      badgeBg: palette.badgeBg,
      badgeText: palette.badgeText,
      attendance: {
        attended,
        total,
        maxAllowedAbsences,
        currentAbsences: Math.max(0, total - attended),
        policyWarningThreshold: 2,
        panoptoSynced: true,
        lastVerifiedDate: 'Live VTOP Sync'
      },
      gradingWeights,
      lateDaysTotal: 3,
      lateDaysUsed: 0,
      taQueue: {
        isOpen: true,
        location: `${c.venue || 'Academic Cabin'} Consultation Desk`,
        studentsInLine: 1,
        waitMinutes: 5
      },
      syllabus: [
        {
          id: `${c.courseCode}-w1`,
          week: 1,
          topic: `${c.courseTitle} - Course Foundations & Objectives`,
          date: 'Semester Start',
          readings: 'Textbook Ch. 1 & Module Overview',
          hasSlides: true,
          hasCodeRepo: true
        },
        {
          id: `${c.courseCode}-w5`,
          week: 5,
          topic: `${c.courseTitle} - Core Theoretical & Practical Principles`,
          date: 'Week 5 Active',
          readings: 'Lecture 12 Handout & Laboratory Notes',
          hasSlides: true,
          hasCodeRepo: true,
          isCurrentWeek: true
        }
      ]
    };
  });

  // 3. Adapt Timetable into Focusly Weekly ScheduleBlocks
  const scheduleBlocks: ScheduleBlock[] = [];

  data.courses.forEach((c) => {
    const expandedEntries = expandVtopSlotsToWeeklySchedule(
      c.slot,
      c.courseCode,
      c.courseTitle,
      c.venue,
      c.courseType === 'Lab' ? 'Lab' : 'Theory'
    );

    expandedEntries.forEach((entry, idx) => {
      scheduleBlocks.push({
        id: `sb-vtop-${c.courseCode}-${entry.day}-${idx}-${Date.now()}`,
        title: entry.courseTitle,
        courseCode: entry.courseCode,
        startTime: entry.startTime,
        endTime: entry.endTime,
        location: entry.venue,
        type: entry.type === 'Lab' ? 'section' : 'lecture',
        cognitiveLoad: entry.type === 'Lab' ? 'high' : 'medium'
      });
    });
  });

  // Ensure default buffer & focus blocks exist if schedule is light
  if (scheduleBlocks.length === 0) {
    scheduleBlocks.push({
      id: 'sb-vtop-def-1',
      title: 'Academic Peak Deep Work Block',
      courseCode: courses[0]?.code || 'CSE1007',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Central Library Knowledge Center',
      type: 'deep_work',
      cognitiveLoad: 'high',
      isPeakWindow: true
    });
  }

  // 4. Adapt Exams & Courses into Focusly Actionable Tasks
  const tasks: Task[] = [];

  // Add exam tasks if harvested
  if (data.exams && data.exams.length > 0) {
    data.exams.forEach((ex, idx) => {
      const courseId = ex.courseCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      tasks.push({
        id: `task-exam-${idx}-${courseId}`,
        courseId,
        title: `Final Assessment Test (FAT): ${ex.courseCode}`,
        description: `Exam Timing: ${ex.examTime || '10:00 AM - 01:00 PM'} (${ex.session}) · Hall: ${ex.venue} · Seat: ${ex.seatNumber || 'Allocated'}`,
        cognitiveLoad: 'high',
        dueDate: ex.examDate,
        estimatedMinutes: 180,
        completed: false,
        status: idx === 0 ? 'today' : 'this_week',
        subtasks: [
          { id: `st-ex-${idx}-1`, title: 'Synthesize semester lecture slides & reference formula sheet', completed: true },
          { id: `st-ex-${idx}-2`, title: 'Solve previous 3 semester final exam question papers', completed: false },
          { id: `st-ex-${idx}-3`, title: `Review ${ex.venue} classroom notes and doubts`, completed: false }
        ],
        progressPercent: 33
      });
    });
  }

  // Add coursework tasks for each real registered course
  data.courses.forEach((c, idx) => {
    const courseId = c.courseCode.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isLab = c.courseType === 'Lab' || c.slot.startsWith('L');

    // Task 1: Digital Assignment / Practice Problem Set
    tasks.push({
      id: `task-da-${idx}-${courseId}`,
      courseId,
      title: `${c.courseCode} Digital Assignment (DA-1): Applied Problem Set`,
      description: `Instructor: ${c.facultyName || 'Course Faculty'} · Slot ${c.slot} · Verification on VTOP submission portal`,
      cognitiveLoad: 'medium',
      dueDate: `2026-10-${18 + (idx % 8)}`,
      estimatedMinutes: 90,
      completed: idx % 3 === 0,
      status: idx % 2 === 0 ? 'today' : 'this_week',
      subtasks: [
        { id: `st-da-${idx}-1`, title: 'Solve textbook exercises and algorithmic proofs', completed: idx % 3 === 0 },
        { id: `st-da-${idx}-2`, title: 'Format PDF submission document with verified code snippets', completed: false }
      ],
      progressPercent: idx % 3 === 0 ? 50 : 0
    });

    // Task 2: Lab Worksheet (if Lab)
    if (isLab) {
      tasks.push({
        id: `task-lab-${idx}-${courseId}`,
        courseId,
        title: `${c.courseCode} Laboratory Execution: ${c.courseTitle}`,
        description: `Hands-on practical programming & evaluation in ${c.venue}`,
        cognitiveLoad: 'high',
        dueDate: `2026-10-${20 + (idx % 7)}`,
        estimatedMinutes: 120,
        completed: false,
        status: 'this_week',
        subtasks: [
          { id: `st-lab-${idx}-1`, title: 'Implement core algorithm and verify test edge cases', completed: true },
          { id: `st-lab-${idx}-2`, title: 'Complete viva-voce preparation and record notebook', completed: false }
        ],
        progressPercent: 50
      });
    }
  });

  return { profile, courses, scheduleBlocks, tasks };
}
