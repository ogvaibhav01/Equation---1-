import { CelestialBody, ProjectileCalculationResult, TrajectoryPoint } from '../types/projectile';

export const CELESTIAL_PRESETS: CelestialBody[] = [
  { id: 'earth', name: 'Earth', gravity: 9.81, description: 'Standard terrestrial gravity (9.81 m/s²)' },
  { id: 'moon', name: 'Moon', gravity: 1.62, description: 'Lunar surface gravity (1.62 m/s²)' },
  { id: 'mars', name: 'Mars', gravity: 3.72, description: 'Martian surface gravity (3.72 m/s²)' },
  { id: 'jupiter', name: 'Jupiter', gravity: 24.79, description: 'Jovian cloud top gravity (24.79 m/s²)' },
];

export function computeProjectile(
  velocityRaw: number,
  angleDegRaw: number,
  initialHeightRaw: number,
  gravityRaw: number
): ProjectileCalculationResult {
  const velocity = Math.max(0.1, Math.min(150, velocityRaw || 25));
  const angleDeg = Math.max(0, Math.min(90, angleDegRaw ?? 45));
  const initialHeight = Math.max(0, Math.min(100, initialHeightRaw ?? 0));
  const gravity = Math.max(0.5, Math.min(50, gravityRaw || 9.81));

  const angleRad = (angleDeg * Math.PI) / 180;
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);

  // Time to apex (when vy = 0)
  const timeToApex = v0y / gravity;
  const maxHeight = initialHeight + (v0y * v0y) / (2 * gravity);
  const apexX = v0x * timeToApex;

  // Time of flight: y(t) = h0 + v0y*t - 0.5*g*t^2 = 0
  // 0.5*g*t^2 - v0y*t - h0 = 0
  const discriminant = v0y * v0y + 2 * gravity * initialHeight;
  const timeOfFlight = (v0y + Math.sqrt(Math.max(0, discriminant))) / gravity;

  // Range
  const range = v0x * timeOfFlight;

  // Impact velocities
  const vImpactX = v0x;
  const vImpactY = v0y - gravity * timeOfFlight;
  const impactSpeed = Math.sqrt(vImpactX * vImpactX + vImpactY * vImpactY);
  const impactAngleDeg = Math.abs((Math.atan2(vImpactY, vImpactX) * 180) / Math.PI);

  // Sample trajectory points
  const numSteps = 120;
  const points: TrajectoryPoint[] = [];
  for (let i = 0; i <= numSteps; i++) {
    const t = (i / numSteps) * timeOfFlight;
    const x = v0x * t;
    const y = Math.max(0, initialHeight + v0y * t - 0.5 * gravity * t * t);
    const vx = v0x;
    const vy = v0y - gravity * t;
    points.push({ x, y, t, vx, vy });
  }

  return {
    velocity,
    angleDeg,
    initialHeight,
    gravity,
    v0x,
    v0y,
    timeOfFlight,
    timeToApex,
    maxHeight,
    apexX,
    range,
    impactSpeed,
    impactAngleDeg,
    points,
  };
}
