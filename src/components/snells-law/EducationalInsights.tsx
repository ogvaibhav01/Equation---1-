import React, { useState } from 'react';

interface InsightTopic {
  id: string;
  title: string;
  summary: string;
  details: string;
  bulletPoints?: string[];
}

const TOPICS: InsightTopic[] = [
  {
    id: 'what_is_refraction',
    title: 'What is Refraction?',
    summary: 'The bending of light as it passes between media of differing optical densities.',
    details:
      'Refraction is the change in propagation direction of a wave due to a change in its transmission medium. When an electromagnetic wavefront encounters an interface at an oblique angle, one edge of the wavefront changes speed before the other, pivoting the entire beam toward or away from the normal.',
    bulletPoints: [
      'Frequency (f) remains invariant across boundaries.',
      'Phase velocity (v) and wavelength (λ = v / f) change proportionally.',
      'Governed by Fermat’s Principle of Least Time: light follows the path requiring minimum travel time.',
    ],
  },
  {
    id: 'refractive_index',
    title: 'What Does Refractive Index (n) Mean?',
    summary: 'The factor by which phase velocity is reduced relative to vacuum.',
    details:
      'The absolute refractive index n of a transparent medium is defined as n = c / v, where c is the speed of light in vacuum (≈ 2.998 × 10⁸ m/s) and v is the phase velocity within the medium. Higher optical density corresponds to greater polarization resistance by bound atomic electrons, slowing down wave propagation.',
    bulletPoints: [
      'Vacuum: n ≡ 1.0000 (v = c)',
      'Water: n ≈ 1.333 (light travels at ~75% of c)',
      'Diamond: n ≈ 2.417 (light slows to ~41% of c, causing intense dispersion and brilliance)',
    ],
  },
  {
    id: 'why_the_normal',
    title: 'Why Measure Angles from the Normal?',
    summary: 'The normal line provides a universal, coordinate-independent reference.',
    details:
      'In optics, the normal line is perpendicular to the boundary surface at the exact point of incidence. Measuring angles from the normal (θ = 0° for perpendicular incidence) ensures mathematical consistency across curved surfaces (such as convex lenses, concave mirrors, or fiber optic cores) where surface tangents continuously vary.',
    bulletPoints: [
      'θ₁ = 0° corresponds to direct head-on incidence where no bending occurs.',
      'Avoids ambiguity when dealing with curved lens profiles or spherical boundaries.',
    ],
  },
  {
    id: 'bending_rules',
    title: 'Bending Toward vs. Away From Normal',
    summary: 'The direction of bending depends directly on whether light slows down or speeds up.',
    details:
      'When light enters an optically denser medium (n₂ > n₁), it slows down and bends toward the normal (θ₂ < θ₁). Conversely, when light travels into an optically rarer medium (n₂ < n₁), it accelerates and bends away from the normal (θ₂ > θ₁).',
    bulletPoints: [
      'Entering Denser (n₂ > n₁): θ₂ < θ₁ (Bends toward normal)',
      'Entering Rarer (n₂ < n₁): θ₂ > θ₁ (Bends away from normal)',
      'Equal Indices (n₁ = n₂): θ₂ = θ₁ (No deviation)',
    ],
  },
  {
    id: 'total_internal_reflection',
    title: 'Total Internal Reflection & Critical Angle',
    summary: 'Complete reflection of light occurring only from denser to rarer media.',
    details:
      'When light travels from an optically denser medium to a rarer one (n₁ > n₂), the angle of refraction θ₂ is strictly greater than θ₁. As θ₁ increases, θ₂ eventually reaches 90° at the critical angle θ_c = arcsin(n₂ / n₁). Beyond θ_c, Snell’s Law yields sin(θ₂) > 1, meaning no propagating wave can transmit; 100% of the light is internally reflected.',
    bulletPoints: [
      'Requires n₁ > n₂ (impossible when entering a denser medium).',
      'Underpins fiber optic telecommunications, endoscopic medical imaging, and gemstone facets.',
      'Unlike silvered metallic mirrors which absorb 5–10% of light, TIR provides 100% reflection efficiency without loss.',
    ],
  },
];

export const EducationalInsights: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>('what_is_refraction');

  const activeTopic = TOPICS.find((t) => t.id === activeTopicId) || TOPICS[0];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Educational Insights &amp; Physical Intuition
        </h3>
        <span className="text-xs text-slate-400">Conceptual Optical Theory</span>
      </div>

      {/* Topic selection tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800/80">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => setActiveTopicId(topic.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTopicId === topic.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Active topic card */}
      <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-3">
        <div>
          <h4 className="text-sm font-bold text-white mb-1">{activeTopic.title}</h4>
          <p className="text-xs text-cyan-400/90 font-medium">{activeTopic.summary}</p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{activeTopic.details}</p>

        {activeTopic.bulletPoints && (
          <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {activeTopic.bulletPoints.map((pt, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">·</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
