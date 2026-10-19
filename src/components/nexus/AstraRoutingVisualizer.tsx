import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Cpu,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  X,
  RefreshCw,
  Compass,
  Layers,
  Activity
} from 'lucide-react';
import { AstraIntentMatch } from '../../services/astraBrain';
import { PowerId } from '../../types';

export type RoutingStage = 'understanding' | 'selecting' | 'analysing' | 'ready';

export interface AstraRoutingVisualizerProps {
  query: string;
  intentMatch: AstraIntentMatch | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (powerId: PowerId, query: string) => void;
  autoDispatchDelay?: number; // ms, e.g. 1800
}

interface StageInfo {
  id: RoutingStage;
  label: string;
  sublabel: string;
  detail: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
}

const STAGES: StageInfo[] = [
  {
    id: 'understanding',
    label: 'Understanding Request',
    sublabel: 'Semantic Tokenization & Intent Classification',
    detail: 'Deconstructing natural language syntax, evaluating context scope, and mapping Bloom cognitive complexity.',
    icon: Brain,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-400/40'
  },
  {
    id: 'selecting',
    label: 'Selecting Capability',
    sublabel: 'Neural Matrix Routing & Capability Match',
    detail: 'Querying Astra 7 capability lattice across conversational, planetary, analytical, and academic engines.',
    icon: Layers,
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-400/40'
  },
  {
    id: 'analysing',
    label: 'Analysing',
    sublabel: 'Parameter Synthesis & Grounding Guardrails',
    detail: 'Synthesizing contextual parameters, verifying source indices, and preparing zero-latency execution runtime.',
    icon: Sparkles,
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-400/40'
  },
  {
    id: 'ready',
    label: 'Execution Ready',
    sublabel: 'Target Engine Armed & Dispatched',
    detail: 'Autonomous neural pathway locked. Seamlessly transitioning to selected capability workspace.',
    icon: CheckCircle2,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/40'
  }
];

export const AstraRoutingVisualizer: React.FC<AstraRoutingVisualizerProps> = ({
  query,
  intentMatch,
  isOpen,
  onClose,
  onDispatch,
  autoDispatchDelay = 2200
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isOpen || !intentMatch) {
      setCurrentStageIndex(0);
      setProgressPercent(0);
      setIsPaused(false);
      return;
    }

    // Reset when a new query arrives
    setCurrentStageIndex(0);
    setProgressPercent(15);
    setIsPaused(false);

    // Stage 1: Understanding Request (0ms -> 650ms)
    const timer1 = setTimeout(() => {
      setCurrentStageIndex(1); // Selecting Capability
      setProgressPercent(48);
    }, 650);

    // Stage 2: Selecting Capability (650ms -> 1350ms)
    const timer2 = setTimeout(() => {
      setCurrentStageIndex(2); // Analysing
      setProgressPercent(82);
    }, 1350);

    // Stage 3: Analysing -> Ready (1350ms -> 2000ms)
    const timer3 = setTimeout(() => {
      setCurrentStageIndex(3); // Ready
      setProgressPercent(100);
    }, 2000);

    // Auto-dispatch trigger after full analysis completes
    let dispatchTimer: NodeJS.Timeout | null = null;
    if (autoDispatchDelay > 0) {
      dispatchTimer = setTimeout(() => {
        if (!isPaused) {
          onDispatch(intentMatch.powerId, query);
        }
      }, 2000 + autoDispatchDelay);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (dispatchTimer) clearTimeout(dispatchTimer);
    };
  }, [isOpen, query, intentMatch]);

  if (!isOpen || !intentMatch) return null;

  const currentStage = STAGES[currentStageIndex];
  const isReady = currentStageIndex === 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-4xl mx-auto my-4 overflow-hidden rounded-3xl bg-slate-950/90 border border-amber-400/40 p-5 md:p-7 shadow-[0_0_50px_rgba(234,179,8,0.2)] backdrop-blur-2xl text-slate-100 relative"
      >
        {/* Ambient Neural Backlight Gradients */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Astra Brain 3.0 Status & Close/Pause */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 p-[1.5px] flex-shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-wider text-white">
                  ASTRA BRAIN 3.0
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-spin" />
                  COGNITIVE ROUTING PIPELINE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-md">
                Processing Query: “{query}”
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title={isPaused ? 'Resume Auto-Dispatch' : 'Pause Auto-Dispatch'}
            >
              {isPaused ? 'RESUME AUTO' : 'PAUSE'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Dismiss routing visualizer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fluid Animated Progress Line */}
        <div className="relative z-10 pt-4 pb-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Status: {currentStage.label}</span>
            </span>
            <span className="text-cyan-300 font-bold">{progressPercent}% SYNCHRONIZED</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* 3 Main Stages Status Stepper Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {STAGES.slice(0, 3).map((stage, idx) => {
            const Icon = stage.icon;
            const isPassed = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;

            return (
              <motion.div
                key={stage.id}
                layout
                className={`p-3.5 rounded-2xl border transition-all duration-300 backdrop-blur-xl relative overflow-hidden ${
                  isCurrent
                    ? 'bg-white/[0.08] border-amber-400/60 shadow-[0_0_20px_rgba(234,179,8,0.25)] scale-[1.02]'
                    : isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <span className="text-xs font-extrabold text-white">{stage.label}</span>
                  </div>

                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    STAGE 0{idx + 1}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {stage.detail}
                </p>

                {isCurrent && (
                  <motion.div
                    layoutId="active-stage-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400 animate-pulse"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Target Engine Resolution & Immediate Dispatch Banner */}
        <div className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-amber-500/15 border border-cyan-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
                TARGET CAPABILITY IDENTIFIED:
              </span>
              <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {intentMatch.confidence} CONFIDENCE
              </span>
            </div>

            <div className="text-base font-black text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{intentMatch.label}</span>
              <span className="text-xs font-normal text-slate-400">({intentMatch.capability})</span>
            </div>

            <p className="text-xs text-slate-300 max-w-xl">
              {intentMatch.reason}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
            <button
              onClick={() => onDispatch(intentMatch.powerId, query)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] w-full sm:w-auto justify-center"
            >
              <span>{isReady ? 'Launch Now' : 'Proceed to Capability'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
