import { Course, ScheduleBlock, UserProfile } from '../../types';
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
} {
  // 1. Adapt Profile
  const profile: Partial<UserProfile> = {
    name: data.profile.name || 'VIT Scholar',
    institution: 'Vellore Institute of Technology (VIT)',
    degree: data.profile.branch || data.profile.degree || 'B.Tech Computer Science & Engineering',
    term: 'Fall Semester 2024-25',
    targetUnits: data.courses.reduce((acc, c) => acc + (c.credits || 3), 0) || 24,
    onboardingCompleted: true
  };

  // 2. Adapt Courses
  const courses: Course[] = data.courses.map((c, index) => {
    const palette = COURSE_PALETTES[index % COURSE_PALETTES.length];
    const attendanceInfo = data.attendance.find((a) => a.courseCode === c.courseCode);

    const attended = attendanceInfo?.attendedHours || 32;
    const total = attendanceInfo?.totalHours || 36;
    const maxAllowedAbsences = Math.max(1, Math.floor(attended / 0.75 - total));

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
      gradingWeights: [
        { category: 'Continuous Assessment (CAT 1 & 2)', weightPercent: 30, score: 92 },
        { category: 'Digital Assignments & Quizzes', weightPercent: 30, score: 96 },
        { category: 'Final Assessment Test (FAT)', weightPercent: 40 }
      ],
      lateDaysTotal: 3,
      lateDaysUsed: 0,
      taQueue: {
        isOpen: true,
        location: `${c.venue || 'Academic Block'} Help Desk`,
        studentsInLine: 2,
        waitMinutes: 8
      },
      syllabus: [
        {
          id: `${c.courseCode}-w1`,
          week: 1,
          topic: 'Course Overview, Syllabus & Axiomatic Foundations',
          date: 'Aug 10',
          readings: 'Textbook Ch. 1',
          hasSlides: true,
          hasCodeRepo: true
        },
        {
          id: `${c.courseCode}-w5`,
          week: 5,
          topic: `${c.courseTitle} Core Implementations & Problem Sets`,
          date: 'Oct 24',
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

  return { profile, courses, scheduleBlocks };
}
