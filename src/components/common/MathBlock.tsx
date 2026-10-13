import React from 'react';

interface MathBlockProps {
  title?: string;
  formula: string;
  description?: string;
  variables?: { symbol: string; meaning: string }[];
}

export const MathBlock: React.FC<MathBlockProps> = ({
  title,
  formula,
  description,
  variables,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-2">
      {title && (
        <div className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
          {title}
        </div>
      )}

      <div className="py-2 px-3 bg-slate-950/80 rounded border border-slate-800/80 flex items-center justify-center text-center">
        <span className="font-mono text-sm sm:text-base text-cyan-300 font-medium tracking-wide">
          {formula}
        </span>
      </div>

      {description && (
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      )}

      {variables && variables.length > 0 && (
        <div className="pt-1 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          {variables.map((v) => (
            <div key={v.symbol} className="flex items-baseline gap-1.5">
              <span className="font-mono text-cyan-400 font-semibold">{v.symbol}</span>
              <span className="text-slate-400">— {v.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
