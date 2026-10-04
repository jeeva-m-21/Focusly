import React from 'react';
import { Zap, Moon, Sun, ArrowRight, Brain, Clock, ShieldCheck } from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../common/Button';

import { calculateCircadianAlertness } from '../../algorithms/circadianModel';

export const CompactCircadianGuide: React.FC = () => {
  const { simulatedCircadianTime, setSimulatedCircadianTime, setView, startDeepWork, tasks, courses, user } = useFocusStore();

  const [h, m] = simulatedCircadianTime.split(':').map(Number);
  const hourDecimal = h + (m || 0) / 60;
  const bio = calculateCircadianAlertness(hourDecimal, user?.chronotype || 'afternoon');

  const badgeColor =
    bio.alertnessScore >= 80
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
      : bio.alertnessScore >= 60
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  const presets = [
    { label: '09:00', time: '09:00', name: 'Morning Peak' },
    { label: '12:30', time: '12:30', name: 'Midday Lull' },
    { label: '14:30', time: '14:30', name: 'Afternoon Surge' },
    { label: '20:00', time: '20:00', name: 'Evening Taper' }
  ];

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#f4f1eb] dark:bg-[#1f212a] flex items-center justify-center text-[#1c1d21] dark:text-[#f0eff4]">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              Circadian Bio-Rhythm
            </h3>
            <p className="text-[11px] text-[#787b84] dark:text-[#8d929e]">
              Biological alertness & cognitive readiness
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
          {bio.alertnessScore}% Readiness
        </span>
      </div>

      {/* Current phase readout */}
      <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#181922] border border-[#e8e5df] dark:border-[#262834]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
            {bio.phaseName}
          </span>
          <span className="text-[10px] font-mono text-[#787b84] dark:text-[#8d929e]">
            {bio.phaseId.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <p className="text-[11.5px] text-[#64676e] dark:text-[#9ba0a9] leading-relaxed">
          {bio.recommendation}
        </p>

        {/* Minimalist Energy Progress Meter */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#787b84] dark:text-[#8d929e] font-mono">
            <span>Alertness Score</span>
            <span className="font-bold text-[#1c1d21] dark:text-[#f0eff4]">{bio.alertnessScore} / 100</span>
          </div>
          <div className="h-1.5 w-full bg-[#e8e5df] dark:bg-[#262834] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                bio.alertnessScore >= 80
                  ? 'bg-amber-500'
                  : bio.alertnessScore >= 60
                  ? 'bg-emerald-500'
                  : 'bg-slate-400'
              }`}
              style={{ width: `${bio.alertnessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Preset time chips to explore biorhythm without giant sliders */}
      <div>
        <div className="flex items-center justify-between text-[10.5px] text-[#787b84] dark:text-[#8d929e] mb-1.5">
          <span>Test Day Hours</span>
          <span className="font-mono text-[#1c1d21] dark:text-[#f0eff4]">Selected: {simulatedCircadianTime}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {presets.map((preset) => {
            const isSelected = simulatedCircadianTime.startsWith(preset.time.split(':')[0]);
            return (
              <button
                key={preset.time}
                onClick={() => setSimulatedCircadianTime(preset.time)}
                className={`py-1 px-1.5 rounded-lg text-[10.5px] font-mono text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c1d21] text-white dark:bg-white dark:text-[#1c1d21] font-bold shadow-2xs'
                    : 'bg-[#f4f1eb] dark:bg-[#1a1b23] text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-[#f0eff4]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const topTask = tasks.find(t => !t.completed);
          if (topTask) {
            const courseCode = topTask.courseId ? (courses.find(c => c.id === topTask.courseId)?.code || 'CSE2005') : 'CSE2005';
            startDeepWork(topTask.id, topTask.title, courseCode, bio.recommendedDurationMinutes);
          } else {
            startDeepWork('t-1', 'Circadian Peak Deep Work', 'CSE2005', bio.recommendedDurationMinutes);
          }
          setView('focus-timer');
        }}
        icon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
        className="w-full text-xs font-semibold justify-center py-1.5"
      >
        Start {bio.recommendedDurationMinutes}m Focus Block
      </Button>
    </div>
  );
};
