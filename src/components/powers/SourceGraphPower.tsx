import React, { useState } from 'react';
import {
  Network,
  Share2,
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Search,
  Layers,
  Sparkles
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export interface SourceGraphNode {
  id: string;
  sourceName: string;
  sourceType: 'DATA' | 'RESEARCH' | 'OFFICIAL INFORMATION';
  date: string;
  relevantInfo: string;
  context: string;
  methodology: string;
  originalPageUrl: string;
  confidenceScore: number;
}

const SAMPLE_GRAPH_NODES: SourceGraphNode[] = [
  {
    id: 'src-a',
    sourceName: 'World Meteorological Organization (WMO) Global Telemetry',
    sourceType: 'DATA',
    date: '2026-09-24',
    relevantInfo: 'Recorded global mean surface temperature deviation at +1.48°C relative to pre-industrial baseline.',
    context: 'Part of the State of the Global Climate annual assessment matrix.',
    methodology: 'Satellite microwave radiometers cross-calibrated with 10,000 WMO-certified terrestrial weather stations.',
    originalPageUrl: 'https://wmo.int',
    confidenceScore: 99
  },
  {
    id: 'src-b',
    sourceName: 'Nature Climate Change / Harvard Clean Energy Lab',
    sourceType: 'RESEARCH',
    date: '2026-08-18',
    relevantInfo: 'Empirical verification that solid-state sodium battery manufacturing reduces battery life-cycle carbon debt by 44%.',
    context: 'Comparative life-cycle analysis (LCA) across 50 manufacturing facilities.',
    methodology: 'Cradle-to-gate environmental footprint accounting with ISO 14040 adherence.',
    originalPageUrl: 'https://nature.com',
    confidenceScore: 96
  },
  {
    id: 'src-c',
    sourceName: 'Ministry of New and Renewable Energy (MNRE), Government of India',
    sourceType: 'OFFICIAL INFORMATION',
    date: '2026-09-10',
    relevantInfo: 'Official Gazette notification confirming 195 GW total installed non-fossil electrical capacity as of Q3 2026.',
    context: 'National electricity generation quarterly census report.',
    methodology: 'State load despatch centre (SLDC) and Central Electricity Authority (CEA) verified metering.',
    originalPageUrl: 'https://mnre.gov.in',
    confidenceScore: 99
  }
];

interface SourceGraphPowerProps {
  onBack?: () => void;
}

export const SourceGraphPower: React.FC<SourceGraphPowerProps> = ({ onBack }) => {
  const [selectedNode, setSelectedNode] = useState<SourceGraphNode>(SAMPLE_GRAPH_NODES[0]);

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
            <Network className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA SOURCE GRAPH</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                VISUAL EVIDENCE TREE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Evidence Topology: Trace Every Claim Back to Primary Source, Date, Context & Methodology
            </p>
          </div>
        </div>
      </div>

      {/* Visual Tree Diagram */}
      <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4">
        <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
          Answer Evidence Tree
        </div>

        {/* Tree Container */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold inline-block">
            ANSWER: Global Energy & Climate Resilience Benchmark
          </div>

          <div className="pl-6 space-y-3 border-l-2 border-amber-500/30">
            {SAMPLE_GRAPH_NODES.map((node) => (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNode(node);
                  hapticAction();
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  selectedNode.id === node.id
                    ? 'bg-amber-500/15 border-amber-500/40 shadow-md text-white'
                    : 'bg-white/[0.03] border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-300">
                    {node.sourceType}
                  </span>
                  <span className="font-bold">{node.sourceName}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {node.date} • {node.confidenceScore}% Confidence
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node Details: SOURCE NAME, DATE, RELEVANT INFO, CONTEXT, METHODOLOGY, ORIGINAL PAGE */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">SOURCE DOSSIER</span>
            <h3 className="text-base font-bold text-white mt-0.5">{selectedNode.sourceName}</h3>
          </div>
          <a
            href={selectedNode.originalPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-mono transition-colors"
          >
            <span>Original Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">RELEVANT INFORMATION</span>
            <p className="text-slate-100 font-medium leading-relaxed font-sans">{selectedNode.relevantInfo}</p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase">CONTEXT</span>
            <p className="text-slate-300 leading-relaxed font-sans">{selectedNode.context}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase">METHODOLOGY</span>
          <p className="text-slate-300 leading-relaxed font-sans">{selectedNode.methodology}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
          <span>Date of publication / retrieval: {selectedNode.date}</span>
          <span className="text-emerald-400">Grounded Primary Verification</span>
        </div>
      </div>
    </div>
  );
};
