export type Chronotype = 'lark' | 'afternoon' | 'owl';

export type CognitiveLoadLevel = 'high' | 'medium' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  institution: string;
  term: string;
  degree: string;
  targetUnits: number;
  chronotype: Chronotype;
  circadianPeak: {
    start: string; // e.g. "08:30"
    end: string;   // e.g. "11:45"
  };
  weeklyDeepWorkTargetHours: number;
  onboardingCompleted: boolean;
}

export interface AttendanceRecord {
  attended: number;
  total: number;
  maxAllowedAbsences: number;
  currentAbsences: number;
  policyWarningThreshold: number; // e.g., 2
  lastVerifiedDate?: string;
  panoptoSynced: boolean;
}

export interface GradeComponent {
  category: string;
  weightPercent: number;
  score?: number; // e.g. 96
}

export interface SyllabusItem {
  id: string;
  week: number;
  topic: string;
  date: string;
  readings: string;
  hasSlides: boolean;
  hasCodeRepo: boolean;
  edPostUrl?: string;
  isCurrentWeek?: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  units: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  attendance: AttendanceRecord;
  gradingWeights: GradeComponent[];
  lateDaysTotal: number;
  lateDaysUsed: number;
  taQueue: {
    isOpen: boolean;
    location: string;
    studentsInLine: number;
    waitMinutes: number;
  };
  syllabus: SyllabusItem[];
}

export interface AutograderDetails {
  testsPassing: number;
  testsTotal: number;
  valgrindLeaks: number; // 0 means clean
  lateDaysUsed: number;
  coveragePercent: number;
  lastRunTimestamp: string;
  leakStacktrace?: string;
}

export type KanbanColumn = 'backlog' | 'this_week' | 'today' | 'done';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  cognitiveLoad: CognitiveLoadLevel;
  dueDate: string;
  estimatedMinutes: number;
  completed: boolean;
  status?: KanbanColumn;
  subtasks?: TaskSubtask[];
  progressPercent?: number;
  autograder?: AutograderDetails;
  scheduledDate?: string; // e.g. "2026-10-24" (YYYY-MM-DD)
  pinned?: boolean;
}

export interface ExamTopic {
  id: string;
  courseId: string;
  topic: string;
  confidencePercent: number; // 0 - 100
  status: 'critical' | 'moderate' | 'mastered';
  flashcardsCount: number;
  mockQuestionsTested: number;
}

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  repetitions?: number;
  intervalDays?: number;
  easeFactor?: number;
  lastReviewedTimestamp?: number;
  nextReviewTimestamp?: number;
  retentionPercent?: number;
}

export interface MockExamQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DeepWorkSession {
  isRunning: boolean;
  taskId?: string;
  taskTitle?: string;
  courseCode?: string;
  mode: 'focus' | 'break';
  remainingSeconds: number;
  targetSeconds: number; // 50 * 60 = 3000
  ambientSound: 'off' | 'brown-noise' | 'rain' | 'library' | 'binaural';
  completedPomodoros: number;
}

export interface SoundMixer {
  brownNoiseVolume: number; // 0 - 100
  rainVolume: number;
  libraryVolume: number;
  binauralVolume: number;
  masterVolume: number;
}

export interface NoteItem {
  id: string;
  courseId: string;
  title: string;
  content: string;
  timestamp: string;
  tags: string[];
  hasAudioTranscription?: boolean;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  courseCode?: string;
  startTime: string; // "09:30"
  endTime: string;   // "11:00"
  location?: string;
  type: 'lecture' | 'section' | 'deep_work' | 'buffer' | 'break';
  cognitiveLoad?: CognitiveLoadLevel;
  isPeakWindow?: boolean;
}

export interface CampusRoute {
  id: string;
  from: string;
  to: string;
  walkMinutes: number;
  bikeMinutes: number;
  distanceMiles: number;
  quadCrowdLevel: 'Low' | 'Moderate' | 'Heavy';
  bufferRecommendation: string;
}
