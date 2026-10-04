import React, { useState } from 'react';
import { X, Zap, BookOpen, CheckSquare } from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { CognitiveLoadLevel } from '../../types';
import { Button } from '../common/Button';

export const QuickBlockModal: React.FC = () => {
  const {
    isQuickBlockModalOpen,
    setQuickBlockModal,
    addTask,
    courses
  } = useFocusStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'cs106b');
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoadLevel>('high');
  const [dueDate, setDueDate] = useState('Tomorrow at 11:59 PM');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);

  if (!isQuickBlockModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      courseId,
      cognitiveLoad,
      dueDate,
      estimatedMinutes: Number(estimatedMinutes),
      completed: false
    });

    setTitle('');
    setDescription('');
    setQuickBlockModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-[#14151a] text-[#1c1d21] dark:text-[#f0eff4] rounded-2xl shadow-xl border border-[#e8e5df] dark:border-[#232630] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#f0ede6] dark:border-[#232630] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#1c1d21] dark:text-[#f0eff4]">New Task</h3>
            <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">Add an assignment or study milestone</p>
          </div>
          <button
            onClick={() => setQuickBlockModal(false)}
            className="p-1 rounded-md text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-[#f0eff4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Implement Binary Heap PriorityQueue dequeue logic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 text-xs border border-[#e8e5df] dark:border-[#2a2d39] bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] rounded-lg focus:outline-none focus:border-[#1c1d21] dark:focus:border-[#6366f1]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-[#e8e5df] dark:border-[#2a2d39] rounded-lg bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] cursor-pointer"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                Estimated Time
              </label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-[#e8e5df] dark:border-[#2a2d39] rounded-lg bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] cursor-pointer"
              >
                <option value={25}>25 min (Quick Sprint)</option>
                <option value={50}>50 min (1 Session)</option>
                <option value={90}>90 min (Extended)</option>
                <option value={120}>120 min (Full Lab)</option>
              </select>
            </div>
          </div>

          {/* Effort Level Selector */}
          <div>
            <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
              Effort Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCognitiveLoad('high')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  cognitiveLoad === 'high'
                    ? 'bg-[#1c1d21] dark:bg-[#6366f1] text-white border-[#1c1d21] dark:border-[#6366f1]'
                    : 'bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#d1d5db] border-[#e8e5df] dark:border-[#2a2d39] hover:bg-[#faf8f5] dark:hover:bg-[#20222b]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Deep Focus
              </button>

              <button
                type="button"
                onClick={() => setCognitiveLoad('medium')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  cognitiveLoad === 'medium'
                    ? 'bg-[#1c1d21] dark:bg-[#6366f1] text-white border-[#1c1d21] dark:border-[#6366f1]'
                    : 'bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#d1d5db] border-[#e8e5df] dark:border-[#2a2d39] hover:bg-[#faf8f5] dark:hover:bg-[#20222b]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Core Study
              </button>

              <button
                type="button"
                onClick={() => setCognitiveLoad('admin')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  cognitiveLoad === 'admin'
                    ? 'bg-[#1c1d21] dark:bg-[#6366f1] text-white border-[#1c1d21] dark:border-[#6366f1]'
                    : 'bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#d1d5db] border-[#e8e5df] dark:border-[#2a2d39] hover:bg-[#faf8f5] dark:hover:bg-[#20222b]'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Quick Task
              </button>
            </div>
            <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-1">
              Deep focus tasks are suggested during your morning peak hours.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
              Due Date
            </label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#e8e5df] dark:border-[#2a2d39] bg-white dark:bg-[#181920] text-[#1c1d21] dark:text-[#f0eff4] rounded-lg focus:outline-none focus:border-[#1c1d21] dark:focus:border-[#6366f1]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f0ede6] dark:border-[#232630]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuickBlockModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
