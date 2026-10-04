import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertCircle,
  X,
  Wrench,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../common/Button';

export const AutograderModal: React.FC = () => {
  const {
    isAutograderModalOpen,
    closeAutograder,
    selectedAutograderTaskId,
    tasks,
    fixValgrindLeak
  } = useFocusStore();

  const [activeTab, setActiveTab] = useState<'console' | 'source'>('console');
  const [isRunning, setIsRunning] = useState(false);
  const [fixedState, setFixedState] = useState(false);

  if (!isAutograderModalOpen || !selectedAutograderTaskId) return null;

  const task = tasks.find((t) => t.id === selectedAutograderTaskId);
  if (!task || !task.autograder) return null;

  const hasLeak = task.autograder.valgrindLeaks > 0 && !fixedState;

  const handleRunSuite = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (!hasLeak) {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 1200);
  };

  const handleApplyFix = () => {
    fixValgrindLeak(task.id);
    setFixedState(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#10b981', '#6366f1', '#f59e0b']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#14151a] text-[#1c1d21] dark:text-[#f0eff4] rounded-2xl shadow-xl border border-[#e8e5df] dark:border-[#232630] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#f8f6f2] dark:bg-[#181920] border-b border-[#e8e5df] dark:border-[#232630] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#64676e] dark:text-[#9ba0a9]" />
            <span className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
              Test Diagnostics • {task.title.split(':')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white dark:bg-[#1c1e26] p-0.5 rounded-lg border border-[#e8e5df] dark:border-[#2a2d39] text-xs">
              <button
                onClick={() => setActiveTab('console')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  activeTab === 'console'
                    ? 'bg-[#1c1d21] dark:bg-[#6366f1] text-white'
                    : 'text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-[#f0eff4]'
                }`}
              >
                Test Output
              </button>
              <button
                onClick={() => setActiveTab('source')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  activeTab === 'source'
                    ? 'bg-[#1c1d21] dark:bg-[#6366f1] text-white'
                    : 'text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-[#f0eff4]'
                }`}
              >
                Code Preview
              </button>
            </div>

            <button
              onClick={closeAutograder}
              className="p-1 rounded-md text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-[#f0eff4] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status KPI Banner */}
        <div className="px-5 py-3 bg-white dark:bg-[#14151a] border-b border-[#f0ede6] dark:border-[#232630] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#64676e] dark:text-[#9ba0a9]">Test Score:</span>
              <span className={`font-mono font-semibold ${hasLeak ? 'text-[#b45309] dark:text-[#fbbf24]' : 'text-[#15803d] dark:text-[#4ade80]'}`}>
                {hasLeak ? `${task.autograder.testsPassing} / ${task.autograder.testsTotal} (90%)` : '20 / 20 (100% Pass)'}
              </span>
            </div>

            <div className="h-3 w-px bg-[#e8e5df] dark:bg-[#232630]" />

            <div className="flex items-center gap-1.5">
              <span className="text-[#64676e] dark:text-[#9ba0a9]">Memory Status:</span>
              <span className={`font-mono font-semibold ${hasLeak ? 'text-[#be123c] dark:text-[#f43f5e]' : 'text-[#15803d] dark:text-[#4ade80]'}`}>
                {hasLeak ? '1 Unreleased Buffer' : '0 Leaks (Clean)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasLeak ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyFix}
                className="text-xs font-medium"
                icon={<Wrench className="w-3.5 h-3.5" />}
              >
                Apply Fix
              </Button>
            ) : (
              <span className="text-xs font-mono text-[#15803d] dark:text-[#4ade80] font-semibold flex items-center gap-1 bg-[#f0fdf4] dark:bg-[#052e16]/30 px-2 py-1 rounded border border-[#bbf7d0] dark:border-[#166534]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Clean Pass
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleRunSuite}
              disabled={isRunning}
              className="text-xs font-mono"
              icon={<RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />}
            >
              {isRunning ? 'Running...' : 'Rerun'}
            </Button>
          </div>
        </div>

        {/* Tab 1: Terminal Console Logs */}
        {activeTab === 'console' && (
          <div className="p-5 font-mono text-xs overflow-y-auto space-y-2.5 leading-relaxed bg-[#fcfbf9] dark:bg-[#0e0f13] text-[#2c2d33] dark:text-[#d1d5db]">
            <div className="text-[#787b84] dark:text-[#8d929e] text-[11.5px]">
              $ g++ -Wall -Werror -std=c++20 PriorityQueue.cpp autograder_test.cpp -o suite_bin
              <br />
              $ valgrind --leak-check=full ./suite_bin
            </div>

            <div className="space-y-1 text-[11.5px]">
              <div className="text-[#15803d] dark:text-[#4ade80]">✓ [TEST 01] test_priority_queue_empty_init ... PASS</div>
              <div className="text-[#15803d] dark:text-[#4ade80]">✓ [TEST 02] test_enqueue_single_element ... PASS</div>
              <div className="text-[#15803d] dark:text-[#4ade80]">✓ [TEST 03] test_min_heap_invariant_sift_up ... PASS</div>
              <div className="text-[#15803d] dark:text-[#4ade80]">✓ [TEST 04] test_dequeue_root_minimum ... PASS</div>
              <div className="text-[#15803d] dark:text-[#4ade80]">✓ [TEST 05] test_sift_down_two_children ... PASS</div>
              <div className="text-[#15803d] dark:text-[#4ade80]">... [TESTS 06 through 18] all PASS</div>

              {hasLeak ? (
                <div className="mt-3 p-3 rounded-xl bg-[#fff1f2] dark:bg-[#3b0d14]/40 border border-[#fecdd3] dark:border-[#881337] text-[#be123c] dark:text-[#fda4af] space-y-1.5 font-sans">
                  <div className="flex items-center gap-1.5 font-semibold text-[#be123c] dark:text-[#fda4af] text-xs">
                    <AlertCircle className="w-4 h-4 text-[#be123c] dark:text-[#fda4af]" />
                    <span>Test 19 Failed: Unreleased Heap Buffer in resize()</span>
                  </div>
                  <pre className="text-[11px] font-mono text-[#9f1239] dark:text-[#fecdd3] whitespace-pre-wrap">
                    {task.autograder.leakStacktrace}
                  </pre>
                  <p className="text-xs text-[#be123c] dark:text-[#fda4af] pt-1 border-t border-[#fecdd3]/60 dark:border-[#881337]/60">
                    Fix: In `PriorityQueue::resize()`, delete old array buffer before assigning the new pointer.
                  </p>
                </div>
              ) : (
                <div className="mt-3 p-3 rounded-xl bg-[#f0fdf4] dark:bg-[#052e16]/30 border border-[#bbf7d0] dark:border-[#166534] text-[#15803d] dark:text-[#4ade80] space-y-1 font-sans">
                  <div className="flex items-center gap-1.5 font-semibold text-[#15803d] dark:text-[#4ade80] text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#15803d] dark:text-[#4ade80]" />
                    <span>All 20 Tests Passed</span>
                  </div>
                  <p className="text-xs text-[#15803d] dark:text-[#4ade80] font-mono mt-0.5">
                    All heap blocks were freed -- zero leaks detected.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Source Preview */}
        {activeTab === 'source' && (
          <div className="p-5 font-mono text-xs overflow-y-auto leading-relaxed bg-[#f8f6f2] dark:bg-[#0e0f13] text-[#1c1d21] dark:text-[#f0eff4]">
            <div className="text-[#787b84] dark:text-[#8d929e] mb-2">// PriorityQueue.cpp (resize excerpt)</div>
            <pre className="text-[#2c2d33] dark:text-[#d1d5db]">
{`138: void PriorityQueue::resize() {
139:     int newCapacity = capacity * 2;
140:     Element* newElements = new Element[newCapacity];
141:     for (int i = 1; i <= size; i++) {
142:         newElements[i] = elements[i];
143:     }`}
            </pre>

            {hasLeak ? (
              <div className="my-1.5 p-2 bg-[#fff1f2] dark:bg-[#3b0d14]/40 border-l-4 border-rose-500 text-[#be123c] dark:text-[#fda4af]">
                144:     // Issue: Missing `delete[] elements;` leaves previous array allocated!
                <br />
                145:     elements = newElements;
                <br />
                146:     capacity = newCapacity;
              </div>
            ) : (
              <div className="my-1.5 p-2 bg-[#f0fdf4] dark:bg-[#052e16]/30 border-l-4 border-emerald-500 text-[#15803d] dark:text-[#4ade80]">
                144:     delete[] elements; // Cleanly freed previous heap allocation
                <br />
                145:     elements = newElements;
                <br />
                146:     capacity = newCapacity;
              </div>
            )}

            <pre className="text-[#2c2d33] dark:text-[#d1d5db]">
{`147: }`}
            </pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#f8f6f2] dark:bg-[#181920] border-t border-[#e8e5df] dark:border-[#232630] flex items-center justify-between text-xs text-[#64676e] dark:text-[#9ba0a9]">
          <span>VTOP Lab Autograder Diagnostic</span>
          <Button variant="outline" size="sm" onClick={closeAutograder}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
