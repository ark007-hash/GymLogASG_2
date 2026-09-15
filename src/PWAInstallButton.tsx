import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="w-full flex items-center justify-center gap-3 p-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 mt-4"
      >
        <Download size={20} />
        Install App to Device
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white">
              {isIOS ? 'Install on iPhone / iPad' : 'Install App'}
            </h3>
            <div className="mt-4 text-sm text-neutral-300 space-y-3 leading-relaxed">
              {isIOS ? (
                <>
                  <p>1. Tap the <strong>Share</strong> button in the Safari toolbar.</p>
                  <p>2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                </>
              ) : (
                <>
                  <p>To install GymLog:</p>
                  <p>1. Open your browser menu (usually three dots in the top right).</p>
                  <p>2. Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
                  <p className="text-xs text-neutral-500 mt-2">Note: If you are using the AI Studio preview window, open the app in a new tab first.</p>
                </>
              )}
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-xl bg-neutral-800 py-3 text-sm font-bold text-white hover:bg-neutral-700 active:bg-neutral-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
