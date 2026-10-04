import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  FileCheck,
  AlertTriangle,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFocusStore } from '../../store/useFocusStore';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const AttendanceView: React.FC = () => {
  const { courses, logAttendance, setView } = useFocusStore();
  const [notification, setNotification] = useState<string | null>(null);

  const handleLog = (courseId: string, courseCode: string, status: 'present' | 'absent') => {
    logAttendance(courseId, status);
    if (status === 'present') {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 }
      });
      setNotification(`Marked PRESENT for ${courseCode}. Attendance health safe.`);
    } else {
      setNotification(`Logged ABSENCE for ${courseCode}. Policy buffer updated.`);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const attendanceLogHistory = [
    { course: 'CSE2005', date: 'Today, 09:20 AM', status: 'Present', location: 'SJT 411 (Slot A1)', sync: 'VTOP Biometric Verified' },
    { course: 'CSE2006', date: 'Today, 10:20 AM', status: 'Present', location: 'TT 204 (Slot B1)', sync: 'VTOP Biometric Verified' },
    { course: 'ECE2001', date: 'Mon, 12:20 PM', status: 'Absent', location: 'TT 418 (Slot D1)', sync: 'Unexcused (1 cushion used)' },
    { course: 'MAT2002', date: 'Yesterday, 11:30 AM', status: 'Present', location: 'MB 112 (Slot C1)', sync: 'Faculty Roll Call Verified' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5df] dark:border-[#22242f] pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9da0a6] dark:text-[#676b76] font-semibold">
            VIT ACADEMIC REGULATIONS & ATTENDANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight mt-0.5">
            Attendance & 75% Rule Monitor
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
            Real-time VTOP attendance tracking, 75% mandatory FAT eligibility cushion, and slot absence budgets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Overall Standing: 91.8% (Eligible for FAT)</span>
          </Badge>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Critical VIT 75% Policy Alert Banner */}
      <div className="p-4 rounded-xl bg-[#fffdfa] dark:bg-[#181611] border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
            VTOP 75% Policy Alert: ECE2001 (Digital Logic Design) Buffer Narrowing
          </h4>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] leading-relaxed">
            Current attendance is <strong className="text-[#1c1d21] dark:text-[#f0eff4]">84.0% (21/25 hrs)</strong>. Under the mandatory VIT 75% rule, you have a safe cushion of only <strong className="text-amber-600 dark:text-amber-400">1 class</strong> remaining before entering the debarment warning zone for Final Assessment Tests (FAT).
          </p>
        </div>
      </div>

      {/* Course Absence Budgets Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => {
          const { attended, total, maxAllowedAbsences, currentAbsences, lastVerifiedDate, panoptoSynced } = course.attendance;
          const remainingAbsences = Math.max(0, maxAllowedAbsences - currentAbsences);
          const attendancePercent = total > 0 ? ((attended / total) * 100).toFixed(0) : 100;
          const isAtRisk = remainingAbsences <= 1;

          return (
            <Card
              key={course.id}
              className="p-5 bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#1c1d21] dark:text-[#f0eff4] bg-[#f4f1eb] dark:bg-[#1e2029] px-2 py-0.5 rounded border border-[#e8e5df] dark:border-[#2b2e3c]">
                        {course.code}
                      </span>
                      <h3 className="text-sm font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                        {course.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
                      {course.instructor} • {course.units} Units
                    </p>
                  </div>

                  <Badge variant={isAtRisk ? 'amber' : 'emerald'}>
                    {remainingAbsences > 0 ? `${remainingAbsences} Buffer Left` : '0 Left (At Limit)'}
                  </Badge>
                </div>

                {/* Visual Absence Slots Indicator */}
                <div className="space-y-1.5 my-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64676e] dark:text-[#9ba0a9] font-medium">Absence Budget Usage</span>
                    <span className="font-mono text-xs font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                      {currentAbsences} / {maxAllowedAbsences} absences
                    </span>
                  </div>

                  {/* Pip Indicators */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: maxAllowedAbsences }).map((_, idx) => {
                      const isUsed = idx < currentAbsences;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 h-2 rounded-full transition-all ${
                            isUsed
                              ? 'bg-rose-500'
                              : 'bg-emerald-500/80 dark:bg-emerald-500/70'
                          }`}
                          title={isUsed ? 'Absence logged' : 'Buffer available'}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Progress Bar & Class Count */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#787b84] dark:text-[#8d929e]">Class Attendance</span>
                    <span className="font-mono font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                      {attendancePercent}% ({attended}/{total} Sessions)
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#f4f1eb] dark:bg-[#1e202a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(attendancePercent) >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${attendancePercent}%` }}
                    />
                  </div>
                </div>

                {/* Verification Metadata Box */}
                <div className="text-xs text-[#64676e] dark:text-[#9ba0a9] space-y-1 bg-[#f8f6f2] dark:bg-[#181922] p-3 rounded-xl border border-[#e8e5df] dark:border-[#22242f] mt-3">
                  <div className="flex items-center justify-between">
                    <span>Syllabus Policy:</span>
                    <span className="font-medium text-[#1c1d21] dark:text-[#f0eff4]">Max {maxAllowedAbsences} before penalty</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Recorded:</span>
                    <span className="font-mono text-[#1c1d21] dark:text-[#f0eff4]">{lastVerifiedDate || 'Verified in-person'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sync Status:</span>
                    <span className={panoptoSynced ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-[#787b84]'}>
                      {panoptoSynced ? 'Panopto Sync Active' : 'Manual Sign-in'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons to Record Attendance */}
              <div className="pt-3 border-t border-[#f4f1eb] dark:border-[#1e2029] flex items-center justify-between">
                <button
                  onClick={() => setView('course-cs106b')}
                  className="text-xs text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Syllabus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLog(course.id, course.code, 'present')}
                    icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    className="text-xs text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold"
                  >
                    Check In (Present)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLog(course.id, course.code, 'absent')}
                    icon={<XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
                    className="text-xs text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                  >
                    Log Absence
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Verification Log History Table */}
      <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs overflow-hidden">
        <CardHeader
          title="Attendance Verification Audit Trail"
          subtitle="Recent automated beacon sign-ins and discussion section roll calls"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f6f2] dark:bg-[#181922] border-b border-[#e8e5df] dark:border-[#22242f] text-[#64676e] dark:text-[#9ba0a9] text-[10px] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Course</th>
                <th className="py-3 px-5">Date & Time</th>
                <th className="py-3 px-5">Location</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Verification Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ede6] dark:divide-[#22242f]">
              {attendanceLogHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#faf8f5] dark:hover:bg-[#181924] transition-colors">
                  <td className="py-3 px-5 font-mono font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                    {item.course}
                  </td>
                  <td className="py-3 px-5 font-mono text-[#787b84] dark:text-[#8d929e]">
                    {item.date}
                  </td>
                  <td className="py-3 px-5 text-[#1c1d21] dark:text-[#f0eff4]">
                    {item.location}
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        item.status === 'Present'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right font-mono text-[11px] text-[#787b84] dark:text-[#8d929e]">
                    {item.sync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
