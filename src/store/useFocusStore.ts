import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  Course,
  Task,
  ExamTopic,
  Flashcard,
  ScheduleBlock,
  NoteItem,
  DeepWorkSession,
  MockExamQuestion,
  CampusRoute,
  SoundMixer,
  KanbanColumn
} from '../types';
import {
  initialUserProfile,
  initialCourses,
  initialTasks,
  initialExamTopics,
  initialFlashcards,
  initialScheduleBlocks,
  initialNotes,
  initialMockQuestions,
  initialCampusRoutes
} from '../data/mockData';
import { soundscapes } from '../utils/soundscapes';
import { optimizeStudySchedule } from '../algorithms/scheduleOptimizer';
import { calculateSM2, ReviewGrade } from '../algorithms/spacedRepetition';
import { VtopHarvestedData } from '../services/vtop/vtopTypes';
import { adaptVtopDataToFocusly } from '../services/vtop/vtopAdapter';

export type ActiveView =
  | 'auth-login'
  | 'auth-signup'
  | 'onboarding'
  | 'overview'
  | 'calendar'
  | 'planner-week'
  | 'planner-day'
  | 'tasks'
  | 'exam-prep'
  | 'attendance'
  | 'analytics'
  | 'focus-timer'
  | 'notes'
  | 'course-cs106b'
  | 'settings';

interface FocusStore {
  // Appearance (Calm Warm-White Canvas or Clean Dark Mode)
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Navigation & Shell
  currentView: ActiveView;
  onboardingStep: 1 | 2 | 3 | 4;
  isCommandPaletteOpen: boolean;
  isQuickBlockModalOpen: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  selectedCourseId: string;

  // Interactive Circadian Energy Simulation Time (e.g. "11:15")
  simulatedCircadianTime: string;
  setSimulatedCircadianTime: (time: string) => void;

  // Autograder & Valgrind Interactive Debugger Modal
  isAutograderModalOpen: boolean;
  selectedAutograderTaskId: string | null;
  openAutograder: (taskId: string) => void;
  closeAutograder: () => void;
  fixValgrindLeak: (taskId: string) => void;

  // Multi-Track Soundscape Mixer
  soundMixer: SoundMixer;
  setSoundMixerVolume: (key: keyof SoundMixer, value: number) => void;

  // Audio Lecture Quick Capture Simulation
  isRecordingLecture: boolean;
  recordedLectureSnippet: string;
  startRecordingLecture: () => void;
  stopRecordingLecture: () => void;
  synthesizeLectureIntoActionItems: () => void;

  // Mock Examination Engine
  mockQuestions: MockExamQuestion[];
  mockExamState: {
    currentQuestionIndex: number;
    answers: Record<string, number>;
    isSubmitted: boolean;
    score: number | null;
  };
  answerMockQuestion: (questionId: string, optionIndex: number) => void;
  submitMockExam: () => void;
  resetMockExam: () => void;

  // Campus Routes & Buffers
  campusRoutes: CampusRoute[];

  // Domain Entities
  user: UserProfile;
  courses: Course[];
  tasks: Task[];
  examTopics: ExamTopic[];
  flashcards: Flashcard[];
  scheduleBlocks: ScheduleBlock[];
  notes: NoteItem[];

  // Deep Work & Immersion Mode
  activeDeepWork: DeepWorkSession;

  // Actions
  setView: (view: ActiveView) => void;
  setOnboardingStep: (step: 1 | 2 | 3 | 4) => void;
  setCommandPalette: (isOpen: boolean) => void;
  setQuickBlockModal: (isOpen: boolean) => void;
  setSelectedCourseId: (id: string) => void;
  updateUser: (profile: Partial<UserProfile>) => void;
  resetToDemoAccount: (persona: 'aarav' | 'maya') => void;
  
  // Task Actions
  toggleTask: (taskId: string) => void;
  togglePinTask: (taskId: string) => void;
  scheduleTaskDate: (taskId: string, dateStr: string) => void;
  pinTaskToDate: (taskId: string, dateStr: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  moveTaskStatus: (taskId: string, newStatus: KanbanColumn) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Schedule & AI Planner Actions
  buildAiStudyPlan: () => void;
  updateScheduleBlock: (blockId: string, updates: Partial<ScheduleBlock>) => void;
  addScheduleBlock: (block: ScheduleBlock) => void;
  removeScheduleBlock: (blockId: string) => void;

  // Attendance Actions
  logAttendance: (courseId: string, status: 'present' | 'absent') => void;

  // Notes Actions
  addNote: (note: Omit<NoteItem, 'id' | 'timestamp'>) => void;
  convertNoteToTask: (noteId: string) => void;

  // Exam & Mastery
  updateTopicConfidence: (topicId: string, delta: number) => void;
  reviewFlashcardSM2: (flashcardId: string, grade: ReviewGrade) => void;

  // TA Queue
  joinTaQueue: (courseId: string) => void;

  // Authentication Session
  isAuthenticated: boolean;
  signOut: () => void;

  // VTOP College Integration
  isVtopSyncModalOpen: boolean;
  vtopLastSyncedAt: string | null;
  vtopHarvestedData: VtopHarvestedData | null;
  openVtopSyncModal: () => void;
  closeVtopSyncModal: () => void;
  hydrateFromVtop: (data: VtopHarvestedData) => void;

  // Deep Work Engine
  startDeepWork: (taskId?: string, taskTitle?: string, courseCode?: string, durationMinutes?: number) => void;
  setDeepWorkTask: (taskId?: string, taskTitle?: string, courseCode?: string, durationMinutes?: number) => void;
  setDeepWorkDuration: (durationMinutes: number) => void;
  pauseDeepWork: () => void;
  resumeDeepWork: () => void;
  resetDeepWork: () => void;
  tickDeepWork: () => void;
  setAmbientSound: (sound: 'off' | 'brown-noise' | 'rain' | 'library' | 'binaural') => void;
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const nextTheme = get().theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme: nextTheme });
      },

      // Default session starts at Login unless authenticated cookies or session exists
      isAuthenticated: false,
      currentView: 'auth-login',
      onboardingStep: 1,
      isCommandPaletteOpen: false,
      isQuickBlockModalOpen: false,
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      selectedCourseId: 'cs106b',

      simulatedCircadianTime: '11:15',
      setSimulatedCircadianTime: (time) => set({ simulatedCircadianTime: time }),

      isAutograderModalOpen: false,
      selectedAutograderTaskId: null,
      openAutograder: (taskId) => set({ isAutograderModalOpen: true, selectedAutograderTaskId: taskId }),
      closeAutograder: () => set({ isAutograderModalOpen: false, selectedAutograderTaskId: null }),

      fixValgrindLeak: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              autograder: t.autograder
                ? {
                    ...t.autograder,
                    testsPassing: t.autograder.testsTotal,
                    valgrindLeaks: 0,
                    coveragePercent: 100,
                    lastRunTimestamp: 'Just now (Clean Valgrind Pass)'
                  }
                : undefined
            };
          })
        }));
      },

      soundMixer: {
        brownNoiseVolume: 65,
        rainVolume: 40,
        libraryVolume: 20,
        binauralVolume: 30,
        masterVolume: 75
      },
      setSoundMixerVolume: (key, value) => {
        set((state) => ({
          soundMixer: { ...state.soundMixer, [key]: value }
        }));
      },

      isRecordingLecture: false,
      recordedLectureSnippet: '',
      startRecordingLecture: () => {
        set({
          isRecordingLecture: true,
          recordedLectureSnippet: 'Listening to lecture audio... "Prof. Keith: Remember that recursive tree traversals visit left subtrees prior to processing parent nodes in preorder traversals..."'
        });
      },
      stopRecordingLecture: () => set({ isRecordingLecture: false }),
      synthesizeLectureIntoActionItems: () => {
        const snippet = get().recordedLectureSnippet;
        if (!snippet) return;
        get().addNote({
          courseId: 'cs106b',
          title: 'Synthesized Lecture Capture: Binary Tree Traversals',
          content: `Transcript captured from live session:\n${snippet}\n\nKey Takeaways:\n1. Preorder: Node -> Left -> Right\n2. Inorder: Left -> Node -> Right (Yields sorted output on BST)\n3. Postorder: Left -> Right -> Node (Mandatory for freeing tree nodes without memory leaks)`,
          tags: ['CS106B', 'LiveAudio', 'Trees', 'Autograder'],
          hasAudioTranscription: true
        });
        set({ isRecordingLecture: false, recordedLectureSnippet: '' });
      },

      mockQuestions: initialMockQuestions,
      mockExamState: {
        currentQuestionIndex: 0,
        answers: {},
        isSubmitted: false,
        score: null
      },
      answerMockQuestion: (questionId, optionIndex) => {
        set((state) => ({
          mockExamState: {
            ...state.mockExamState,
            answers: { ...state.mockExamState.answers, [questionId]: optionIndex }
          }
        }));
      },
      submitMockExam: () => {
        const { mockQuestions, mockExamState } = get();
        let correct = 0;
        mockQuestions.forEach((q) => {
          if (mockExamState.answers[q.id] === q.correctIndex) {
            correct++;
          }
        });
        const finalScore = Math.round((correct / mockQuestions.length) * 100);
        set((state) => ({
          mockExamState: {
            ...state.mockExamState,
            isSubmitted: true,
            score: finalScore
          }
        }));
      },
      resetMockExam: () => {
        set({
          mockExamState: {
            currentQuestionIndex: 0,
            answers: {},
            isSubmitted: false,
            score: null
          }
        });
      },

      campusRoutes: initialCampusRoutes,

      user: initialUserProfile,
      courses: initialCourses,
      tasks: initialTasks,
      examTopics: initialExamTopics,
      flashcards: initialFlashcards,
      scheduleBlocks: initialScheduleBlocks,
      notes: initialNotes,

      activeDeepWork: {
        isRunning: false,
        mode: 'focus',
        remainingSeconds: 50 * 60,
        targetSeconds: 50 * 60,
        ambientSound: 'off',
        completedPomodoros: 3,
        taskId: 't-1',
        taskTitle: 'CSE2005 Lab: Multi-threaded Producer-Consumer Synchronization',
        courseCode: 'CSE2005'
      },

      setView: (view) => set({ currentView: view }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setCommandPalette: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
      setQuickBlockModal: (isOpen) => set({ isQuickBlockModalOpen: isOpen }),
      setSelectedCourseId: (id) => set({ selectedCourseId: id }),

      // Authentication Session Actions
      signOut: () => {
        set({
          isAuthenticated: false,
          currentView: 'auth-login'
        });
      },

      // VTOP College Integration State & Actions
      isVtopSyncModalOpen: false,
      vtopLastSyncedAt: null,
      vtopHarvestedData: null,
      openVtopSyncModal: () => set({ isVtopSyncModalOpen: true }),
      closeVtopSyncModal: () => set({ isVtopSyncModalOpen: false }),

      hydrateFromVtop: (data: VtopHarvestedData) => {
        const { profile, courses, scheduleBlocks, tasks } = adaptVtopDataToFocusly(data);
        set((state) => ({
          isAuthenticated: true,
          user: { ...state.user, ...profile },
          courses: courses.length > 0 ? courses : state.courses,
          scheduleBlocks: scheduleBlocks.length > 0 ? scheduleBlocks : state.scheduleBlocks,
          tasks: tasks && tasks.length > 0 ? tasks : state.tasks,
          selectedCourseId: courses[0]?.id || state.selectedCourseId,
          vtopLastSyncedAt: data.syncedAt,
          vtopHarvestedData: data,
          isVtopSyncModalOpen: false,
          currentView: 'overview'
        }));
      },

      updateUser: (profile) =>
        set((state) => ({
          user: { ...state.user, ...profile }
        })),

      resetToDemoAccount: (persona) => {
        if (persona === 'aarav') {
          set({
            isAuthenticated: true,
            user: { ...initialUserProfile, onboardingCompleted: true },
            courses: initialCourses,
            tasks: initialTasks,
            scheduleBlocks: initialScheduleBlocks,
            onboardingStep: 1,
            currentView: 'overview'
          });
        } else {
          set({
            isAuthenticated: true,
            user: {
              name: 'Maya Lin',
              email: 'maya.lin2023@vitstudent.ac.in',
              institution: 'Vellore Institute of Technology (VIT)',
              term: 'Winter Semester 2025-26',
              degree: "B.Tech Computer Science & Bioengineering '27",
              targetUnits: 23,
              chronotype: 'afternoon',
              circadianPeak: { start: '13:00', end: '16:30' },
              weeklyDeepWorkTargetHours: 20,
              onboardingCompleted: false
            },
            onboardingStep: 1,
            currentView: 'onboarding'
          });
        }
      },

      toggleTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        })),

      togglePinTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, pinned: !t.pinned } : t
          )
        })),

      scheduleTaskDate: (taskId, dateStr) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, scheduledDate: dateStr } : t
          )
        })),

      pinTaskToDate: (taskId, dateStr) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, scheduledDate: dateStr, pinned: true } : t
          )
        })),

      addTask: (task) =>
        set((state) => {
          let resolvedDate = task.scheduledDate;
          if (!resolvedDate && task.dueDate) {
            const lower = task.dueDate.toLowerCase();
            if (lower.includes('today') || lower.includes('thursday')) resolvedDate = '2026-10-24';
            else if (lower.includes('tomorrow') || lower.includes('friday')) resolvedDate = '2026-10-25';
            else if (lower.includes('yesterday') || lower.includes('wednesday')) resolvedDate = '2026-10-23';
            else if (lower.includes('saturday')) resolvedDate = '2026-10-26';
            else if (lower.includes('sunday')) resolvedDate = '2026-10-25';
            else if (lower.includes('monday')) resolvedDate = '2026-10-27';
            else if (lower.includes('tuesday')) resolvedDate = '2026-11-03';
            else if (lower.includes('next week')) resolvedDate = '2026-10-30';
            else {
              const iso = task.dueDate.match(/\d{4}-\d{2}-\d{2}/);
              resolvedDate = iso ? iso[0] : '2026-10-24';
            }
          }
          return {
            tasks: [
              {
                ...task,
                scheduledDate: resolvedDate || '2026-10-24',
                id: `t-${Date.now()}`
              },
              ...state.tasks
            ]
          };
        }),

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId)
        })),

      moveTaskStatus: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              status: newStatus,
              completed: newStatus === 'done'
            };
          })
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            const subtasks = (t.subtasks || []).map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            );
            const completedCount = subtasks.filter((st) => st.completed).length;
            const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : t.progressPercent;
            return {
              ...t,
              subtasks,
              progressPercent
            };
          })
        })),

      buildAiStudyPlan: () =>
        set((state) => {
          // Keep fixed classes, sections, transit, and breaks
          const fixedBlocks = state.scheduleBlocks.filter(
            (b) => b.type === 'lecture' || b.type === 'buffer' || b.type === 'break' || b.type === 'section'
          );

          // Run real greedy interval scheduling algorithm
          const result = optimizeStudySchedule(
            state.tasks,
            fixedBlocks,
            state.user.chronotype || 'afternoon'
          );

          return {
            scheduleBlocks: result.optimizedBlocks
          };
        }),

      updateScheduleBlock: (blockId, updates) =>
        set((state) => ({
          scheduleBlocks: state.scheduleBlocks.map((b) =>
            b.id === blockId ? { ...b, ...updates } : b
          )
        })),

      addScheduleBlock: (block) =>
        set((state) => ({
          scheduleBlocks: [...state.scheduleBlocks, block]
        })),

      removeScheduleBlock: (blockId) =>
        set((state) => ({
          scheduleBlocks: state.scheduleBlocks.filter((b) => b.id !== blockId)
        })),

      logAttendance: (courseId, status) =>
        set((state) => ({
          courses: state.courses.map((c) => {
            if (c.id !== courseId) return c;
            const newTotal = c.attendance.total + 1;
            const newAttended = status === 'present' ? c.attendance.attended + 1 : c.attendance.attended;
            const newAbsences = status === 'absent' ? c.attendance.currentAbsences + 1 : c.attendance.currentAbsences;
            return {
              ...c,
              attendance: {
                ...c.attendance,
                total: newTotal,
                attended: newAttended,
                currentAbsences: newAbsences,
                lastVerifiedDate: `Just now (${status === 'present' ? 'Verified In-Person' : 'Unexcused Absence'})`
              }
            };
          })
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [
            {
              ...note,
              id: `n-${Date.now()}`,
              timestamp: 'Just now'
            },
            ...state.notes
          ]
        })),

      convertNoteToTask: (noteId) => {
        const note = get().notes.find((n) => n.id === noteId);
        if (!note) return;
        get().addTask({
          courseId: note.courseId,
          title: `Action Item: ${note.title}`,
          description: `Extracted from lecture note capture: ${note.content.slice(0, 100)}...`,
          cognitiveLoad: 'medium',
          dueDate: 'Tomorrow at 5:00 PM',
          estimatedMinutes: 45,
          completed: false
        });
      },

      updateTopicConfidence: (topicId, delta) =>
        set((state) => ({
          examTopics: state.examTopics.map((topic) => {
            if (topic.id !== topicId) return topic;
            const newScore = Math.max(0, Math.min(100, topic.confidencePercent + delta));
            const newStatus = newScore < 50 ? 'critical' : newScore < 80 ? 'moderate' : 'mastered';
            return {
              ...topic,
              confidencePercent: newScore,
              status: newStatus
            };
          })
        })),

      reviewFlashcardSM2: (flashcardId, grade) =>
        set((state) => {
          const card = state.flashcards.find((f) => f.id === flashcardId);
          if (!card) return state;

          const currentProgress = {
            cardId: card.id,
            repetitions: card.repetitions ?? 0,
            intervalDays: card.intervalDays ?? 1,
            easeFactor: card.easeFactor ?? 2.5,
            lastReviewedTimestamp: card.lastReviewedTimestamp ?? Date.now(),
            nextReviewTimestamp: card.nextReviewTimestamp ?? Date.now(),
            retentionPercent: card.retentionPercent ?? 50
          };

          const newProgress = calculateSM2(currentProgress, grade);

          const updatedFlashcards = state.flashcards.map((f) =>
            f.id === flashcardId
              ? {
                  ...f,
                  repetitions: newProgress.repetitions,
                  intervalDays: newProgress.intervalDays,
                  easeFactor: newProgress.easeFactor,
                  lastReviewedTimestamp: newProgress.lastReviewedTimestamp,
                  nextReviewTimestamp: newProgress.nextReviewTimestamp,
                  retentionPercent: newProgress.retentionPercent,
                  lastReviewed: 'Just now'
                }
              : f
          );

          // Update associated topic confidence based on SM-2 recall grade
          const delta = grade >= 4 ? 8 : grade === 3 ? 4 : grade === 2 ? -2 : -8;
          const updatedTopics = state.examTopics.map((topic) => {
            if (topic.id !== card.topicId) return topic;
            const newScore = Math.max(0, Math.min(100, topic.confidencePercent + delta));
            const newStatus: 'critical' | 'moderate' | 'mastered' =
              newScore < 50 ? 'critical' : newScore < 80 ? 'moderate' : 'mastered';
            return {
              ...topic,
              confidencePercent: newScore,
              status: newStatus
            };
          });

          return {
            flashcards: updatedFlashcards,
            examTopics: updatedTopics
          };
        }),

      joinTaQueue: (courseId) =>
        set((state) => ({
          courses: state.courses.map((c) => {
            if (c.id !== courseId) return c;
            return {
              ...c,
              taQueue: {
                ...c.taQueue,
                studentsInLine: c.taQueue.studentsInLine + 1,
                waitMinutes: c.taQueue.waitMinutes + 12
              }
            };
          })
        })),

      startDeepWork: (taskId, taskTitle, courseCode, durationMinutes) =>
        set((state) => {
          const seconds = durationMinutes ? durationMinutes * 60 : state.activeDeepWork.targetSeconds;
          return {
            activeDeepWork: {
              ...state.activeDeepWork,
              isRunning: true,
              taskId: taskId !== undefined ? taskId : state.activeDeepWork.taskId,
              taskTitle: taskTitle !== undefined ? taskTitle : state.activeDeepWork.taskTitle,
              courseCode: courseCode !== undefined ? courseCode : state.activeDeepWork.courseCode,
              ...(durationMinutes ? { targetSeconds: seconds, remainingSeconds: seconds } : {})
            }
          };
        }),

      setDeepWorkTask: (taskId, taskTitle, courseCode, durationMinutes) =>
        set((state) => {
          const seconds = durationMinutes ? durationMinutes * 60 : state.activeDeepWork.targetSeconds;
          return {
            activeDeepWork: {
              ...state.activeDeepWork,
              taskId: taskId !== undefined ? taskId : state.activeDeepWork.taskId,
              taskTitle: taskTitle !== undefined ? taskTitle : state.activeDeepWork.taskTitle,
              courseCode: courseCode !== undefined ? courseCode : state.activeDeepWork.courseCode,
              ...(durationMinutes ? { targetSeconds: seconds, remainingSeconds: seconds } : {})
            }
          };
        }),

      setDeepWorkDuration: (durationMinutes) =>
        set((state) => ({
          activeDeepWork: {
            ...state.activeDeepWork,
            targetSeconds: durationMinutes * 60,
            remainingSeconds: durationMinutes * 60
          }
        })),

      pauseDeepWork: () =>
        set((state) => ({
          activeDeepWork: {
            ...state.activeDeepWork,
            isRunning: false
          }
        })),

      resumeDeepWork: () =>
        set((state) => ({
          activeDeepWork: {
            ...state.activeDeepWork,
            isRunning: true
          }
        })),

      resetDeepWork: () =>
        set((state) => ({
          activeDeepWork: {
            ...state.activeDeepWork,
            isRunning: false,
            remainingSeconds: state.activeDeepWork.mode === 'focus' ? 50 * 60 : 10 * 60
          }
        })),

      tickDeepWork: () => {
        const current = get().activeDeepWork;
        if (!current.isRunning) return;

        if (current.remainingSeconds <= 1) {
          const nextMode = current.mode === 'focus' ? 'break' : 'focus';
          const nextSeconds = nextMode === 'focus' ? 50 * 60 : 10 * 60;
          set((state) => ({
            activeDeepWork: {
              ...state.activeDeepWork,
              mode: nextMode,
              remainingSeconds: nextSeconds,
              targetSeconds: nextSeconds,
              isRunning: false,
              completedPomodoros:
                current.mode === 'focus'
                  ? state.activeDeepWork.completedPomodoros + 1
                  : state.activeDeepWork.completedPomodoros
            }
          }));
        } else {
          set((state) => ({
            activeDeepWork: {
              ...state.activeDeepWork,
              remainingSeconds: state.activeDeepWork.remainingSeconds - 1
            }
          }));
        }
      },

      setAmbientSound: (sound) => {
        if (sound === 'off') {
          soundscapes.stop();
        } else if (sound === 'binaural') {
          soundscapes.play('brown-noise'); // gentle warm focus frequency
        } else {
          soundscapes.play(sound);
        }
        set((state) => ({
          activeDeepWork: {
            ...state.activeDeepWork,
            ambientSound: sound
          }
        }));
      }
    }),
    {
      name: 'focusly-state-storage-v2',
      partialize: (state) => ({
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
        vtopLastSyncedAt: state.vtopLastSyncedAt,
        user: state.user,
        courses: state.courses,
        tasks: state.tasks,
        notes: state.notes,
        examTopics: state.examTopics,
        flashcards: state.flashcards,
        scheduleBlocks: state.scheduleBlocks,
        currentView: state.isAuthenticated ? state.currentView : 'auth-login'
      })
    }
  )
);
