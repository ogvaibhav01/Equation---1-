export interface MediumPreset {
  id: string;
  name: string;
  index: number;
  description: string;
  colorHint: string; // Subtle tint representing physical density
}

export type RefractionStatus =
  | 'bending_towards_normal'
  | 'bending_away_from_normal'
  | 'no_deviation'
  | 'critical_angle'
  | 'total_internal_reflection';

export interface OpticsSimulationState {
  n1: number;
  n2: number;
  theta1: number; // in degrees (0 to 90)
  medium1PresetId: string;
  medium2PresetId: string;
  showNormal: boolean;
  showArcs: boolean;
  showReflectedRay: boolean;
  showAngleLabels: boolean;
  showDetails: boolean;
  showWavefronts: boolean;
}

export interface OpticsCalculationResult {
  n1: number;
  n2: number;
  theta1Deg: number;
  theta1Rad: number;
  theta2Deg: number | null;
  theta2Rad: number | null;
  thetaRDeg: number;
  criticalAngleDeg: number | null;
  isTotalInternalReflection: boolean;
  isCriticalAngle: boolean;
  status: RefractionStatus;
  statusLabel: string;
  statusExplanation: string;
  sinTheta1: number;
  sinTheta2: number;
  ratioN1N2: number;
  angularDeviationDeg: number | null;
  speedOfLight1: number; // m/s
  speedOfLight2: number; // m/s
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  n1: number;
  n2: number;
  theta1: number;
  expectedTheta2: string;
  expectedStatus: string;
}
