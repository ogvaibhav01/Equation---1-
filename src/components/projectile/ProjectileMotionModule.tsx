import React, { useState, useMemo } from 'react';
import { computeProjectile, CELESTIAL_PRESETS } from '../../physics/projectileModel';
import { ProjectileCanvas } from './ProjectileCanvas';
import { ProjectileControls } from './ProjectileControls';
import { ProjectileMetrics } from './ProjectileMetrics';
import { MathBlock } from '../common/MathBlock';

export const ProjectileMotionModule: React.FC = () => {
  const [velocity, setVelocity] = useState<number>(30); // m/s
  const [angle, setAngle] = useState<number>(45); // degrees
  const [initialHeight, setInitialHeight] = useState<number>(0); // m
  const [gravity, setGravity] = useState<number>(9.81); // m/s^2
  const [celestialId, setCelestialId] = useState<string>('earth');

  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showApex, setShowApex] = useState<boolean>(true);
  const [showTrajectoryGrid, setShowTrajectoryGrid] = useState<boolean>(true);

  const calc = useMemo(() => {
    return computeProjectile(velocity, angle, initialHeight, gravity);
  }, [velocity, angle, initialHeight, gravity]);

  const handleGravityChange = (newG: number, newId?: string) => {
    setGravity(newG);
    setCelestialId(newId || 'custom');
  };

  const handleReset = () => {
    setVelocity(30);
    setAngle(45);
    setInitialHeight(0);
    setGravity(9.81);
    setCelestialId('earth');
    setShowVectors(true);
    setShowApex(true);
    setShowTrajectoryGrid(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Module Title Banner */}
      <div className="space-y-2 border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-2">
              <span>Mechanics Laboratory</span>
              <span className="text-slate-600">·</span>
              <span>2D Kinematic Trajectories</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Projectile Motion
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-400 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">
              Governing Equation: y(x) = h₀ + x·tan(θ) - (g·x²) / (2v₀²·cos²(θ))
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Simulate parabolic trajectories under uniform gravity without air resistance. Observe how initial launch velocity, elevation angle, and gravitational acceleration influence apex height and ground impact range.
        </p>
      </div>

      {/* Primary Layout: Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Column: Canvas + Metrics */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <ProjectileCanvas
            calc={calc}
            showVectors={showVectors}
            showApex={showApex}
            showTrajectoryGrid={showTrajectoryGrid}
          />

          <ProjectileMetrics calc={calc} />
        </div>

        {/* Right Column: Launch Parameter Controls */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <ProjectileControls
            velocity={velocity}
            angle={angle}
            initialHeight={initialHeight}
            gravity={gravity}
            celestialId={celestialId}
            showVectors={showVectors}
            showApex={showApex}
            showTrajectoryGrid={showTrajectoryGrid}
            onVelocityChange={setVelocity}
            onAngleChange={setAngle}
            onInitialHeightChange={setInitialHeight}
            onGravityChange={handleGravityChange}
            onToggleVectors={() => setShowVectors(!showVectors)}
            onToggleApex={() => setShowApex(!showApex)}
            onToggleGrid={() => setShowTrajectoryGrid(!showTrajectoryGrid)}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Kinematics Equations Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Kinematics Mathematical Formulation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MathBlock
            title="Horizontal Position x(t)"
            formula="x(t) = v₀ · cos(θ) · t"
            description="Since horizontal acceleration a_x = 0 under uniform gravity, horizontal velocity v_x remains constant throughout the flight."
          />

          <MathBlock
            title="Vertical Position y(t)"
            formula="y(t) = h₀ + v₀ · sin(θ) · t - ½ g t²"
            description="Vertical motion undergoes constant downward gravitational acceleration -g, producing a parabolic altitude profile."
          />

          <MathBlock
            title="Ground Range (h₀ = 0)"
            formula="R = (v₀² · sin(2θ)) / g"
            description="For level ground launch, maximum horizontal range is achieved at an optimal launch angle of θ = 45° where sin(2θ) = 1."
          />
        </div>
      </div>
    </div>
  );
};
