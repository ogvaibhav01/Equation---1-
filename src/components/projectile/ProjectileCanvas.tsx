import React, { useState, useEffect } from 'react';
import { ProjectileCalculationResult } from '../../types/projectile';

interface ProjectileCanvasProps {
  calc: ProjectileCalculationResult;
  showVectors: boolean;
  showApex: boolean;
  showTrajectoryGrid: boolean;
}

export const ProjectileCanvas: React.FC<ProjectileCanvasProps> = ({
  calc,
  showVectors,
  showApex,
  showTrajectoryGrid,
}) => {
  const [animProgress, setAnimProgress] = useState(1); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let startTimestamp: number | null = null;
    const durationMs = Math.min(6000, Math.max(1500, calc.timeOfFlight * 600));

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(1, elapsed / durationMs);
      setAnimProgress(progress);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, calc.timeOfFlight]);

  // Coordinate scaling
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 440;
  const PADDING_LEFT = 60;
  const PADDING_BOTTOM = 50;
  const PADDING_TOP = 40;
  const PADDING_RIGHT = 60;

  const PLOT_WIDTH = SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const PLOT_HEIGHT = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const maxX = Math.max(20, calc.range * 1.15);
  const maxY = Math.max(10, calc.maxHeight * 1.25);

  const scaleX = (x: number) => PADDING_LEFT + (x / maxX) * PLOT_WIDTH;
  const scaleY = (y: number) => SVG_HEIGHT - PADDING_BOTTOM - (y / maxY) * PLOT_HEIGHT;

  // Path data for trajectory
  const points = calc.points;
  const pathD = points.length > 0
    ? `M ${scaleX(points[0].x)} ${scaleY(points[0].y)} ` +
      points.slice(1).map((p) => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ')
    : '';

  // Current animated projectile position
  const currentIdx = Math.min(
    points.length - 1,
    Math.floor(animProgress * (points.length - 1))
  );
  const currentPoint = points[currentIdx] || points[0];

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* Visual Header / Playback controls */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Kinematic Trajectory Stage
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono text-[11px]">
            g = {calc.gravity.toFixed(2)} m/s² · v₀ = {calc.velocity.toFixed(1)} m/s · θ = {calc.angleDeg.toFixed(1)}°
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAnimProgress(0);
              setIsPlaying(true);
            }}
            className="px-3 py-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            {isPlaying ? 'Replaying...' : 'Launch Simulation'}
          </button>
        </div>
      </div>

      {/* Trajectory Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[340px] max-h-[500px] select-none">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full"
          role="img"
          aria-label="Projectile Motion trajectory plot showing parabolic curve, maximum altitude, and ground range"
        >
          <defs>
            <marker
              id="vector-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Coordinate Grid */}
          {showTrajectoryGrid && (
            <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
              {[0.25, 0.5, 0.75, 1.0].map((frac) => (
                <line
                  key={`grid-x-${frac}`}
                  x1={scaleX(maxX * frac)}
                  y1={PADDING_TOP}
                  x2={scaleX(maxX * frac)}
                  y2={SVG_HEIGHT - PADDING_BOTTOM}
                />
              ))}
              {[0.25, 0.5, 0.75, 1.0].map((frac) => (
                <line
                  key={`grid-y-${frac}`}
                  x1={PADDING_LEFT}
                  y1={scaleY(maxY * frac)}
                  x2={SVG_WIDTH - PADDING_RIGHT}
                  y2={scaleY(maxY * frac)}
                />
              ))}
            </g>
          )}

          {/* Ground Baseline */}
          <line
            x1={PADDING_LEFT}
            y1={scaleY(0)}
            x2={SVG_WIDTH - PADDING_RIGHT}
            y2={scaleY(0)}
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Launch Platform / Height if h0 > 0 */}
          {calc.initialHeight > 0 && (
            <g>
              <rect
                x={PADDING_LEFT - 12}
                y={scaleY(calc.initialHeight)}
                width="16"
                height={scaleY(0) - scaleY(calc.initialHeight)}
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text
                x={PADDING_LEFT - 18}
                y={(scaleY(calc.initialHeight) + scaleY(0)) / 2}
                textAnchor="end"
                className="font-mono text-[10px] fill-slate-400"
              >
                h₀={calc.initialHeight.toFixed(0)}m
              </text>
            </g>
          )}

          {/* Trajectory Parabolic Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            strokeDasharray="6 3"
          />

          {/* Solid line up to current animated point */}
          {animProgress > 0 && (
            <path
              d={
                `M ${scaleX(points[0].x)} ${scaleY(points[0].y)} ` +
                points
                  .slice(1, currentIdx + 1)
                  .map((p) => `L ${scaleX(p.x)} ${scaleY(p.y)}`)
                  .join(' ')
              }
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
            />
          )}

          {/* Apex Point Marker */}
          {showApex && (
            <g>
              <line
                x1={scaleX(calc.apexX)}
                y1={scaleY(calc.maxHeight)}
                x2={scaleX(calc.apexX)}
                y2={scaleY(0)}
                stroke="#eab308"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={scaleX(calc.apexX)}
                cy={scaleY(calc.maxHeight)}
                r="4.5"
                fill="#eab308"
              />
              <text
                x={scaleX(calc.apexX)}
                y={scaleY(calc.maxHeight) - 10}
                textAnchor="middle"
                className="font-mono text-xs fill-amber-300 font-bold"
              >
                Apex: {calc.maxHeight.toFixed(1)} m
              </text>
            </g>
          )}

          {/* Range Point Marker */}
          <g>
            <circle
              cx={scaleX(calc.range)}
              cy={scaleY(0)}
              r="4.5"
              fill="#10b981"
            />
            <text
              x={scaleX(calc.range)}
              y={scaleY(0) + 20}
              textAnchor="middle"
              className="font-mono text-xs fill-emerald-400 font-bold"
            >
              Range: {calc.range.toFixed(1)} m
            </text>
          </g>

          {/* Projectile Body & Velocity Vectors */}
          {currentPoint && (
            <g transform={`translate(${scaleX(currentPoint.x)}, ${scaleY(currentPoint.y)})`}>
              <circle r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

              {showVectors && (
                <g>
                  {/* v_x vector */}
                  <line
                    x1="0"
                    y1="0"
                    x2={currentPoint.vx * 1.2}
                    y2="0"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    markerEnd="url(#vector-arrow)"
                  />
                  {/* v_y vector */}
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={-currentPoint.vy * 1.2}
                    stroke="#22d3ee"
                    strokeWidth="2"
                    markerEnd="url(#vector-arrow)"
                  />
                </g>
              )}
            </g>
          )}

          {/* Coordinate Axis Labels */}
          <text
            x={PADDING_LEFT}
            y={scaleY(0) + 18}
            className="font-mono text-[10px] fill-slate-400"
          >
            0 m
          </text>
          <text
            x={SVG_WIDTH - PADDING_RIGHT}
            y={scaleY(0) + 18}
            textAnchor="end"
            className="font-mono text-[10px] fill-slate-400"
          >
            Horizontal Distance X (m)
          </text>
          <text
            x={PADDING_LEFT - 8}
            y={PADDING_TOP + 10}
            textAnchor="end"
            className="font-mono text-[10px] fill-slate-400"
          >
            Y (m)
          </text>
        </svg>
      </div>

      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Time Elapsed:{' '}
          <strong className="text-white font-mono">
            {(currentPoint ? currentPoint.t : calc.timeOfFlight).toFixed(2)} s
          </strong>{' '}
          / {calc.timeOfFlight.toFixed(2)} s
        </span>
        <span className="font-mono text-slate-500">
          Impact Speed: {calc.impactSpeed.toFixed(1)} m/s ({calc.impactAngleDeg.toFixed(1)}° below horiz.)
        </span>
      </div>
    </div>
  );
};
