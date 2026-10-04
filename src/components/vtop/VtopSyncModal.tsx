import React, { useState, useEffect } from 'react';
import {
  School,
  X,
  RefreshCw,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { vtopClient } from '../../services/vtop/vtopClient';
import { Button } from '../common/Button';
import { AVAILABLE_SEMESTERS } from '../../services/vtop/vtopTypes';
import { FocuslySymbol } from '../brand/FocuslyLogo';
import { cn } from '../../utils/cn';

export const VtopSyncModal: React.FC = () => {
  const { isVtopSyncModalOpen, closeVtopSyncModal, hydrateFromVtop } = useFocusStore();

  const [syncStep, setSyncStep] = useState<'credentials' | 'authenticating' | 'select_semester' | 'syncing'>('credentials');
  const [selectedSemesterCode, setSelectedSemesterCode] = useState('WS202526');
  const [authenticatedStudent, setAuthenticatedStudent] = useState<{
    name: string;
    regNo: string;
    branch: string;
    campus: string;
  } | null>(null);

  const [regNo, setRegNo] = useState('22BCE1042');
  const [password, setPassword] = useState('••••••••••••');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);

  // Sync Progress State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('');
  const [syncPercent, setSyncPercent] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load fresh captcha when modal opens
  useEffect(() => {
    if (isVtopSyncModalOpen) {
      setSyncStep('credentials');
      loadFreshCaptcha();
    }
  }, [isVtopSyncModalOpen]);

  const loadFreshCaptcha = async () => {
    setIsLoadingCaptcha(true);
    setSyncError(null);
    try {
      const res = await vtopClient.getCaptcha();
      setCaptchaImage(res.captchaImage);
      setCaptchaInput('');
    } catch (err: any) {
      setSyncError('Could not load captcha from VTOP gateway. Please check connection.');
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  const handleStartAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) {
      setSyncError('Please enter your registration number.');
      return;
    }
    if (!password.trim()) {
      setSyncError('Please enter your VTOP password.');
      return;
    }
    if (!captchaInput.trim()) {
      setSyncError('Please solve the captcha puzzle to authenticate.');
      return;
    }

    setSyncError(null);
    setSyncStep('authenticating');

    try {
      const authResult = await vtopClient.authenticate({
        regNo: regNo.trim().toUpperCase(),
        password: password.trim(),
        captcha: captchaInput.trim()
      });

      setAuthenticatedStudent({
        name: authResult.studentName,
        regNo: authResult.regNo,
        branch: authResult.branch,
        campus: authResult.campus
      });

      setSyncStep('select_semester');
    } catch (err: any) {
      setSyncStep('credentials');
      setSyncError(err.message || 'Authentication failed. Please verify credentials.');
      loadFreshCaptcha();
    }
  };

  const handleConfirmSync = async () => {
    setSyncStep('syncing');
    setIsSyncing(true);
    setSyncPercent(5);
    setSyncStatusText('Establishing session with VTOP portal for chosen semester...');

    try {
      const harvestedData = await vtopClient.loginAndHarvest(
        {
          regNo: regNo.trim().toUpperCase(),
          password: password.trim(),
          captcha: captchaInput.trim()
        },
        selectedSemesterCode,
        (step, pct) => {
          setSyncStatusText(step);
          setSyncPercent(pct);
        }
      );

      // Hydrate Zustand store directly with parsed courses, timetable, profile, and attendance
      setTimeout(() => {
        hydrateFromVtop(harvestedData);
        setIsSyncing(false);
        closeVtopSyncModal();
      }, 700);
    } catch (err: any) {
      setIsSyncing(false);
      setSyncStep('select_semester');
      setSyncError(err.message || 'Sync failed. Please check credentials and try again.');
    }
  };

  if (!isVtopSyncModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#16171D] rounded-2xl border border-[#E7E5DF] dark:border-[#2A2D36] shadow-calm-modal overflow-hidden text-[#18181A] dark:text-[#F3F4F6] relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E7E5DF] dark:border-[#2A2D36] flex items-center justify-between bg-[#FCFBF8] dark:bg-[#121318]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36] flex items-center justify-center shadow-xs">
              <School className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[15px] font-bold tracking-tight">Connect College Portal (VTOP)</h3>
                <span className="text-[9.5px] font-mono uppercase bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-[#F59E0B] px-1.5 py-0.2 rounded border border-[#F59E0B]/30 font-semibold">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-[#686A70] dark:text-[#A0A3AB]">
                Directly imports registered courses, slots, timetable & attendance
              </p>
            </div>
          </div>

          {!isSyncing && (
            <button
              onClick={closeVtopSyncModal}
              title="Close"
              className="p-1.5 rounded-lg text-[#96979B] hover:text-[#18181A] dark:hover:text-white hover:bg-[#F7F6F2] dark:hover:bg-[#1C1E24] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sync Progress Pipeline Screen */}
        {isSyncing || syncStep === 'syncing' ? (
          <div className="p-7 space-y-6 text-center">
            <div className="inline-flex items-center justify-center relative my-2">
              <div className="w-16 h-16 rounded-full bg-[#FFF7E6] dark:bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/30">
                <FocuslySymbol size={32} variant="accent" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
            </div>

            <div className="space-y-1">
              <div className="text-[16px] font-bold">{syncStatusText}</div>
              <p className="text-xs text-[#686A70] dark:text-[#A0A3AB]">
                Syncing {AVAILABLE_SEMESTERS.find(s => s.code === selectedSemesterCode)?.name || 'Academic Term'} directly with student records...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#F7F6F2] dark:bg-[#20222A] h-2 rounded-full overflow-hidden border border-[#E7E5DF] dark:border-[#2A2D36]">
              <div
                className="bg-[#F59E0B] h-full transition-all duration-300 rounded-full"
                style={{ width: `${syncPercent}%` }}
              />
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-3 gap-2 text-left pt-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
                <span className="font-semibold block text-[#18181A] dark:text-white">✓ Handshake</span>
                <span className="text-[10px] text-[#686A70] dark:text-[#A0A3AB]">Session verified</span>
              </div>
              <div className="p-2 rounded-lg bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
                <span className="font-semibold block text-[#18181A] dark:text-white">✓ Slot Matrix</span>
                <span className="text-[10px] text-[#686A70] dark:text-[#A0A3AB]">Timetable loaded</span>
              </div>
              <div className="p-2 rounded-lg bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
                <span className="font-semibold block text-[#18181A] dark:text-white">✓ Attendance</span>
                <span className="text-[10px] text-[#686A70] dark:text-[#A0A3AB]">75% buffer calculated</span>
              </div>
            </div>
          </div>
        ) : syncStep === 'select_semester' ? (
          /* Step 2: Post-Authentication Semester Selection */
          <div className="p-6 space-y-4 animate-in fade-in duration-200">
            {/* Authenticated Verification Badge */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {authenticatedStudent?.name || authenticatedStudent?.regNo || regNo} · <span className="font-mono">{authenticatedStudent?.regNo || regNo}</span>
                  </p>
                  <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400">
                    {authenticatedStudent?.branch || 'Computer Science & Engineering'} · {authenticatedStudent?.campus || 'VIT Chennai'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSyncStep('credentials');
                  loadFreshCaptcha();
                }}
                className="text-[10px] text-[#686A70] hover:text-[#18181A] dark:text-[#96979B] dark:hover:text-white underline cursor-pointer"
              >
                Change
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#18181A] dark:text-[#F0EFF4] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Select Academic Semester to Sync</span>
                </h3>
                <span className="text-[10px] font-mono text-[#16A368] bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.2 rounded-full font-semibold">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-[#686A70] dark:text-[#96979B] mt-1">
                Choose the semester to update your timetable, registered slots, and 75% attendance cushion in Focusly.
              </p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {AVAILABLE_SEMESTERS.map((sem) => {
                const isSelected = selectedSemesterCode === sem.code;
                return (
                  <button
                    key={sem.code}
                    type="button"
                    onClick={() => setSelectedSemesterCode(sem.code)}
                    className={cn(
                      'w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3',
                      isSelected
                        ? 'bg-[#FFFBF2] dark:bg-[#F59E0B]/10 border-[#F59E0B] shadow-2xs'
                        : 'bg-[#FCFBF8] dark:bg-[#1C1E24] border-[#E7E5DF] dark:border-[#2A2D36] hover:border-[#18181A]/30 dark:hover:border-white/30'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-bold truncate',
                          isSelected ? 'text-[#18181A] dark:text-white' : 'text-[#18181A] dark:text-[#F0EFF4]'
                        )}>
                          {sem.name}
                        </span>
                        <span className={cn(
                          'text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold',
                          sem.type === 'Current'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#16A368] border border-emerald-200 dark:border-emerald-800'
                            : sem.type === 'Previous'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-[#D97706] border border-amber-200 dark:border-amber-800'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        )}>
                          {sem.type === 'Current' ? 'Current Term' : sem.code}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#686A70] dark:text-[#96979B] mt-0.5 leading-snug">
                        {sem.description}
                      </p>
                    </div>

                    <div className={cn(
                      'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                      isSelected
                        ? 'border-[#F59E0B] bg-[#F59E0B]'
                        : 'border-[#D1CFCA] dark:border-[#404352]'
                    )}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E5DF] dark:border-[#2A2D36]">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSyncStep('credentials');
                  loadFreshCaptcha();
                }}
                className="text-xs"
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleConfirmSync}
                className="text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-white border-transparent flex items-center gap-1.5 cursor-pointer"
              >
                <span>Load {AVAILABLE_SEMESTERS.find(s => s.code === selectedSemesterCode)?.name.split(' ')[0] || 'Selected'} Semester</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Step 1: Credentials & Live Captcha Form */
          <form onSubmit={handleStartAuth} className="p-6 space-y-4">
            {syncError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-[#DC5A63]/30 text-[#DC5A63] text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{syncError}</span>
              </div>
            )}

            <div className="space-y-3">
              {/* Registration Number */}
              <div>
                <label className="block text-xs font-semibold text-[#686A70] dark:text-[#A0A3AB] mb-1">
                  Registration Number
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#96979B] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    placeholder="e.g. 22BCE1042"
                    className="w-full pl-9 pr-3 py-2 bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36] rounded-xl text-xs font-mono text-[#18181A] dark:text-white focus:outline-none focus:border-[#F59E0B] uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#686A70] dark:text-[#A0A3AB] mb-1">
                  VTOP Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#96979B] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter VTOP password"
                    className="w-full pl-9 pr-3 py-2 bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36] rounded-xl text-xs text-[#18181A] dark:text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              {/* Live Captcha Extraction Container */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#686A70] dark:text-[#A0A3AB]">
                    Captcha Challenge
                  </label>
                  <button
                    type="button"
                    onClick={loadFreshCaptcha}
                    className="text-[11px] text-[#F59E0B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingCaptcha ? 'animate-spin' : ''}`} />
                    <span>Refresh Captcha</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Captcha Image */}
                  <div className="w-36 h-11 bg-[#F7F6F2] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    {isLoadingCaptcha ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#96979B]" />
                    ) : captchaImage ? (
                      <img src={captchaImage} alt="VTOP Captcha" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-[#96979B]">Loading...</span>
                    )}
                  </div>

                  {/* Captcha Input */}
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Case-sensitive code"
                    className="flex-1 py-2 px-3 bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36] rounded-xl text-xs font-mono font-bold tracking-widest text-[#18181A] dark:text-white focus:outline-none focus:border-[#F59E0B] text-center"
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Safe Storage Badge */}
            <div className="p-2.5 rounded-xl bg-[#FCFBF8] dark:bg-[#121318] border border-[#E7E5DF] dark:border-[#2A2D36] text-[11px] text-[#686A70] dark:text-[#A0A3AB] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A368] shrink-0" />
              <span>
                Zero credential storage. Credentials are used solely to authenticate your session with the portal.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E5DF] dark:border-[#2A2D36]">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={closeVtopSyncModal}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={syncStep === 'authenticating'}
                className="text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-white border-transparent flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{syncStep === 'authenticating' ? 'Verifying Gateway...' : 'Authenticate & Select Semester'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
