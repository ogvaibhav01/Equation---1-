export interface CelestialBody {
  id: string;
  name: string;
  gravity: number; // m/s^2
  description: string;
}

export interface ProjectileState {
  velocity: number; // m/s
  angle: number; // degrees
  initialHeight: number; // meters
  gravity: number; // m/s^2
  celestialId: string;
  showVectors: boolean;
  showApex: boolean;
  showTrajectoryGrid: boolean;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
  vx: number;
  vy: number;
}

export interface ProjectileCalculationResult {
  velocity: number;
  angleDeg: number;
  initialHeight: number;
  gravity: number;
  v0x: number;
  v0y: number;
  timeOfFlight: number;
  timeToApex: number;
  maxHeight: number;
  apexX: number;
  range: number;
  impactSpeed: number;
  impactAngleDeg: number;
  points: TrajectoryPoint[];
}
