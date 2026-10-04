import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Sun,
  Moon,
  Zap,
  Activity,
  Brain,
  Coffee,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../common/Card';
import { useFocusStore } from '../../store/useFocusStore';

export const CircadianEnergySimulator: React.FC = () => {
  const { simulatedCircadianTime, setSimulatedCircadianTime, setView, startDeepWork } = useFocusStore();
  const pathRef = useRef<SVGPathElement | null>(null);

  // Convert "HH:MM" (between 08:00 and 23:00) to percentage 0 - 100
  const parseTimeToPercent = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = h * 60 + m;
    const startMinutes = 8 * 60; // 08:00 AM
    const endMinutes = 23 * 60;  // 11:00 PM
    const clamped = Math.max(startMinutes, Math.min(endMinutes, totalMinutes));
    return ((clamped - startMinutes) / (endMinutes - startMinutes)) * 100;
  };

  const currentPercent = parseTimeToPercent(simulatedCircadianTime);

  // Compute physiological state and telemetry
  const getBioTelemetry = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const decimal = h + m / 60;

    if (decimal >= 8.0 && decimal < 11.75) {
      return {
        phaseId: 'morning',
        phase: 'Peak Focus Window',
        score: 94,
        status: 'Optimal Deep Work',
        cortisol: 'Peak (0.88)',
        adenosine: 'Minimal (0.12)',
        recommendedDuration: '50-90 min session',
        targetActivities: 'Dynamic memory management, algorithm design, Valgrind debugging, linear algebra proofs',
        tagColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        waveColor: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.25)',
        badgeDot: 'bg-amber-500',
        phaseLabel: '08:30 – 11:45 Peak'
      };
    } else if (decimal >= 11.75 && decimal < 13.5) {
      return {
        phaseId: 'lull',
        phase: 'Post-Prandial Midday Lull',
        score: 52,
        status: 'Recovery & Transit',
        cortisol: 'Moderate (0.42)',
        adenosine: 'Transient Spike (0.58)',
        recommendedDuration: '15-25 min light sprint',
        targetActivities: 'Stanford campus walk, healthy lunch, lecture slide skimming, administrative email',
        tagColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        waveColor: '#64748b',
        glowColor: 'rgba(100, 116, 139, 0.2)',
        badgeDot: 'bg-slate-400',
        phaseLabel: '11:45 – 13:30 Lull'
      };
    } else if (decimal >= 13.5 && decimal < 17.5) {
      return {
        phaseId: 'afternoon',
        phase: 'Afternoon Analytical Surge',
        score: 84,
        status: 'High Analytical Stamina',
        cortisol: 'Secondary Elevation (0.68)',
        adenosine: 'Controlled (0.34)',
        recommendedDuration: '50 min session',
        targetActivities: 'Physics lab problem solving, Math 51 P-Sets, TA office hours debugging',
        tagColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        waveColor: '#6366f1',
        glowColor: 'rgba(99, 102, 241, 0.25)',
        badgeDot: 'bg-indigo-500',
        phaseLabel: '13:30 – 17:30 Surge'
      };
    } else {
      return {
        phaseId: 'evening',
        phase: 'Twilight Melatonin Onset',
        score: 42,
        status: 'Memory Consolidation',
        cortisol: 'Tapering (0.18)',
        adenosine: 'Accumulated (0.85)',
        recommendedDuration: '20-30 min wind-down',
        targetActivities: 'Anki flashcards spaced review, syllabus checklist review, sleep hygiene prep',
        tagColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        waveColor: '#a855f7',
        glowColor: 'rgba(168, 85, 247, 0.25)',
        badgeDot: 'bg-purple-500',
        phaseLabel: '18:00 – 23:00 Taper'
      };
    }
  };

  const bio = getBioTelemetry(simulatedCircadianTime);

  // SVG Wave definition across [0, 700] on X, [0, 140] on Y
  const svgPath = useMemo(() => {
    return 'M 0 75 ' +
      'C 30 25, 45 25, 70 25 ' +
      'C 95 25, 115 30, 140 30 ' +
      'C 175 30, 185 100, 210 100 ' +
      'C 230 100, 240 88, 260 88 ' +
      'C 290 88, 315 45, 350 45 ' +
      'C 390 45, 415 60, 440 60 ' +
      'C 475 60, 495 95, 530 95 ' +
      'C 570 95, 585 115, 620 115 ' +
      'C 660 115, 680 125, 700 125';
  }, []);

  const svgAreaPath = useMemo(() => `${svgPath} L 700 140 L 0 140 Z`, [svgPath]);

  // Exact point on curve calculation via SVG path sampling
  const [cursorPos, setCursorPos] = useState({ x: 350, y: 45 });

  useEffect(() => {
    if (pathRef.current) {
      try {
        const totalLen = pathRef.current.getTotalLength();
        const fraction = Math.max(0, Math.min(1, currentPercent / 100));
        const pt = pathRef.current.getPointAtLength(fraction * totalLen);
        setCursorPos({ x: pt.x, y: pt.y });
      } catch (e) {
        // Fallback calculation
        setCursorPos({ x: (currentPercent / 100) * 700, y: 60 });
      }
    }
  }, [currentPercent]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const startMinutes = 8 * 60;
    const endMinutes = 23 * 60;
    const currentTotalMins = Math.round(startMinutes + (val / 100) * (endMinutes - startMinutes));
    const h = Math.floor(currentTotalMins / 60).toString().padStart(2, '0');
    const m = (currentTotalMins % 60).toString().padStart(2, '0');
    setSimulatedCircadianTime(`${h}:${m}`);
  };

  const jumpToPreset = (timeStr: string) => {
    setSimulatedCircadianTime(timeStr);
  };

  const phases = [
    { id: 'morning', label: '08:30 – 11:45 Peak', time: '09:30', dot: 'bg-amber-500' },
    { id: 'lull', label: '11:45 – 13:30 Lull', time: '12:30', dot: 'bg-slate-400' },
    { id: 'afternoon', label: '13:30 – 17:30 Surge', time: '15:15', dot: 'bg-indigo-500' },
    { id: 'evening', label: '18:00 – 23:00 Taper', time: '20:30', dot: 'bg-purple-500' }
  ];

  return (
    <Card className="p-6 bg-white dark:bg-[#14151a] border border-[#e8e5df] dark:border-[#232630] shadow-xs relative overflow-hidden">
      {/* Soft bio-glow indicator */}
      <div
        className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: bio.waveColor }}
      />

      {/* Header with Live Bio-Score and Phase Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#f0ede6] dark:border-[#232630]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#faf8f5] dark:bg-[#1c1e26] border border-[#e8e5df] dark:border-[#2a2d39] flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-[#1c1d21] dark:text-[#f0eff4]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
                Circadian Bio-Rhythm Guide
              </h2>
              <span className={`text-[10.5px] font-mono px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 transition-colors ${bio.tagColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${bio.badgeDot}`} />
                <span>{bio.phase}</span>
              </span>
            </div>
            <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
              Diurnal biological alertness synchronized to your Stanford course schedule.
            </p>
          </div>
        </div>

        {/* Live Score Dial */}
        <div className="flex items-center gap-4 bg-[#f8f6f2] dark:bg-[#181920] px-3.5 py-2 rounded-xl border border-[#e8e5df] dark:border-[#252834] shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#787b84] dark:text-[#8d929e] block">
              Readiness
            </span>
            <span className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] block">
              {bio.status}
            </span>
          </div>

          <div className="flex items-baseline gap-0.5 font-mono">
            <motion.span
              key={bio.score}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black text-[#1c1d21] dark:text-[#f0eff4]"
              style={{ color: bio.waveColor }}
            >
              {bio.score}
            </motion.span>
            <span className="text-xs font-semibold text-[#787b84] dark:text-[#8d929e]">/100</span>
          </div>
        </div>
      </div>

      {/* Phase Selection Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 mb-3">
        {phases.map((p) => {
          const isActive = bio.phaseId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => jumpToPreset(p.time)}
              className={`py-1.5 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                isActive
                  ? 'bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] border-[#1c1d21] dark:border-white shadow-xs'
                  : 'bg-[#faf8f5] dark:bg-[#181920] text-[#64676e] dark:text-[#8d929e] border-[#e8e5df] dark:border-[#262834] hover:border-[#1c1d21] dark:hover:border-white'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400 dark:bg-amber-500' : p.dot}`} />
                <span className="truncate text-[11px]">{p.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Chronobiology Graph */}
      <div className="relative h-36 w-full rounded-2xl bg-[#faf8f5]/80 dark:bg-[#0e0f13]/80 border border-[#e8e5df] dark:border-[#232630] overflow-hidden p-2">
        {/* Subtle horizontal grid guide */}
        <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-25">
          <div className="border-b border-[#1c1d21] dark:border-white w-full border-dashed" />
          <div className="border-b border-[#1c1d21] dark:border-white w-full border-dashed" />
          <div className="border-b border-[#1c1d21] dark:border-white w-full border-dashed" />
        </div>

        <svg
          viewBox="0 0 700 140"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="circadianGradAreaLive" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={bio.waveColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={bio.waveColor} stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="waveStrokeGradLive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="28%" stopColor="#f59e0b" />
              <stop offset="38%" stopColor="#64748b" />
              <stop offset="55%" stopColor="#6366f1" />
              <stop offset="78%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <filter id="waveGlowLive" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Filled Under-Curve Area */}
          <path
            d={svgAreaPath}
            fill="url(#circadianGradAreaLive)"
            className="transition-colors duration-500"
          />

          {/* Master Path Reference for exact mathematical point sampling */}
          <path
            ref={pathRef}
            d={svgPath}
            fill="none"
            stroke="url(#waveStrokeGradLive)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#waveGlowLive)"
          />

          {/* Animated energy pulses flowing along the wave */}
          <path
            d={svgPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeDasharray="8 64"
            opacity="0.6"
            className="animate-pulse"
          />

          {/* Vertical Tracking Line */}
          <line
            x1={cursorPos.x}
            y1={10}
            x2={cursorPos.x}
            y2={135}
            stroke={bio.waveColor}
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.8"
          />

          {/* Exact Cursor Dot Riding the Curve */}
          <circle
            cx={cursorPos.x}
            cy={cursorPos.y}
            r="5"
            fill={bio.waveColor}
            stroke="#ffffff"
            strokeWidth="2"
            className="transition-all duration-75"
          />

          {/* Subtle Outer Radar Ring */}
          <circle
            cx={cursorPos.x}
            cy={cursorPos.y}
            r="10"
            fill="none"
            stroke={bio.waveColor}
            strokeWidth="1.2"
            opacity="0.5"
          />
        </svg>

        {/* Floating Time Pill Following Cursor */}
        <div
          className="absolute top-2 pointer-events-none transition-all duration-75 -translate-x-1/2 z-10"
          style={{ left: `${Math.max(8, Math.min(92, currentPercent))}%` }}
        >
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] text-[10px] font-mono font-bold shadow-md">
            <Clock className="w-2.5 h-2.5" />
            <span>{simulatedCircadianTime}</span>
          </div>
        </div>
      </div>

      {/* Tactile Dedicated Scrubber Bar */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#787b84] dark:text-[#8d929e]">
          <span className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            08:00 AM
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#9da0a6] dark:text-[#676b76] flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Drag Timeline Slider
          </span>
          <span className="flex items-center gap-1">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            11:00 PM
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={currentPercent}
          onChange={handleSliderChange}
          aria-label="Circadian time scrub slider"
          className="w-full h-1.5 bg-[#e8e5df] dark:bg-[#232630] rounded-lg appearance-none cursor-pointer accent-[#1c1d21] dark:accent-white"
        />
      </div>

      {/* Physiological Telemetry & Task Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4 pt-4 border-t border-[#f0ede6] dark:border-[#232630]">
        {/* Card 1: Biological Markers */}
        <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#181920] border border-[#e8e5df] dark:border-[#252834]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#787b84] dark:text-[#8d929e] block mb-1">
            Biomarker Profile
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#64676e] dark:text-[#9ba0a9]">Cortisol:</span>
              <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4] font-mono">{bio.cortisol}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64676e] dark:text-[#9ba0a9]">Adenosine:</span>
              <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4] font-mono">{bio.adenosine}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64676e] dark:text-[#9ba0a9]">Session Window:</span>
              <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">{bio.recommendedDuration}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Recommended Cognitive Work */}
        <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#181920] border border-[#e8e5df] dark:border-[#252834] md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
                Target Cognitive Activity
              </span>
              <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Synchronized
              </span>
            </div>
            <p className="text-xs text-[#1c1d21] dark:text-[#f0eff4] font-medium leading-relaxed">
              {bio.targetActivities}
            </p>
          </div>

          {/* Quick Action */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e8e5df] dark:border-[#2a2d39]">
            <span className="text-[10.5px] font-mono text-[#787b84] dark:text-[#8d929e]">
              Current Time: <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">{simulatedCircadianTime}</span>
            </span>

            <button
              onClick={() => {
                startDeepWork('sb-1', 'Peak Circadian Deep Work Session', 'CS 106B');
                setView('focus-timer');
              }}
              className="text-xs font-semibold text-[#1c1d21] dark:text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Launch Focus Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
