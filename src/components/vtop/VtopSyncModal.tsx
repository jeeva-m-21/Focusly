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
import { FocuslySymbol } from '../brand/FocuslyLogo';

export const VtopSyncModal: React.FC = () => {
  const { isVtopSyncModalOpen, closeVtopSyncModal, hydrateFromVtop } = useFocusStore();

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

  const handleStartSync = async (e: React.FormEvent) => {
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
    setIsSyncing(true);
    setSyncPercent(5);
    setSyncStatusText('Establishing session with VTOP portal...');

    try {
      const harvestedData = await vtopClient.loginAndHarvest(
        {
          regNo: regNo.trim(),
          password: password.trim(),
          captcha: captchaInput.trim()
        },
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
      setSyncError(err.message || 'Sync failed. Please check credentials and try again.');
      loadFreshCaptcha();
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
        {isSyncing ? (
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
                Syncing directly with your student records...
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
                <span className="text-[10px] text-[#686A70] dark:text-[#A0A3AB]">Session authenticated</span>
              </div>
              <div className="p-2 rounded-lg bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
                <span className="font-semibold block text-[#18181A] dark:text-white">✓ Slot Matrix</span>
                <span className="text-[10px] text-[#686A70] dark:text-[#A0A3AB]">Timetable expanded</span>
              </div>
              <div className="p-2 rounded-lg bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36]">
                <span className="font-semibold block text-[#18181A] dark:text-white">✓ Attendance</span>
                <span className="text-[10px] text-[#686A70] dark:text-[#A0A3AB]">75% buffer calculated</span>
              </div>
            </div>
          </div>
        ) : (
          /* Credentials & Live Captcha Form */
          <form onSubmit={handleStartSync} className="p-6 space-y-4">
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
                    onChange={(e) => setRegNo(e.target.value)}
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
                    maxLength={6}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    placeholder="Enter characters"
                    className="flex-1 py-2 px-3 bg-[#FCFBF8] dark:bg-[#1C1E24] border border-[#E7E5DF] dark:border-[#2A2D36] rounded-xl text-xs font-mono font-bold tracking-widest text-[#18181A] dark:text-white focus:outline-none focus:border-[#F59E0B] uppercase text-center"
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Safe Storage Badge */}
            <div className="p-2.5 rounded-xl bg-[#FCFBF8] dark:bg-[#121318] border border-[#E7E5DF] dark:border-[#2A2D36] text-[11px] text-[#686A70] dark:text-[#A0A3AB] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A368] shrink-0" />
              <span>
                Zero credential storage. Credentials are used solely to query the student portal session and discard immediately.
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
                className="text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-white border-transparent"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Connect & Sync Timetable
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
