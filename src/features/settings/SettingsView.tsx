import React, { useState } from 'react';
import {
  User,
  Sliders,
  Bell,
  Clock,
  ShieldCheck,
  Brain,
  MapPin,
  Check,
  Save,
  Moon,
  Sun,
  Flame,
  Volume2,
  Sparkles,
  Footprints,
  Bike,
  School
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { PwaInstallPrompt } from '../../components/common/PwaInstallPrompt';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUser,
    theme,
    toggleTheme,
    soundMixer,
    setSoundMixerVolume,
    setView,
    resetToDemoAccount,
    setOnboardingStep,
    openVtopSyncModal,
    vtopLastSyncedAt
  } = useFocusStore();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution);
  const [degree, setDegree] = useState(user.degree);
  const [targetUnits, setTargetUnits] = useState(user.targetUnits);
  const [weeklyGoal, setWeeklyGoal] = useState(user.weeklyDeepWorkTargetHours);
  const [chronotype, setChronotype] = useState(user.chronotype);

  // Preference states
  const [defaultDuration, setDefaultDuration] = useState<number>(50);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(10);
  const [attendanceThreshold, setAttendanceThreshold] = useState<number>(2);
  const [valgrindAlerts, setValgrindAlerts] = useState<boolean>(true);
  const [transitMode, setTransitMode] = useState<'walk' | 'bike'>('walk');
  const [transitBuffer, setTransitBuffer] = useState<number>(15);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      institution,
      degree,
      targetUnits: Number(targetUnits),
      weeklyDeepWorkTargetHours: Number(weeklyGoal),
      chronotype
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5df] dark:border-[#20222a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium bg-[#f4f1eb] dark:bg-[#1f212a] text-[#1c1d21] dark:text-[#f0eff4] px-2 py-0.5 rounded border border-[#e8e5df] dark:border-[#2a2d39]">
              Account & Preferences
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1c1d21] dark:text-[#f0eff4] mt-1 tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
            Manage your student profile, Pomodoro study engine, attendance warning thresholds, and circadian settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Settings saved
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            icon={<Save className="w-3.5 h-3.5" />}
            className="text-xs font-semibold px-4"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* PWA Mobile & Desktop App Install Banner */}
      <PwaInstallPrompt />

      {/* College Portal (VTOP) Integration Card */}
      <Card className="bg-[#FFFFFF] dark:bg-[#15161A] border border-[#E7E5DF] dark:border-[#2A2D36] shadow-xs">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FFF7E6] dark:bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20">
                <School className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <span className="font-bold text-[#18181A] dark:text-[#F3F4F6]">
                College Portal Sync (VTOP)
              </span>
            </div>
          }
          subtitle="Direct reverse-engineered integration with college database. Automatically extracts registered courses, weekly time slots, campus room venues, and calculates live 75% attendance cushions."
        />
        <CardBody className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#18181A] dark:text-[#F3F4F6]">
                  Portal Connection Status:
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded font-medium bg-emerald-50 dark:bg-emerald-950/40 text-[#16A368] border border-[#16A368]/30">
                  {vtopLastSyncedAt ? `Active Sync (${new Date(vtopLastSyncedAt).toLocaleDateString()})` : 'Ready to Connect'}
                </span>
              </div>
              <p className="text-[11px] text-[#686A70] dark:text-[#A0A3AB] mt-0.5">
                Target Gateway: <code className="font-mono text-[#18181A] dark:text-white">vtopcc.vit.ac.in</code> with live Captcha challenge.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openVtopSyncModal}
              className="text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-white border-transparent shrink-0"
              icon={<School className="w-3.5 h-3.5" />}
            >
              {vtopLastSyncedAt ? 'Re-sync Portal Data' : 'Connect & Import Records'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Interactive Flow Demonstration & Auth Suite */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-amber-950/10 border border-amber-200 dark:border-amber-900/60 shadow-xs">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-[#1c1d21] dark:text-[#f0eff4]">
                Interactive Flow Demonstration Suite
              </span>
            </div>
          }
          subtitle="Test and evaluate the authentication doorway, Stanford SSO simulation, and 4-step onboarding wizard"
        />
        <CardBody className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setView('auth-login')}
              className="py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Test Sign In & SSO Doorway</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setView('auth-signup')}
              className="py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Test Sign-Up Flow</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setOnboardingStep(1);
                setView('onboarding');
              }}
              className="py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Re-run Onboarding Wizard</span>
            </Button>
          </div>

          <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-[#64676e] dark:text-[#9ba0a9]">
              Quick Persona Switcher:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => resetToDemoAccount('aarav')}
                className="px-2.5 py-1 rounded-lg border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#1a1b24] text-[11px] font-semibold hover:border-amber-500 transition-colors cursor-pointer"
              >
                Aarav Sharma (CS '26)
              </button>
              <button
                type="button"
                onClick={() => resetToDemoAccount('maya')}
                className="px-2.5 py-1 rounded-lg border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#1a1b24] text-[11px] font-semibold hover:border-amber-500 transition-colors cursor-pointer text-amber-700 dark:text-amber-400"
              >
                Maya Chen (New Student)
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Academic Student Profile */}
        <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
          <CardHeader
            title="Academic Profile"
            subtitle="Your university credentials, enrolled degree, and unit targets"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  University Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Degree & Major
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Quarter Units Enrolled
                </label>
                <input
                  type="number"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Weekly Deep Work Goal (Hours)
                </label>
                <input
                  type="number"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 2. Pomodoro & Focus Timer Preferences */}
        <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
          <CardHeader
            title="Focus Timer & Pomodoro Engine"
            subtitle="Default durations, breaks, and ambient soundscapes"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Default Focus Session
                </label>
                <select
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors cursor-pointer"
                >
                  <option value={25}>25 minutes (Standard Pomodoro)</option>
                  <option value={50}>50 minutes (Deep Work Session)</option>
                  <option value={90}>90 minutes (Ultradian Flow Block)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Short Break Duration
                </label>
                <select
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors cursor-pointer"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                </select>
              </div>
            </div>

            {/* Ambient Soundscape Levels */}
            <div className="pt-2 border-t border-[#f4f1eb] dark:border-[#1e2029]">
              <h4 className="text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-2 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#787b84] dark:text-[#8d929e]" />
                Ambient Soundscape Defaults
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#181922] border border-[#e8e5df] dark:border-[#262834]">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span>Brown Noise</span>
                    <span className="font-mono">{soundMixer.brownNoiseVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundMixer.brownNoiseVolume}
                    onChange={(e) => setSoundMixerVolume('brownNoiseVolume', Number(e.target.value))}
                    className="w-full accent-[#1c1d21] dark:accent-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#181922] border border-[#e8e5df] dark:border-[#262834]">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span>Vellore Monsoon Rain</span>
                    <span className="font-mono">{soundMixer.rainVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundMixer.rainVolume}
                    onChange={(e) => setSoundMixerVolume('rainVolume', Number(e.target.value))}
                    className="w-full accent-[#1c1d21] dark:accent-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#181922] border border-[#e8e5df] dark:border-[#262834]">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span>Huang Library</span>
                    <span className="font-mono">{soundMixer.libraryVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundMixer.libraryVolume}
                    onChange={(e) => setSoundMixerVolume('libraryVolume', Number(e.target.value))}
                    className="w-full accent-[#1c1d21] dark:accent-white"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 3. Academic Policy Alerts & Early-Warning Thresholds */}
        <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
          <CardHeader
            title="Academic Early-Warning & Verification Thresholds"
            subtitle="Configure proactive alerts for attendance policy caps and autograder leaks"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Attendance Absence Risk Alert
                </label>
                <select
                  value={attendanceThreshold}
                  onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors cursor-pointer"
                >
                  <option value={1}>Alert when 1 absence buffer remains</option>
                  <option value={2}>Alert when 2 absence buffers remain</option>
                  <option value={3}>Alert when 3 absence buffers remain</option>
                </select>
                <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-1">
                  Triggers visual alerts when course attendance approaches letter grade penalty thresholds.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Valgrind Memory Leak Warning
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={valgrindAlerts}
                    onChange={(e) => setValgrindAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d5d0c7] dark:border-[#383b48] text-[#1c1d21] dark:text-white focus:ring-0 accent-[#1c1d21] dark:accent-white"
                  />
                  <span className="text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">
                    Warn immediately on Valgrind memory leak loss records
                  </span>
                </label>
                <p className="text-[11px] text-[#787b84] dark:text-[#8d929e] mt-1">
                  Highlights memory leaks in CS 106B dynamic arrays before late days are consumed.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 4. Campus Transit & Chronotype */}
        <Card className="bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-xs">
          <CardHeader
            title="Campus Mobility & Circadian Chronotype"
            subtitle="Transit speeds between SJT, Technology Tower, and Central Library, and energy scheduling"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Preferred Campus Travel Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransitMode('walk')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      transitMode === 'walk'
                        ? 'bg-[#1c1d21] text-white dark:bg-white dark:text-[#1c1d21] font-semibold border-transparent'
                        : 'bg-[#faf8f5] dark:bg-[#181920] text-[#64676e] dark:text-[#9ba0a9] border-[#e8e5df] dark:border-[#272935]'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Walking (3.2 mph)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransitMode('bike')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      transitMode === 'bike'
                        ? 'bg-[#1c1d21] text-white dark:bg-white dark:text-[#1c1d21] font-semibold border-transparent'
                        : 'bg-[#faf8f5] dark:bg-[#181920] text-[#64676e] dark:text-[#9ba0a9] border-[#e8e5df] dark:border-[#272935]'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Biking (9.5 mph)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Circadian Chronotype
                </label>
                <select
                  value={chronotype}
                  onChange={(e) => setChronotype(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e5df] dark:border-[#272936] bg-[#fcfbf9] dark:bg-[#16171e] text-[#1c1d21] dark:text-[#f0eff4] focus:outline-hidden focus:border-[#1c1d21] dark:focus:border-white transition-colors cursor-pointer"
                >
                  <option value="lark">Morning Lark (Peak: 08:30 – 11:45 AM)</option>
                  <option value="afternoon">Afternoon Analytical (Peak: 1:30 – 5:30 PM)</option>
                  <option value="owl">Night Owl (Peak: 8:00 – 11:30 PM)</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setView('overview')}
            className="text-xs text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
          >
            ← Back to Overview Cockpit
          </button>

          <Button
            variant="primary"
            size="md"
            type="submit"
            icon={<Save className="w-4 h-4" />}
            className="text-xs font-semibold px-6"
          >
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
