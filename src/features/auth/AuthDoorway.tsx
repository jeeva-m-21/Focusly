import React, { useState, useEffect } from 'react';
import {
  School,
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
  GraduationCap,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Mail,
  Smartphone,
  X
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { vtopClient } from '../../services/vtop/vtopClient';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { FocuslySymbol } from '../../components/brand/FocuslyLogo';
import { cn } from '../../utils/cn';

export const AuthDoorway: React.FC<{ initialMode?: 'login' | 'signup' }> = ({
  initialMode = 'login'
}) => {
  const {
    setView,
    updateUser,
    resetToDemoAccount,
    theme,
    toggleTheme,
    hydrateFromVtop
  } = useFocusStore();

  // Active auth portal tab: 'vtop' is primary by default, with 'standard' as alternative
  const [activeTab, setActiveTab] = useState<'vtop' | 'standard'>('vtop');
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);

  // VTOP Form State
  const [vtopRegNo, setVtopRegNo] = useState('22BCE1042');
  const [vtopPassword, setVtopPassword] = useState('••••••••••••');
  const [vtopSemester, setVtopSemester] = useState('WS202526');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [isVtopSyncing, setIsVtopSyncing] = useState(false);
  const [vtopStatusText, setVtopStatusText] = useState('');
  const [vtopPercent, setVtopPercent] = useState(0);
  const [vtopError, setVtopError] = useState<string | null>(null);

  // Standard Form State
  const [email, setEmail] = useState('aarav.sharma@stanford.edu');
  const [stdPassword, setStdPassword] = useState('focusly2026');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('Stanford University');
  const [degree, setDegree] = useState("B.S. Computer Science '26");

  // Simulated SSO Modal State
  const [isSsoModalOpen, setIsSsoModalOpen] = useState(false);
  const [ssoProvider, setSsoProvider] = useState<'stanford' | 'google'>('stanford');
  const [ssoStep, setSsoStep] = useState<'authenticating' | 'duo_push' | 'success'>('authenticating');

  // Load live CAPTCHA on initial mount
  useEffect(() => {
    loadFreshCaptcha();
  }, []);

  const loadFreshCaptcha = async () => {
    setIsLoadingCaptcha(true);
    setVtopError(null);
    try {
      const res = await vtopClient.getCaptcha();
      setCaptchaImage(res.captchaImage);
      setCaptchaInput('');
    } catch {
      setVtopError('Unable to fetch CAPTCHA from gateway. Please refresh.');
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  const handleVtopLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vtopRegNo.trim()) {
      setVtopError('Please enter your registration number.');
      return;
    }
    if (!vtopPassword.trim()) {
      setVtopError('Please enter your portal password.');
      return;
    }
    if (!captchaInput.trim()) {
      setVtopError('Please solve the captcha puzzle to authenticate.');
      return;
    }

    setVtopError(null);
    setIsVtopSyncing(true);
    setVtopPercent(10);
    setVtopStatusText('Connecting to university gateway...');

    try {
      const harvestedData = await vtopClient.loginAndHarvest(
        {
          regNo: vtopRegNo.trim().toUpperCase(),
          password: vtopPassword.trim(),
          captcha: captchaInput.trim().toUpperCase()
        },
        (step, pct) => {
          setVtopStatusText(step);
          setVtopPercent(pct);
        }
      );

      // Successfully authenticated & harvested. Hydrate Zustand store & persist to localStorage
      setTimeout(() => {
        hydrateFromVtop(harvestedData);
        setIsVtopSyncing(false);
      }, 700);
    } catch (err: any) {
      setIsVtopSyncing(false);
      setVtopError(err.message || 'Authentication failed. Please verify credentials.');
      loadFreshCaptcha();
    }
  };

  const handleTriggerSSO = (provider: 'stanford' | 'google') => {
    setSsoProvider(provider);
    setIsSsoModalOpen(true);
    setSsoStep('authenticating');

    if (provider === 'stanford') {
      setTimeout(() => {
        setSsoStep('duo_push');
      }, 1000);
    } else {
      setTimeout(() => {
        setSsoStep('success');
        setTimeout(() => {
          setIsSsoModalOpen(false);
          resetToDemoAccount('aarav');
        }, 800);
      }, 1200);
    }
  };

  const handleApproveDuoPush = () => {
    setSsoStep('success');
    setTimeout(() => {
      setIsSsoModalOpen(false);
      resetToDemoAccount('aarav');
    }, 900);
  };

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      resetToDemoAccount('aarav');
    } else {
      updateUser({
        name: name.trim() || 'New Scholar',
        email,
        institution,
        degree,
        onboardingCompleted: false
      });
      setView('onboarding');
    }
  };

  const handleQuickDemo = (persona: 'aarav' | 'maya') => {
    resetToDemoAccount(persona);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#0C0D10] text-[#18181A] dark:text-[#F0EFF4] flex flex-col justify-center items-center p-4 sm:p-6 relative transition-colors duration-200">
      {/* Top Header Controls: Theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to warm light mode' : 'Switch to clean dark mode'}
          className="p-2 rounded-xl text-[#686A70] dark:text-[#96979B] hover:text-[#18181A] dark:hover:text-white bg-white dark:bg-[#16171D] border border-[#E7E5DF] dark:border-[#242630] shadow-2xs transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#686A70]" />
          )}
        </button>
      </div>

      {/* Top Brand Identity */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#18181A] border border-[#E7E5DF] dark:border-[#2A2D36] shadow-xs mb-2.5">
          <FocuslySymbol size={40} variant="accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181A] dark:text-[#F3F4F6] tracking-tight">
          Focus<span className="text-[#F59E0B]">ly</span>
        </h1>
        <p className="text-xs text-[#686A70] dark:text-[#96979B] mt-0.5">
          Quiet Academic Operating System & Circadian Study Engine
        </p>
      </div>

      {/* 1-Click Instant Demo / Evaluator Showcase Callout */}
      <div className="w-full max-w-md mb-4 p-3.5 bg-[#FFF7E6] dark:bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold text-[#D97706] dark:text-[#F59E0B] mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Instant Demo Mode (1-Click Tour)</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#F59E0B] text-white px-2 py-0.5 rounded font-bold">
            No Credentials Needed
          </span>
        </div>
        <p className="text-[11px] text-[#686A70] dark:text-[#A0A3AB] mb-2.5">
          Evaluate the complete platform instantly with pre-loaded academic data and live features:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickDemo('aarav')}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#181924] border border-[#E7E5DF] dark:border-[#2A2D36] hover:border-[#F59E0B] text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#18181A] dark:text-white group-hover:text-[#F59E0B] truncate">
                Aarav Sharma
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A368]" />
            </div>
            <div className="text-[9.5px] text-[#686A70] dark:text-[#96979B] truncate mt-0.5">
              CSE '26 • Full Dashboard
            </div>
          </button>
          <button
            onClick={() => handleQuickDemo('maya')}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#181924] border border-[#E7E5DF] dark:border-[#2A2D36] hover:border-[#F59E0B] text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#18181A] dark:text-white group-hover:text-[#F59E0B] truncate">
                Maya Chen
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            </div>
            <div className="text-[9.5px] text-[#686A70] dark:text-[#96979B] truncate mt-0.5">
              Bioeng '27 • Onboarding Flow
            </div>
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <Card className="w-full max-w-md p-6 sm:p-7 bg-white dark:bg-[#14151C] border border-[#E7E5DF] dark:border-[#22242F] shadow-sm rounded-2xl">
        {/* Gateway Selection Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#F7F6F2] dark:bg-[#1B1C26] rounded-xl border border-[#E7E5DF] dark:border-[#262838] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('vtop')}
            className={cn(
              'py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              activeTab === 'vtop'
                ? 'bg-white dark:bg-[#252838] text-[#18181A] dark:text-white shadow-xs font-bold text-[#F59E0B]'
                : 'text-[#686A70] dark:text-[#96979B] hover:text-[#18181A] dark:hover:text-white'
            )}
          >
            <School className="w-3.5 h-3.5" />
            <span>VIT College Portal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={cn(
              'py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              activeTab === 'standard'
                ? 'bg-white dark:bg-[#252838] text-[#18181A] dark:text-white shadow-xs font-bold'
                : 'text-[#686A70] dark:text-[#96979B] hover:text-[#18181A] dark:hover:text-white'
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email / SSO</span>
          </button>
        </div>

        {/* TAB 1: VTOP STUDENT PORTAL LOGIN WITH LIVE CAPTCHA */}
        {activeTab === 'vtop' && (
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#18181A] dark:text-[#F0EFF4] flex items-center gap-1.5">
                  <span>VTOP Student Authentication</span>
                </h2>
                <span className="text-[10px] font-mono text-[#16A368] bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-medium">
                  Gateway Live
                </span>
              </div>
              <p className="text-xs text-[#686A70] dark:text-[#96979B] mt-1">
                Enter your VIT registration number and password to sync your timetable, slots, and attendance.
              </p>
            </div>

            {vtopError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
                <AlertCircle className="w-4 h-4 text-[#DC5A63] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{vtopError}</p>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                    You can also use 1-Click Instant Demo above to test immediately.
                  </p>
                </div>
              </div>
            )}

            {isVtopSyncing ? (
              <div className="py-6 px-4 bg-[#FCFBF8] dark:bg-[#181924] rounded-xl border border-[#E7E5DF] dark:border-[#2A2D36] text-center space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFF7E6] dark:bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center mx-auto animate-pulse">
                  <School className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#18181A] dark:text-white">
                    Synchronizing Academic Profile
                  </h3>
                  <p className="text-[11px] text-[#686A70] dark:text-[#96979B] mt-1">
                    {vtopStatusText}
                  </p>
                </div>
                <div className="w-full bg-[#E7E5DF] dark:bg-[#2A2D36] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F59E0B] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${vtopPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#96979B] font-mono">
                  <span>Harvesting VTOP Datasets</span>
                  <span>{vtopPercent}%</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVtopLogin} className="space-y-3.5">
                {/* Registration Number */}
                <div>
                  <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                    Registration Number
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#96979B]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 22BCE1042"
                      value={vtopRegNo}
                      onChange={(e) => setVtopRegNo(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] font-mono uppercase tracking-wider transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                    VTOP Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#96979B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter portal password"
                      value={vtopPassword}
                      onChange={(e) => setVtopPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#96979B] hover:text-[#18181A] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Semester Selection */}
                <div>
                  <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                    Academic Term / Semester
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#96979B]" />
                    <select
                      value={vtopSemester}
                      onChange={(e) => setVtopSemester(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors"
                    >
                      <option value="WS202526">Winter Semester 2025-26</option>
                      <option value="FS202526">Fall Semester 2025-26</option>
                    </select>
                  </div>
                </div>

                {/* LIVE CAPTCHA SECTION */}
                <div className="p-3 bg-[#FCFBF8] dark:bg-[#181924] border border-[#E7E5DF] dark:border-[#2A2D36] rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#18181A] dark:text-white flex items-center gap-1.5">
                      <span>Verification CAPTCHA</span>
                    </span>
                    <button
                      type="button"
                      onClick={loadFreshCaptcha}
                      disabled={isLoadingCaptcha}
                      className="text-[10px] text-[#686A70] hover:text-[#F59E0B] dark:text-[#96979B] dark:hover:text-[#F59E0B] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className={cn('w-3 h-3', isLoadingCaptcha && 'animate-spin')} />
                      <span>Refresh Code</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* CAPTCHA Display Box */}
                    <div className="h-10 w-36 bg-[#F7F6F2] dark:bg-[#111217] rounded-lg border border-[#E7E5DF] dark:border-[#2A2D36] flex items-center justify-center overflow-hidden shrink-0 select-none">
                      {isLoadingCaptcha ? (
                        <span className="text-[10px] text-[#96979B] animate-pulse">Loading...</span>
                      ) : captchaImage ? (
                        <img
                          src={captchaImage}
                          alt="VTOP Captcha"
                          className="h-full w-full object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="text-[10px] text-[#96979B]">No Captcha</span>
                      )}
                    </div>

                    {/* CAPTCHA Text Input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        placeholder="Enter 5-digit code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full px-3 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-white dark:bg-[#14151C] text-[#18181A] dark:text-white rounded-lg focus:outline-none focus:border-[#F59E0B] font-mono uppercase tracking-widest text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 text-xs font-semibold mt-2 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Log In & Harvest Academic Data</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-[#E7E5DF] dark:border-[#22242F] flex items-center justify-between text-[11px] text-[#686A70] dark:text-[#96979B]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A368]" />
                <span>Encrypted Session • Stored Locally</span>
              </div>
              <span className="font-mono text-[10px]">VTOP v4.2 Bridge</span>
            </div>
          </div>
        )}

        {/* TAB 2: STANDARD EMAIL / SSO */}
        {activeTab === 'standard' && (
          <div>
            {/* Toggle Pills: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-[#F7F6F2] dark:bg-[#1B1C26] rounded-xl border border-[#E7E5DF] dark:border-[#262838] mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setEmail('aarav.sharma@stanford.edu');
                }}
                className={cn(
                  'py-1.5 rounded-lg transition-all cursor-pointer',
                  isLogin
                    ? 'bg-white dark:bg-[#252838] text-[#18181A] dark:text-white shadow-xs'
                    : 'text-[#686A70] dark:text-[#96979B] hover:text-[#18181A] dark:hover:text-white'
                )}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setEmail('maya.chen@stanford.edu');
                  setName('Maya Chen');
                }}
                className={cn(
                  'py-1.5 rounded-lg transition-all cursor-pointer',
                  !isLogin
                    ? 'bg-white dark:bg-[#252838] text-[#18181A] dark:text-white shadow-xs'
                    : 'text-[#686A70] dark:text-[#96979B] hover:text-[#18181A] dark:hover:text-white'
                )}
              >
                Create Account
              </button>
            </div>

            {/* Institutional Single Sign-On Options */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleTriggerSSO('stanford')}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2 border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181A23] hover:bg-[#F7F6F2] dark:hover:bg-[#202230] rounded-xl text-[#18181A] dark:text-[#F0EFF4] text-xs font-medium shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-4 h-4 rounded-full bg-[#8C1515] text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
                  S
                </div>
                <span>Continue with Stanford Cardinal Key / SSO</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerSSO('google')}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2 border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181A23] hover:bg-[#F7F6F2] dark:hover:bg-[#202230] rounded-xl text-[#18181A] dark:text-[#F0EFF4] text-xs font-medium shadow-2xs transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Workspace</span>
              </button>
            </div>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E7E5DF] dark:border-[#22242F]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white dark:bg-[#14151C] px-3 text-[#96979B] dark:text-[#686A70]">
                  or with email credentials
                </span>
              </div>
            </div>

            <form onSubmit={handleManualAuth} className="space-y-3">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#96979B]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maya Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                        Institution
                      </label>
                      <select
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors"
                      >
                        <option value="Stanford University">Stanford</option>
                        <option value="VIT Vellore">VIT Vellore</option>
                        <option value="UC Berkeley">Berkeley</option>
                        <option value="MIT">MIT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B.S. CS '26"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#96979B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#18181A] dark:text-[#F0EFF4] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#96979B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={stdPassword}
                    onChange={(e) => setStdPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs border border-[#E7E5DF] dark:border-[#262836] bg-[#FCFBF8] dark:bg-[#181924] text-[#18181A] dark:text-[#F0EFF4] rounded-xl focus:outline-none focus:border-[#F59E0B] transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#96979B] hover:text-[#18181A] dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-xs font-semibold mt-2 shadow-xs cursor-pointer"
              >
                {isLogin ? (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                ) : (
                  <>
                    <span>Launch Onboarding Setup</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </Card>

      {/* Simulated Stanford Axess / Duo 2FA Modal */}
      {isSsoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Card className="w-full max-w-sm p-6 bg-white dark:bg-[#161720] border border-[#E7E5DF] dark:border-[#2A2D3D] shadow-calm-lg rounded-2xl relative">
            <button
              onClick={() => setIsSsoModalOpen(false)}
              className="absolute top-4 right-4 text-[#686A70] hover:text-[#18181A] dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {ssoStep === 'authenticating' && (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8C1515] text-white flex items-center justify-center text-xl font-bold mx-auto shadow-sm animate-pulse">
                  S
                </div>
                <h3 className="text-sm font-bold text-[#18181A] dark:text-white">
                  Connecting to University SSO
                </h3>
                <p className="text-xs text-[#686A70] dark:text-[#96979B]">
                  Verifying Cardinal Key certificate and credentials...
                </p>
              </div>
            )}

            {ssoStep === 'duo_push' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#16A368] flex items-center justify-center mx-auto shadow-sm">
                  <Smartphone className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#18181A] dark:text-white">
                    Duo Mobile 2-Factor Push
                  </h3>
                  <p className="text-xs text-[#686A70] dark:text-[#96979B] mt-1">
                    Push notification sent to student device...
                  </p>
                </div>
                <div className="p-3 bg-[#FCFBF8] dark:bg-[#1F212C] rounded-xl text-left border border-[#E7E5DF] dark:border-[#2B2E3E] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#686A70]">Service:</span>
                    <span className="font-semibold text-[#18181A] dark:text-white">Stanford Axess SSO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#686A70]">Location:</span>
                    <span className="font-semibold text-[#18181A] dark:text-white">Stanford, CA</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleApproveDuoPush}
                  className="w-full py-2.5 text-xs font-semibold cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Approve Duo Push
                </Button>
              </div>
            )}

            {ssoStep === 'success' && (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#16A368] text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#18181A] dark:text-white">
                  Authentication Verified!
                </h3>
                <p className="text-xs text-[#686A70] dark:text-[#96979B]">
                  Launching your personalized academic workspace...
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
