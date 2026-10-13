import { MediumPreset, OpticsCalculationResult, TestCase } from '../types/optics';

export const SPEED_OF_LIGHT_VACUUM = 299792458; // m/s

export const MEDIUM_PRESETS: MediumPreset[] = [
  {
    id: 'air',
    name: 'Air',
    index: 1.0003,
    description: 'Standard atmospheric air at sea level (n ≈ 1.0003)',
    colorHint: 'rgba(56, 189, 248, 0.04)',
  },
  {
    id: 'vacuum',
    name: 'Vacuum',
    index: 1.0000,
    description: 'Empty space with refractive index defined as exactly 1.0',
    colorHint: 'rgba(15, 23, 42, 0.02)',
  },
  {
    id: 'water',
    name: 'Water',
    index: 1.333,
    description: 'Liquid water at 20°C (n ≈ 1.333)',
    colorHint: 'rgba(14, 165, 233, 0.12)',
  },
  {
    id: 'acrylic',
    name: 'Acrylic (Plexiglas)',
    index: 1.490,
    description: 'Polymethyl methacrylate transparent thermoplastic (n ≈ 1.490)',
    colorHint: 'rgba(99, 102, 241, 0.14)',
  },
  {
    id: 'glass',
    name: 'Typical Glass (Crown)',
    index: 1.500,
    description: 'Standard crown optical glass (n ≈ 1.500)',
    colorHint: 'rgba(59, 130, 246, 0.18)',
  },
  {
    id: 'flint_glass',
    name: 'Dense Flint Glass',
    index: 1.620,
    description: 'High-dispersion optical glass (n ≈ 1.620)',
    colorHint: 'rgba(139, 92, 246, 0.22)',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    index: 2.417,
    description: 'High optical density gemstone crystal (n ≈ 2.417)',
    colorHint: 'rgba(168, 85, 247, 0.28)',
  },
];

export const VALIDATION_TEST_CASES: TestCase[] = [
  {
    id: 'case_a',
    name: 'Case A: Normal Incidence',
    description: 'Light arrives along the normal line (θ₁ = 0°). Ray continues straight without angular deviation.',
    n1: 1.00,
    n2: 1.50,
    theta1: 0,
    expectedTheta2: '0.0°',
    expectedStatus: 'No angular deviation',
  },
  {
    id: 'case_b',
    name: 'Case B: Air to Glass (Denser)',
    description: 'Light enters optically denser glass (n₂ > n₁). The ray bends toward the normal (θ₂ < θ₁).',
    n1: 1.00,
    n2: 1.50,
    theta1: 45,
    expectedTheta2: '≈ 28.1°',
    expectedStatus: 'Bends toward normal',
  },
  {
    id: 'case_c',
    name: 'Case C: Glass to Air (Sub-critical)',
    description: 'Light travels from denser glass to rarer air below critical angle (θ₁ < θ_c). Ray bends away from normal.',
    n1: 1.50,
    n2: 1.00,
    theta1: 30,
    expectedTheta2: '≈ 48.6°',
    expectedStatus: 'Bends away from normal',
  },
  {
    id: 'case_d',
    name: 'Case D: Total Internal Reflection',
    description: 'Glass to air with θ₁ = 50° > θ_c (41.8°). No transmitted propagating ray; 100% of light is reflected.',
    n1: 1.50,
    n2: 1.00,
    theta1: 50,
    expectedTheta2: 'N/A (TIR)',
    expectedStatus: 'Total internal reflection',
  },
  {
    id: 'case_e',
    name: 'Case E: Equal Indices',
    description: 'Both media have identical refractive index (n₁ = n₂ = 1.33). Optical interface causes zero bending.',
    n1: 1.33,
    n2: 1.33,
    theta1: 40,
    expectedTheta2: '40.0°',
    expectedStatus: 'No angular deviation',
  },
  {
    id: 'case_f',
    name: 'Case F: Exact Critical Angle',
    description: 'At the critical angle θ₁ = arcsin(1.0/1.5) ≈ 41.81°, the refracted ray grazes along the boundary (θ₂ = 90°).',
    n1: 1.50,
    n2: 1.00,
    theta1: 41.81,
    expectedTheta2: '90.0° (along boundary)',
    expectedStatus: 'Critical angle',
  },
  {
    id: 'case_g',
    name: 'Case G: Diamond to Water',
    description: 'Diamond (2.417) to water (1.333). Large index difference yields significant refraction or low critical angle (θ_c ≈ 33.5°).',
    n1: 2.417,
    n2: 1.333,
    theta1: 25,
    expectedTheta2: '≈ 50.0°',
    expectedStatus: 'Bends away from normal',
  },
];

/**
 * Validates and sanitizes a refractive index value.
 * Requires finite positive numbers (usually >= 1.0, allowed down to 0.1 for theoretical checks).
 */
export function sanitizeRefractiveIndex(value: number, fallback = 1.0): number {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.min(Math.max(value, 0.5), 10.0);
}

/**
 * Validates and clamps an incident angle in degrees to [0, 90].
 */
export function sanitizeIncidentAngle(deg: number): number {
  if (typeof deg !== 'number' || isNaN(deg) || !isFinite(deg)) {
    return 45;
  }
  return Math.min(Math.max(deg, 0), 90);
}

/**
 * Pure TypeScript physics computation engine for Snell's Law and Reflection.
 */
export function computeOptics(n1Raw: number, n2Raw: number, theta1Raw: number): OpticsCalculationResult {
  const n1 = sanitizeRefractiveIndex(n1Raw, 1.0);
  const n2 = sanitizeRefractiveIndex(n2Raw, 1.5);
  const theta1Deg = sanitizeIncidentAngle(theta1Raw);

  const theta1Rad = (theta1Deg * Math.PI) / 180;
  const sinTheta1 = Math.sin(theta1Rad);
  const thetaRDeg = theta1Deg; // Law of reflection: θ_r = θ_1

  // Speed of light in each medium: v = c / n
  const speedOfLight1 = SPEED_OF_LIGHT_VACUUM / n1;
  const speedOfLight2 = SPEED_OF_LIGHT_VACUUM / n2;

  // Critical angle applies only when light travels from denser to rarer medium (n1 > n2)
  let criticalAngleDeg: number | null = null;
  if (n1 > n2) {
    const sinCritical = n2 / n1;
    if (sinCritical <= 1.0) {
      criticalAngleDeg = (Math.asin(sinCritical) * 180) / Math.PI;
    }
  }

  // Snell's Law argument: sin(theta2) = (n1 / n2) * sin(theta1)
  const ratioN1N2 = n1 / n2;
  const sinTheta2Candidate = ratioN1N2 * sinTheta1;

  const EPSILON = 1e-6;

  let theta2Deg: number | null = null;
  let theta2Rad: number | null = null;
  let isTotalInternalReflection = false;
  let isCriticalAngle = false;
  let status: OpticsCalculationResult['status'];
  let statusLabel: string;
  let statusExplanation: string;

  if (sinTheta2Candidate > 1.0 + EPSILON) {
    // Total internal reflection: argument of arcsin exceeds 1.0
    isTotalInternalReflection = true;
    theta2Deg = null;
    theta2Rad = null;
    status = 'total_internal_reflection';
    statusLabel = 'Total Internal Reflection';
    statusExplanation = `Because n₁ (${n1.toFixed(3)}) > n₂ (${n2.toFixed(3)}) and θ₁ (${theta1Deg.toFixed(1)}°) > θ_c (${criticalAngleDeg?.toFixed(1)}°), the argument (n₁/n₂)·sin(θ₁) = ${sinTheta2Candidate.toFixed(4)} > 1. No real propagating refracted ray can exist; 100% of light energy is reflected back into Medium 1.`;
  } else if (Math.abs(sinTheta2Candidate - 1.0) <= EPSILON || (criticalAngleDeg !== null && Math.abs(theta1Deg - criticalAngleDeg) < 0.05)) {
    // At the critical angle: sin(theta2) = 1, theta2 = 90 deg
    isCriticalAngle = true;
    theta2Deg = 90.0;
    theta2Rad = Math.PI / 2;
    status = 'critical_angle';
    statusLabel = 'Critical Angle (Grazing Ray)';
    statusExplanation = `The angle of incidence equals the critical angle θ_c ≈ ${criticalAngleDeg?.toFixed(1)}°. The refracted ray travels along the interface boundary at θ₂ = 90.0°. Any further increase in θ₁ triggers total internal reflection.`;
  } else {
    // Ordinary refraction
    const clampedSin = Math.max(-1.0, Math.min(1.0, sinTheta2Candidate));
    theta2Rad = Math.asin(clampedSin);
    theta2Deg = (theta2Rad * 180) / Math.PI;

    if (Math.abs(theta1Deg - theta2Deg) < 0.05) {
      status = 'no_deviation';
      statusLabel = 'No Angular Deviation';
      statusExplanation = theta1Deg === 0
        ? 'Normal incidence (θ₁ = 0°): Light enters perpendicular to the boundary and continues straight without bending.'
        : `Equal refractive indices (n₁ = n₂ = ${n1.toFixed(3)}): The boundary causes zero wave speed change, so light continues undeflected.`;
    } else if (n2 > n1) {
      status = 'bending_towards_normal';
      statusLabel = 'Bends Toward Normal';
      statusExplanation = `Light travels into an optically denser medium (n₂ > n₁, speed drops from ${(speedOfLight1 / 1e8).toFixed(2)}×10⁸ to ${(speedOfLight2 / 1e8).toFixed(2)}×10⁸ m/s). By Snell's Law, the wave slows down and refracts toward the normal: θ₂ (${theta2Deg.toFixed(1)}°) < θ₁ (${theta1Deg.toFixed(1)}°).`;
    } else {
      status = 'bending_away_from_normal';
      statusLabel = 'Bends Away From Normal';
      statusExplanation = `Light travels into an optically rarer medium (n₁ > n₂, speed increases from ${(speedOfLight1 / 1e8).toFixed(2)}×10⁸ to ${(speedOfLight2 / 1e8).toFixed(2)}×10⁸ m/s). The wave speeds up and refracts away from the normal: θ₂ (${theta2Deg.toFixed(1)}°) > θ₁ (${theta1Deg.toFixed(1)}°).`;
    }
  }

  const angularDeviationDeg = theta2Deg !== null ? Math.abs(theta1Deg - theta2Deg) : null;

  return {
    n1,
    n2,
    theta1Deg,
    theta1Rad,
    theta2Deg,
    theta2Rad,
    thetaRDeg,
    criticalAngleDeg,
    isTotalInternalReflection,
    isCriticalAngle,
    status,
    statusLabel,
    statusExplanation,
    sinTheta1,
    sinTheta2: Math.min(1.0, sinTheta2Candidate),
    ratioN1N2,
    angularDeviationDeg,
    speedOfLight1,
    speedOfLight2,
  };
}
