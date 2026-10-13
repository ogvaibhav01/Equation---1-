/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { SnellsLawModule } from './components/snells-law/SnellsLawModule';
import { ProjectileMotionModule } from './components/projectile/ProjectileMotionModule';

type ModuleType = 'snells-law' | 'projectile-motion';

export default function App() {
  // Determine initial module from window pathname
  const [currentModule, setCurrentModule] = useState<ModuleType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('projectile-motion')) {
        return 'projectile-motion';
      }
    }
    return 'snells-law';
  });

  // Keep browser URL synchronized with selected module
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('projectile-motion')) {
        setCurrentModule('projectile-motion');
      } else {
        setCurrentModule('snells-law');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectModule = (module: ModuleType) => {
    setCurrentModule(module);
    const targetPath =
      module === 'snells-law'
        ? '/physics/snells-law'
        : '/physics/projectile-motion';

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  const handleResetModule = () => {
    // Force re-render of current module
    const current = currentModule;
    setCurrentModule(current === 'snells-law' ? 'projectile-motion' : 'snells-law');
    setTimeout(() => {
      setCurrentModule(current);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Equation 1 Application Top Bar */}
      <Header
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        onResetModule={handleResetModule}
      />

      {/* Main Laboratory Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentModule === 'snells-law' ? (
          <SnellsLawModule key="snells-law" />
        ) : (
          <ProjectileMotionModule key="projectile-motion" />
        )}
      </main>

      {/* Clean Laboratory Footer (anti-slop: unboxed metadata, zero pill boxes) */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Equation 1</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Mathematics &amp; Physics Laboratory</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>Classical Electrodynamics &amp; Optics</span>
            <span aria-hidden="true">·</span>
            <span>Pure TypeScript Physics Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
