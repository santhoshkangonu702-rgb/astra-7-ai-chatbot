import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Bot,
  Binary,
  Radio,
  Sparkles,
  ArrowLeft,
  Search,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
  Zap,
  Globe2,
  Lock,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface AITechRadarPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type TechMaturity =
  | 'Current Reality'
  | 'Research'
  | 'Prototype'
  | 'Expected Development'
  | 'Possible Future Scenario';

export interface TechRadarItem {
  id: string;
  name: string;
  category: string;
  maturity: TechMaturity;
  currentStatus: string;
  recentDevelopment: string;
  academicResearch: string;
  limitations: string;
  possibleFuture: string;
  keyActors: string[];
  lastAudited: string;
  source: string;
}

const TECH_RADAR_ITEMS: TechRadarItem[] = [
  {
    id: 'tr-humanoid-robotics',
    name: 'Bipedal Humanoid Industrial Robots',
    category: 'Robotics & Hardware',
    maturity: 'Prototype',
    currentStatus: 'Controlled pilots in automotive stamping plants and specialized fulfillment sorting warehouses.',
    recentDevelopment: 'Integration of vision-language-action (VLA) foundation models allowing end-to-end learning from human teleoperation videos.',
    academicResearch: 'Whole-body dynamic model predictive control (MPC) coupled with tactile sensory fingertip arrays for fragile object manipulation.',
    limitations: 'Battery operational duration restricted to 2–4 hours under high load; high cost per actuator; safety protocols in unstructured human environments.',
    possibleFuture: 'General-purpose warehouse material handling by 2028; domestic eldercare and cooperative construction tasks by 2035.',
    keyActors: ['Boston Dynamics', 'Figure AI', 'Tesla Optimus', 'Sanctuary AI', 'Unitree'],
    lastAudited: '2026-09 Audited',
    source: 'IEEE Robotics and Automation Society & Stanford Robotics Lab'
  },
  {
    id: 'tr-multimodal-foundation',
    name: 'Multimodal Frontier Reasoning Models (Gemini, Claude, GPT)',
    category: 'Artificial Intelligence',
    maturity: 'Current Reality',
    currentStatus: 'Commercial production deployment handling code generation, image/video comprehension, speech synthesis, and real-time reasoning.',
    recentDevelopment: 'Test-time compute scaling, dynamic chain-of-thought verification, and native multimodal tool grounding without external OCR pipelines.',
    academicResearch: 'Reward modeling for verifiable mathematical proofs, synthetic data bootstrapping, and latent representation steering.',
    limitations: 'Susceptibility to edge-case hallucinations in complex multistep logic; immense inference energy requirements; copyright boundaries.',
    possibleFuture: 'Autonomous multi-agent scientific discovery loops; self-correcting software development environments with automated formal verification.',
    keyActors: ['Google DeepMind', 'Anthropic', 'OpenAI', 'Meta FAIR'],
    lastAudited: '2026-09 Audited',
    source: 'ACM Computing Surveys & Frontier Model Forum Technical Reports'
  },
  {
    id: 'tr-quantum-computing',
    name: 'Fault-Tolerant Quantum Computing & Neutral-Atom Arrays',
    category: 'Quantum Technologies',
    maturity: 'Research',
    currentStatus: 'Noisy Intermediate-Scale Quantum (NISQ) devices operating between 100 to 1,000 physical qubits; demonstration of surface code error correction.',
    recentDevelopment: 'Optical tweezer-controlled neutral rubidium and ytterbium atoms executing two-qubit entangling gates with >99.5% fidelity.',
    academicResearch: 'Magic state distillation thresholds and low-overhead transversal gate sets for fault-tolerant logical qubits.',
    limitations: 'Laser phase noise, optical cross-talk, and decoherence times; scaling logical qubits from 50 to 10,000 needed for Shor algorithm.',
    possibleFuture: 'Quantum chemical simulation for room-temperature catalyst discovery by 2032; factoring RSA-2048 encryption not anticipated before 2038+.',
    keyActors: ['IBM Quantum', 'QuEra Computing', 'Google Quantum AI', 'Quantinuum', 'PsiQuantum'],
    lastAudited: '2026-09 Audited',
    source: 'Nature Quantum Information & Physical Review Letters'
  },
  {
    id: 'tr-bci-neural',
    name: 'High-Density Intracortical Brain-Computer Interfaces',
    category: 'Neurotechnology',
    maturity: 'Prototype',
    currentStatus: 'Approved human clinical feasibility trials enabling paralyzed participants to control digital interfaces and robotic arms via motor cortex intent.',
    recentDevelopment: 'Wireless 1,024-channel flexible thread electrodes with subdermal inductive recharge and telemetry units.',
    academicResearch: 'Adaptive Kalman filtering and transformer decoders reconstructing complex motor intent and synthetic phoneme speech.',
    limitations: 'Surgical implantation risks; glial scar tissue formation degrading signal amplitude over 5–10 years; strict ethical barriers for non-medical applications.',
    possibleFuture: 'High-bandwidth speech restoration for ALS patients by 2028; non-invasive consumer spatial computing interfaces by 2040.',
    keyActors: ['Neuralink', 'Synchron', 'Blackrock Neurotech', 'BrainGate Consortium'],
    lastAudited: '2026-09 Audited',
    source: 'The Lancet Neurology & IEEE Transactions on Biomedical Engineering'
  },
  {
    id: 'tr-silicon-photonic',
    name: 'Silicon Photonics Co-Packaged Optics for AI Datacenters',
    category: 'Semiconductors',
    maturity: 'Expected Development',
    currentStatus: 'Transitioning from optical pluggables to optical engine packaging directly on substrate alongside GPUs and TPUs.',
    recentDevelopment: 'Monolithic integration of micro-ring modulators and laser diodes on 300mm silicon wafers achieving 3.2 Tbps per optical die.',
    academicResearch: 'Thermal drift compensation in micro-ring resonators and optical interconnect loss mitigation under 85°C junction heat.',
    limitations: 'High precision packaging yield and laser reliability across extended multi-year datacenter duty cycles.',
    possibleFuture: 'All-optical switched datacenter fabrics reducing AI cluster communication power by 70% by 2029.',
    keyActors: ['TSMC', 'Intel Labs', 'Broadcom', 'Ayar Labs', 'Nvidia'],
    lastAudited: '2026-09 Audited',
    source: 'IEEE Journal of Selected Topics in Quantum Electronics'
  }
];

export const AITechRadarPower: React.FC<AITechRadarPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [selectedMaturity, setSelectedMaturity] = useState<TechMaturity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<TechRadarItem>(TECH_RADAR_ITEMS[0]);

  const maturities: Array<TechMaturity | 'ALL'> = [
    'ALL',
    'Current Reality',
    'Prototype',
    'Research',
    'Expected Development',
    'Possible Future Scenario'
  ];

  const filteredItems = useMemo(() => {
    return TECH_RADAR_ITEMS.filter((item) => {
      const matchMaturity = selectedMaturity === 'ALL' || item.maturity === selectedMaturity;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.currentStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keyActors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchMaturity && matchSearch;
    });
  }, [selectedMaturity, searchQuery]);

  return (
    <div
      id="astra-ai-tech-radar-power"
      className="w-full flex-1 flex flex-col bg-[#04060E] text-slate-100 min-h-0 min-w-0 overflow-y-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border border-amber-500/40 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                AI & TECHNOLOGY RADAR
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Frontier Assessment
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Current Reality → Research → Prototype → Expected Development → Possible Future
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search & Maturity Chips */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frontier tech (e.g. humanoid robots, quantum, photonics, BCI, Gemini)..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {maturities.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSelectedMaturity(m);
                  triggerHaptic(8);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                  selectedMaturity === m
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tech List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Assessed Technologies ({filteredItems.length})
            </h3>
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const isSelected = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item);
                      triggerHaptic(8);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300">
                          {item.maturity}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.currentStatus}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed 5-Step Reality Ladder */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                  {activeItem.category}
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  Maturity: {activeItem.maturity}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-2">{activeItem.name}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Leading Actors: {activeItem.keyActors.join(', ')} • Source: {activeItem.source}
              </p>
            </div>

            {/* Structured Ladder */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider block text-[11px]">
                  1. Current Reality
                </span>
                <p className="text-slate-200 leading-relaxed">{activeItem.currentStatus}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
                <span className="font-bold text-cyan-400 uppercase tracking-wider block text-[11px]">
                  2. Recent Breakthrough
                </span>
                <p className="text-slate-200 leading-relaxed">{activeItem.recentDevelopment}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-purple-500/20 space-y-1">
                <span className="font-bold text-purple-400 uppercase tracking-wider block text-[11px]">
                  3. Academic & Lab Research
                </span>
                <p className="text-slate-200 leading-relaxed">{activeItem.academicResearch}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-rose-500/20 space-y-1">
                <span className="font-bold text-rose-400 uppercase tracking-wider block text-[11px]">
                  4. Current Technical Limitations
                </span>
                <p className="text-slate-300 leading-relaxed">{activeItem.limitations}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <span className="font-bold text-amber-300 uppercase tracking-wider block text-[11px]">
                  5. Projected Future Horizon (2030–2040)
                </span>
                <p className="text-amber-100 leading-relaxed">{activeItem.possibleFuture}</p>
              </div>
            </div>

            {onAskAstra && (
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => onAskAstra(`Provide deep architectural analysis and commercial viability timeline for "${activeItem.name}"`)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Synthesize In-Depth Astra Briefing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
