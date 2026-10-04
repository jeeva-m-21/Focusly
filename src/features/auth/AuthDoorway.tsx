import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2,
  Smartphone,
  Sun,
  Moon,
  School,
  X
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const AuthDoorway: React.FC<{ initialMode?: 'login' | 'signup' }> = ({
  initialMode = 'login'
}) => {
  const { setView, updateUser, resetToDemoAccount, theme, toggleTheme } = useFocusStore();

  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('aarav.sharma@stanford.edu');
  const [password, setPassword] = useState('focusly2026');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('Stanford University');
  const [degree, setDegree] = useState("B.S. Bioengineering '27");

  // Simulated 2FA / SSO State
  const [isSsoModalOpen, setIsSsoModalOpen] = useState(false);
  const [ssoProvider, setSsoProvider] = useState<'stanford' | 'google'>('stanford');
  const [ssoStep, setSsoStep] = useState<'authenticating' | 'duo_push' | 'success'>('authenticating');

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
          setView('overview');
        }, 800);
      }, 1200);
    }
  };

  const handleApproveDuoPush = () => {
    setSsoStep('success');
    setTimeout(() => {
      setIsSsoModalOpen(false);
      setView('overview');
    }, 900);
  };

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      updateUser({ email });
      setView('overview');
    } else {
      // Create new profile and proceed to interactive Onboarding Flow
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
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0c0d10] text-[#1c1d21] dark:text-[#f0eff4] flex flex-col justify-center items-center p-4 relative transition-colors duration-200">
      {/* Top Header Controls: Theme & Quick Demo Access */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to warm light mode' : 'Switch to clean dark mode'}
          className="p-2 rounded-xl text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white bg-white dark:bg-[#16171d] border border-[#e8e5df] dark:border-[#242630] shadow-2xs transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#64676e]" />
          )}
        </button>
      </div>

      {/* Top Brand Logo */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#1c1d21] dark:bg-white text-white dark:text-[#0c0d10] shadow-sm mb-2.5 font-black text-base">
          F
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d21] dark:text-[#f0eff4] tracking-tight">
          Focusly
        </h1>
        <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
          Quiet Academic Command & Bio-Rhythm Study Engine
        </p>
      </div>

      {/* Quick 1-Click Evaluation / Demo Mode Banner */}
      <div className="w-full max-w-md mb-4 p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200 mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Interactive Demo Personas</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 uppercase tracking-wider">Instant Tour</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickDemo('aarav')}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1b1c24] border border-amber-200 dark:border-amber-900/80 hover:border-amber-400 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="text-[11px] font-bold text-[#1c1d21] dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 truncate">
              Aarav Sharma
            </div>
            <div className="text-[9.5px] text-[#787b84] dark:text-[#8d929e] truncate">
              Active CS '26 • Full Dashboard
            </div>
          </button>
          <button
            onClick={() => handleQuickDemo('maya')}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1b1c24] border border-amber-200 dark:border-amber-900/80 hover:border-amber-400 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="text-[11px] font-bold text-[#1c1d21] dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 truncate">
              Maya Chen
            </div>
            <div className="text-[9.5px] text-[#787b84] dark:text-[#8d929e] truncate">
              New Student • Onboarding Flow
            </div>
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <Card className="w-full max-w-md p-6 sm:p-7 bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#22242f] shadow-sm rounded-2xl">
        {/* Toggle Pills: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-[#f4f1eb] dark:bg-[#1b1c26] rounded-xl border border-[#e8e5df] dark:border-[#262838] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setEmail('aarav.sharma@stanford.edu');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              isLogin
                ? 'bg-white dark:bg-[#252838] text-[#1c1d21] dark:text-white shadow-xs'
                : 'text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
            }`}
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
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              !isLogin
                ? 'bg-white dark:bg-[#252838] text-[#1c1d21] dark:text-white shadow-xs'
                : 'text-[#787b84] dark:text-[#8d929e] hover:text-[#1c1d21] dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Card Header Context */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-[#1c1d21] dark:text-[#f0eff4]">
            {isLogin ? 'Welcome Back to Focusly' : 'Set Up Your Academic Profile'}
          </h2>
          <p className="text-xs text-[#64676e] dark:text-[#9ba0a9] mt-0.5">
            {isLogin
              ? 'Access your daily circadian focus timeline and active coursework.'
              : 'Configure your enrolled units, study peaks, and attendance policies.'}
          </p>
        </div>

        {/* Institutional Single Sign-On Options */}
        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={() => handleTriggerSSO('stanford')}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-[#e8e5df] dark:border-[#262836] bg-[#faf8f5] dark:bg-[#181a23] hover:bg-[#f3f0e8] dark:hover:bg-[#202230] rounded-xl text-[#1c1d21] dark:text-[#f0eff4] text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
          >
            <div className="w-4 h-4 rounded-full bg-[#8c1515] text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
              S
            </div>
            <span>Continue with Stanford Cardinal Key / SSO</span>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerSSO('google')}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-[#e8e5df] dark:border-[#262836] bg-[#faf8f5] dark:bg-[#181a23] hover:bg-[#f3f0e8] dark:hover:bg-[#202230] rounded-xl text-[#1c1d21] dark:text-[#f0eff4] text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8e5df] dark:border-[#22242f]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-white dark:bg-[#14151c] px-3 text-[#9da0a6] dark:text-[#676b76]">
              or with email & credentials
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleManualAuth} className="space-y-3">
          {/* Sign Up Fields */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9da0a6]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] rounded-xl focus:outline-none focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                    Institution
                  </label>
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] rounded-xl focus:outline-none focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                  >
                    <option value="Stanford University">Stanford University</option>
                    <option value="UC Berkeley">UC Berkeley</option>
                    <option value="MIT">MIT</option>
                    <option value="Harvard University">Harvard University</option>
                    <option value="Carnegie Mellon">Carnegie Mellon</option>
                    <option value="University of Washington">Univ. of Washington</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
                    Program / Major
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.S. CS '26"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] rounded-xl focus:outline-none focus:border-[#1c1d21] dark:focus:border-white transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4] mb-1">
              {isLogin ? 'Institutional Email' : 'University Email (.edu)'}
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9da0a6]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sunetid@stanford.edu"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] rounded-xl focus:outline-none focus:border-[#1c1d21] dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#1c1d21] dark:text-[#f0eff4]">
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => alert('Demo Mode: Use any password or click a 1-click persona above.')}
                  className="text-[11px] text-[#787b84] hover:text-[#1c1d21] dark:hover:text-white cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9da0a6]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs border border-[#e8e5df] dark:border-[#262836] bg-white dark:bg-[#181924] text-[#1c1d21] dark:text-[#f0eff4] rounded-xl focus:outline-none focus:border-[#1c1d21] dark:focus:border-white font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#9da0a6] hover:text-[#1c1d21] dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
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

        {/* Security & Verification Footer */}
        <div className="mt-5 pt-3.5 border-t border-[#f0ede6] dark:border-[#22242f] flex items-center justify-between text-[11px] text-[#787b84] dark:text-[#8d929e]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Stanford Shibboleth & Canvas Ready</span>
          </div>
          <span className="font-mono text-[10px]">v1.0.0</span>
        </div>
      </Card>

      {/* Simulated Stanford Axess / Duo 2FA Modal */}
      {isSsoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Card className="w-full max-w-sm p-6 bg-white dark:bg-[#161720] border border-[#e8e5df] dark:border-[#2a2d3d] shadow-calm-lg rounded-2xl relative">
            <button
              onClick={() => setIsSsoModalOpen(false)}
              className="absolute top-4 right-4 text-[#787b84] hover:text-[#1c1d21] dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {ssoStep === 'authenticating' && (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8c1515] text-white flex items-center justify-center text-xl font-bold mx-auto shadow-sm animate-pulse">
                  S
                </div>
                <h3 className="text-sm font-bold text-[#1c1d21] dark:text-white">
                  Connecting to Stanford Login
                </h3>
                <p className="text-xs text-[#787b84] dark:text-[#8d929e]">
                  Verifying Cardinal Key certificate and credentials...
                </p>
              </div>
            )}

            {ssoStep === 'duo_push' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <Smartphone className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1c1d21] dark:text-white">
                    Duo Mobile 2-Factor Push
                  </h3>
                  <p className="text-xs text-[#787b84] dark:text-[#8d929e] mt-1">
                    Push notification sent to Aarav's iPhone (Stanford CS)...
                  </p>
                </div>
                <div className="p-3 bg-[#f8f6f2] dark:bg-[#1f212c] rounded-xl text-left border border-[#e8e5df] dark:border-[#2b2e3e] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#787b84]">Service:</span>
                    <span className="font-semibold text-[#1c1d21] dark:text-white">Stanford Axess SSO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#787b84]">Location:</span>
                    <span className="font-semibold text-[#1c1d21] dark:text-white">Stanford, CA</span>
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
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#1c1d21] dark:text-white">
                  Authentication Verified!
                </h3>
                <p className="text-xs text-[#787b84] dark:text-[#8d929e]">
                  Launching your personalized study dashboard...
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
