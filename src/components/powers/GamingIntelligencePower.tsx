import React, { useState } from 'react';
import {
  Gamepad2,
  Cpu,
  Layers,
  Sparkles,
  Download,
  Play,
  CheckCircle2,
  Code2,
  Sword,
  Map,
  Users,
  Compass,
  ArrowLeft,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface GamingIntelligencePowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type GameBuilderStage =
  | 'CONCEPT'
  | 'WORLD'
  | 'CHARACTERS'
  | 'MAP'
  | 'GAMEPLAY'
  | 'UI'
  | 'CODE'
  | 'ASSETS'
  | 'TESTING'
  | 'PREVIEW';

export const GamingIntelligencePower: React.FC<GamingIntelligencePowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'database' | 'esports'>('builder');
  const [gameConcept, setGameConcept] = useState('Cyberpunk Indian mythological action RPG where an exiled cyber-monk navigates neo-Varanasi with energy chakras and plasma staves.');
  const [currentStage, setCurrentStage] = useState<GameBuilderStage>('CONCEPT');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const stages: GameBuilderStage[] = [
    'CONCEPT',
    'WORLD',
    'CHARACTERS',
    'MAP',
    'GAMEPLAY',
    'UI',
    'CODE',
    'ASSETS',
    'TESTING',
    'PREVIEW'
  ];

  const handleNextStage = () => {
    const idx = stages.indexOf(currentStage);
    if (idx < stages.length - 1) {
      setIsSynthesizing(true);
      triggerHaptic(10);
      setTimeout(() => {
        setIsSynthesizing(false);
        setCurrentStage(stages[idx + 1]);
        hapticSuccess();
      }, 500);
    }
  };

  return (
    <div
      id="astra-gaming-intelligence-power"
      className="w-full flex-1 flex flex-col bg-[#04060E] text-slate-100 min-h-0 min-w-0 overflow-y-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Header */}
      <div className="sticky top-0 z-20 border-b border-amber-500/20 bg-[#050814]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                triggerHaptic(10);
                onBack();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-amber-500/40 text-purple-400">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                GAMING INTELLIGENCE & BUILDER
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  Concept Studio
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              10-Stage Game Builder • Mechanics & World Lore • Esports Telemetry • Transparent Prototype Labeling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'builder' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Game Builder
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'database' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Game Encyclopedia
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Transparency Banner */}
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300 flex items-center justify-between">
          <span className="font-semibold">
            Status Label: <span className="font-bold underline uppercase">Concept / Prototype Mode</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Astra generates verified design documents, schemas, and runnable HTML5 prototypes
          </span>
        </div>

        {/* 10-Stage Builder Ladder */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              Active Workspace Stage: <span className="text-amber-300">{currentStage}</span>
            </span>
            <span className="font-mono">{stages.indexOf(currentStage) + 1} of 10</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {stages.map((stage, idx) => {
              const isPast = stages.indexOf(currentStage) > idx;
              const isCurrent = currentStage === stage;

              return (
                <button
                  key={stage}
                  onClick={() => {
                    setCurrentStage(stage);
                    triggerHaptic(8);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-black shadow-md'
                      : isPast
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {idx + 1}. {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* Concept Input */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
          <label className="block text-xs font-bold text-slate-300">Game Design Concept & Narrative Setting</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={gameConcept}
              onChange={(e) => setGameConcept(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleNextStage}
              disabled={isSynthesizing}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSynthesizing ? 'Synthesizing...' : 'Next Stage →'}
            </button>
          </div>
        </div>

        {/* Blueprint Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Sword className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Core Combat Mechanics</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fast-paced parry-counter flow with 7 Elemental Chakras (Solar, Plasma, Kinetic, Void) switchable mid-combo for stance-breaking strikes.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Map className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">World & Biome Architecture</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Neo-Varanasi 2077: Multi-tiered vertical river ghats with neon holographic temple towers, cybernetic boat ferries, and underground sewer labyrinths.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Cpu className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Engine & Tech Stack</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prototyped in Three.js & WebGL for zero-install browser execution; production path targets Unreal Engine 5 with Nanite and Lumen lighting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
