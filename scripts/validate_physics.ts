import { computeOptics } from '../src/physics/snellModel';

console.log('--- RUNNING SNELLS LAW SCIENTIFIC VALIDATION SUITE ---');

// Case A
const caseA = computeOptics(1.00, 1.50, 0);
console.log('Case A (Normal incidence, θ₁=0°):', {
  theta2Deg: caseA.theta2Deg,
  status: caseA.status,
  isTIR: caseA.isTotalInternalReflection,
});
if (caseA.theta2Deg !== 0 || caseA.status !== 'no_deviation') {
  throw new Error('Case A failed');
}

// Case B
const caseB = computeOptics(1.00, 1.50, 45);
console.log('Case B (Air to glass, θ₁=45°):', {
  theta2Deg: caseB.theta2Deg?.toFixed(2),
  status: caseB.status,
});
if (!caseB.theta2Deg || Math.abs(caseB.theta2Deg - 28.13) > 0.1 || caseB.status !== 'bending_towards_normal') {
  throw new Error('Case B failed');
}

// Case C
const caseC = computeOptics(1.50, 1.00, 30);
console.log('Case C (Glass to air, θ₁=30°):', {
  theta2Deg: caseC.theta2Deg?.toFixed(2),
  status: caseC.status,
});
if (!caseC.theta2Deg || Math.abs(caseC.theta2Deg - 48.59) > 0.1 || caseC.status !== 'bending_away_from_normal') {
  throw new Error('Case C failed');
}

// Case D
const caseD = computeOptics(1.50, 1.00, 50);
console.log('Case D (Glass to air, θ₁=50° > θ_c):', {
  theta2Deg: caseD.theta2Deg,
  status: caseD.status,
  isTIR: caseD.isTotalInternalReflection,
});
if (caseD.theta2Deg !== null || !caseD.isTotalInternalReflection || caseD.status !== 'total_internal_reflection') {
  throw new Error('Case D failed');
}

// Case E
const caseE = computeOptics(1.33, 1.33, 40);
console.log('Case E (Equal indices, θ₁=40°):', {
  theta2Deg: caseE.theta2Deg?.toFixed(2),
  status: caseE.status,
});
if (!caseE.theta2Deg || Math.abs(caseE.theta2Deg - 40.0) > 0.01 || caseE.status !== 'no_deviation') {
  throw new Error('Case E failed');
}

// Case F
const caseF = computeOptics(1.50, 1.00, 41.8103);
console.log('Case F (Critical angle, n₁=1.5, n₂=1.0):', {
  criticalAngleDeg: caseF.criticalAngleDeg?.toFixed(2),
  theta2Deg: caseF.theta2Deg?.toFixed(2),
  status: caseF.status,
  isCritical: caseF.isCriticalAngle,
});
if (!caseF.criticalAngleDeg || Math.abs(caseF.criticalAngleDeg - 41.81) > 0.1 || !caseF.isCriticalAngle) {
  throw new Error('Case F failed');
}

// Case G - Custom indices
const caseG = computeOptics(2.417, 1.333, 25);
console.log('Case G (Diamond to water, θ₁=25°):', {
  theta2Deg: caseG.theta2Deg?.toFixed(2),
  status: caseG.status,
});
// sin(theta2) = (2.417 / 1.333) * sin(25°) = 1.8132 * 0.4226 = 0.7663 -> arcsin(0.7663) = 50.02°
if (!caseG.theta2Deg || Math.abs(caseG.theta2Deg - 50.02) > 0.1) {
  throw new Error('Case G failed');
}

console.log('--- ALL SCIENTIFIC VALIDATION CASES PASSED SUCCESSFULLY ---');
