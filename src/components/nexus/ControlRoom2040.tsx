import React, { useState } from 'react';
import {
  Globe2,
  Calendar,
  Lock,
  Zap,
  TrendingUp,
  Cpu,
  Radio,
  Satellite,
  Compass,
  Sparkles,
  ArrowRight,
  BookOpen,
  FolderKanban,
  Target,
  ListTodo,
  FileText,
  Brain,
  Activity,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { PowerId } from '../../types';
import { triggerHaptic, hapticAction } from '../../utils/haptics';

interface ControlRoom2040Props {
  onSelectPower: (power: PowerId) => void;
}

export const ControlRoom2040: React.FC<ControlRoom2040Props> = ({ onSelectPower }) => {
  const [activeHorizon, setActiveHorizon] = useState<'2030' | '2040' | '2050'>('2040');

  const liveNowItems = [
    { name: 'World Intelligence', sub: 'Demographics & Geopolitics', power: 'global-intelligence' as PowerId, icon: Globe2, color: 'text-cyan-400' },
    { name: 'India Intelligence', sub: 'States, Schemes & ISRO', power: 'india-intelligence' as PowerId, icon: FlagIcon, color: 'text-amber-400' },
    { name: 'Planetary Weather', sub: 'Doppler Radar & AQI', power: 'earth' as PowerId, icon: Radio, color: 'text-sky-400' },
    { name: 'AI Frontier', sub: 'Test-Time Scaling Laws', power: 'tech-radar' as PowerId, icon: Cpu, color: 'text-purple-400' },
    { name: 'Semiconductors', sub: 'Gallium Nitride & Photonic Chips', power: 'codelab' as PowerId, icon: Zap, color: 'text-amber-300' },
    { name: 'Global Markets', sub: 'Real-time Liquidity & Indices', power: 'finance-economy' as PowerId, icon: TrendingUp, color: 'text-emerald-400' },
    { name: 'Sports Tracking', sub: 'Hawk-Eye 3.0 Spatial Data', power: 'sports' as PowerId, icon: Activity, color: 'text-orange-400' },
    { name: 'Space Telemetry', sub: 'ISS & Antariksh Station LEO', power: 'satellite' as PowerId, icon: Satellite, color: 'text-rose-400' },
    { name: 'Tech Trends', sub: 'Zero-Carbon Sovereign Cloud', power: 'briefing' as PowerId, icon: Flame, color: 'text-yellow-400' }
  ];

  const myWorldItems = [
    { name: 'Projects', sub: 'Kanban & Deliverables', power: 'projects' as PowerId, icon: FolderKanban, color: 'text-cyan-400', count: 4 },
    { name: 'Goals', sub: 'Coached Milestones', power: 'goalcoach' as PowerId, icon: Target, color: 'text-emerald-400', count: 5 },
    { name: 'Tasks', sub: 'Daily & Weekly Schedule', power: 'planner' as PowerId, icon: ListTodo, color: 'text-amber-400', count: 12 },
    { name: 'Learning', sub: 'AI Tutor Pro Sessions', power: 'study' as PowerId, icon: BookOpen, color: 'text-purple-400', count: 8 },
    { name: 'Documents', sub: 'Multimodal Vector Index', power: 'documents' as PowerId, icon: FileText, color: 'text-pink-400', count: 3 },
    { name: 'Memory', sub: 'Encrypted Cognitive Vault', power: 'memory' as PowerId, icon: Brain, color: 'text-yellow-400', count: 6 }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Control Room Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-cyan-500/15 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                COMMAND CENTER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                HOLOGRAPHIC 2040 MESH
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>ASTRA 2040 CONTROL ROOM</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Unified Tri-Fold Operations: LIVE NOW telemetric monitoring, LOOKING AHEAD futures modeling, and MY WORLD private sovereignty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectPower('personal-space')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Personal Space</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Holographic Columns: LIVE NOW • LOOKING AHEAD • MY WORLD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1: LIVE NOW */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-black/60 border border-cyan-500/30 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-extrabold text-white tracking-wide font-mono uppercase">
                LIVE NOW
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              9 Verified Feeds
            </span>
          </div>

          <div className="space-y-2">
            {liveNowItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectPower(item.power);
                    hapticAction();
                  }}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.sub}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: LOOKING AHEAD (2030, 2040, 2050) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-black/60 border border-amber-500/30 backdrop-blur-xl space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white tracking-wide font-mono uppercase">
                  LOOKING AHEAD
                </h3>
              </div>

              {/* Horizon Selector (2030, 2040, 2050) */}
              <div className="flex p-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono">
                {(['2030', '2040', '2050'] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setActiveHorizon(h);
                      hapticAction();
                    }}
                    className={`px-2 py-0.5 rounded transition-all ${
                      activeHorizon === h
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizon Specific Intelligence Dossier */}
            {activeHorizon === '2030' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">HORIZON 2030: QUANTUM & BIO-ENERGY</span>
                  <p className="text-slate-200 font-semibold text-sm">Solid-State Commercial Fleets & Edge Quantum Decoupling</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    National grid networks integrate sodium-ion storage; commercial air carriers begin short-haul hydrogen turbofan routes.
                  </p>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div>• Solid-State Batteries: 500 Wh/kg commercially verified</div>
                  <div>• 10,000-Qubit Topological Processors in hyperscale cloud</div>
                  <div>• 60% of all code generated and formally verified by agentic meshes</div>
                </div>
              </div>
            )}

            {activeHorizon === '2040' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">HORIZON 2040: BHARATIYA ANTARIKSH & FUSION</span>
                  <p className="text-slate-200 font-semibold text-sm">Permanent Orbital Habitats & High-Temperature Fusion Grids</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Bharatiya Antariksh Station operational with closed-loop bio-regenerative agriculture; coastal desalination achieves zero grid carbon.
                  </p>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div>• High-Temperature Superconductor Tokamaks delivering continuous Q&gt;10 net power</div>
                  <div>• Inter-city vacuum maglev corridors connecting global hubs</div>
                  <div>• Zero-emission urban mobility with decentralized 15-minute concourses</div>
                </div>
              </div>
            )}

            {activeHorizon === '2050' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">HORIZON 2050: INTERPLANETARY TRANSSHIPMENT</span>
                  <p className="text-slate-200 font-semibold text-sm">Post-Carbon Bio-Cities & Autonomous Lunar Regolith Metallurgy</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Atmospheric carbon direct capture reaches net negative planetary balance; permanent settlements on lunar south pole and Mars cycler transit.
                  </p>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div>• Self-replicating autonomous additive manufacturing using basaltic regolith</div>
                  <div>• Engineered photosynthetic organisms restoring degraded biomes</div>
                  <div>• Universal cognitive digital twin co-pilots for all citizens</div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectPower('scenarios')}
            className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Launch World Simulator Scenarios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* COLUMN 3: MY WORLD */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-black/60 border border-purple-500/30 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-extrabold text-white tracking-wide font-mono uppercase">
                MY WORLD
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Private Sovereignty
            </span>
          </div>

          <div className="space-y-2">
            {myWorldItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectPower(item.power);
                    hapticAction();
                  }}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.sub}</div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-white">
                    {item.count} Items
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
