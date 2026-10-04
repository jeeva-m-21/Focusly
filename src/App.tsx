import React, { useEffect } from 'react';
import {
  Compass,
  Calendar,
  CalendarDays,
  CheckSquare,
  Flame,
  BarChart3
} from 'lucide-react';
import { useFocusStore, ActiveView } from './store/useFocusStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FloatingFocusDock } from './components/layout/FloatingFocusDock';
import { CommandPalette } from './components/command/CommandPalette';
import { QuickBlockModal } from './components/command/QuickBlockModal';
import { AutograderModal } from './components/debugger/AutograderModal';
import { VtopSyncModal } from './components/vtop/VtopSyncModal';
import { cn } from './utils/cn';

// Features
import { AuthDoorway } from './features/auth/AuthDoorway';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { OverviewCockpit } from './features/overview/OverviewCockpit';
import { CalendarView } from './features/calendar/CalendarView';
import { PlannerWeek } from './features/planner/PlannerWeek';
import { PlannerDay } from './features/planner/PlannerDay';
import { TasksView } from './features/tasks/TasksView';
import { ExamPrepView } from './features/exam-prep/ExamPrepView';
import { AttendanceView } from './features/attendance/AttendanceView';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { FocusTimerView } from './features/focus-timer/FocusTimerView';
import { NotesView } from './features/notes/NotesView';
import { CourseDetailView } from './features/course/CourseDetailView';
import { SettingsView } from './features/settings/SettingsView';

export const App: React.FC = () => {
  const {
    currentView,
    setView,
    theme,
    setQuickBlockModal,
    startDeepWork,
    isCommandPaletteOpen,
    isQuickBlockModalOpen,
    isAutograderModalOpen,
    tasks
  } = useFocusStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Global keyboard shortcuts: 'N' -> New Task, 'F' -> Start Focus Session
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      if (isCommandPaletteOpen || isQuickBlockModalOpen || isAutograderModalOpen) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setQuickBlockModal(true);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        const topTask = tasks.find((t) => !t.completed) || tasks[0];
        if (topTask) {
          startDeepWork(topTask.id, topTask.title, 'CS 106B');
        }
        setView('focus-timer');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isQuickBlockModalOpen,
    isAutograderModalOpen,
    setQuickBlockModal,
    startDeepWork,
    setView,
    tasks
  ]);

  // Doorway
  if (currentView === 'auth-login') {
    return <AuthDoorway initialMode="login" />;
  }
  if (currentView === 'auth-signup') {
    return <AuthDoorway initialMode="signup" />;
  }

  // Onboarding Flow
  if (currentView === 'onboarding') {
    return <OnboardingFlow />;
  }

  const mobileNavItems: Array<{ id: ActiveView; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Today', icon: <Compass className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'focus-timer', label: 'Timer', icon: <Flame className="w-4 h-4" /> },
    { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  // Workspace Shell
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#faf8f5] dark:bg-[#0c0d10] text-[#1c1d21] dark:text-[#f0eff4] transition-colors duration-200">
      {/* Persistent Left Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative bg-ambient-mesh">
        {/* Soft background ambient glow orbs */}
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />

        {/* Top Context Header */}
        <Header />

        {/* Scrollable Work Surface */}
        <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 sm:py-6 scroll-smooth relative z-10 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-6">
          <div key={currentView} className="view-enter">
            {currentView === 'overview' && <OverviewCockpit />}
            {currentView === 'calendar' && <CalendarView />}
            {currentView === 'planner-week' && <PlannerWeek />}
            {currentView === 'planner-day' && <PlannerDay />}
            {currentView === 'tasks' && <TasksView />}
            {currentView === 'exam-prep' && <ExamPrepView />}
            {currentView === 'attendance' && <AttendanceView />}
            {currentView === 'analytics' && <AnalyticsView />}
            {currentView === 'focus-timer' && <FocusTimerView />}
            {currentView === 'notes' && <NotesView />}
            {currentView === 'course-cs106b' && <CourseDetailView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>

        {/* Mobile Sleek Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#fcfbf9]/95 dark:bg-[#101115]/95 backdrop-blur-md border-t border-[#e8e5df] dark:border-[#20222a] px-3 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] flex items-center justify-around select-none">
          {mobileNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={cn(
                  'flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'text-[#1c1d21] dark:text-white font-semibold'
                    : 'text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
                )}
              >
                <span
                  className={cn(
                    'p-1 rounded-lg transition-colors',
                    isActive ? 'bg-[#f4f1eb] dark:bg-[#1e2028]' : ''
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Floating State Mini-Dock for Deep Work Sessions */}
      <FloatingFocusDock />

      {/* Universal ⌘K Command Center */}
      <CommandPalette />

      {/* Omni-Action + New Block Creator Modal */}
      <QuickBlockModal />

      {/* Interactive Valgrind & Gradescope Debugger Modal */}
      <AutograderModal />

      {/* College Portal (VTOP) Sync & Captcha Modal */}
      <VtopSyncModal />
    </div>
  );
};

export default App;
