import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, Share, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect if already installed in standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
              Focusly App Installed
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Running in standalone native window with offline caching.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-[#faf8f5] dark:bg-[#181923] border border-[#e8e5df] dark:border-[#272938] text-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1c1d21] dark:bg-white text-white dark:text-[#1c1d21] flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#1c1d21] dark:text-[#f0eff4]">
              Install Mobile & Desktop App
            </h4>
            <p className="text-[11px] text-[#787b84] dark:text-[#8d929e]">
              Progressive Web App (PWA) • Works offline in lecture halls
            </p>
          </div>
        </div>

        {deferredPrompt ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleInstallClick}
            icon={<Download className="w-3.5 h-3.5" />}
            className="text-xs font-semibold px-3 py-1.5"
          >
            Install App
          </Button>
        ) : isIOS ? (
          <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            iOS Safari
          </span>
        ) : (
          <span className="text-[10px] font-mono text-[#787b84] dark:text-[#8d929e] bg-white dark:bg-[#20222b] px-2 py-0.5 rounded border border-[#e8e5df] dark:border-[#2b2e3c]">
            Web App Ready
          </span>
        )}
      </div>

      {isIOS && !deferredPrompt && (
        <div className="p-2.5 rounded-lg bg-white dark:bg-[#14151c] border border-[#e8e5df] dark:border-[#232532] text-[11px] text-[#64676e] dark:text-[#9ba0a9] flex items-center gap-2">
          <Share className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            On iPhone/iPad: tap the <strong>Share</strong> button in Safari, then select <strong>"Add to Home Screen"</strong>.
          </span>
        </div>
      )}
    </div>
  );
};
