import React from 'react';
import { MathBlock } from '../common/MathBlock';

export const EquationsPanel: React.FC = () => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Governing Optical Principles &amp; Formulas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MathBlock
          title="Snell's Law of Refraction"
          formula="n₁ · sin(θ₁) = n₂ · sin(θ₂)"
          description="Describes the relationship between the angles of incidence and refraction when light passes across an interface between two isotropic media."
          variables={[
            { symbol: 'n₁', meaning: 'Refractive index of incident medium' },
            { symbol: 'n₂', meaning: 'Refractive index of refracting medium' },
            { symbol: 'θ₁', meaning: 'Angle of incidence from normal' },
            { symbol: 'θ₂', meaning: 'Angle of refraction from normal' },
          ]}
        />

        <MathBlock
          title="Angle of Refraction"
          formula="θ₂ = arcsin( (n₁ / n₂) · sin(θ₁) )"
          description="Calculates the transmitted angle. This real-valued propagating solution only exists when |(n₁/n₂)·sin(θ₁)| ≤ 1."
          variables={[
            { symbol: 'n₁ / n₂', meaning: 'Relative refractive index' },
            { symbol: 'arcsin(x)', meaning: 'Defined on domain [-1, 1]' },
          ]}
        />

        <MathBlock
          title="Law of Specular Reflection"
          formula="θᵣ = θ₁"
          description="The angle of reflection equals the angle of incidence. The incident ray, the normal, and the reflected ray all lie in the same plane of incidence."
          variables={[
            { symbol: 'θᵣ', meaning: 'Angle of reflection from normal' },
            { symbol: 'θ₁', meaning: 'Angle of incidence from normal' },
          ]}
        />

        <MathBlock
          title="Critical Angle &amp; TIR Condition"
          formula="θ_c = arcsin( n₂ / n₁ ) ,  for n₁ > n₂"
          description="Total internal reflection occurs exclusively when light travels into a rarer medium (n₁ > n₂) and the incident angle strictly exceeds θ_c (θ₁ > θ_c)."
          variables={[
            { symbol: 'θ_c', meaning: 'Critical angle (θ₂ reaches 90°)' },
            { symbol: 'TIR', meaning: 'Occurs when θ₁ > θ_c' },
          ]}
        />
      </div>
    </div>
  );
};
