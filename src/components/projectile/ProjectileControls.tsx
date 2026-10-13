import React from 'react';
import { CELESTIAL_PRESETS } from '../../physics/projectileModel';
import { SliderControl } from '../common/SliderControl';

interface ProjectileControlsProps {
  velocity: number;
  angle: number;
  initialHeight: number;
  gravity: number;
  celestialId: string;
  showVectors: boolean;
  showApex: boolean;
  showTrajectoryGrid: boolean;
  onVelocityChange: (v: number) => void;
  onAngleChange: (a: number) => void;
  onInitialHeightChange: (h: number) => void;
  onGravityChange: (g: number, celestialId?: string) => void;
  onToggleVectors: () => void;
  onToggleApex: () => void;
  onToggleGrid: () => void;
  onReset: () => void;
}

export const ProjectileControls: React.FC<ProjectileControlsProps> = ({
  velocity,
  angle,
  initialHeight,
  gravity,
  celestialId,
  showVectors,
  showApex,
  showTrajectoryGrid,
  onVelocityChange,
  onAngleChange,
  onInitialHeightChange,
  onGravityChange,
  onToggleVectors,
  onToggleApex,
  onToggleGrid,
  onReset,
}) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Launch Parameters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          Reset Defaults
        </button>
      </div>

      {/* Initial Velocity */}
      <SliderControl
        id="velocity-slider"
        label="Initial Velocity"
        symbol="v₀"
        value={velocity}
        min={1}
        max={100}
        step={1}
        unit="m/s"
        onChange={onVelocityChange}
        quickButtons={[
          { label: '15 m/s', value: 15 },
          { label: '25 m/s', value: 25 },
          { label: '40 m/s', value: 40 },
          { label: '60 m/s', value: 60 },
        ]}
      />

      {/* Launch Angle */}
      <SliderControl
        id="angle-slider"
        label="Launch Angle"
        symbol="θ"
        value={angle}
        min={0}
        max={90}
        step={1}
        unit="°"
        onChange={onAngleChange}
        quickButtons={[
          { label: '30°', value: 30 },
          { label: '45° (Max Range)', value: 45 },
          { label: '60°', value: 60 },
          { label: '75°', value: 75 },
        ]}
      />

      {/* Initial Height */}
      <SliderControl
        id="height-slider"
        label="Initial Altitude"
        symbol="h₀"
        value={initialHeight}
        min={0}
        max={60}
        step={1}
        unit="m"
        onChange={onInitialHeightChange}
        quickButtons={[
          { label: 'Ground (0m)', value: 0 },
          { label: '10m', value: 10 },
          { label: '25m', value: 25 },
        ]}
      />

      {/* Gravitational Field */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="celestial-select" className="text-slate-300 font-medium flex items-center gap-1.5">
            Gravitational Environment
            <span className="font-mono text-cyan-400 font-semibold">g</span>
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-xs">g =</span>
            <input
              id="custom-g"
              type="number"
              min="0.5"
              max="50"
              step="0.01"
              value={gravity}
              onChange={(e) => onGravityChange(parseFloat(e.target.value) || 9.81, 'custom')}
              aria-label="Gravitational acceleration"
              className="w-18 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-xs font-mono font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500 tabular-nums"
            />
            <span className="text-slate-400 text-xs">m/s²</span>
          </div>
        </div>

        <select
          id="celestial-select"
          value={celestialId}
          onChange={(e) => {
            const body = CELESTIAL_PRESETS.find((c) => c.id === e.target.value);
            if (body) {
              onGravityChange(body.gravity, body.id);
            } else {
              onGravityChange(gravity, 'custom');
            }
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          {CELESTIAL_PRESETS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.gravity} m/s²)
            </option>
          ))}
          <option value="custom">Custom Gravitational Field</option>
        </select>
      </div>

      {/* Display toggles */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Display Controls
        </span>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showVectors}
              onChange={onToggleVectors}
              className="rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-slate-300 text-[11px]">Velocity Vectors</span>
          </label>
          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showApex}
              onChange={onToggleApex}
              className="rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-slate-300 text-[11px]">Apex Marker</span>
          </label>
          <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showTrajectoryGrid}
              onChange={onToggleGrid}
              className="rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-slate-300 text-[11px]">Metric Grid</span>
          </label>
        </div>
      </div>
    </div>
  );
};
