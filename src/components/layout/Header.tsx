import React, { useState } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Flame,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  Sparkles,
  GraduationCap,
  LogOut,
  UserCheck,
  Compass
} from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    setCommandPalette,
    setQuickBlockModal,
    setView,
    currentView,
    activeDeepWork,
    setMobileMenuOpen,
    resetToDemoAccount,
    setOnboardingStep
  } = useFocusStore();

  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  return (
    <header className="h-[calc(3.5rem+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)] bg-[#fcfbf9]/95 dark:bg-[#101115]/95 backdrop-blur-md border-b border-[#e8e5df] dark:border-[#20222a] px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 select-none transition-colors duration-200">
      {/* Left: Mobile Menu & Clean Consolidated Context */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-1.5 rounded-lg text-[#64676e] dark:text-[#9ba0a9] hover:bg-[#f4f1eb] dark:hover:bg-[#1a1c24] border border-[#e8e5df] dark:border-[#262832] transition-colors cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-[#1c1d21] dark:text-[#f0eff4] bg-[#f4f1eb]/80 dark:bg-[#181a24] hover:bg-[#eae6dd] dark:hover:bg-[#202230] border border-[#e8e5df] dark:border-[#252838] transition-colors cursor-pointer group"
              title="Demonstrate Auth & Onboarding Flow"
            >
              <span>{user.institution} · {user.term}</span>
              <ChevronDown className={`w-3 h-3 text-[#787b84] dark:text-[#8d929e] transition-transform ${isDemoMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <span className="text-xs text-[#787b84] dark:text-[#8d929e] hidden sm:inline">·</span>
            <span className="text-xs text-[#787b84] dark:text-[#8d929e] hidden sm:inline font-medium">Thu, Week 5</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden sm:inline-block ml-0.5" title="Academic Sync Active" />
          </div>

          {/* Interactive Demo & Auth Switcher Dropdown */}
          {isDemoMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDemoMenuOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#161720] border border-[#e8e5df] dark:border-[#272938] rounded-2xl shadow-calm-lg p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-[#f0ede6] dark:border-[#22242f] mb-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#787b84] dark:text-[#8d929e]">
                      Flow Demonstration
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1c1d21] dark:text-white font-medium mt-0.5 truncate">
                    Current: {user.name} ({user.degree})
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsDemoMenuOpen(false);
                      setOnboardingStep(1);
                      setView('onboarding');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#f4f1eb] dark:hover:bg-[#1f212c] text-[#1c1d21] dark:text-[#f0eff4] transition-colors cursor-pointer group"
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-xs">Run Onboarding Flow</div>
                      <div className="text-[10px] text-[#787b84] dark:text-[#8d929e]">4-step academic setup wizard</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsDemoMenuOpen(false);
                      setView('auth-login');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#f4f1eb] dark:hover:bg-[#1f212c] text-[#1c1d21] dark:text-[#f0eff4] transition-colors cursor-pointer group"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-xs">Open Sign In & VTOP Doorway</div>
                      <div className="text-[10px] text-[#787b84] dark:text-[#8d929e]">VTOP portal & CAPTCHA gateway</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsDemoMenuOpen(false);
                      setView('auth-signup');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#f4f1eb] dark:hover:bg-[#1f212c] text-[#1c1d21] dark:text-[#f0eff4] transition-colors cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-xs">Test New Student Sign-Up</div>
                      <div className="text-[10px] text-[#787b84] dark:text-[#8d929e]">Register profile & jump to setup</div>
                    </div>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-[#f0ede6] dark:border-[#22242f] space-y-1">
                  <div className="px-2 text-[10px] uppercase font-bold text-[#787b84] dark:text-[#8d929e]">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => {
                      setIsDemoMenuOpen(false);
                      resetToDemoAccount('aarav');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f4f1eb] dark:hover:bg-[#1f212c] text-[#1c1d21] dark:text-[#f0eff4] transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-xs">Aarav (VIT CSE '26)</span>
                    <span className="text-[10px] font-mono text-[#787b84]">22BCE1042</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDemoMenuOpen(false);
                      resetToDemoAccount('maya');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f4f1eb] dark:hover:bg-[#1f212c] text-[#1c1d21] dark:text-[#f0eff4] transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-xs">Maya (VIT '27)</span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">Onboarding</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Search, Theme Toggle & Primary Action */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Active Timer Pill if Running */}
        {activeDeepWork.isRunning && currentView !== 'focus-timer' && (
          <button
            onClick={() => setView('focus-timer')}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 bg-[#fffbeb] dark:bg-[#78350f]/30 border border-[#fde68a] dark:border-[#92400e] text-[#b45309] dark:text-[#fbbf24] rounded-lg text-xs font-mono font-semibold hover:bg-[#fef3c7] dark:hover:bg-[#78350f]/40 transition-all cursor-pointer shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>
              {Math.floor(activeDeepWork.remainingSeconds / 60)}:
              {(activeDeepWork.remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </button>
        )}

        {/* ⌘K Universal Search Button */}
        <button
          onClick={() => setCommandPalette(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#f4f1eb]/80 dark:bg-[#16171d] hover:bg-[#eae6de] dark:hover:bg-[#1e2028] border border-[#e8e5df] dark:border-[#242630] rounded-lg text-xs text-[#64676e] dark:text-[#9ba0a9] transition-all cursor-pointer w-9 sm:w-52 justify-center sm:justify-between group"
          title="Search (⌘K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-[#9da0a6] group-hover:text-[#1c1d21] dark:group-hover:text-white" />
            <span className="truncate hidden sm:inline">Search tasks or jump to...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#20222b] border border-[#e8e5df] dark:border-[#2c2f3c] rounded text-[#64676e] dark:text-[#9ba0a9] shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Clean Theme Toggle Button (Light / Clean Dark) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to warm light mode' : 'Switch to clean dark mode'}
          className="p-1.5 sm:p-2 rounded-lg text-[#64676e] dark:text-[#9ba0a9] hover:text-[#1c1d21] dark:hover:text-white bg-[#f4f1eb]/80 dark:bg-[#16171d] hover:bg-[#eae6de] dark:hover:bg-[#1e2028] border border-[#e8e5df] dark:border-[#242630] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#64676e]" />
          )}
        </button>

        {/* New Task Action */}
        <Button
          onClick={() => setQuickBlockModal(true)}
          size="sm"
          variant="primary"
          icon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150"
        >
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">Task</span>
          <kbd className="hidden sm:inline-block text-[9.5px] font-mono opacity-60 ml-1 px-1 py-0.2 rounded bg-white/20 dark:bg-black/30">
            N
          </kbd>
        </Button>
      </div>
    </header>
  );
};
