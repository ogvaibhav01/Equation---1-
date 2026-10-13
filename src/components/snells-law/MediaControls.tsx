import React from 'react';
import { MEDIUM_PRESETS } from '../../physics/snellModel';
import { SliderControl } from '../common/SliderControl';

interface MediaControlsProps {
  n1: number;
  n2: number;
  theta1: number;
  medium1PresetId: string;
  medium2PresetId: string;
  showNormal: boolean;
  showArcs: boolean;
  showReflectedRay: boolean;
  showAngleLabels: boolean;
  showWavefronts: boolean;
  criticalAngle: number | null;
  onN1Change: (n1: number, presetId?: string) => void;
  onN2Change: (n2: number, presetId?: string) => void;
  onTheta1Change: (theta1: number) => void;
  onSwapMedia: () => void;
  onToggleNormal: () => void;
  onToggleArcs: () => void;
  onToggleReflectedRay: () => void;
  onToggleAngleLabels: () => void;
  onToggleWavefronts: () => void;
  onReset: () => void;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  n1,
  n2,
  theta1,
  medium1PresetId,
  medium2PresetId,
  showNormal,
  showArcs,
  showReflectedRay,
  showAngleLabels,
  showWavefronts,
  criticalAngle,
  onN1Change,
  onN2Change,
  onTheta1Change,
  onSwapMedia,
  onToggleNormal,
  onToggleArcs,
  onToggleReflectedRay,
  onToggleAngleLabels,
  onToggleWavefronts,
  onReset,
}) => {
  const quickAngles = [
    { label: '0° (Normal)', value: 0 },
    { label: '30°', value: 30 },
    { label: '45°', value: 45 },
    { label: '60°', value: 60 },
  ];

  if (criticalAngle !== null) {
    quickAngles.push({
      label: `θ_c (${criticalAngle.toFixed(1)}°)`,
      value: Math.round(criticalAngle * 10) / 10,
    });
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Experimental Parameters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          Reset Defaults
        </button>
      </div>

      {/* Incident Angle Control */}
      <div className="space-y-2">
        <SliderControl
          id="theta1-slider"
          label="Angle of Incidence"
          symbol="θ₁"
          value={theta1}
          min={0}
          max={90}
          step={0.5}
          unit="°"
          onChange={onTheta1Change}
          quickButtons={quickAngles}
          accentColor="cyan"
        />
        <p className="text-[11px] text-slate-400 leading-tight">
          Measured from the vertical normal line (θ₁ = 0° corresponds to perpendicular entry).
        </p>
      </div>

      {/* Media Selectors (Medium 1 and Medium 2) */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Optical Media
          </span>
          <button
            type="button"
            onClick={onSwapMedia}
            title="Swap Medium 1 and Medium 2"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2 py-1 bg-cyan-950/40 border border-cyan-800/50 rounded hover:bg-cyan-900/40 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Swap Media
          </button>
        </div>

        {/* Medium 1 (Incident Medium) */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="medium1-select" className="text-slate-300 font-medium flex items-center gap-1.5">
              Medium 1 (Incident)
              <span className="font-mono text-cyan-400 font-semibold">n₁</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs">n₁ =</span>
              <input
                id="custom-n1"
                type="number"
                min="0.5"
                max="10.0"
                step="0.001"
                value={n1}
                onChange={(e) => onN1Change(parseFloat(e.target.value) || 1.0, 'custom')}
                aria-label="Refractive index of Medium 1"
                className="w-20 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-xs font-mono font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500 tabular-nums"
              />
            </div>
          </div>

          <select
            id="medium1-select"
            value={medium1PresetId}
            onChange={(e) => {
              const selectedId = e.target.value;
              const preset = MEDIUM_PRESETS.find((p) => p.id === selectedId);
              if (preset) {
                onN1Change(preset.index, preset.id);
              } else {
                onN1Change(n1, 'custom');
              }
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {MEDIUM_PRESETS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (n = {m.index.toFixed(3)})
              </option>
            ))}
            <option value="custom">Custom Refractive Index</option>
          </select>
        </div>

        {/* Medium 2 (Refracting Medium) */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="medium2-select" className="text-slate-300 font-medium flex items-center gap-1.5">
              Medium 2 (Refracting)
              <span className="font-mono text-indigo-400 font-semibold">n₂</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs">n₂ =</span>
              <input
                id="custom-n2"
                type="number"
                min="0.5"
                max="10.0"
                step="0.001"
                value={n2}
                onChange={(e) => onN2Change(parseFloat(e.target.value) || 1.0, 'custom')}
                aria-label="Refractive index of Medium 2"
                className="w-20 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-xs font-mono font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500 tabular-nums"
              />
            </div>
          </div>

          <select
            id="medium2-select"
            value={medium2PresetId}
            onChange={(e) => {
              const selectedId = e.target.value;
              const preset = MEDIUM_PRESETS.find((p) => p.id === selectedId);
              if (preset) {
                onN2Change(preset.index, preset.id);
              } else {
                onN2Change(n2, 'custom');
              }
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {MEDIUM_PRESETS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (n = {m.index.toFixed(3)})
              </option>
            ))}
            <option value="custom">Custom Refractive Index</option>
          </select>
        </div>
      </div>

      {/* Visual Display Toggles */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Display Controls
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showNormal}
              onChange={onToggleNormal}
              className="rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-slate-300">Normal Line</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showArcs}
              onChange={onToggleArcs}
              className="rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-slate-300">Angle Arcs</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showReflectedRay}
              onChange={onToggleReflectedRay}
              className="rounded accent-amber-400 cursor-pointer"
            />
            <span className="text-slate-300">Reflected Ray</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showAngleLabels}
              onChange={onToggleAngleLabels}
              className="rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-slate-300">Angle Labels</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer col-span-2">
            <input
              type="checkbox"
              checked={showWavefronts}
              onChange={onToggleWavefronts}
              className="rounded accent-emerald-400 cursor-pointer"
            />
            <span className="text-slate-300">Wavefronts (Wavelength Scale)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
