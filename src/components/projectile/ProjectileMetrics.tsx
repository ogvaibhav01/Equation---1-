import React from 'react';
import { ProjectileCalculationResult } from '../../types/projectile';
import { MetricCard } from '../common/MetricCard';

interface ProjectileMetricsProps {
  calc: ProjectileCalculationResult;
}

export const ProjectileMetrics: React.FC<ProjectileMetricsProps> = ({ calc }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <MetricCard
        label="Maximum Altitude"
        value={calc.maxHeight.toFixed(1)}
        unit="m"
        formulaHint="h_max"
        highlight="amber"
        subtext={`Apex at x = ${calc.apexX.toFixed(1)}m`}
      />
      <MetricCard
        label="Total Range"
        value={calc.range.toFixed(1)}
        unit="m"
        formulaHint="R = v₀x · t"
        highlight="emerald"
        subtext="Horizontal landing distance"
      />
      <MetricCard
        label="Time of Flight"
        value={calc.timeOfFlight.toFixed(2)}
        unit="s"
        formulaHint="t_flight"
        highlight="cyan"
        subtext={`Apex at t = ${calc.timeToApex.toFixed(2)}s`}
      />
      <MetricCard
        label="Horizontal Speed"
        value={calc.v0x.toFixed(1)}
        unit="m/s"
        formulaHint="v₀ · cos(θ)"
        subtext="Constant throughout flight"
      />
      <MetricCard
        label="Initial Vert. Speed"
        value={calc.v0y.toFixed(1)}
        unit="m/s"
        formulaHint="v₀ · sin(θ)"
        subtext="Decelerates by g"
      />
      <MetricCard
        label="Impact Velocity"
        value={calc.impactSpeed.toFixed(1)}
        unit="m/s"
        formulaHint="|v_impact|"
        highlight="purple"
        subtext={`${calc.impactAngleDeg.toFixed(1)}° landing angle`}
      />
    </div>
  );
};
