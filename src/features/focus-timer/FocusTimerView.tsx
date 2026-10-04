import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Volume2,
  CheckCircle2,
  Lock,
  Sliders,
  Plus,
  Coffee,
  Check,
  Sparkles,
  Shield,
  ArrowRight,
  ChevronDown,
  ListTodo,
  Terminal,
  BookOpen,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../../components/common/Button';

export const FocusTimerView: React.FC = () => {
  const {
    activeDeepWork,
    pauseDeepWork,
    resumeDeepWork,
    resetDeepWork,
    tickDeepWork,
    setAmbientSound,
    soundMixer,
    setSoundMixerVolume,
    addTask,
    toggleTask,
    tasks,
    courses,
    setDeepWorkTask,
    setDeepWorkDuration
  } = useFocusStore();

  const [scratchpadText, setScratchpadText] = useState('');
  const [scratchpadList, setScratchpadList] = useState<string[]>([
    'Double-check that destructor deletes dynamic array in PriorityQueue',
    'Email section leader regarding problem 4 edge cases'
  ]);
  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false);
  const [customTaskInput, setCustomTaskInput] = useState('');
  const [newObjectiveText, setNewObjectiveText] = useState('');
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Micro-checklist for active deep work
  const [microChecklist, setMicroChecklist] = useState<Array<{ id: string; title: string; completed: boolean }>>([
    { id: 'mc-1', title: 'Read autograder test failures in dequeue()', completed: true },
    { id: 'mc-2', title: 'Inspect recursive sift-down child index math', completed: true },
    { id: 'mc-3', title: 'Implement dynamic memory delete[] on heap array resize', completed: false },
    { id: 'mc-4', title: 'Run full Valgrind memory leak verification test', completed: false }
  ]);

  // Interval timer tick hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeDeepWork.isRunning) {
      interval = setInterval(() => {
        tickDeepWork();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeDeepWork.isRunning, tickDeepWork]);

  const minutes = Math.floor(activeDeepWork.remainingSeconds / 60);
  const seconds = (activeDeepWork.remainingSeconds % 60).toString().padStart(2, '0');
  const totalTarget = activeDeepWork.targetSeconds || 50 * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalTarget - activeDeepWork.remainingSeconds) / totalTarget) * 100));

  const handleToggleMicro = (id: string) => {
    setMicroChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddMicro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectiveText.trim()) return;
    setMicroChecklist([
      ...microChecklist,
      { id: `mc-${Date.now()}`, title: newObjectiveText.trim(), completed: false }
    ]);
    setNewObjectiveText('');
  };

  const handleAddScratchpad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchpadText.trim()) return;
    setScratchpadList([...scratchpadList, scratchpadText.trim()]);
    setScratchpadText('');
  };

  const handleFinishSession = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
    if (activeDeepWork.taskId) {
      toggleTask(activeDeepWork.taskId);
    }
    pauseDeepWork();
    setSessionCompleted(true);
    setTimeout(() => setSessionCompleted(false), 5000);
  };

  const handleSelectTask = (task: typeof tasks[0]) => {
    const course = courses.find((c) => c.id === task.courseId);
    setDeepWorkTask(task.id, task.title, course?.code || 'ACADEMIC');
    if (task.subtasks && task.subtasks.length > 0) {
      setMicroChecklist(
        task.subtasks.map((st) => ({
          id: st.id,
          title: st.title,
          completed: st.completed
        }))
      );
    } else {
      setMicroChecklist([
        { id: `mc-1-${Date.now()}`, title: `Focus milestone: ${task.title.slice(0, 45)}`, completed: false },
        { id: `mc-2-${Date.now()}`, title: 'Review and verify edge cases', completed: false }
      ]);
    }
    setIsTaskPickerOpen(false);
  };

  const handleSelectIndependent = () => {
    setDeepWorkTask(undefined, 'Independent Deep Work', 'FREE FOCUS');
    setMicroChecklist([
      { id: `mc-1-${Date.now()}`, title: 'Establish deep work objective', completed: false },
      { id: `mc-2-${Date.now()}`, title: 'Maintain uninterrupted attention', completed: false }
    ]);
    setIsTaskPickerOpen(false);
  };

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskInput.trim()) return;
    const newTitle = customTaskInput.trim();
    addTask({
      courseId: 'cs106b',
      title: newTitle,
      description: 'Created during active focus session',
      cognitiveLoad: 'high',
      dueDate: 'Today at 6:00 PM',
      estimatedMinutes: 50,
      completed: false
    });
    setDeepWorkTask(undefined, newTitle, 'CUSTOM');
    setCustomTaskInput('');
    setIsTaskPickerOpen(false);
  };

  const currentDurationMinutes = Math.round(totalTarget / 60);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 sm:py-4">
      {/* 1. Interactive Task Selector Header */}
      <div className="relative">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs text-center space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
              {activeDeepWork.courseCode || 'CS 106B'} • IMMERSIVE FOCUS
            </span>

            <button
              onClick={() => setIsTaskPickerOpen(!isTaskPickerOpen)}
              className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-[#f4f1eb] dark:hover:bg-[#1d1f29]"
            >
              <span>Switch Task</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTaskPickerOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <h1 className="text-base sm:text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
            {activeDeepWork.taskTitle || 'Independent Deep Work'}
          </h1>
        </div>

        {/* Task Picker Dropdown Panel */}
        {isTaskPickerOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-40 p-3 rounded-2xl bg-white dark:bg-[#161720] border border-[#e8e5df] dark:border-[#2a2d3d] shadow-calm-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-[#f4f1eb] dark:border-[#22242f] pb-2">
              <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-amber-500" />
                Select Task to Focus On
              </span>
              <button
                onClick={() => setIsTaskPickerOpen(false)}
                className="text-[#9da0a6] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Incomplete Tasks */}
            <div className="max-h-60 overflow-y-auto space-y-1.5">
              {/* Option 0: Independent Focus */}
              <button
                onClick={handleSelectIndependent}
                className="w-full p-2.5 rounded-xl border border-dashed border-[#e8e5df] dark:border-[#2c303f] hover:border-[#1c1d21] dark:hover:border-white text-left transition-all cursor-pointer flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
                    ✨ Free-form / Independent Study
                  </span>
                  <p className="text-[11px] text-[#787b84] dark:text-[#8d929e]">
                    Focus without linking to a specific syllabus task
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {tasks.filter((t) => !t.completed).map((task) => {
                const course = courses.find((c) => c.id === task.courseId);
                const isSelected = activeDeepWork.taskId === task.id;

                return (
                  <button
                    key={task.id}
                    onClick={() => handleSelectTask(task)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 text-xs ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                        : 'bg-[#faf8f5] dark:bg-[#1a1b24] border-[#e8e5df] dark:border-[#272936] hover:border-[#1c1d21] dark:hover:border-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5">
                        <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
                          {course?.code}
                        </span>
                        <span className="text-[#9da0a6]">• {task.dueDate}</span>
                      </div>
                      <h4 className="font-bold text-[#1c1d21] dark:text-[#f0eff4] truncate">
                        {task.title}
                      </h4>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick create custom task */}
            <form onSubmit={handleCreateCustomTask} className="flex gap-2 pt-2 border-t border-[#f4f1eb] dark:border-[#22242f]">
              <input
                type="text"
                value={customTaskInput}
                onChange={(e) => setCustomTaskInput(e.target.value)}
                placeholder="Or type custom objective..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#e8e5df] dark:border-[#2a2d3d] bg-white dark:bg-[#14151c] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden"
              />
              <Button variant="outline" size="sm" type="submit" className="text-xs px-3">
                Select
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* 2. Signature Focus Hero: Clean Circular Focus Clock */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#13141b] border border-[#e8e5df] dark:border-[#262836] text-center shadow-xs flex flex-col items-center justify-center space-y-6">
        {/* Circular Progress Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 256 256">
            {/* Background Track */}
            <circle
              cx="128"
              cy="128"
              r="108"
              className="text-[#f0ede6] dark:text-[#1e202c]"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active Progress Ring */}
            <circle
              cx="128"
              cy="128"
              r="108"
              className="text-[#1c1d21] dark:text-[#f0eff4] transition-all duration-700 ease-out"
              strokeWidth="8"
              strokeDasharray={678.58}
              strokeDashoffset={678.58 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Centered Clock Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 select-none">
            {/* Mode Indicator Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f1eb] dark:bg-[#1d1f2a] border border-[#e8e5df] dark:border-[#2a2d3b]">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeDeepWork.isRunning
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <span className="text-[10.5px] font-mono font-bold tracking-widest uppercase text-[#1c1d21] dark:text-[#f0eff4]">
                {activeDeepWork.isRunning ? 'FOCUSING' : 'PAUSED'}
              </span>
            </div>

            {/* Time Digits */}
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-[#1c1d21] dark:text-[#f0eff4]">
              {minutes}:{seconds}
            </div>

            <span className="text-xs font-mono text-[#787b84] dark:text-[#8d929e]">
              {currentDurationMinutes}m Focus Block
            </span>
          </div>
        </div>

        {/* Duration Preset Selector Pills */}
        <div className="flex items-center gap-2 bg-[#f4f1eb] dark:bg-[#1c1e27] p-1 rounded-xl border border-[#e8e5df] dark:border-[#292c3a]">
          {[
            { label: '25m Pomodoro', minutes: 25 },
            { label: '50m Deep Work', minutes: 50 },
            { label: '90m Ultradian', minutes: 90 }
          ].map((preset) => {
            const isPreset = currentDurationMinutes === preset.minutes;
            return (
              <button
                key={preset.minutes}
                onClick={() => setDeepWorkDuration(preset.minutes)}
                className={`px-3 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors ${
                  isPreset
                    ? 'bg-white dark:bg-[#252835] text-[#1c1d21] dark:text-[#f0eff4] shadow-xs font-semibold'
                    : 'text-[#64676e] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Primary Tactical Actions: [ Pause / Start ] [ Finish ] [ Reset ] */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {activeDeepWork.isRunning ? (
            <Button
              variant="outline"
              size="lg"
              onClick={pauseDeepWork}
              icon={<Pause className="w-4 h-4" />}
              className="font-bold text-sm px-6 py-2.5"
            >
              PAUSE
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={resumeDeepWork}
              icon={<Play className="w-4 h-4 fill-white dark:fill-[#121316]" />}
              className="font-bold text-sm px-6 py-2.5"
            >
              RESUME
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={handleFinishSession}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            className="font-bold text-sm px-5 py-2.5"
          >
            FINISH
          </Button>

          <button
            onClick={resetDeepWork}
            title="Reset timer"
            className="p-3 rounded-xl border border-[#e8e5df] dark:border-[#262835] text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {sessionCompleted && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Focus session logged! Task milestone marked as completed.</span>
          </div>
        )}
      </div>

      {/* 3. Session Micro-Checklist */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f4f1eb] dark:border-[#1e2029] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#f4f1eb] dark:bg-[#1c1e27] flex items-center justify-center text-[#1c1d21] dark:text-[#f0eff4]">
              <ListTodo className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                Active Session Sub-Milestones
              </h3>
              <p className="text-[11px] text-[#787b84] dark:text-[#8d929e]">
                Break your focus session into small, checkable increments
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-[#787b84] dark:text-[#8d929e]">
            {microChecklist.filter((m) => m.completed).length} / {microChecklist.length} done
          </span>
        </div>

        {/* Checklist rows */}
        <div className="space-y-2">
          {microChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleMicro(item.id)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer text-xs ${
                item.completed
                  ? 'bg-[#fcfbf9] dark:bg-[#16171e] border-[#e8e5df] dark:border-[#242630] text-[#9da0a6] line-through'
                  : 'bg-white dark:bg-[#14151c] border-[#e8e5df] dark:border-[#242630] text-[#1c1d21] dark:text-[#f0eff4] hover:border-[#1c1d21] dark:hover:border-white'
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {}}
                className="w-4 h-4 rounded border-[#d5d0c7] dark:border-[#383b48] accent-[#1c1d21] dark:accent-white pointer-events-none"
              />
              <span className="font-medium flex-1">{item.title}</span>
            </div>
          ))}
        </div>

        {/* Add new subtask input */}
        <form onSubmit={handleAddMicro} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newObjectiveText}
            onChange={(e) => setNewObjectiveText(e.target.value)}
            placeholder="Add sub-objective for this session..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden"
          />
          <Button variant="outline" size="sm" type="submit" className="text-xs px-3">
            Add
          </Button>
        </form>
      </div>

      {/* 4. Ambient Audio & Distraction Catcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ambient Soundscapes */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              <Volume2 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Ambient Soundscapes</span>
            </div>
            <span className="text-[10px] font-mono text-[#787b84] dark:text-[#8d929e]">
              Flow Audio
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'brown-noise', label: 'Brown Noise' },
              { id: 'rain', label: 'Rainfall' },
              { id: 'library', label: 'Library' },
              { id: 'binaural', label: '40Hz Gamma' }
            ].map((sound) => (
              <button
                key={sound.id}
                onClick={() =>
                  setAmbientSound(
                    activeDeepWork.ambientSound === sound.id ? 'off' : (sound.id as any)
                  )
                }
                className={`p-2 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                  activeDeepWork.ambientSound === sound.id
                    ? 'bg-[#1c1d21] text-white dark:bg-white dark:text-[#121316] border-transparent shadow-xs'
                    : 'bg-[#fcfbf9] dark:bg-[#181922] border-[#e8e5df] dark:border-[#262835] text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white'
                }`}
              >
                {sound.label}
              </button>
            ))}
          </div>
        </div>

        {/* Distraction Catcher Scratchpad */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Distraction Catcher</span>
            </div>
            <span className="text-[10px] font-mono text-[#787b84] dark:text-[#8d929e]">
              Jot & Stay Focused
            </span>
          </div>

          <form onSubmit={handleAddScratchpad} className="flex items-center gap-1.5">
            <input
              type="text"
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              placeholder="Dump off-task thought..."
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#e8e5df] dark:border-[#262835] bg-white dark:bg-[#181922] text-xs text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden shadow-2xs"
            />
            <Button variant="outline" size="sm" type="submit" className="text-xs font-semibold px-2 py-1">
              Dump
            </Button>
          </form>

          {scratchpadList.length > 0 && (
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {scratchpadList.slice(0, 2).map((item, idx) => (
                <div
                  key={idx}
                  className="text-[11px] text-[#787b84] dark:text-[#8d929e] truncate flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
