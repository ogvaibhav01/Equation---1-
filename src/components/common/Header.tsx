import React from 'react';

interface HeaderProps {
  currentModule: 'snells-law' | 'projectile-motion';
  onSelectModule: (module: 'snells-law' | 'projectile-motion') => void;
  onResetModule: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onSelectModule,
  onResetModule,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-sm shadow-cyan-500/20 text-sm">
            E₁
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Equation 1
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400 pl-2 border-l border-slate-800">
            Physics &amp; Math Lab
          </span>
        </div>

        {/* Zone 2: Module navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => onSelectModule('snells-law')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer ${
              currentModule === 'snells-law'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Snell&apos;s Law &amp; Refraction
          </button>
          <button
            onClick={() => onSelectModule('projectile-motion')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer ${
              currentModule === 'projectile-motion'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Projectile Motion
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onResetModule}
            title="Reset active simulation parameters"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};
