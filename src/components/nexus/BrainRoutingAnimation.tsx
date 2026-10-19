import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Activity,
  Zap,
  X,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { PowerId } from '../../types';
import { AstraIntentMatch } from '../../services/astraBrain';
import { triggerHaptic, hapticSuccess } from '../../utils/haptics';

export type BrainStageId = 'understanding' | 'selecting' | 'analysing' | 'complete';

export interface BrainStageInfo {
  id: BrainStageId;
  label: string;
  sublabel: string;
  technicalCode: string;
  detail: string;
  icon: React.ElementType;
  accentColor: string;
  bgGlow: string;
  badgeColor: string;
}

export const BRAIN_STAGES: BrainStageInfo[] = [
  {
    id: 'understanding',
    label: 'Understanding Request',
    sublabel: 'Intent Classification & Semantic Scoping',
    technicalCode: 'NLP-PARSE // TOKENIZE_QUERY',
    detail: 'Deconstructing query syntax, analyzing prompt context, and evaluating user intent vectors.',
    icon: Brain,
    accentColor: 'text-amber-400',
    bgGlow: 'from-amber-500/25 via-amber-500/5 to-transparent',
    badgeColor: 'bg-amber-500/15 border-amber-400/30 text-amber-300'
  },
  {
    id: 'selecting',
    label: 'Selecting Capability',
    sublabel: 'Astra Neural Matrix Routing',
    technicalCode: 'NEURAL-ROUTER // CAPABILITY_LOCK',
    detail: 'Traversing 2040 cognitive modules, matching specialized tools, and allocating execution context.',
    icon: Layers,
    accentColor: 'text-cyan-400',
    bgGlow: 'from-cyan-500/25 via-cyan-500/5 to-transparent',
    badgeColor: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300'
  },
  {
    id: 'analysing',
    label: 'Analysing',
    sublabel: 'Deep Parameter & Grounding Synthesis',
    technicalCode: 'SYNTHESIS // GROUND_VERIFY',
    detail: 'Synthesizing input parameters, verifying grounding constraints, and tuning model temperature.',
    icon: Sparkles,
    accentColor: 'text-purple-400',
    bgGlow: 'from-purple-500/25 via-purple-500/5 to-transparent',
    badgeColor: 'bg-purple-500/15 border-purple-400/30 text-purple-300'
  }
];

export interface BrainRoutingAnimationProps {
  query?: string;
  intentMatch?: AstraIntentMatch | null;
  mode?: 'overlay' | 'inline';
  activeStageIndex?: number;
  autoProgress?: boolean;
  stageDuration?: number; // ms per stage (default 750ms)
  onComplete?: (targetPowerId: PowerId, query: string) => void;
  onCancel?: () => void;
  targetCapabilityLabel?: string;
  targetPowerId?: PowerId;
  className?: string;
}

export const BrainRoutingAnimation: React.FC<BrainRoutingAnimationProps> = ({
  query = 'Processing prompt...',
  intentMatch,
  mode = 'overlay',
  activeStageIndex: controlledStageIndex,
  autoProgress = true,
  stageDuration = 750,
  onComplete,
  onCancel,
  targetCapabilityLabel,
  targetPowerId,
  className = '',
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(
    controlledStageIndex !== undefined ? controlledStageIndex : 0
  );
  const [progressPercent, setProgressPercent] = useState(15);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);

  const resolvedTargetPower = targetPowerId || intentMatch?.powerId || 'chat';
  const resolvedTargetLabel =
    targetCapabilityLabel || intentMatch?.label || intentMatch?.capability || resolvedTargetPower.toUpperCase();

  // Progress through stages: 0 (Understanding) -> 1 (Selecting) -> 2 (Analysing) -> Complete
  useEffect(() => {
    if (controlledStageIndex !== undefined) {
      setCurrentStageIndex(controlledStageIndex);
      return;
    }

    if (!autoProgress) return;

    // Reset initial state
    setCurrentStageIndex(0);
    setProgressPercent(18);
    setTelemetryLogs([
      `[${new Date().toLocaleTimeString()}] AST-BRAIN-3.0 initialized`,
      `[INTENT] Receiving semantic stream: "${query.slice(0, 45)}${query.length > 45 ? '...' : ''}"`
    ]);

    const timer1 = setTimeout(() => {
      triggerHaptic(12);
      setCurrentStageIndex(1);
      setProgressPercent(55);
      setTelemetryLogs((prev) => [
        ...prev,
        `[ROUTING] Target capability match: ${resolvedTargetLabel} (${Math.round((intentMatch?.confidence || 0.95) * 100)}% confidence)`
      ]);
    }, stageDuration);

    const timer2 = setTimeout(() => {
      triggerHaptic(16);
      setCurrentStageIndex(2);
      setProgressPercent(88);
      setTelemetryLogs((prev) => [
        ...prev,
        `[ANALYSIS] Deep neural synthesis & grounding parameters verified`
      ]);
    }, stageDuration * 2);

    const timerComplete = setTimeout(() => {
      hapticSuccess();
      setProgressPercent(100);
      setTelemetryLogs((prev) => [
        ...prev,
        `[DISPATCH] Neural pathway locked -> Transitioning to ${resolvedTargetLabel}`
      ]);

      const timerExit = setTimeout(() => {
        if (onComplete) {
          onComplete(resolvedTargetPower, query);
        }
      }, 400);

      return () => clearTimeout(timerExit);
    }, stageDuration * 3);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timerComplete);
    };
  }, [autoProgress, stageDuration, query, resolvedTargetLabel, resolvedTargetPower, controlledStageIndex]);

  const activeStage = BRAIN_STAGES[Math.min(currentStageIndex, BRAIN_STAGES.length - 1)];
  const isComplete = currentStageIndex >= BRAIN_STAGES.length;

  const content = (
    <div
      id="brain-routing-animation-card"
      className={`relative w-full max-w-2xl bg-slate-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(234,179,8,0.15)] backdrop-blur-2xl overflow-hidden flex flex-col items-center select-none ${className}`}
    >
      {/* Dynamic Background Holographic Glow */}
      <div
        className={`absolute -inset-2 bg-gradient-to-b ${activeStage.bgGlow} opacity-70 blur-3xl pointer-events-none transition-all duration-700`}
      />

      {/* Cyber Grid Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full flex items-center justify-between pb-5 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wider text-white">
                ASTRA BRAIN 3.0
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                COGNITIVE ROUTER
              </span>
            </div>
            <span className="text-xs text-slate-400">Autonomous Neural Dispatch</span>
          </div>
        </div>

        {onCancel && (
          <button
            id="brain-routing-cancel-btn"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cancel Routing"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Center Holographic Stage Core */}
      <div className="relative my-6 sm:my-8 flex flex-col items-center justify-center z-10">
        {/* Pulsing Quantum Ring Particles */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-cyan-400/30"
          />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-cyan-500/20 blur-md animate-pulse" />

          {/* Active Stage Icon */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <activeStage.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${activeStage.accentColor}`} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stage Name & Subtitle */}
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Stage {Math.min(currentStageIndex + 1, 3)} of 3
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-wide text-white mt-1">
            {activeStage.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 px-4 leading-relaxed">
            {activeStage.detail}
          </p>
        </div>
      </div>

      {/* Query Being Processed Snippet */}
      <div className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-3.5 mb-6 z-10 flex items-start gap-3">
        <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Active Query Vector
          </div>
          <div className="text-xs text-slate-200 font-mono truncate mt-0.5">
            "{query}"
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
          <Compass className="w-3 h-3" />
          <span>{resolvedTargetLabel}</span>
        </div>
      </div>

      {/* 3 Step Visual Pipeline Indicators */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 z-10 mb-5">
        {BRAIN_STAGES.map((st, idx) => {
          const isPast = currentStageIndex > idx;
          const isCurrent = currentStageIndex === idx;
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
                isCurrent
                  ? `${st.badgeColor} shadow-[0_0_15px_rgba(234,179,8,0.2)] scale-[1.02]`
                  : isPast
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.02] border-white/5 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center mb-1.5">
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Icon className={`w-4 h-4 ${st.accentColor} animate-bounce`} />
                ) : (
                  <Icon className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <span className="text-[11px] font-bold tracking-tight leading-tight line-clamp-1">
                {st.label}
              </span>
              <span className="text-[9px] font-mono opacity-80 mt-0.5">
                {isPast ? 'COMPLETED' : isCurrent ? 'PROCESSING' : 'QUEUED'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Telemetry Footer */}
      <div className="w-full z-10 space-y-3">
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden p-[1px] border border-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400"
            initial={{ width: '15%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Live Terminal Telemetry Log */}
        <div className="w-full bg-black/60 rounded-xl p-2.5 font-mono text-[10px] text-slate-400 border border-white/5 space-y-0.5">
          {telemetryLogs.slice(-2).map((log, i) => (
            <div key={i} className="truncate flex items-center gap-1.5">
              <span className="text-amber-400">❯</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Skip to Execution Button */}
        {onComplete && (
          <div className="flex justify-end pt-1">
            <button
              id="brain-routing-skip-btn"
              onClick={() => {
                hapticSuccess();
                onComplete(resolvedTargetPower, query);
              }}
              className="flex items-center gap-1 text-[11px] font-mono text-amber-300 hover:text-amber-200 transition-colors"
            >
              <span>Instant Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (mode === 'overlay') {
    return (
      <div
        id="brain-routing-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      >
        {content}
      </div>
    );
  }

  // Inline mode: directly replaces content inside the container
  return (
    <div id="brain-routing-inline" className="w-full flex justify-center py-4">
      {content}
    </div>
  );
};
