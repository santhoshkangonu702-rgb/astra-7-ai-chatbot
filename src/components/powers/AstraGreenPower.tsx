import React, { useState } from 'react';
import {
  Leaf,
  Sun,
  Droplets,
  Recycle,
  Wind,
  Download,
  ArrowLeft,
  Activity,
  CheckCircle2,
  TreeDeciduous,
  Globe2,
  FileText
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export interface SustainabilityMetric {
  title: string;
  value: string;
  benchmark: string;
  trend: 'improving' | 'stable' | 'needs_attention';
  detail: string;
}

const GREEN_METRICS: SustainabilityMetric[] = [
  {
    title: 'Global Renewable Energy Share',
    value: '42.8%',
    benchmark: 'Target: 60% by 2030 (IEA)',
    trend: 'improving',
    detail: 'Driven by record low-cost solar PV additions across Gujarat, Rajasthan, California, and North Sea offshore wind.'
  },
  {
    title: 'Atmospheric CO2 Concentration',
    value: '426.4 ppm',
    benchmark: 'Pre-Industrial: 280 ppm',
    trend: 'needs_attention',
    detail: 'Monitored at Mauna Loa Observatory; direct air capture and mineralization plants scaling deployment.'
  },
  {
    title: 'Industrial Water Reclamation Index',
    value: '84.2%',
    benchmark: 'Zero Liquid Discharge standard',
    trend: 'improving',
    detail: 'Closed-loop graphene membrane filtration deployed across major semiconductor and pharmaceutical fabs.'
  },
  {
    title: 'Critical Mineral Recycling Rate',
    value: '38.6%',
    benchmark: 'Circular Economy Goal: 70%',
    trend: 'improving',
    detail: 'Hydrometallurgical extraction recovers battery-grade lithium, cobalt, and nickel from decommissioned EV packs.'
  }
];

interface AstraGreenPowerProps {
  onBack?: () => void;
}

export const AstraGreenPower: React.FC<AstraGreenPowerProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleExportReport = () => {
    const text = `# ASTRA GREEN — 2040 SUSTAINABILITY & CLIMATE REPORT
Date: ${new Date().toISOString()}

1. GLOBAL RENEWABLES & CLEAN ENERGY
• Renewable Share: 42.8% of global grid electricity.
• Solar and offshore wind capacity additions up 34% year-over-year.

2. ATMOSPHERIC & CLIMATE BENCHMARKS
• CO2 Concentration: 426.4 ppm.
• Active reforestation and ocean iron-fertilization research monitoring.

3. CIRCULAR ECONOMY & WATER RECLAMATION
• 84.2% water recycling rate across industrial clusters.
• Battery recycling recovery index: 38.6% and accelerating.

Educational Assessment: Transitioning from fossil hydrocarbons to electrification reduces total thermodynamic exergy waste by 50%.
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-sustainability-report-${Date.now()}.md`;
    a.click();
    hapticSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-green-500/15 border border-emerald-500/25 backdrop-blur-md">
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
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA GREEN</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                SUSTAINABILITY INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clean Energy, Carbon Tracking, Circular Economy, Water Desalination & Educational Climate Reports
            </p>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Sustainability Report</span>
        </button>
      </div>

      {/* Sustainability Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GREEN_METRICS.map((metric, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              {metric.title}
            </span>
            <div className="text-2xl font-black font-mono text-emerald-300">{metric.value}</div>
            <div className="text-[10px] font-mono text-slate-400">{metric.benchmark}</div>
            <p className="text-[11px] text-slate-300 pt-2 border-t border-white/5 leading-relaxed font-sans">
              {metric.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Sustainable Projects & Explanations */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TreeDeciduous className="w-4 h-4 text-emerald-400" />
          <span>Major Environmental Projects & Ecological Engineering</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-bold text-slate-200">Khavda Renewable Energy Park (Gujarat, India)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              30,000 MW hybrid solar-wind installation occupying 726 sq km of salt desert, providing clean power to 16 million homes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-bold text-slate-200">Great Green Wall of Africa</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              8,000 km belt of drought-resilient vegetation across the Sahel restoring 100 million hectares of degraded arable land.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-bold text-slate-200">Graphene Desalination (Mediterranean Hubs)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Low-energy molecular filtration utilizing nanoporous single-layer graphene to produce agricultural water with zero brine dumping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
