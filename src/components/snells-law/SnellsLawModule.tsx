import React, { useState, useMemo } from 'react';
import {
  computeOptics,
  MEDIUM_PRESETS,
} from '../../physics/snellModel';
import { TestCase } from '../../types/optics';
import { OpticsCanvas } from './OpticsCanvas';
import { MediaControls } from './MediaControls';
import { MeasurementsPanel } from './MeasurementsPanel';
import { StepCalculation } from './StepCalculation';
import { EquationsPanel } from './EquationsPanel';
import { ValidationCases } from './ValidationCases';
import { EducationalInsights } from './EducationalInsights';

export const SnellsLawModule: React.FC = () => {
  // Scientific parameters state
  const [n1, setN1] = useState<number>(1.0003); // Air default
  const [n2, setN2] = useState<number>(1.500); // Crown glass default
  const [theta1, setTheta1] = useState<number>(45.0); // 45° incident angle

  const [medium1PresetId, setMedium1PresetId] = useState<string>('air');
  const [medium2PresetId, setMedium2PresetId] = useState<string>('glass');

  // Display toggles
  const [showNormal, setShowNormal] = useState<boolean>(true);
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [showReflectedRay, setShowReflectedRay] = useState<boolean>(true);
  const [showAngleLabels, setShowAngleLabels] = useState<boolean>(true);
  const [showWavefronts, setShowWavefronts] = useState<boolean>(true);

  // Tab for auxiliary panel (Equations vs Derivation vs Educational Theory)
  const [activeTab, setActiveTab] = useState<'equations' | 'derivation' | 'theory' | 'validation'>('derivation');

  // Single source of truth physics calculation
  const calc = useMemo(() => {
    return computeOptics(n1, n2, theta1);
  }, [n1, n2, theta1]);

  const medium1Name = useMemo(() => {
    const preset = MEDIUM_PRESETS.find((p) => p.id === medium1PresetId);
    return preset ? preset.name : 'Custom Medium';
  }, [medium1PresetId]);

  const medium2Name = useMemo(() => {
    const preset = MEDIUM_PRESETS.find((p) => p.id === medium2PresetId);
    return preset ? preset.name : 'Custom Medium';
  }, [medium2PresetId]);

  const handleN1Change = (newN1: number, presetId?: string) => {
    setN1(newN1);
    setMedium1PresetId(presetId || 'custom');
  };

  const handleN2Change = (newN2: number, presetId?: string) => {
    setN2(newN2);
    setMedium2PresetId(presetId || 'custom');
  };

  const handleSwapMedia = () => {
    const prevN1 = n1;
    const prevN2 = n2;
    const prevP1 = medium1PresetId;
    const prevP2 = medium2PresetId;

    setN1(prevN2);
    setN2(prevN1);
    setMedium1PresetId(prevP2);
    setMedium2PresetId(prevP1);
  };

  const handleReset = () => {
    setN1(1.0003);
    setN2(1.500);
    setTheta1(45.0);
    setMedium1PresetId('air');
    setMedium2PresetId('glass');
    setShowNormal(true);
    setShowArcs(true);
    setShowReflectedRay(true);
    setShowAngleLabels(true);
  };

  const handleSelectTestCase = (tc: TestCase) => {
    setN1(tc.n1);
    setN2(tc.n2);
    setTheta1(tc.theta1);

    // Identify preset if matching
    const p1 = MEDIUM_PRESETS.find((p) => Math.abs(p.index - tc.n1) < 0.005);
    const p2 = MEDIUM_PRESETS.find((p) => Math.abs(p.index - tc.n2) < 0.005);
    setMedium1PresetId(p1 ? p1.id : 'custom');
    setMedium2PresetId(p2 ? p2.id : 'custom');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Module Title Banner */}
      <div className="space-y-2 border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-2">
              <span>Optics Laboratory</span>
              <span className="text-slate-600">·</span>
              <span>Geometric &amp; Wave Refraction</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Snell&apos;s Law &amp; Refraction
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-400 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">
              Governing Equation: n₁·sin(θ₁) = n₂·sin(θ₂)
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Explore electromagnetic wave refraction, angular deviation, and total internal reflection across optical interfaces. Adjust incident angles or medium optical densities to observe light path changes in real time.
        </p>
      </div>

      {/* Primary Layout: Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Column: Stage (Canvas) + Live Measurements (7 cols on lg, 8 cols on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <OpticsCanvas
            calc={calc}
            medium1Name={medium1Name}
            medium2Name={medium2Name}
            showNormal={showNormal}
            showArcs={showArcs}
            showReflectedRay={showReflectedRay}
            showAngleLabels={showAngleLabels}
            showWavefronts={showWavefronts}
            onAngleChange={setTheta1}
          />

          <MeasurementsPanel
            calc={calc}
            medium1Name={medium1Name}
            medium2Name={medium2Name}
          />
        </div>

        {/* Right Column: Experimental Parameters & Media Controls (5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <MediaControls
            n1={n1}
            n2={n2}
            theta1={theta1}
            medium1PresetId={medium1PresetId}
            medium2PresetId={medium2PresetId}
            showNormal={showNormal}
            showArcs={showArcs}
            showReflectedRay={showReflectedRay}
            showAngleLabels={showAngleLabels}
            showWavefronts={showWavefronts}
            criticalAngle={calc.criticalAngleDeg}
            onN1Change={handleN1Change}
            onN2Change={handleN2Change}
            onTheta1Change={setTheta1}
            onSwapMedia={handleSwapMedia}
            onToggleNormal={() => setShowNormal(!showNormal)}
            onToggleArcs={() => setShowArcs(!showArcs)}
            onToggleReflectedRay={() => setShowReflectedRay(!showReflectedRay)}
            onToggleAngleLabels={() => setShowAngleLabels(!showAngleLabels)}
            onToggleWavefronts={() => setShowWavefronts(!showWavefronts)}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Auxiliary Mathematical, Analytical & Educational Sections */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('derivation')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'derivation'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Step-by-Step Derivation
            </button>
            <button
              onClick={() => setActiveTab('equations')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'equations'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Governing Principles
            </button>
            <button
              onClick={() => setActiveTab('validation')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'validation'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verification Cases (A–G)
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Educational Theory
            </button>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Interactive Equation Breakdown
          </span>
        </div>

        {activeTab === 'derivation' && (
          <StepCalculation
            calc={calc}
            medium1Name={medium1Name}
            medium2Name={medium2Name}
          />
        )}

        {activeTab === 'equations' && <EquationsPanel />}

        {activeTab === 'validation' && (
          <ValidationCases
            currentN1={n1}
            currentN2={n2}
            currentTheta1={theta1}
            onSelectCase={handleSelectTestCase}
          />
        )}

        {activeTab === 'theory' && <EducationalInsights />}
      </div>
    </div>
  );
};
