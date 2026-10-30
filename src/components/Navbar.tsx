import React from 'react';
import { Sun, Moon, Terminal, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenBackendGuide: () => void;
  onNavigateHome: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenBackendGuide,
  onNavigateHome,
  onScrollTo,
}) => {
  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b ${
        isDarkMode
          ? 'bg-slate-950/80 border-slate-800/80'
          : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single brand wordmark */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="text-base font-bold tracking-tight whitespace-nowrap">
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>All Video</span>{' '}
            <span className="text-indigo-400">Downloader</span>
          </div>
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onScrollTo('platforms')}
            className={`whitespace-nowrap transition-colors hover:text-indigo-400 cursor-pointer ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Platforms
          </button>
          <button
            onClick={() => onScrollTo('how-it-works')}
            className={`whitespace-nowrap transition-colors hover:text-indigo-400 cursor-pointer ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onScrollTo('faq')}
            className={`whitespace-nowrap transition-colors hover:text-indigo-400 cursor-pointer ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={onOpenBackendGuide}
            className={`whitespace-nowrap transition-colors hover:text-indigo-400 cursor-pointer flex items-center gap-1.5 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Python Backend</span>
          </button>
        </nav>

        {/* Zone 3: Actions - Theme toggle + Backend Guide */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-black hover:border-slate-300'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenBackendGuide}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Self-Host & Free Deploy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
