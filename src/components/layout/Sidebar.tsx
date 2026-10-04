import React from 'react';
import {
  Compass,
  Calendar,
  CalendarDays,
  Clock,
  CheckSquare,
  GraduationCap,
  Flame,
  BookOpen,
  FileText,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useFocusStore, ActiveView } from '../../store/useFocusStore';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setView,
    user,
    tasks,
    activeDeepWork,
    isMobileMenuOpen,
    setMobileMenuOpen
  } = useFocusStore();

  const criticalTasksCount = tasks.filter((t) => t.autograder && t.autograder.valgrindLeaks > 0).length;

  const navSections: Array<{
    title: string;
    items: Array<{
      id: ActiveView;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeVariant?: 'neutral' | 'amber' | 'rose';
      dot?: 'rose' | 'amber' | 'emerald';
      pulse?: boolean;
    }>;
  }> = [
    {
      title: 'STUDENT OS',
      items: [
        {
          id: 'overview',
          label: 'Dashboard',
          icon: <Compass className="w-4 h-4" />
        },
        {
          id: 'planner-day',
          label: 'Schedule Timeline',
          icon: <Clock className="w-4 h-4" />
        },
        {
          id: 'tasks',
          label: 'Task Board',
          icon: <CheckSquare className="w-4 h-4" />,
          badge: tasks.filter((t) => !t.completed).length,
          badgeVariant: criticalTasksCount > 0 ? 'amber' : 'neutral'
        },
        {
          id: 'course-cs106b',
          label: 'Course Workspace',
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          id: 'focus-timer',
          label: 'Focus Room',
          icon: <Flame className="w-4 h-4" />,
          dot: activeDeepWork.isRunning ? 'emerald' : undefined,
          pulse: activeDeepWork.isRunning
        }
      ]
    },
    {
      title: 'ACADEMICS',
      items: [
        {
          id: 'calendar',
          label: 'Academic Calendar',
          icon: <CalendarDays className="w-4 h-4" />
        },
        {
          id: 'exam-prep',
          label: 'Exam Prep',
          icon: <GraduationCap className="w-4 h-4" />,
          badge: 1,
          badgeVariant: 'neutral'
        },
        {
          id: 'notes',
          label: 'Study Notes',
          icon: <FileText className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'RECORDS',
      items: [
        {
          id: 'analytics',
          label: 'Study Stats',
          icon: <BarChart3 className="w-4 h-4" />
        },
        {
          id: 'attendance',
          label: 'Attendance Health',
          icon: <ShieldCheck className="w-4 h-4" />
        },
        {
          id: 'settings',
          label: 'Settings & Profile',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }
  ];

  const handleSelectView = (view: ActiveView) => {
    setView(view);
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const renderNavContent = () => (
    <>
      {/* Brand Header */}
      <div className="h-14 px-5 border-b border-[#eeeae3] dark:border-[#20222a] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1c1d21] dark:bg-[#f1f2f5] flex items-center justify-center text-white dark:text-[#121316] shadow-xs font-bold text-xs">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">Focusly</span>
            </div>
            <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] leading-none mt-0.5">
              Study & Focus Hub
            </p>
          </div>
        </div>

        {isMobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            title="Close Navigation"
            className="md:hidden p-1.5 rounded-lg text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#f4f1eb] dark:hover:bg-[#1a1c24] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold tracking-wider text-[#9da0a6] dark:text-[#656976] uppercase font-sans">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectView(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer text-left',
                      isActive
                        ? 'bg-[#1c1d21]/90 dark:bg-white/10 text-white font-semibold shadow-2xs'
                        : 'text-[#62656d] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#f4f1eb] dark:hover:bg-[#181a22]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn(isActive ? 'text-white' : 'text-[#858890] dark:text-[#8d929e]')}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Explicit count badge */}
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded text-[10.5px] font-mono font-medium shrink-0',
                          isActive
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#121316]'
                            : item.badgeVariant === 'amber'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                            : item.badgeVariant === 'rose'
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                            : 'bg-[#eeece6] dark:bg-[#20222a] text-[#64676e] dark:text-[#9ba0a9] border border-[#e2ded6] dark:border-[#282b36]'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Minimalist dot indicator */}
                    {item.dot && (
                      <span className="flex items-center justify-center shrink-0 pr-1">
                        {item.pulse ? (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                        ) : item.dot === 'rose' ? (
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full bg-rose-500',
                              isActive ? 'ring-2 ring-white/60 dark:ring-black/40' : 'ring-2 ring-rose-400/30'
                            )}
                          />
                        ) : (
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full bg-amber-500',
                              isActive ? 'ring-2 ring-white/60 dark:ring-black/40' : 'ring-2 ring-amber-400/30'
                            )}
                          />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Card Footer */}
      <div className="p-3 border-t border-[#eeeae3] dark:border-[#20222a] bg-[#f8f6f2] dark:bg-[#121318]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#16171d] border border-[#e8e5df] dark:border-[#242732] shadow-xs">
          <div
            onClick={() => handleSelectView('settings')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1 group"
            title="Open Account & Focus Settings"
          >
            <div className="w-7 h-7 rounded-full bg-[#f4f1eb] dark:bg-[#20222b] border border-[#e8e5df] dark:border-[#282b36] text-[#1c1d21] dark:text-[#f0eff4] text-xs font-semibold flex items-center justify-center shrink-0 group-hover:border-[#1c1d21] dark:group-hover:border-white transition-colors">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AS'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] truncate group-hover:underline">{user.name}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <p className="text-[10.5px] text-[#787b84] dark:text-[#8d929e] truncate">{user.degree}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <button
              onClick={() => handleSelectView('settings')}
              title="Settings & Preferences"
              className={`p-1.5 rounded-lg text-[#9da0a6] hover:text-[#1c1d21] dark:hover:text-white transition-colors cursor-pointer ${
                currentView === 'settings' ? 'text-[#1c1d21] dark:text-white bg-[#f4f1eb] dark:bg-[#20222b]' : ''
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSelectView('auth-login')}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#9da0a6] hover:text-rose-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#fcfbf9] dark:bg-[#101115] border-r border-[#e8e5df] dark:border-[#20222a] h-screen shrink-0 select-none transition-colors duration-200">
        {renderNavContent()}
      </aside>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex flex-col w-72 max-w-[85vw] h-full bg-[#fcfbf9] dark:bg-[#101115] border-r border-[#e8e5df] dark:border-[#20222a] z-10 shadow-calm-lg animate-in slide-in-from-left duration-200 select-none">
            {renderNavContent()}
          </aside>
        </div>
      )}
    </>
  );
};
