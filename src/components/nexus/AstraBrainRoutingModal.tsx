import React, { useEffect, useState } from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Globe2,
  X
} from 'lucide-react';
import { AstraIntentMatch } from '../../services/astraBrain';
import { PowerId } from '../../types';

interface AstraBrainRoutingModalProps {
  isOpen: boolean;
  onClose: () => void;
  intentMatch: AstraIntentMatch | null;
  onProceedToPower: (powerId: PowerId) => void;
}

export const AstraBrainRoutingModal: React.FC<AstraBrainRoutingModalProps> = ({
  isOpen,
  onClose,
  intentMatch,
  onProceedToPower,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !intentMatch) {
      setCurrentStepIndex(0);
      return;
    }

    // Progress through the routing pipeline steps with high-tech cadence
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < intentMatch.routingPath.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, intentMatch]);

  if (!isOpen || !intentMatch) return null;

  const isCompleted = currentStepIndex >= intentMatch.routingPath.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-950/90 border border-amber-500/30 p-6 md:p-8 text-slate-100 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 p-[1px] flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-wider text-white">
                  ASTRA BRAIN 3.0
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AUTONOMOUS ROUTING
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cognitive intent classification & zero-friction dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Routing Pipeline Visualization */}
        <div className="py-6 space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Neural Execution Pathway</span>
            <span className="text-cyan-400">
              {Math.round(((currentStepIndex + 1) / intentMatch.routingPath.length) * 100)}% Synchronized
            </span>
          </div>

          {/* Sequential Step Nodes */}
          <div className="space-y-2">
            {intentMatch.routingPath.map((stepText, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div
                  key={stepText}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(234,179,8,0.25)] scale-[1.01]'
                      : isPast
                      ? 'bg-white/[0.04] border-white/10 text-slate-300'
                      : 'bg-white/[0.01] border-white/5 text-slate-600 opacity-60'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 transition-colors ${
                      isPast
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : isCurrent
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-white/5 text-slate-500 border border-white/10'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono font-bold tracking-wide block truncate">
                      {stepText}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Target Engine Resolution Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-cyan-400/30 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                Target Selected Engine
              </div>
              <div className="text-sm font-extrabold text-white">
                {intentMatch.label} ({intentMatch.capability})
              </div>
              <p className="text-[11px] text-slate-300">
                {intentMatch.reason}
              </p>
            </div>

            <div className="text-right flex-shrink-0 ml-3">
              <div className="text-lg font-black text-amber-300 font-mono">
                {Math.round(intentMatch.confidence * 100)}%
              </div>
              <div className="text-[9px] text-slate-400 font-mono">Confidence</div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onProceedToPower(intentMatch.powerId);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-cyan-400 text-slate-950 font-extrabold text-xs tracking-wide hover:brightness-110 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all active:scale-95"
          >
            <span>Launch {intentMatch.label}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
