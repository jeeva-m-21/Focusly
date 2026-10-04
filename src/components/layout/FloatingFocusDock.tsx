import React, { useState } from 'react';
import { Flame, Play, Pause, Square, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { cn } from '../../utils/cn';

export const FloatingFocusDock: React.FC = () => {
  const {
    activeDeepWork,
    currentView,
    setView,
    pauseDeepWork,
    resumeDeepWork,
    resetDeepWork,
    setAmbientSound
  } = useFocusStore();

  const [isExpanded, setIsExpanded] = useState(false);

  // Only display if timer is running and user is NOT on the dedicated focus timer screen
  if (!activeDeepWork.isRunning || currentView === 'focus-timer') {
    return null;
  }

  const minutes = Math.floor(activeDeepWork.remainingSeconds / 60);
  const seconds = (activeDeepWork.remainingSeconds % 60).toString().padStart(2, '0');
  const progressRatio = Math.max(
    0,
    Math.min(1, 1 - activeDeepWork.remainingSeconds / (activeDeepWork.targetSeconds || 3000))
  );

  return (
    <div className="fixed bottom-16 md:bottom-6 right-3 sm:right-6 z-40 select-none animate-in fade-in duration-200">
      <div className="bg-[#1c1d21]/95 dark:bg-[#14151a]/95 text-white backdrop-blur-md rounded-2xl shadow-calm-lg border border-[#2d2f38] dark:border-[#2a2d3c] p-2.5 transition-all text-xs">
        {/* Minimalist Persistent Bar: 🔥 48:12 CSE2005  ⏸ */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to toggle details"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-mono font-bold text-xs tracking-tight">
              {minutes}:{seconds}
            </span>
            <span className="text-[11px] font-mono font-medium text-amber-300 dark:text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
              {activeDeepWork.courseCode || 'Study'}
            </span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-white/10">
            {activeDeepWork.isRunning ? (
              <button
                onClick={pauseDeepWork}
                className="p-1 rounded-md hover:bg-white/10 text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Pause"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={resumeDeepWork}
                className="p-1 rounded-md hover:bg-white/10 text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Resume"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Expand focus controls'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded State on Click/Hover */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2 w-56 animate-in fade-in duration-150">
            <div className="text-[11px] font-medium text-white/90 truncate">
              {activeDeepWork.taskTitle || 'Deep Work Focus Block'}
            </div>

            {/* Micro Progress Bar */}
            <div className="h-1 w-full bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(progressRatio * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setView('focus-timer')}
                className="text-[10.5px] text-amber-300 hover:underline cursor-pointer"
              >
                Open Studio →
              </button>

              <button
                onClick={resetDeepWork}
                className="flex items-center gap-1 text-[10.5px] text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>End</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
