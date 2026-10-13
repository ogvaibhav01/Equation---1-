import React, { useRef, useState, useCallback, useEffect } from 'react';
import { OpticsCalculationResult } from '../../types/optics';

interface OpticsCanvasProps {
  calc: OpticsCalculationResult;
  medium1Name: string;
  medium2Name: string;
  showNormal: boolean;
  showArcs: boolean;
  showReflectedRay: boolean;
  showAngleLabels: boolean;
  showWavefronts: boolean;
  onAngleChange: (angle: number) => void;
}

export const OpticsCanvas: React.FC<OpticsCanvasProps> = ({
  calc,
  medium1Name,
  medium2Name,
  showNormal,
  showArcs,
  showReflectedRay,
  showAngleLabels,
  showWavefronts,
  onAngleChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // SVG coordinate dimensions
  const WIDTH = 800;
  const HEIGHT = 520;
  const CX = 400; // Point of incidence X
  const CY = 260; // Point of incidence Y (Interface line)
  const RAY_LENGTH = 230;
  const ARC_RADIUS = 56;

  // Incident ray geometry (upper left quadrant toward center)
  const t1Rad = calc.theta1Rad;
  const sourceX = CX - RAY_LENGTH * Math.sin(t1Rad);
  const sourceY = CY - RAY_LENGTH * Math.cos(t1Rad);

  // Midpoint of incident ray for direction arrow
  const incMidX = (sourceX + CX) / 2;
  const incMidY = (sourceY + CY) / 2;

  // Reflected ray geometry (upper right quadrant from center)
  const reflX = CX + RAY_LENGTH * Math.sin(t1Rad);
  const reflY = CY - RAY_LENGTH * Math.cos(t1Rad);
  const reflMidX = (CX + reflX) / 2;
  const reflMidY = (CY + reflY) / 2;

  // Refracted ray geometry (lower right quadrant from center)
  const hasRefractedRay = calc.theta2Deg !== null && !calc.isTotalInternalReflection;
  const t2Rad = calc.theta2Rad ?? 0;
  const refrX = CX + RAY_LENGTH * Math.sin(t2Rad);
  const refrY = CY + RAY_LENGTH * Math.cos(t2Rad);
  const refrMidX = (CX + refrX) / 2;
  const refrMidY = (CY + refrY) / 2;

  // Interactive mouse/touch dragging handler
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = WIDTH / rect.width;
      const scaleY = HEIGHT / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // Calculate angle from upper normal (vertical line going up from CX, CY)
      const dx = CX - mouseX;
      const dy = CY - mouseY;

      if (dy > 0) {
        let angleDeg = (Math.atan2(dx, dy) * 180) / Math.PI;
        angleDeg = Math.max(0, Math.min(90, Math.round(angleDeg * 10) / 10));
        onAngleChange(angleDeg);
      }
    },
    [isDragging, onAngleChange]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Arcs path calculations
  const arcT1X = CX - ARC_RADIUS * Math.sin(t1Rad);
  const arcT1Y = CY - ARC_RADIUS * Math.cos(t1Rad);
  const incidentArcPath =
    calc.theta1Deg > 0.5
      ? `M ${CX} ${CY - ARC_RADIUS} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 0 ${arcT1X} ${arcT1Y}`
      : '';

  const arcReflX = CX + ARC_RADIUS * Math.sin(t1Rad);
  const arcReflY = CY - ARC_RADIUS * Math.cos(t1Rad);
  const reflectedArcPath =
    calc.theta1Deg > 0.5 && showReflectedRay
      ? `M ${CX} ${CY - ARC_RADIUS} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${arcReflX} ${arcReflY}`
      : '';

  const arcT2X = CX + ARC_RADIUS * Math.sin(t2Rad);
  const arcT2Y = CY + ARC_RADIUS * Math.cos(t2Rad);
  const refractedArcPath =
    hasRefractedRay && (calc.theta2Deg ?? 0) > 0.5
      ? `M ${CX} ${CY + ARC_RADIUS} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 0 ${arcT2X} ${arcT2Y}`
      : '';

  // Optical density shading based on refractive index
  const medium1Opacity = Math.min(0.25, Math.max(0.04, (calc.n1 - 1.0) * 0.15 + 0.04));
  const medium2Opacity = Math.min(0.35, Math.max(0.04, (calc.n2 - 1.0) * 0.15 + 0.04));

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* Visual Header / Telemetry Bar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Ray Propagation Stage
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Drag emitter handle or use angle slider
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-slate-400">
            θ₁: <span className="text-cyan-400 font-semibold">{calc.theta1Deg.toFixed(1)}°</span>
          </span>
          {showReflectedRay && (
            <span className="text-slate-400">
              θᵣ: <span className="text-amber-400 font-semibold">{calc.thetaRDeg.toFixed(1)}°</span>
            </span>
          )}
          <span className="text-slate-400">
            θ₂:{' '}
            <span
              className={`font-semibold ${
                calc.isTotalInternalReflection
                  ? 'text-rose-400'
                  : calc.isCriticalAngle
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {calc.theta2Deg !== null ? `${calc.theta2Deg.toFixed(1)}°` : 'None (TIR)'}
            </span>
          </span>
        </div>
      </div>

      {/* Main SVG Visualization Canvas */}
      <div className="relative w-full aspect-[16/10] min-h-[350px] max-h-[540px] select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-full cursor-crosshair"
          onPointerDown={(e) => {
            setIsDragging(true);
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          }}
          aria-label="Snell's Law light refraction diagram showing incident, reflected, and refracted rays across optical media interface"
          role="img"
        >
          <defs>
            {/* Ray arrowheads */}
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
            </marker>
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
            </marker>
            <marker
              id="arrow-emerald"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
            </marker>

            {/* Glowing ray filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle optical density grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* BACKGROUND: Medium 1 (Incident Medium - Top) */}
          <rect
            x="0"
            y="0"
            width={WIDTH}
            height={CY}
            fill="#090e1c"
          />
          <rect
            x="0"
            y="0"
            width={WIDTH}
            height={CY}
            fill={`rgba(14, 165, 233, ${medium1Opacity})`}
          />
          <rect x="0" y="0" width={WIDTH} height={CY} fill="url(#grid)" />

          {/* BACKGROUND: Medium 2 (Second Medium - Bottom) */}
          <rect
            x="0"
            y={CY}
            width={WIDTH}
            height={HEIGHT - CY}
            fill="#050a16"
          />
          <rect
            x="0"
            y={CY}
            width={WIDTH}
            height={HEIGHT - CY}
            fill={`rgba(99, 102, 241, ${medium2Opacity})`}
          />
          <rect x="0" y={CY} width={WIDTH} height={HEIGHT - CY} fill="url(#grid)" />

          {/* MEDIUM LABELS & INDICES */}
          {/* Medium 1 Label (Top Left) */}
          <g transform="translate(24, 30)">
            <text className="font-sans font-semibold text-xs fill-slate-200">
              Medium 1: {medium1Name}
            </text>
            <text y="18" className="font-mono text-xs fill-cyan-400 font-medium">
              n₁ = {calc.n1.toFixed(3)}
            </text>
            <text y="34" className="font-mono text-[10px] fill-slate-400">
              v₁ = {(calc.speedOfLight1 / 1e8).toFixed(2)} × 10⁸ m/s
            </text>
          </g>

          {/* Medium 2 Label (Bottom Left) */}
          <g transform={`translate(24, ${CY + 30})`}>
            <text className="font-sans font-semibold text-xs fill-slate-200">
              Medium 2: {medium2Name}
            </text>
            <text y="18" className="font-mono text-xs fill-indigo-400 font-medium">
              n₂ = {calc.n2.toFixed(3)}
            </text>
            <text y="34" className="font-mono text-[10px] fill-slate-400">
              v₂ = {(calc.speedOfLight2 / 1e8).toFixed(2)} × 10⁸ m/s
            </text>
          </g>

          {/* Critical Angle Label (Bottom Right if applicable) */}
          {calc.criticalAngleDeg !== null && (
            <g transform={`translate(${WIDTH - 200}, ${CY - 20})`}>
              <text textAnchor="end" className="font-mono text-xs fill-amber-300 font-medium">
                Critical Angle θ_c = {calc.criticalAngleDeg.toFixed(1)}°
              </text>
            </g>
          )}

          {/* OPTICAL INTERFACE (Horizontal boundary line) */}
          <line
            x1="0"
            y1={CY}
            x2={WIDTH}
            y2={CY}
            stroke="#475569"
            strokeWidth="2"
          />
          <text
            x={WIDTH - 16}
            y={CY + 18}
            textAnchor="end"
            className="font-mono text-[10px] fill-slate-400 tracking-wider uppercase"
          >
            Optical Interface Boundary
          </text>

          {/* NORMAL LINE (Perpendicular to interface) */}
          {showNormal && (
            <g>
              <line
                x1={CX}
                y1={20}
                x2={CX}
                y2={HEIGHT - 20}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text
                x={CX + 8}
                y={32}
                className="font-mono text-[11px] fill-slate-400 font-semibold"
              >
                Normal Line (N)
              </text>
              <text
                x={CX + 8}
                y={HEIGHT - 28}
                className="font-mono text-[10px] fill-slate-400"
              >
                N′
              </text>
            </g>
          )}

          {/* WAVEFRONTS (Educational visualization showing wavelength change) */}
          {showWavefronts && (
            <g opacity="0.35">
              {/* Incident plane waves (perpendicular to incident ray) */}
              {[30, 60, 90, 120, 150, 180, 210].map((dist) => {
                const px = CX - dist * Math.sin(t1Rad);
                const py = CY - dist * Math.cos(t1Rad);
                const waveHalf = 24;
                const wx1 = px - waveHalf * Math.cos(t1Rad);
                const wy1 = py + waveHalf * Math.sin(t1Rad);
                const wx2 = px + waveHalf * Math.cos(t1Rad);
                const wy2 = py - waveHalf * Math.sin(t1Rad);
                return (
                  <line
                    key={`inc-wave-${dist}`}
                    x1={wx1}
                    y1={wy1}
                    x2={wx2}
                    y2={wy2}
                    stroke="#22d3ee"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Refracted plane waves (wavelength scaled by n1/n2) */}
              {hasRefractedRay &&
                [
                  25 * (calc.n1 / calc.n2),
                  50 * (calc.n1 / calc.n2),
                  75 * (calc.n1 / calc.n2),
                  100 * (calc.n1 / calc.n2),
                  125 * (calc.n1 / calc.n2),
                  150 * (calc.n1 / calc.n2),
                  175 * (calc.n1 / calc.n2),
                ].map((dist, idx) => {
                  const px = CX + dist * Math.sin(t2Rad);
                  const py = CY + dist * Math.cos(t2Rad);
                  const waveHalf = 24;
                  const wx1 = px - waveHalf * Math.cos(t2Rad);
                  const wy1 = py + waveHalf * Math.sin(t2Rad);
                  const wx2 = px + waveHalf * Math.cos(t2Rad);
                  const wy2 = py - waveHalf * Math.sin(t2Rad);
                  return (
                    <line
                      key={`refr-wave-${idx}`}
                      x1={wx1}
                      y1={wy1}
                      x2={wx2}
                      y2={wy2}
                      stroke="#34d399"
                      strokeWidth="1.2"
                    />
                  );
                })}
            </g>
          )}

          {/* ANGLE ARCS */}
          {showArcs && (
            <g>
              {/* Incident Arc θ₁ */}
              {incidentArcPath && (
                <path
                  d={incidentArcPath}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="1.75"
                />
              )}
              {showAngleLabels && calc.theta1Deg > 5 && (
                <text
                  x={CX - (ARC_RADIUS + 16) * Math.sin(t1Rad / 2)}
                  y={CY - (ARC_RADIUS + 16) * Math.cos(t1Rad / 2)}
                  textAnchor="middle"
                  className="font-mono text-xs fill-cyan-300 font-bold"
                >
                  θ₁={calc.theta1Deg.toFixed(0)}°
                </text>
              )}

              {/* Reflected Arc θᵣ */}
              {reflectedArcPath && (
                <path
                  d={reflectedArcPath}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
              )}
              {showAngleLabels && showReflectedRay && calc.theta1Deg > 5 && (
                <text
                  x={CX + (ARC_RADIUS + 16) * Math.sin(t1Rad / 2)}
                  y={CY - (ARC_RADIUS + 16) * Math.cos(t1Rad / 2)}
                  textAnchor="middle"
                  className="font-mono text-xs fill-amber-300 font-bold"
                >
                  θᵣ={calc.thetaRDeg.toFixed(0)}°
                </text>
              )}

              {/* Refracted Arc θ₂ */}
              {refractedArcPath && (
                <path
                  d={refractedArcPath}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.75"
                />
              )}
              {showAngleLabels && hasRefractedRay && (calc.theta2Deg ?? 0) > 5 && (
                <text
                  x={CX + (ARC_RADIUS + 16) * Math.sin(t2Rad / 2)}
                  y={CY + (ARC_RADIUS + 16) * Math.cos(t2Rad / 2)}
                  textAnchor="middle"
                  className="font-mono text-xs fill-emerald-300 font-bold"
                >
                  θ₂={calc.theta2Deg?.toFixed(0)}°
                </text>
              )}
            </g>
          )}

          {/* INCIDENT RAY (Cyan) */}
          <line
            x1={sourceX}
            y1={sourceY}
            x2={CX}
            y2={CY}
            stroke="#22d3ee"
            strokeWidth="3.5"
            filter="url(#glow-cyan)"
          />
          {/* Arrow on incident ray */}
          <circle
            cx={incMidX}
            cy={incMidY}
            r="1"
            markerEnd="url(#arrow-cyan)"
            stroke="none"
          />
          {/* Subtle directional pulse arrow line segment */}
          <line
            x1={sourceX}
            y1={sourceY}
            x2={incMidX}
            y2={incMidY}
            stroke="#22d3ee"
            strokeWidth="3.5"
            markerEnd="url(#arrow-cyan)"
          />

          {/* REFLECTED RAY (Amber / Yellow) */}
          {showReflectedRay && (
            <g>
              <line
                x1={CX}
                y1={CY}
                x2={reflX}
                y2={reflY}
                stroke={calc.isTotalInternalReflection ? '#f59e0b' : '#fbbf24'}
                strokeWidth={calc.isTotalInternalReflection ? '4' : '2.2'}
                strokeDasharray={calc.isTotalInternalReflection ? 'none' : '6 3'}
                filter="url(#glow-amber)"
              />
              <line
                x1={CX}
                y1={CY}
                x2={reflMidX}
                y2={reflMidY}
                stroke="#fbbf24"
                strokeWidth="2.5"
                markerEnd="url(#arrow-amber)"
              />
              <text
                x={reflX + 10}
                y={reflY - 8}
                className="font-sans text-xs fill-amber-300 font-semibold"
              >
                Reflected Ray {calc.isTotalInternalReflection && '(100% TIR)'}
              </text>
            </g>
          )}

          {/* REFRACTED / TRANSMITTED RAY (Emerald) */}
          {hasRefractedRay && (
            <g>
              <line
                x1={CX}
                y1={CY}
                x2={refrX}
                y2={refrY}
                stroke="#10b981"
                strokeWidth="3.5"
                filter="url(#glow-emerald)"
              />
              <line
                x1={CX}
                y1={CY}
                x2={refrMidX}
                y2={refrMidY}
                stroke="#34d399"
                strokeWidth="3"
                markerEnd="url(#arrow-emerald)"
              />
              <text
                x={refrX + 12}
                y={refrY + (calc.isCriticalAngle ? -8 : 12)}
                className="font-sans text-xs fill-emerald-300 font-semibold"
              >
                {calc.isCriticalAngle ? 'Grazing Ray (θ₂ = 90°)' : 'Refracted Ray'}
              </text>
            </g>
          )}

          {/* TOTAL INTERNAL REFLECTION GRAPHICAL NOTICE */}
          {calc.isTotalInternalReflection && (
            <g transform={`translate(${CX}, ${CY + 80})`}>
              <rect
                x="-190"
                y="-30"
                width="380"
                height="64"
                rx="8"
                fill="#0f172a"
                stroke="#e11d48"
                strokeWidth="1.5"
                opacity="0.95"
              />
              <text
                textAnchor="middle"
                y="-8"
                className="font-sans font-bold text-xs fill-rose-300 uppercase tracking-wide"
              >
                Total Internal Reflection (TIR)
              </text>
              <text
                textAnchor="middle"
                y="12"
                className="font-mono text-[11px] fill-rose-400"
              >
                θ₁ ({calc.theta1Deg.toFixed(1)}°) &gt; θ_c ({calc.criticalAngleDeg?.toFixed(1)}°) · No Transmitted Propagating Ray
              </text>
              <text
                textAnchor="middle"
                y="26"
                className="font-sans text-[10px] fill-slate-400"
              >
                100% of incident light energy is reflected back into Medium 1
              </text>
            </g>
          )}

          {/* POINT OF INCIDENCE (Intersection Center) */}
          <circle
            cx={CX}
            cy={CY}
            r="5"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="2.5"
          />
          <text
            x={CX + 8}
            y={CY + 18}
            className="font-mono text-[10px] fill-slate-400"
          >
            Point of Incidence (P)
          </text>

          {/* DRAGGABLE LIGHT EMITTER HANDLE */}
          <g
            transform={`translate(${sourceX}, ${sourceY})`}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            }}
          >
            <circle
              r="14"
              fill="#082f49"
              stroke="#22d3ee"
              strokeWidth="2.5"
              className="hover:stroke-white transition-colors"
            />
            <circle r="5" fill="#38bdf8" />
            <text
              x="-24"
              y="-18"
              textAnchor="middle"
              className="font-mono text-[11px] fill-cyan-300 font-bold pointer-events-none"
            >
              Emitter ({calc.theta1Deg.toFixed(0)}°)
            </text>
          </g>
        </svg>
      </div>

      {/* Visual Footer Caption */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Bending Behavior:{' '}
          <strong className="text-slate-200">{calc.statusLabel}</strong>
        </span>
        <span className="font-mono text-slate-500">
          Ratio n₁/n₂ = {calc.ratioN1N2.toFixed(3)}
        </span>
      </div>
    </div>
  );
};
