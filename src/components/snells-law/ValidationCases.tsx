import React from 'react';
import { VALIDATION_TEST_CASES } from '../../physics/snellModel';
import { TestCase } from '../../types/optics';

interface ValidationCasesProps {
  currentN1: number;
  currentN2: number;
  currentTheta1: number;
  onSelectCase: (testCase: TestCase) => void;
}

export const ValidationCases: React.FC<ValidationCasesProps> = ({
  currentN1,
  currentN2,
  currentTheta1,
  onSelectCase,
}) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Standard Verification Test Cases
        </h3>
        <span className="text-xs text-slate-400">One-click experimental setups</span>
      </div>

      <p className="text-xs text-slate-400">
        Load verified scientific test scenarios directly into the simulation to test boundary conditions, normal incidence, equal media, and total internal reflection.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VALIDATION_TEST_CASES.map((tc) => {
          const isActive =
            Math.abs(currentN1 - tc.n1) < 0.02 &&
            Math.abs(currentN2 - tc.n2) < 0.02 &&
            Math.abs(currentTheta1 - tc.theta1) < 0.5;

          return (
            <button
              key={tc.id}
              type="button"
              onClick={() => onSelectCase(tc)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {tc.name}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {tc.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  n₁={tc.n1.toFixed(2)} · n₂={tc.n2.toFixed(2)} · θ₁={tc.theta1}°
                </span>
                <span className="text-emerald-400 font-semibold">{tc.expectedTheta2}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
