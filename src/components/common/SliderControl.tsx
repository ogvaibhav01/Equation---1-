import React from 'react';

interface SliderControlProps {
  id: string;
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  quickButtons?: { label: string; value: number }[];
  accentColor?: 'cyan' | 'blue' | 'amber';
}

export const SliderControl: React.FC<SliderControlProps> = ({
  id,
  label,
  symbol,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  quickButtons,
  accentColor = 'cyan',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  const handleStep = (delta: number) => {
    const next = Math.min(max, Math.max(min, Math.round((value + delta) * 10) / 10));
    onChange(next);
  };

  const accentClass =
    accentColor === 'amber'
      ? 'accent-amber-400'
      : accentColor === 'blue'
      ? 'accent-blue-500'
      : 'accent-cyan-400';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={id} className="text-slate-300 font-medium flex items-center gap-1.5">
          {label}
          {symbol && <span className="font-mono text-cyan-400 font-semibold">{symbol}</span>}
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStep(-step)}
            aria-label={`Decrease ${label}`}
            className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            -
          </button>
          <div className="relative">
            <input
              id={`${id}-number`}
              type="number"
              min={min}
              max={max}
              step={step}
              value={Number.isInteger(value) ? value : value.toFixed(1)}
              onChange={handleInputChange}
              aria-label={`${label} numeric input`}
              className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-xs font-mono font-semibold text-white focus:outline-none focus:border-cyan-500 tabular-nums"
            />
          </div>
          <button
            type="button"
            onClick={() => handleStep(step)}
            aria-label={`Increase ${label}`}
            className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            +
          </button>
          {unit && <span className="text-slate-400 text-xs pl-0.5">{unit}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-500 shrink-0">{min}{unit}</span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={label}
          className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accentClass}`}
        />
        <span className="text-[11px] font-mono text-slate-500 shrink-0">{max}{unit}</span>
      </div>

      {quickButtons && quickButtons.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-0.5">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 mr-1">Presets:</span>
          {quickButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => onChange(btn.value)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors shrink-0 cursor-pointer ${
                Math.abs(value - btn.value) < 0.1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
