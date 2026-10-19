import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Cpu,
  Search,
  Code2,
  Database,
  Newspaper,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Film,
  MapPin,
  Coins,
  Satellite,
  Compass,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export interface InternalAgentNode {
  id: string;
  name: string;
  domain: string;
  icon: React.ElementType;
  badge: string;
  status: 'Ready' | 'Active' | 'Dispatched';
  description: string;
  verifiedSourceRegistry: string;
}

const CAPABILITY_AGENTS: InternalAgentNode[] = [
  {
    id: 'research',
    name: 'Research Capability Agent',
    domain: 'Deep Synthesis & Literature',
    icon: BookOpen,
    badge: 'ASTRA BRAIN → RESEARCH → VERIFIED',
    status: 'Ready',
    description: 'Autonomous multi-source extraction, contradictions analysis, and citation verification.',
    verifiedSourceRegistry: 'arXiv, PubMed, IEEE, Nature, Science Direct'
  },
  {
    id: 'code',
    name: 'Code & Systems Agent',
    domain: 'Software Engineering',
    icon: Code2,
    badge: 'ASTRA BRAIN → CODE → VERIFIED',
    status: 'Ready',
    description: 'Syntax verification, algorithmic complexity optimization, and type safety enforcement.',
    verifiedSourceRegistry: 'TypeScript Compiler, Python AST, Rust Cargo Verification'
  },
  {
    id: 'data',
    name: 'Data & Analytics Agent',
    domain: 'Quantitative Analysis',
    icon: Database,
    badge: 'ASTRA BRAIN → DATA → VISUALIZED',
    status: 'Ready',
    description: 'Statistical distributions, mathematical regression, and dataset visualization.',
    verifiedSourceRegistry: 'World Bank, Reserve Bank of India, IMF, NOAA'
  },
  {
    id: 'search',
    name: 'Web Grounding Agent',
    domain: 'Real-Time Verification',
    icon: Search,
    badge: 'ASTRA BRAIN → SEARCH → VERIFIED',
    status: 'Ready',
    description: 'Live web scraping with cryptographic domain authenticity verification.',
    verifiedSourceRegistry: 'Live Grounded Web Indices & Official Government Portals'
  },
  {
    id: 'documents',
    name: 'Document Intelligence Agent',
    domain: 'Multimodal RAG',
    icon: FileText,
    badge: 'ASTRA BRAIN → DOCUMENTS → ANALYZED',
    status: 'Ready',
    description: 'Vector chunk indexing, tabular data recovery, and page citation tracking.',
    verifiedSourceRegistry: 'Client-Side Encrypted Vector Memory'
  },
  {
    id: 'maps',
    name: 'Spatial & Places Agent',
    domain: 'Geographic Intelligence',
    icon: MapPin,
    badge: 'ASTRA BRAIN → MAPS → VERIFIED',
    status: 'Ready',
    description: 'Nearby hospital routing, transit hubs, and emergency radius estimation.',
    verifiedSourceRegistry: 'OpenStreetMap, Indian Survey Data, Transit Feeds'
  },
  {
    id: 'space',
    name: 'Cosmic & Satellite Agent',
    domain: 'Orbital Telemetry',
    icon: Satellite,
    badge: 'ASTRA BRAIN → SPACE → VERIFIED',
    status: 'Ready',
    description: 'Real-time TLE propagation, solar weather indices, and launch windows.',
    verifiedSourceRegistry: 'ISRO ISTRAC, NASA Horizons, Space-Track NORAD'
  }
];

interface MultiAgentPowerProps {
  onBack?: () => void;
}

export const MultiAgentPower: React.FC<MultiAgentPowerProps> = ({ onBack }) => {
  const [selectedAgent, setSelectedAgent] = useState<InternalAgentNode>(CAPABILITY_AGENTS[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0 mr-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back</span>
            </button>
          )}
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <Brain className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA MULTI-AGENT SYSTEM</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                INTERNAL COGNITIVE MESH
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Astra Brain Autonomous Capability Orchestration with Compact Verified Badges
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice: Never expose hidden chain-of-thought */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Zero Hidden Chain-of-Thought Disclosure:</strong> The user interface displays only compact capability badges
          (e.g., <code>ASTRA BRAIN → RESEARCH → VERIFIED</code>) without raw internal scratchpads or confusing tokens.
        </span>
      </div>

      {/* Orchestration Visual Diagram */}
      <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4">
        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider text-center">
          Autonomous Capability Routing Architecture
        </div>
        <div className="flex flex-col items-center justify-center space-y-3 font-mono text-xs">
          <div className="px-6 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            ASTRA BRAIN 3.0
          </div>
          <div className="text-slate-600">│</div>
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto max-w-full py-1">
            {['RESEARCH', 'CODE', 'DATA', 'SEARCH', 'DOCUMENTS', 'MAPS', 'SPACE'].map((c) => (
              <div key={c} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-[11px] whitespace-nowrap">
                {c}
              </div>
            ))}
          </div>
          <div className="text-slate-600">↓</div>
          <div className="px-5 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold">
            GROUNDED VERIFICATION & CITATION
          </div>
          <div className="text-slate-600">↓</div>
          <div className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
            FINAL ANSWER + COMPACT INDICATOR
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAPABILITY_AGENTS.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              onClick={() => {
                setSelectedAgent(agent);
                hapticAction();
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                selectedAgent.id === agent.id
                  ? 'bg-amber-500/15 border-amber-500/40 shadow-md'
                  : 'bg-white/[0.03] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {agent.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                <span className="text-[11px] text-slate-400 font-mono">{agent.domain}</span>
              </div>

              <div className="p-2 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-amber-300">
                {agent.badge}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{agent.description}</p>

              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-slate-500">
                Verified Registry: {agent.verifiedSourceRegistry}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
