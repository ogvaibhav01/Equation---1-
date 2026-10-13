import React from 'react';
import { OpticsCalculationResult } from '../../types/optics';
import { MetricCard } from '../common/MetricCard';

interface MeasurementsPanelProps {
  calc: OpticsCalculationResult;
  medium1Name: string;
  medium2Name: string;
}

export const MeasurementsPanel: React.FC<MeasurementsPanelProps> = ({
  calc,
  medium1Name,
  medium2Name,
}) => {
  const getStatusColor = () => {
    switch (calc.status) {
      case 'total_internal_reflection':
        return 'rose';
      case 'critical_angle':
        return 'amber';
      case 'bending_towards_normal':
        return 'cyan';
      case 'bending_away_from_normal':
        return 'emerald';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {/* Refraction Status Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Optical Regime
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">
              n₁/n₂ = {calc.ratioN1N2.toFixed(3)}
            </span>
          </div>
          <div className="text-base font-bold text-white flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                calc.isTotalInternalReflection
                  ? 'bg-rose-500 ring-4 ring-rose-500/20'
                  : calc.isCriticalAngle
                  ? 'bg-amber-400 ring-4 ring-amber-400/20'
                  : 'bg-cyan-400 ring-4 ring-cyan-400/20'
              }`}
            />
            {calc.statusLabel}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl pt-1">
            {calc.statusExplanation}
          </p>
        </div>

        {calc.criticalAngleDeg !== null && (
          <div className="sm:text-right shrink-0 bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[11px] text-slate-400 font-medium">Critical Angle (θ_c)</div>
            <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {calc.criticalAngleDeg.toFixed(2)}°
            </div>
            <div className="text-[10px] text-slate-500">arcsin(n₂/n₁)</div>
          </div>
        )}
      </div>

      {/* Grid of Live Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Incident Angle"
          value={`${calc.theta1Deg.toFixed(1)}°`}
          formulaHint="θ₁"
          highlight="cyan"
          subtext={`in ${medium1Name}`}
        />

        <MetricCard
          label="Reflection Angle"
          value={`${calc.thetaRDeg.toFixed(1)}°`}
          formulaHint="θᵣ = θ₁"
          highlight="amber"
          subtext="Law of Reflection"
        />

        <MetricCard
          label="Refraction Angle"
          value={
            calc.isTotalInternalReflection
              ? 'N/A'
              : `${calc.theta2Deg?.toFixed(1)}°`
          }
          formulaHint="θ₂"
          highlight={getStatusColor()}
          subtext={
            calc.isTotalInternalReflection
              ? 'Total internal reflection'
              : `in ${medium2Name}`
          }
        />

        <MetricCard
          label="Angular Deviation"
          value={
            calc.angularDeviationDeg !== null
              ? `${calc.angularDeviationDeg.toFixed(1)}°`
              : 'N/A'
          }
          formulaHint="δ = |θ₁ - θ₂|"
          subtext={calc.angularDeviationDeg !== null ? 'Ray path bending' : 'No transmission'}
        />

        <MetricCard
          label="Phase Speed v₁"
          value={(calc.speedOfLight1 / 1e8).toFixed(2)}
          unit="×10⁸ m/s"
          formulaHint="c / n₁"
          subtext={`Index ${calc.n1.toFixed(3)}`}
        />

        <MetricCard
          label="Phase Speed v₂"
          value={(calc.speedOfLight2 / 1e8).toFixed(2)}
          unit="×10⁸ m/s"
          formulaHint="c / n₂"
          subtext={`Index ${calc.n2.toFixed(3)}`}
        />
      </div>
    </div>
  );
};
