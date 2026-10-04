import React, { useState, useEffect } from 'react';
import {
  Search,
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
  X,
  Terminal
} from 'lucide-react';
import { useFocusStore, ActiveView } from '../../store/useFocusStore';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPalette,
    setView,
    tasks,
    courses,
    startDeepWork,
    openAutograder
  } = useFocusStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  const navigationCommands: Array<{
    id: ActiveView;
    title: string;
    category: string;
    icon: React.ReactNode;
  }> = [
    { id: 'overview', title: "Go to Today's Overview", category: 'Navigation', icon: <Compass className="w-4 h-4" /> },
    { id: 'calendar', title: 'Go to Academic Calendar', category: 'Navigation', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'planner-week', title: 'Go to Weekly Plan', category: 'Navigation', icon: <Calendar className="w-4 h-4" /> },
    { id: 'planner-day', title: 'Go to Daily Schedule', category: 'Navigation', icon: <Clock className="w-4 h-4" /> },
    { id: 'tasks', title: 'Go to Tasks & Assignments', category: 'Navigation', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'exam-prep', title: 'Go to Exam Prep', category: 'Navigation', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'focus-timer', title: 'Start Focus Session (50m)', category: 'Action', icon: <Flame className="w-4 h-4 text-amber-500" /> },
    { id: 'course-cs106b', title: 'Open CS 106B Course', category: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'notes', title: 'Open Study Notes', category: 'Study', icon: <FileText className="w-4 h-4" /> },
    { id: 'attendance', title: 'View Attendance Records', category: 'Records', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'analytics', title: 'View Study Stats', category: 'Records', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const filteredNav = navigationCommands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectNav = (view: ActiveView) => {
    setView(view);
    setCommandPalette(false);
    setQuery('');
  };

  const handleStartTaskFocus = (task: typeof tasks[0]) => {
    const course = courses.find((c) => c.id === task.courseId);
    startDeepWork(task.id, task.title, course?.code);
    setView('focus-timer');
    setCommandPalette(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 dark:bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#14151a] text-[#1c1d21] dark:text-[#f0eff4] rounded-2xl shadow-xl border border-[#e8e5df] dark:border-[#232630] overflow-hidden flex flex-col max-h-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#f0ede6] dark:border-[#232630] gap-3">
          <Search className="w-4 h-4 text-[#9da0a6] dark:text-[#6b7280] shrink-0" />
          <input
            type="text"
            placeholder="Type a command, course, or task..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-xs outline-none text-[#1c1d21] dark:text-[#f0eff4] bg-transparent placeholder:text-[#9da0a6] dark:placeholder:text-[#6b7280]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#9da0a6] dark:text-[#6b7280] hover:text-[#1c1d21] dark:hover:text-[#f0eff4] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] font-mono text-[#787b84] dark:text-[#8d929e] bg-[#f4f1eb] dark:bg-[#1c1e26] px-1.5 py-0.5 rounded border border-[#e8e5df] dark:border-[#2a2d39]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#f0ede6] dark:divide-[#232630]">
          {/* Quick Diagnostics Action */}
          <div className="pb-2">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[#787b84] dark:text-[#8d929e] uppercase tracking-wider">
              Quick Action
            </div>
            <div className="px-2">
              <button
                onClick={() => {
                  openAutograder('t-1');
                  setCommandPalette(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#f8f6f2] dark:bg-[#1a1c24] hover:bg-[#f0ede6] dark:hover:bg-[#222530] text-xs font-medium cursor-pointer transition-colors text-left text-[#1c1d21] dark:text-[#f0eff4]"
              >
                <Terminal className="w-4 h-4 text-[#64676e] dark:text-[#9ba0a9]" />
                <span>Open Code Diagnostics (CS 106B)</span>
              </button>
            </div>
          </div>

          {/* Quick Nav Commands */}
          <div className="py-2">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[#787b84] dark:text-[#8d929e] uppercase tracking-wider">
              Navigation
            </div>
            <div className="space-y-0.5">
              {filteredNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#2c2d33] dark:text-[#d1d5db] hover:text-[#1c1d21] dark:hover:text-[#f0eff4] hover:bg-[#f4f1eb] dark:hover:bg-[#1a1c24] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#787b84] dark:text-[#8d929e] group-hover:text-[#1c1d21] dark:group-hover:text-[#f0eff4]">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-[#787b84] dark:text-[#8d929e] uppercase bg-[#f4f1eb] dark:bg-[#1f212a] px-1.5 py-0.5 rounded border border-[#e8e5df] dark:border-[#2a2d39]">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Matching Tasks */}
          {filteredTasks.length > 0 && (
            <div className="pt-2">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#787b84] dark:text-[#8d929e] uppercase tracking-wider">
                Tasks
              </div>
              <div className="space-y-0.5">
                {filteredTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleStartTaskFocus(task)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#2c2d33] dark:text-[#d1d5db] hover:text-[#1c1d21] dark:hover:text-[#f0eff4] hover:bg-[#f4f1eb] dark:hover:bg-[#1a1c24] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-medium truncate">{task.title}</span>
                    </div>
                    <span className="text-[10.5px] text-[#b45309] dark:text-[#fbbf24] font-medium bg-[#fffbeb] dark:bg-[#292212] px-2 py-0.5 rounded-full border border-[#fde68a] dark:border-amber-800/40 shrink-0">
                      Start Focus
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
