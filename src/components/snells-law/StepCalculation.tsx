import React from 'react';
import { OpticsCalculationResult } from '../../types/optics';

interface StepCalculationProps {
  calc: OpticsCalculationResult;
  medium1Name: string;
  medium2Name: string;
}

export const StepCalculation: React.FC<StepCalculationProps> = ({
  calc,
  medium1Name,
  medium2Name,
}) => {
  const sinArg = calc.ratioN1N2 * calc.sinTheta1;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Step-by-Step Mathematical Derivation
        </h3>
        <span className="text-xs font-mono text-slate-500">Live Numerical Evaluation</span>
      </div>

      {calc.isTotalInternalReflection ? (
        /* Total Internal Reflection Calculation Path */
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-300">
              Step 1: Verify Optical Density Condition (n₁ &gt; n₂)
            </span>
            <p className="text-slate-400">
              Medium 1 ({medium1Name}, n₁ = {calc.n1.toFixed(3)}) is optically denser than Medium 2 ({medium2Name}, n₂ = {calc.n2.toFixed(3)}):
            </p>
            <div className="font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded">
              {calc.n1.toFixed(3)} &gt; {calc.n2.toFixed(3)} ✓ (Light is attempting to exit into a rarer medium)
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-300">
              Step 2: Calculate the Critical Angle (θ_c)
            </span>
            <p className="text-slate-400">
              The critical angle is defined when the theoretical refraction angle reaches 90° (sin 90° = 1):
            </p>
            <div className="font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded">
              θ_c = arcsin(n₂ / n₁) = arcsin({calc.n2.toFixed(3)} / {calc.n1.toFixed(3)}) = arcsin({(calc.n2 / calc.n1).toFixed(4)}) ≈ {calc.criticalAngleDeg?.toFixed(2)}°
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-300">
              Step 3: Compare Current Incident Angle θ₁ with θ_c
            </span>
            <p className="text-slate-400">
              Evaluating the Snell&apos;s Law arcsine argument:
            </p>
            <div className="font-mono text-rose-300 bg-slate-900/80 px-2.5 py-1 rounded">
              sin(θ₂) = (n₁ / n₂) · sin(θ₁) = ({calc.n1.toFixed(3)} / {calc.n2.toFixed(3)}) · sin({calc.theta1Deg.toFixed(1)}°) = {calc.ratioN1N2.toFixed(4)} · {calc.sinTheta1.toFixed(4)} = {sinArg.toFixed(4)} &gt; 1.0000
            </div>
          </div>

          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg space-y-1">
            <span className="font-semibold text-rose-300">
              Step 4: Physical Conclusion
            </span>
            <p className="text-slate-300">
              Since θ₁ ({calc.theta1Deg.toFixed(1)}°) &gt; θ_c ({calc.criticalAngleDeg?.toFixed(1)}°), the argument of the arcsine function exceeds 1, which has no real solution in trigonometry. Consequently,{' '}
              <strong className="text-rose-400">no real propagating transmitted wave enters Medium 2</strong>. By energy conservation, 100% of the incident power is reflected back into Medium 1 at θᵣ = {calc.thetaRDeg.toFixed(1)}°.
            </p>
          </div>
        </div>
      ) : (
        /* Ordinary Refraction or Critical Angle Path */
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-300">
              Step 1: Identify Given Experimental Parameters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1.5 rounded">
              <div>n₁ = {calc.n1.toFixed(3)} ({medium1Name})</div>
              <div>n₂ = {calc.n2.toFixed(3)} ({medium2Name})</div>
              <div>θ₁ = {calc.theta1Deg.toFixed(1)}° ({calc.theta1Rad.toFixed(4)} rad)</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-300">
              Step 2: Apply Snell&apos;s Governing Law
            </span>
            <p className="text-slate-400">
              Rearrange n₁ · sin(θ₁) = n₂ · sin(θ₂) to solve for sin(θ₂):
            </p>
            <div className="font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded">
              sin(θ₂) = (n₁ / n₂) · sin(θ₁)
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <span className="font-semibold text-slate-300">
              Step 3: Evaluate Ratio and Trigonometric Quantities
            </span>
            <div className="font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1.5 rounded space-y-1">
              <div>n₁ / n₂ = {calc.n1.toFixed(3)} / {calc.n2.toFixed(3)} = {calc.ratioN1N2.toFixed(4)}</div>
              <div>sin({calc.theta1Deg.toFixed(1)}°) = {calc.sinTheta1.toFixed(4)}</div>
              <div className="text-emerald-400">
                sin(θ₂) = {calc.ratioN1N2.toFixed(4)} · {calc.sinTheta1.toFixed(4)} = {sinArg.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-1">
            <span className="font-semibold text-emerald-300">
              Step 4: Compute Refraction Angle (θ₂)
            </span>
            <p className="text-slate-300">
              Taking the inverse sine of the argument:
            </p>
            <div className="font-mono text-emerald-300 bg-slate-900/80 px-2.5 py-1.5 rounded">
              θ₂ = arcsin({sinArg.toFixed(4)}) = {calc.theta2Rad?.toFixed(4)} rad ≈ <strong className="text-emerald-400 text-sm">{calc.theta2Deg?.toFixed(2)}°</strong>
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              Deviation from original path: δ = |θ₁ - θ₂| = |{calc.theta1Deg.toFixed(1)}° - {calc.theta2Deg?.toFixed(1)}°| = {calc.angularDeviationDeg?.toFixed(1)}°.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
