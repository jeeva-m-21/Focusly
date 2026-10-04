import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Flame,
  Zap,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  MoveRight,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../../components/common/Button';
import { Badge, CognitiveLoadBadge } from '../../components/common/Badge';
import { ScheduleBlock, Task } from '../../types';

export const PlannerDay: React.FC = () => {
  const {
    scheduleBlocks,
    tasks,
    courses,
    setView,
    startDeepWork,
    addScheduleBlock,
    removeScheduleBlock,
    updateScheduleBlock,
    simulatedCircadianTime,
    setQuickBlockModal
  } = useFocusStore();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // 0 = Today (Thu)

  // Unscheduled or pending tasks that can be dragged onto the schedule
  const backlogTasks = tasks.filter((t) => !t.completed);

  // Time slots from 08:00 to 18:00
  const hours = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00'
  ];

  // Quick schedule a task at a given hour
  const handleScheduleTaskAtHour = (task: Task, hour: string) => {
    const endMinutes = parseInt(hour.split(':')[0], 10) + 1;
    const endHourStr = `${endMinutes.toString().padStart(2, '0')}:00`;
    const course = courses.find((c) => c.id === task.courseId);

    const newBlock: ScheduleBlock = {
      id: `sb-custom-${Date.now()}`,
      title: task.title,
      courseCode: course?.code,
      startTime: hour,
      endTime: endHourStr,
      type: 'deep_work',
      cognitiveLoad: task.cognitiveLoad,
      location: course?.code === 'CS 106B' ? 'Gates B02' : 'Green Library'
    };

    addScheduleBlock(newBlock);
  };

  // Adjust duration by +/- 15 minutes
  const handleAdjustDuration = (block: ScheduleBlock, deltaMinutes: number) => {
    const [h, m] = block.endTime.split(':').map(Number);
    let totalMinutes = h * 60 + m + deltaMinutes;
    const [startH, startM] = block.startTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;

    // Minimum 15 min duration
    if (totalMinutes <= startTotal) {
      totalMinutes = startTotal + 15;
    }

    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    const newEndTime = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;

    updateScheduleBlock(block.id, { endTime: newEndTime });
  };

  // Check for block conflicts
  const isBlockConflicted = (currentBlock: ScheduleBlock) => {
    const [curStartH, curStartM] = currentBlock.startTime.split(':').map(Number);
    const [curEndH, curEndM] = currentBlock.endTime.split(':').map(Number);
    const curStart = curStartH * 60 + curStartM;
    const curEnd = curEndH * 60 + curEndM;

    return scheduleBlocks.some((other) => {
      if (other.id === currentBlock.id) return false;
      const [othStartH, othStartM] = other.startTime.split(':').map(Number);
      const [othEndH, othEndM] = other.endTime.split(':').map(Number);
      const othStart = othStartH * 60 + othStartM;
      const othEnd = othEndH * 60 + othEndM;

      // Overlap condition
      return curStart < othEnd && curEnd > othStart;
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Day Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5df] dark:border-[#22242f] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9da0a6] dark:text-[#676b76] font-semibold">
            INTERACTIVE TIMELINE CENTERPIECE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight mt-0.5">
            Daily Schedule & Timeline
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-1">
            Drag tasks directly onto open slots, resize focus blocks, and eliminate schedule conflicts.
          </p>
        </div>

        {/* Day Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f4f1eb] dark:bg-[#181922] p-1 rounded-xl border border-[#e8e5df] dark:border-[#242630] text-xs">
            <button
              onClick={() => setSelectedDayOffset((prev) => prev - 1)}
              className="p-1 rounded-lg text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white hover:bg-white dark:hover:bg-[#252834] transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-[#1c1d21] dark:text-[#f0eff4] font-mono">
              {selectedDayOffset === 0
                ? 'Thursday, Oct 24 (Today)'
                : selectedDayOffset === 1
                ? 'Friday, Oct 25 (Tomorrow)'
                : selectedDayOffset === -1
                ? 'Wednesday, Oct 23'
                : `Oct ${24 + selectedDayOffset}`}
            </span>
            <button
              onClick={() => setSelectedDayOffset((prev) => prev + 1)}
              className="p-1 rounded-lg text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white hover:bg-white dark:hover:bg-[#252834] transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuickBlockModal(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-semibold"
          >
            + New Block
          </Button>
        </div>
      </div>

      {/* Circadian Alertness & Peak Focus Window Advisory */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#fffdfa] dark:bg-[#18171e] border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              High-Alertness Biological Window (11:00 AM – 1:30 PM & 3:30 – 5:30 PM)
            </h4>
            <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
              Ideal timing for heavy algorithmic assignments before afternoon cortisol drop.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e] bg-white dark:bg-[#20222c] px-2 py-1 rounded border border-[#e8e5df] dark:border-[#2d303e]">
            Current: 10:45 AM
          </span>
        </div>
      </div>

      {/* Main 2-Column Workspace: Large Timeline Centerpiece + Unscheduled Task Backlog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Large Interactive Timeline */}
        <div className="lg:col-span-8 bg-white dark:bg-[#14151c] rounded-2xl border border-[#e8e5df] dark:border-[#22242f] p-4 sm:p-6 shadow-xs relative">
          <div className="flex items-center justify-between mb-4 border-b border-[#f4f1eb] dark:border-[#1e2029] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#787b84] dark:text-[#8d929e]" />
              <h2 className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
                Timeline Flow (08:00 – 18:00)
              </h2>
            </div>
            <span className="text-xs text-[#787b84] dark:text-[#8d929e]">
              Click or drag tasks onto slots
            </span>
          </div>

          {/* Timeline Hour Grid */}
          <div className="space-y-4 relative">
            {/* Live 'Now' Indicator at 10:45 (Positioned in time gutter so it does not strike through task cards) */}
            <div
              className="absolute left-0 z-20 pointer-events-none flex items-center gap-1.5"
              style={{ top: '27.5%' }}
            >
              <div className="flex items-center gap-1 bg-rose-500 text-white font-mono text-[9.5px] px-2 py-0.5 rounded font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>10:45 AM</span>
                <span className="opacity-80 text-[8px] uppercase tracking-wider ml-0.5">NOW</span>
              </div>
              <div className="w-4 h-0.5 bg-rose-500" />
            </div>

            {hours.map((hour) => {
              // Find schedule blocks that start in this hour
              const matchingBlocks = scheduleBlocks.filter(
                (b) => b.startTime.startsWith(hour.slice(0, 2))
              );

              return (
                <div
                  key={hour}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedTaskId) {
                      const task = tasks.find((t) => t.id === draggedTaskId);
                      if (task) {
                        handleScheduleTaskAtHour(task, hour);
                      }
                      setDraggedTaskId(null);
                    }
                  }}
                  className="group min-h-[58px] flex items-start gap-4 border-t border-[#f4f1eb] dark:border-[#1a1b24] pt-2 relative hover:bg-[#fcfbf9] dark:hover:bg-[#161720] transition-colors rounded-lg px-1.5"
                >
                  {/* Hour Label */}
                  <div className="w-12 shrink-0 font-mono text-xs font-semibold text-[#9da0a6] dark:text-[#676b76] pt-1">
                    {hour}
                  </div>

                  {/* Block Container */}
                  <div className="flex-1 space-y-2 min-w-0">
                    {matchingBlocks.length > 0 ? (
                      matchingBlocks.map((block) => {
                        const conflicted = isBlockConflicted(block);

                        return (
                          <div
                            key={block.id}
                            className={`p-3 rounded-xl border transition-all relative ${
                              conflicted
                                ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 shadow-xs'
                                : block.isPeakWindow
                                ? 'bg-[#fffdfa] dark:bg-[#1a1924] border-amber-300 dark:border-amber-800/80 shadow-2xs'
                                : block.type === 'buffer'
                                ? 'bg-[#fcfbf9] dark:bg-[#15161d] border-dashed border-[#d5d0c7] dark:border-[#2d303e]'
                                : 'bg-white dark:bg-[#181922] border-[#e8e5df] dark:border-[#262835] shadow-2xs hover:border-[#1c1d21] dark:hover:border-[#383b49]'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="min-w-0 flex items-start gap-2.5">
                                <div className="font-mono text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] pt-0.5">
                                  {block.startTime} – {block.endTime}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {block.courseCode && (
                                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#f4f1eb] dark:bg-[#20222b] text-[#1c1d21] dark:text-[#f0eff4] border border-[#e8e5df] dark:border-[#2a2d39]">
                                        {block.courseCode}
                                      </span>
                                    )}
                                    <h4 className="text-xs sm:text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4] truncate">
                                      {block.title}
                                    </h4>
                                    {conflicted && (
                                      <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>Time Conflict</span>
                                      </span>
                                    )}
                                    {block.isPeakWindow && (
                                      <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded font-semibold">
                                        Peak Focus
                                      </span>
                                    )}
                                  </div>

                                  {block.location && (
                                    <p className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] mt-0.5 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-[#9da0a6] dark:text-[#676b76]" />
                                      <span>{block.location}</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Interactive Block Actions & Resizing */}
                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto pt-1 sm:pt-0">
                                {/* Duration Adjusters */}
                                <div className="flex items-center bg-[#f4f1eb] dark:bg-[#20222c] rounded-lg p-0.5 border border-[#e8e5df] dark:border-[#2d303d]">
                                  <button
                                    onClick={() => handleAdjustDuration(block, -15)}
                                    title="Decrease duration by 15m"
                                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
                                  >
                                    -15m
                                  </button>
                                  <span className="text-[10px] text-[#d5d0c7] dark:text-[#383b48]">|</span>
                                  <button
                                    onClick={() => handleAdjustDuration(block, 15)}
                                    title="Increase duration by 15m"
                                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
                                  >
                                    +15m
                                  </button>
                                </div>

                                {block.type !== 'buffer' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      startDeepWork(block.id, block.title, block.courseCode);
                                      setView('focus-timer');
                                    }}
                                    icon={<Flame className="w-3 h-3 text-amber-500" />}
                                    className="text-xs font-semibold py-0.5 px-2"
                                  >
                                    Focus
                                  </Button>
                                )}

                                <button
                                  onClick={() => removeScheduleBlock(block.id)}
                                  title="Remove block"
                                  className="p-1 rounded text-[#9da0a6] hover:text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-9 border border-dashed border-transparent hover:border-[#d5d0c7] dark:hover:border-[#383b48] rounded-xl flex items-center justify-between px-3 text-xs text-[#9da0a6] dark:text-[#676b76] group-hover:bg-[#f8f6f2] dark:group-hover:bg-[#181924] transition-all">
                        <span>Open study slot</span>
                        <span className="text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          Drop task here to schedule
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Unscheduled Backlog Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#14151c] rounded-2xl border border-[#e8e5df] dark:border-[#22242f] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-[#f4f1eb] dark:border-[#1e2029] pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1d21] dark:text-[#f0eff4]">
                  UNSCHEDULED BACKLOG
                </h3>
                <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-0.5">
                  Drag onto timeline or click to place.
                </p>
              </div>
              <Badge variant="default">{backlogTasks.length} Available</Badge>
            </div>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {backlogTasks.map((task) => {
                const course = courses.find((c) => c.id === task.courseId);

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTaskId(task.id)}
                    className="p-3 rounded-xl border border-[#e8e5df] dark:border-[#22242f] bg-[#fcfbf9] dark:bg-[#181922] hover:border-[#1c1d21] dark:hover:border-[#383b48] transition-all cursor-grab active:cursor-grabbing shadow-2xs group"
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono">
                      <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4] bg-[#eeece6] dark:bg-[#20222a] px-1.5 py-0.2 rounded border border-[#e2ded6] dark:border-[#282b36]">
                        {course?.code}
                      </span>
                      <span className="text-[#787b84] dark:text-[#8d929e]">{task.dueDate}</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] leading-snug">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#eeeae3] dark:border-[#20222a] text-xs">
                      <span className="text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">
                        ~{task.estimatedMinutes} min
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleScheduleTaskAtHour(task, '14:00')}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-[#242632] border border-[#e8e5df] dark:border-[#2d303f] hover:bg-[#1c1d21] hover:text-white dark:hover:bg-white dark:hover:text-[#121316] transition-colors cursor-pointer"
                        >
                          + at 14:00
                        </button>
                        <button
                          onClick={() => handleScheduleTaskAtHour(task, '16:00')}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-[#242632] border border-[#e8e5df] dark:border-[#2d303f] hover:bg-[#1c1d21] hover:text-white dark:hover:bg-white dark:hover:text-[#121316] transition-colors cursor-pointer"
                        >
                          + at 16:00
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Transit Buffer Note */}
          <div className="p-3.5 rounded-xl bg-[#f8f6f2] dark:bg-[#15161d] border border-[#e8e5df] dark:border-[#22242f] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              <Footprints className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Transit Buffer Intelligence</span>
            </div>
            <p className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] leading-relaxed">
              Between Gates B02 and Packard 101, an automatic 15-minute campus walk buffer is preserved to prevent tardiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
