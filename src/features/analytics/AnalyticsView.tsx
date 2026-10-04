import React from 'react';
import {
  Clock,
  Zap,
  Flame,
  Award,
  BarChart2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { WeeklyFocusWaveChart } from '../../components/charts/WeeklyFocusWaveChart';
import { CourseDistributionDonut } from '../../components/charts/CourseDistributionDonut';
import { ConsistencyHeatmap } from '../../components/charts/ConsistencyHeatmap';
import { useFocusStore } from '../../store/useFocusStore';
import { calculateCircadianAlertness } from '../../algorithms/circadianModel';
import { calculateCourseProjection, calculateTermGPAEquilibrium } from '../../algorithms/gradeForecaster';

export const AnalyticsView: React.FC = () => {
  const { courses, user } = useFocusStore();

  const termGPA = calculateTermGPAEquilibrium(courses, 3.90);
  const courseProjections = courses.map(calculateCourseProjection);

  const hoursList = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const circadianHourlyVelocity = hoursList.map((hour) => {
    const hourNum = parseInt(hour.split(':')[0], 10);
    const alert = calculateCircadianAlertness(hourNum, user.chronotype || 'afternoon');
    return {
      hour,
      velocity: alert.alertnessScore,
      phase: alert.phaseName,
      recommendation: alert.recommendation
    };
  });

  const subjectEffortBalance = [
    { code: 'CSE2005', units: 4, actualHours: 10.5, expectedHours: 8.0, balance: '+2.5h deep focus' },
    { code: 'CSE2006', units: 4, actualHours: 8.0, expectedHours: 8.0, balance: 'On pacing target' },
    { code: 'MAT2002', units: 3, actualHours: 6.5, expectedHours: 6.0, balance: '+0.5h ahead' },
    { code: 'ECE2001', units: 4, actualHours: 5.5, expectedHours: 8.0, balance: '-2.5h study deficit' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5df] dark:border-[#22242f] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9da0a6] dark:text-[#676b76] font-semibold">
            ACADEMIC PERFORMANCE & VELOCITY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight mt-0.5">
            Study Stats & Analytics
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
            Weekly focus trends, bio-rhythm alignment, course workload equilibrium, and session longevity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber">
            <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Weekly Target: 77% (18.5h / 24h)</span>
          </Badge>
        </div>
      </div>

      {/* 1. Executive Analytics Intelligence Scorecard (Replacing Generic 4 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Hero Card (6 cols): Weekly Velocity Horizon & Pace */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Target className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c1d21] dark:text-[#f0eff4]">
                WEEKLY FOCUS VELOCITY
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
              Pacing for 25.2h (+1.2h)
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
                18.5 <span className="text-base font-normal text-[#787b84] dark:text-[#8d929e]">/ 24.0 hrs</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                77% Goal
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#f4f1eb] dark:bg-[#1e202a] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full w-[77%]" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#f4f1eb] dark:border-[#1e2029] flex items-center justify-between text-xs text-[#64676e] dark:text-[#9ba0a9]">
            <span>14-day study streak maintained</span>
            <span className="font-semibold text-[#1c1d21] dark:text-[#f0eff4]">3.2h average / day</span>
          </div>
        </div>

        {/* Right Card 1 (3 cols): Circadian Peak Alignment */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
              BIO-ALIGNMENT
            </span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              92.4%
            </div>
            <p className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mt-1">
              Peak Alertness Match
            </p>
            <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-0.5 leading-snug">
              14.2h of problem sets completed during high-dopamine biological windows.
            </p>
          </div>

          <div className="pt-2 border-t border-[#f4f1eb] dark:border-[#1e2029] text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400">
            ✓ Zero late-night fatigue spikes
          </div>
        </div>

        {/* Right Card 2 (3 cols): Unbroken Flow & Focus Quality */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#787b84] dark:text-[#8d929e]">
              FOCUS QUALITY
            </span>
            <Award className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#1c1d21] dark:text-[#f0eff4]">
              48.5m
            </div>
            <p className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mt-1">
              Avg Unbroken Session
            </p>
            <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-0.5 leading-snug">
              Distraction interruptions: 0.4 / hr (reduced by 75% compared to Week 3).
            </p>
          </div>

          <div className="pt-2 border-t border-[#f4f1eb] dark:border-[#1e2029] text-[10.5px] font-mono text-[#787b84] dark:text-[#8d929e]">
            Dean's List concentration tier
          </div>
        </div>
      </div>

      {/* 2. Primary Graph: Weekly Focus Velocity Wave Chart */}
      <WeeklyFocusWaveChart />

      {/* 3. Two Column Graphs: Course Distribution Donut + Habit Consistency Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <CourseDistributionDonut />
        </div>
        <div className="lg:col-span-6">
          <ConsistencyHeatmap />
        </div>
      </div>

      {/* 4. Course Workload vs Credit Units Equilibrium Matrix */}
      <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
        <CardHeader
          title="Course Effort vs Credit Units Equilibrium"
          subtitle="Comparing actual weekly study hours invested against expected 2:1 credit load ratios"
          badge={<Badge variant="default">17 Units Total</Badge>}
        />
        <CardBody className="space-y-3">
          {subjectEffortBalance.map((item) => {
            const isOver = item.balance.includes('+');
            const isUnder = item.balance.includes('-');

            return (
              <div
                key={item.code}
                className="p-3.5 rounded-xl border border-[#e8e5df] dark:border-[#242632] bg-[#fcfbf9] dark:bg-[#161720] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#1c1d21] dark:text-[#f0eff4] bg-white dark:bg-[#20222b] px-2 py-0.5 rounded border border-[#e8e5df] dark:border-[#2b2e3c]">
                    {item.code}
                  </span>
                  <div>
                    <h4 className="font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                      {item.units} Units • Target: {item.expectedHours}h / week
                    </h4>
                    <span className="text-[11px] text-[#787b84] dark:text-[#8d929e]">
                      Actual logged: <strong className="text-[#1c1d21] dark:text-[#f0eff4]">{item.actualHours} hrs</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="w-32 h-2 bg-[#f4f1eb] dark:bg-[#1f212a] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (item.actualHours / item.expectedHours) * 100)}%` }}
                      className={`h-full rounded-full ${
                        isOver ? 'bg-amber-500' : isUnder ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <span
                    className={`font-mono font-semibold text-[11px] ${
                      isOver
                        ? 'text-amber-600 dark:text-amber-400'
                        : isUnder
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {item.balance}
                  </span>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* 5. Course Grade Forecaster & Target Final Exam Solver */}
      <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Target className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                Target Grade & Exam Score Equilibrium Solver
              </span>
            </div>
          }
          subtitle="Mathematical solver computing the exact minimum final exam score required to secure your target grade"
          badge={
            <Badge variant="emerald">
              Projected Term GPA: {termGPA.projectedGPA.toFixed(2)} (Dean's List: {termGPA.isDeansListProjected ? 'Yes' : 'No'})
            </Badge>
          }
        />
        <CardBody className="space-y-3">
          {courseProjections.map((proj) => {
            const course = courses.find((c) => c.id === proj.courseId);
            return (
              <div
                key={proj.courseId}
                className="p-3.5 rounded-xl border border-[#e8e5df] dark:border-[#242632] bg-[#fcfbf9] dark:bg-[#161720] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#1c1d21] dark:text-[#f0eff4] bg-white dark:bg-[#20222b] px-2 py-0.5 rounded border border-[#e8e5df] dark:border-[#2b2e3c]">
                    {proj.courseCode}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                        {course?.name || proj.courseCode}
                      </h4>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded text-[11px]">
                        Current: {proj.currentPercentage}% ({proj.currentLetterGrade})
                      </span>
                    </div>
                    <span className="text-[11px] text-[#787b84] dark:text-[#8d929e]">
                      {proj.gradedWeightPercent}% graded ({proj.remainingWeightPercent}% remaining on finals & midterms)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 bg-[#f4f1eb] dark:bg-[#1e202a] px-2.5 py-1 rounded-lg border border-[#e8e5df] dark:border-[#2a2d3c]">
                    <span className="text-[#787b84] dark:text-[#8d929e]">Needed for 'A':</span>
                    <strong className={proj.requiredForA && proj.requiredForA > 100 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}>
                      {proj.requiredForA !== null ? `${proj.requiredForA}%` : 'Locked in'}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#f4f1eb] dark:bg-[#1e202a] px-2.5 py-1 rounded-lg border border-[#e8e5df] dark:border-[#2a2d3c]">
                    <span className="text-[#787b84] dark:text-[#8d929e]">Needed for 'A-':</span>
                    <strong className="text-amber-600 dark:text-amber-400">
                      {proj.requiredForAMinus !== null ? `${proj.requiredForAMinus}%` : 'Locked in'}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* 6. Hourly Focus Distribution */}
      <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <BarChart2 className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                Hourly Study Intensity & Focus Distribution
              </span>
            </div>
          }
          subtitle="Hours of the day when you record the most uninterrupted deep work"
          badge={<Badge variant="amber">Peak Alertness: 09:00 – 11:45 AM</Badge>}
        />
        <CardBody>
          <div className="h-56 flex items-end gap-2.5 sm:gap-3 pt-6 pb-2 px-2 border-b border-[#e8e5df] dark:border-[#22242c] overflow-x-auto">
            {circadianHourlyVelocity.map((item) => {
              const isPeak = item.velocity >= 85;
              return (
                <div key={item.hour} className="flex-1 min-w-[32px] flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-[#1c1d21] dark:text-[#f0eff4] opacity-0 group-hover:opacity-100 transition-opacity bg-[#f4f1eb] dark:bg-[#20222b] px-1.5 py-0.5 rounded border border-[#e8e5df] dark:border-[#2c2f3c]">
                    {item.velocity}%
                  </div>
                  <div
                    style={{ height: `${item.velocity}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isPeak
                        ? 'bg-[#1c1d21] dark:bg-white shadow-xs'
                        : 'bg-amber-500/70 hover:bg-amber-500'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-[#787b84] dark:text-[#8d929e] rotate-[-45deg] sm:rotate-0 mt-1">
                    {item.hour.slice(0, 2)}h
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-[#787b84] dark:text-[#8d929e] pt-3">
            <span>Chart notes: Black bars represent peak cortisol focus sessions.</span>
            <span className="font-mono font-semibold text-[#1c1d21] dark:text-[#f0eff4]">VIT Term Focus Average: 74%</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
