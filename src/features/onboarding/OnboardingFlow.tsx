import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  Sun,
  Sunrise,
  Moon,
  Sparkles,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  Sliders,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Chronotype } from '../../types';
import { calculateCircadianAlertness } from '../../algorithms/circadianModel';
import { FocuslySymbol } from '../../components/brand/FocuslyLogo';

export const OnboardingFlow: React.FC = () => {
  const {
    user,
    updateUser,
    courses,
    setView,
    onboardingStep,
    setOnboardingStep,
    buildAiStudyPlan,
    theme,
    toggleTheme
  } = useFocusStore();

  const [name, setName] = useState(user.name);
  const [degree, setDegree] = useState(user.degree);
  const [targetUnits, setTargetUnits] = useState(user.targetUnits);
  const [selectedChronotype, setSelectedChronotype] = useState<Chronotype>(user.chronotype || 'afternoon');
  const [peakStart, setPeakStart] = useState(user.circadianPeak?.start || '13:00');
  const [peakEnd, setPeakEnd] = useState(user.circadianPeak?.end || '16:30');
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(user.weeklyDeepWorkTargetHours || 24);
  const [absenceBuffer, setAbsenceBuffer] = useState(2);
  const [panoptoAutoCheck, setPanoptoAutoCheck] = useState(true);
  const [autoScheduleInitialPlan, setAutoScheduleInitialPlan] = useState(true);

  // Compute live circadian peak indicator
  const peakTelemetry = calculateCircadianAlertness(
    parseInt(peakStart.split(':')[0], 10) || 10,
    selectedChronotype
  );

  const handleNext = () => {
    if (onboardingStep < 4) {
      setOnboardingStep((onboardingStep + 1) as 1 | 2 | 3 | 4);
    } else {
      updateUser({
        name,
        degree,
        targetUnits,
        chronotype: selectedChronotype,
        circadianPeak: { start: peakStart, end: peakEnd },
        weeklyDeepWorkTargetHours: weeklyTargetHours,
        onboardingCompleted: true
      });

      if (autoScheduleInitialPlan) {
        buildAiStudyPlan();
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setView('overview');
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep((onboardingStep - 1) as 1 | 2 | 3 | 4);
    }
  };

  const stepTitles = [
    { title: 'Academic Profile & Load', subtitle: 'Target course load and Stanford Axess sync' },
    { title: 'Circadian Peak Calibration', subtitle: 'Algorithmic alignment with your biological focus window' },
    { title: 'Attendance Guardrails', subtitle: 'Course absence limits, Canvas sync & safety buffers' },
    { title: 'Workspace Launch', subtitle: 'Personalized study schedule and algorithmic solver ready' }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0c0d10] text-[#1c1d21] dark:text-[#f0eff4] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200">
      {/* Top Header */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between py-3 border-b border-[#E7E5DF] dark:border-[#2A2D36]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#18181A] border border-[#E7E5DF] dark:border-[#2A2D36] flex items-center justify-center shadow-2xs">
            <FocuslySymbol size={22} variant="accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#18181A] dark:text-[#F3F4F6]">
                Focus<span className="text-[#F59E0B]">ly</span>
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-[#F59E0B] px-2 py-0.5 rounded border border-[#F59E0B]/30">
                Setup Wizard
              </span>
            </div>
            <p className="text-[11px] text-[#686A70] dark:text-[#A0A3AB] leading-none mt-0.5">
              Personalizing your academic workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to warm light mode' : 'Switch to clean dark mode'}
            className="p-1.5 rounded-lg text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white bg-white dark:bg-[#16171d] border border-[#e8e5df] dark:border-[#242630] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#64676e]" />
            )}
          </button>

          <button
            onClick={() => setView('auth-login')}
            className="flex items-center gap-1 text-xs text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white font-medium transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-[#f4f1eb] dark:hover:bg-[#181a24]"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="max-w-xl mx-auto w-full my-auto py-6">
        {/* 4-Segment Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-[#64676e] dark:text-[#9ba0a9] mb-2 font-medium">
            <span>
              Step {onboardingStep} of 4:{' '}
              <strong className="text-[#1c1d21] dark:text-[#f0eff4]">
                {stepTitles[onboardingStep - 1].title}
              </strong>
            </span>
            <span className="font-mono text-xs font-semibold text-[#1c1d21] dark:text-white">
              {onboardingStep * 25}%
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step <= onboardingStep
                    ? 'bg-[#1c1d21] dark:bg-white'
                    : 'bg-[#e8e5df] dark:bg-[#20222c]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Card */}
        <Card className="p-6 sm:p-7 bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-sm rounded-2xl">
          {/* STEP 1: Academic Profile & Goals */}
          {onboardingStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                  Degree Program & Course Load
                </h2>
                <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                  Confirm your major and target unit load to compute your 2:1 study equilibrium.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                      Preferred Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] rounded-xl focus:outline-none focus:border-[#1c1d21] dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                      Degree Program & Year
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] rounded-xl focus:outline-none focus:border-[#1c1d21] dark:focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">
                      Target Unit Load
                    </label>
                    <span className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] font-mono">
                      {targetUnits} Units ({targetUnits * 2} hrs study expectation)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="22"
                    value={targetUnits}
                    onChange={(e) => setTargetUnits(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e8e5df] dark:bg-[#20222d] rounded-lg appearance-none cursor-pointer accent-[#1c1d21] dark:accent-white"
                  />
                  <div className="flex justify-between text-[11px] text-[#9da0a6] dark:text-[#676b76] mt-1 font-mono">
                    <span>12 Min</span>
                    <span>15–18 Standard</span>
                    <span>22 Maximum</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">
                      Imported Courses (Stanford Axess Sync)
                    </label>
                    <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400">
                      ✓ 4 courses synchronized
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-2.5 rounded-xl border border-[#e8e5df] dark:border-[#262838] bg-[#f8f6f2] dark:bg-[#171822] flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-1">
                          <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] block truncate">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] block truncate">
                            {course.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-white dark:bg-[#20222f] border border-[#e8e5df] dark:border-[#2d3040] px-1.5 py-0.5 rounded text-[#1c1d21] dark:text-[#f0eff4] shrink-0">
                          {course.units}u
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Study Rhythm & Circadian Availability */}
          {onboardingStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                  When is your peak cognitive stamina?
                </h2>
                <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                  Powered by Borbély's Two-Process Circadian Model to schedule algorithmic problem sets when alertness is highest.
                </p>
              </div>

              {/* Chronotype Cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: 'lark',
                    title: 'Morning Lark',
                    window: '08:30 – 11:45 AM',
                    icon: <Sun className="w-5 h-5 text-amber-500" />
                  },
                  {
                    id: 'afternoon',
                    title: 'Afternoon Surge',
                    window: '01:00 – 04:30 PM',
                    icon: <Sunrise className="w-5 h-5 text-indigo-500" />
                  },
                  {
                    id: 'owl',
                    title: 'Night Owl',
                    window: '06:00 – 09:30 PM',
                    icon: <Moon className="w-5 h-5 text-purple-400" />
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedChronotype(item.id as Chronotype);
                      if (item.id === 'lark') {
                        setPeakStart('08:30');
                        setPeakEnd('11:45');
                      } else if (item.id === 'afternoon') {
                        setPeakStart('13:00');
                        setPeakEnd('16:30');
                      } else {
                        setPeakStart('18:00');
                        setPeakEnd('21:30');
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedChronotype === item.id
                        ? 'border-[#1c1d21] dark:border-white bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] shadow-xs'
                        : 'border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] hover:border-[#1c1d21] dark:hover:border-[#404354]'
                    }`}
                  >
                    <div className="mb-2">{item.icon}</div>
                    <div className="text-xs font-bold">{item.title}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        selectedChronotype === item.id
                          ? 'text-[#dedad2] dark:text-[#40424a]'
                          : 'text-[#787b84] dark:text-[#8d929e]'
                      }`}
                    >
                      {item.window}
                    </div>
                  </button>
                ))}
              </div>

              {/* Peak Window Customizer & Alertness Preview */}
              <div className="p-3.5 rounded-xl bg-[#f8f6f2] dark:bg-[#171822] border border-[#e8e5df] dark:border-[#262838] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Calculated Biological Peak Alertness</span>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {peakTelemetry.alertnessScore}% stamina
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] block mb-1">
                      Focus Window Starts
                    </span>
                    <input
                      type="time"
                      value={peakStart}
                      onChange={(e) => setPeakStart(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[#e8e5df] dark:border-[#2c2f3e] rounded-lg bg-white dark:bg-[#1f212c] text-[#1c1d21] dark:text-[#f0eff4]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#64676e] dark:text-[#9ba0a9] block mb-1">
                      Focus Window Ends
                    </span>
                    <input
                      type="time"
                      value={peakEnd}
                      onChange={(e) => setPeakEnd(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[#e8e5df] dark:border-[#2c2f3e] rounded-lg bg-white dark:bg-[#1f212c] text-[#1c1d21] dark:text-[#f0eff4]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] italic leading-tight">
                  Recommendation: {peakTelemetry.recommendation}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">
                    Weekly Deep Work Goal
                  </label>
                  <span className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] font-mono">
                    {weeklyTargetHours} Hours / Week
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="36"
                  value={weeklyTargetHours}
                  onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#e8e5df] dark:bg-[#20222d] rounded-lg appearance-none cursor-pointer accent-[#1c1d21] dark:accent-white"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Attendance Guard & Academic Policies */}
          {onboardingStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                  Attendance Safety Guardrails
                </h2>
                <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                  Protect your academic standing with automated absence caps and lecture verifications.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Policy Deficit Guardrail
                    </h4>
                    <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5 leading-snug">
                      Focusly triggers high-priority alerts whenever you have 1 absence remaining before course penalties apply.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-2">
                    Default Course Absence Allowance
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAbsenceBuffer(val)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                          absenceBuffer === val
                            ? 'bg-[#1c1d21] dark:bg-white text-white dark:text-[#121316] border-[#1c1d21] dark:border-white shadow-xs'
                            : 'bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] border-[#e8e5df] dark:border-[#262836] hover:bg-[#faf8f5] dark:hover:bg-[#202230]'
                        }`}
                      >
                        {val} {val === 1 ? 'Absence' : 'Absences'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e8e5df] dark:border-[#262838] flex items-center justify-between bg-[#f8f6f2] dark:bg-[#171822]">
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                      Automatic Lecture Verification
                    </h4>
                    <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                      Verify class attendance automatically through Panopto playback or EdStem polling sync.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={panoptoAutoCheck}
                    onChange={(e) => setPanoptoAutoCheck(e.target.checked)}
                    className="w-4 h-4 accent-[#1c1d21] dark:accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Validation & Launch */}
          {onboardingStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                  Academic Profile Configured!
                </h2>
                <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                  Ready to launch your circadian timeline, syllabus models, and SM-2 flashcard drills.
                </p>
              </div>

              {/* Summary Configuration Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-left">
                <div className="p-3 rounded-xl border border-[#e8e5df] dark:border-[#262838] bg-[#f8f6f2] dark:bg-[#171822]">
                  <span className="text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
                    Daily Focus Peak
                  </span>
                  <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] mt-0.5 block font-mono">
                    {peakStart} – {peakEnd}
                  </span>
                  <span className="text-[10.5px] text-amber-600 dark:text-amber-400 font-medium">
                    {selectedChronotype.toUpperCase()} Waveform
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-[#e8e5df] dark:border-[#262838] bg-[#f8f6f2] dark:bg-[#171822]">
                  <span className="text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
                    Enrolled Courses
                  </span>
                  <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] mt-0.5 block font-mono">
                    {courses.length} Courses ({targetUnits} Units)
                  </span>
                  <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Canvas Connected
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-[#e8e5df] dark:border-[#262838] bg-[#f8f6f2] dark:bg-[#171822]">
                  <span className="text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
                    Absence Cap
                  </span>
                  <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] mt-0.5 block font-mono">
                    {absenceBuffer} Misses Max
                  </span>
                  <span className="text-[10.5px] text-[#64676e] dark:text-[#9ba0a9]">
                    Auto-alerts enabled
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-[#e8e5df] dark:border-[#262838] bg-[#f8f6f2] dark:bg-[#171822]">
                  <span className="text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e] block">
                    Target Study Hours
                  </span>
                  <span className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4] mt-0.5 block font-mono">
                    {weeklyTargetHours} hrs / week
                  </span>
                  <span className="text-[10.5px] text-[#64676e] dark:text-[#9ba0a9]">
                    50-min deep sessions
                  </span>
                </div>
              </div>

              {/* Auto Schedule AI Plan Option */}
              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-[#1c1d21] dark:text-white block">
                      Optimize Initial Weekly Schedule
                    </span>
                    <span className="text-[11px] text-[#64676e] dark:text-[#9ba0a9]">
                      Uses greedy interval scheduling to pack conflict-free focus blocks.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoScheduleInitialPlan}
                  onChange={(e) => setAutoScheduleInitialPlan(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-7 pt-4 border-t border-[#f0ede6] dark:border-[#22242f] flex items-center justify-between">
            {onboardingStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setView('auth-login')}
              >
                Exit to Login
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              className="cursor-pointer font-bold shadow-xs"
            >
              {onboardingStep === 4 ? (
                <>
                  <span>Launch Focusly Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center py-3 text-[11px] text-[#9da0a6] dark:text-[#676b76]">
        Focusly • Stanford Academic Operating System
      </footer>
    </div>
  );
};
