import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  highlight?: 'cyan' | 'amber' | 'emerald' | 'purple' | 'rose' | 'default';
  formulaHint?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  highlight = 'default',
  formulaHint,
}) => {
  const getHighlightClass = () => {
    switch (highlight) {
      case 'cyan':
        return 'text-cyan-400';
      case 'amber':
        return 'text-amber-400';
      case 'emerald':
        return 'text-emerald-400';
      case 'purple':
        return 'text-purple-400';
      case 'rose':
        return 'text-rose-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between transition-colors hover:border-slate-700">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs text-slate-400 font-medium truncate">{label}</span>
        {formulaHint && (
          <span className="text-[11px] font-mono text-slate-500">{formulaHint}</span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className={`text-xl font-bold font-mono tabular-nums tracking-tight ${getHighlightClass()}`}>
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
      </div>

      {subtext && (
        <span className="text-[11px] text-slate-500 truncate mt-0.5">{subtext}</span>
      )}
    </div>
  );
};
