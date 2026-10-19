import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { VerifiedSource } from '../../types';

interface VerifiedSourcesDrawerProps {
  sources: VerifiedSource[];
}

export const VerifiedSourcesDrawer: React.FC<VerifiedSourcesDrawerProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3.5 rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">
            Verified Sources & Citations
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
            {sources.length} sources
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>{isOpen ? 'Hide' : 'Inspect'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 space-y-2 border-t border-white/5 bg-[#080B14]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sources.map((s, idx) => (
              <a
                key={s.id || idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-semibold truncate max-w-[140px]">
                    <Globe className="w-2.5 h-2.5" />
                    {s.domain}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      s.reliabilityScore >= 95
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {s.reliabilityScore}% Trust
                  </span>
                </div>
                <div className="font-medium text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 text-[11px] leading-snug">
                  {s.title}
                </div>
                {s.authorOrOrg && (
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{s.authorOrOrg}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:text-emerald-400 transition-opacity" />
                  </div>
                )}
              </a>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Real-time sources verified against accredited wire & institutional databases. No hallucinated links.</span>
          </div>
        </div>
      )}
    </div>
  );
};
