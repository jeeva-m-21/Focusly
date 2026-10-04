import React, { useState } from 'react';
import {
  Plus,
  Flame,
  Clock,
  Terminal,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Check,
  Search,
  Layers
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../../components/common/Button';
import { Badge, CognitiveLoadBadge } from '../../components/common/Badge';
import { Task, KanbanColumn } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    courses,
    toggleTask,
    deleteTask,
    moveTaskStatus,
    toggleSubtask,
    startDeepWork,
    setView,
    setQuickBlockModal,
    openAutograder
  } = useFocusStore();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns: Array<{ id: KanbanColumn; title: string; subtitle: string; color: string }> = [
    { id: 'backlog', title: 'BACKLOG', subtitle: 'Queued readings & labs', color: 'border-t-stone-400' },
    { id: 'this_week', title: 'THIS WEEK', subtitle: 'Target assignments', color: 'border-t-blue-500' },
    { id: 'today', title: 'TODAY', subtitle: 'Immediate active focus', color: 'border-t-amber-500' },
    { id: 'done', title: 'DONE', subtitle: 'Completed & verified', color: 'border-t-emerald-500' }
  ];

  // Filter tasks by course and search query
  const filteredTasks = tasks.filter((t) => {
    const matchesCourse = selectedCourseFilter === 'all' || t.courseId === selectedCourseFilter;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesSearch;
  });

  const getNextColumn = (current: KanbanColumn): KanbanColumn | null => {
    if (current === 'backlog') return 'this_week';
    if (current === 'this_week') return 'today';
    if (current === 'today') return 'done';
    return null;
  };

  const getPrevColumn = (current: KanbanColumn): KanbanColumn | null => {
    if (current === 'done') return 'today';
    if (current === 'today') return 'this_week';
    if (current === 'this_week') return 'backlog';
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5df] dark:border-[#22242f] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9da0a6] dark:text-[#676b76] font-semibold">
            ACADEMIC KANBAN PLANNING BOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight mt-0.5">
            Task & Assignment Board
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-1">
            Drag problem sets and readings between workflow stages. Prioritize high-effort tasks for peak hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9da0a6] dark:text-[#676b76]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#e8e5df] dark:border-[#262835] bg-white dark:bg-[#14151c] text-xs text-[#1c1d21] dark:text-[#f0eff4] focus:outline-none focus:border-[#1c1d21] dark:focus:border-white shadow-2xs w-36 sm:w-48"
            />
          </div>

          {/* Course filter selector */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#e8e5df] dark:border-[#262835] bg-white dark:bg-[#14151c] text-xs text-[#1c1d21] dark:text-[#f0eff4] focus:outline-none focus:border-[#1c1d21] dark:focus:border-white shadow-2xs cursor-pointer"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuickBlockModal(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-semibold shadow-xs"
          >
            + Add Task
          </Button>
        </div>
      </div>

      {/* 4-Column Academic Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((t) => {
            const taskCol = t.status || (t.completed ? 'done' : 'this_week');
            return taskCol === column.id;
          });

          return (
            <div
              key={column.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedTaskId) {
                  moveTaskStatus(draggedTaskId, column.id);
                  setDraggedTaskId(null);
                }
              }}
              className={`rounded-2xl border border-[#e8e5df] dark:border-[#22242f] bg-[#fbf9f5] dark:bg-[#121319] p-3.5 space-y-3 min-h-[580px] flex flex-col border-t-4 ${column.color} shadow-xs transition-colors`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1d21] dark:text-[#f0eff4]">
                      {column.title}
                    </h3>
                    <span className="w-5 h-5 rounded-full bg-[#eeece6] dark:bg-[#1f212a] text-[#1c1d21] dark:text-[#f0eff4] text-[10px] font-mono font-bold flex items-center justify-center">
                      {columnTasks.length}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#787b84] dark:text-[#8d929e] mt-0.5">
                    {column.subtitle}
                  </p>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1">
                {columnTasks.map((task) => {
                  const course = courses.find((c) => c.id === task.courseId);
                  const progress = task.progressPercent || 0;
                  const currentStatus = task.status || (task.completed ? 'done' : 'this_week');
                  const nextCol = getNextColumn(currentStatus);
                  const prevCol = getPrevColumn(currentStatus);

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDraggedTaskId(task.id)}
                      className="p-3.5 rounded-xl border border-[#e8e5df] dark:border-[#22242f] bg-white dark:bg-[#161720] hover:border-[#1c1d21] dark:hover:border-[#3d4050] transition-all shadow-2xs group cursor-grab active:cursor-grabbing space-y-2.5"
                    >
                      {/* Top Row: Course Badge + Priority + Duration */}
                      <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                        <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4] bg-[#f4f1eb] dark:bg-[#20222a] px-1.5 py-0.2 rounded border border-[#e8e5df] dark:border-[#282b36]">
                          {course?.code || 'GEN'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[#787b84] dark:text-[#8d929e] flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedMinutes}m</span>
                          </span>
                          <CognitiveLoadBadge load={task.cognitiveLoad} />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4
                          className={`text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] leading-snug ${
                            task.completed ? 'line-through text-[#9da0a6] dark:text-[#676b76]' : ''
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Due Date & Autograder Status */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-[#787b84] dark:text-[#8d929e] font-mono">
                          {task.dueDate}
                        </span>

                        {task.autograder && (
                          <button
                            onClick={() => openAutograder(task.id)}
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border flex items-center gap-1 cursor-pointer ${
                              task.autograder.valgrindLeaks > 0
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 font-semibold'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
                            }`}
                          >
                            <Terminal className="w-3 h-3" />
                            <span>
                              {task.autograder.testsPassing}/{task.autograder.testsTotal}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Subtasks Progress */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="space-y-1.5 pt-1.5 border-t border-[#f4f1eb] dark:border-[#1e2029]">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#787b84] dark:text-[#8d929e]">
                            <span>Subtasks</span>
                            <span>
                              {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length} ({progress}%)
                            </span>
                          </div>

                          <div className="h-1 bg-[#f4f1eb] dark:bg-[#1f212a] rounded-full overflow-hidden">
                            <div
                              style={{ width: `${progress}%` }}
                              className={`h-full rounded-full transition-all duration-300 ${
                                progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                          </div>

                          {/* Interactive subtasks list toggle */}
                          <div className="space-y-1 pt-1">
                            {task.subtasks.slice(0, 2).map((st) => (
                              <label
                                key={st.id}
                                className="flex items-center gap-1.5 text-[11px] text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={st.completed}
                                  onChange={() => toggleSubtask(task.id, st.id)}
                                  className="w-3 h-3 rounded accent-[#1c1d21] dark:accent-white cursor-pointer"
                                />
                                <span className={st.completed ? 'line-through text-[#9da0a6]' : 'truncate'}>
                                  {st.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Controls: Shift Column Arrows + Focus Session Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#f4f1eb] dark:border-[#1e2029]">
                        <div className="flex items-center gap-1">
                          {prevCol && (
                            <button
                              onClick={() => moveTaskStatus(task.id, prevCol)}
                              title={`Move to ${prevCol}`}
                              className="p-1 rounded text-[#787b84] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#f4f1eb] dark:hover:bg-[#20222a] transition-colors cursor-pointer"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {nextCol && (
                            <button
                              onClick={() => moveTaskStatus(task.id, nextCol)}
                              title={`Move to ${nextCol}`}
                              className="p-1 rounded text-[#787b84] hover:text-[#1c1d21] dark:hover:text-white hover:bg-[#f4f1eb] dark:hover:bg-[#20222a] transition-colors cursor-pointer"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!task.completed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                startDeepWork(task.id, task.title, course?.code);
                                setView('focus-timer');
                              }}
                              icon={<Flame className="w-3 h-3 text-amber-500" />}
                              className="text-[11px] font-semibold py-0.5 px-2"
                            >
                              Focus
                            </Button>
                          )}

                          <button
                            onClick={() => deleteTask(task.id)}
                            title="Delete task"
                            className="p-1 text-[#9da0a6] hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-[#e8e5df] dark:border-[#22242f] rounded-xl flex flex-col items-center justify-center text-xs text-[#9da0a6] dark:text-[#676b76] p-4 text-center">
                    <span>No tasks in {column.title.toLowerCase()}</span>
                    <span className="text-[10px] text-[#b5b1a9] dark:text-[#4d5162] mt-0.5">
                      Drop cards here
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
