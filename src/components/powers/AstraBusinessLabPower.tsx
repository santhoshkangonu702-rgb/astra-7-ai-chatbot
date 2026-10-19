import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  PieChart,
  Target,
  Users,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  FileText,
  DollarSign,
  Compass,
  Download,
  Layers,
  Building,
  Activity
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface AstraBusinessLabPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export const AstraBusinessLabPower: React.FC<AstraBusinessLabPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [startupIdea, setStartupIdea] = useState('Autonomous AI Drone Delivery & Precision Soil Health Monitoring for Smallholder Farms');
  const [activeTab, setActiveTab] = useState<'model' | 'swot' | 'pitch' | 'personas'>('model');
  const [isGenerating, setIsGenerating] = useState(false);

  const swotData = {
    strengths: [
      'Low marginal operational cost per aerial inspection flight',
      'Proprietary multi-spectral edge computing sensor payload',
      'Hyper-localized agronomic pest alerts delivered in regional tongues'
    ],
    weaknesses: [
      'Regulatory clearance dependencies with civil aviation directorates',
      'High initial hardware capital expenditure per drone unit',
      'Battery performance variation under extreme monsoon and dust conditions'
    ],
    opportunities: [
      'Government drone subsidies under agricultural modernization schemes',
      'Carbon credit verification partnerships with global offset registries',
      'Expansion into Southeast Asian and East African agrarian corridors'
    ],
    threats: [
      'Commoditization of basic drone hardware from mass overseas manufacturers',
      'Unpredictable micro-weather disruptions limiting flight windows',
      'Data sovereignty and farm land mapping privacy regulatory scrutiny'
    ]
  };

  const pitchDeckSlides = [
    { slide: 1, title: 'The Problem', detail: '35% crop loss occurs before harvest due to delayed pest detection and excessive chemical runoff across fragmented smallholder farms.' },
    { slide: 2, title: 'The Solution', detail: 'Autonomous solar-docked drone telemetry delivering daily plant-by-plant NDVI stress maps with automated micro-targeted biological spray.' },
    { slide: 3, title: 'Market Size (TAM / SAM / SOM)', detail: 'Total addressable market: $14.2 Billion Global Precision Agriculture; Serviceable Obtainable Market: $850 Million in South Asia.' },
    { slide: 4, title: 'Business Model & Unit Economics', detail: 'Hardware-enabled SaaS: ₹450 / acre seasonal subscription + 15% revenue share on biological bio-pesticide deliveries.' },
    { slide: 5, title: 'Competitive Advantage', detail: 'Edge-AI pest identification runs locally without rural cellular connectivity; patent-pending multi-spectral camera module.' }
  ];

  const handleSynthesize = () => {
    setIsGenerating(true);
    triggerHaptic(12);
    setTimeout(() => {
      setIsGenerating(false);
      hapticSuccess();
    }, 600);
  };

  return (
    <div
      id="astra-business-lab-power"
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ASTRA BUSINESS LAB
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Venture Architecture
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Market Research • SWOT Matrix • Unit Economics • Customer Personas • Pitch Deck Synthesis
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => {
              setActiveTab('model');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'model' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Business Model
          </button>
          <button
            onClick={() => {
              setActiveTab('swot');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'swot' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            SWOT Matrix
          </button>
          <button
            onClick={() => {
              setActiveTab('pitch');
              triggerHaptic(10);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'pitch' ? 'bg-amber-500 text-black shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Pitch Deck
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Startup Idea Input */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
          <label className="block text-xs font-bold text-slate-300">Venture Concept & Target Sector</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={startupIdea}
              onChange={(e) => setStartupIdea(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSynthesize}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGenerating ? 'Evaluating...' : 'Analyze Venture'}
            </button>
          </div>
        </div>

        {/* 1. BUSINESS MODEL TAB */}
        {activeTab === 'model' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">Value Proposition</span>
              <h4 className="text-sm font-bold text-white">Autonomous Agronomic Health Intelligence</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empowers farm collectives to eliminate 35% preventable yield loss while slashing synthetic chemical usage by 40% through centimeter-level thermal and NDVI scouting.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400">Revenue Architecture</span>
              <h4 className="text-sm font-bold text-white">Dual Stream: SaaS + Consumables</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recurring annual farm telemetry subscription (₹450 / acre / season) paired with transactional margin on certified microbial biological inputs delivered directly via automated payload dispensers.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">Go-To-Market Channel</span>
              <h4 className="text-sm font-bold text-white">FPO & Cooperative Integration</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Partner directly with Farmer Producer Organizations (FPOs) and agricultural state cooperatives for collective fleet deployment and rapid customer acquisition with zero individual hardware financing barrier.
              </p>
            </div>
          </div>
        )}

        {/* 2. SWOT MATRIX TAB */}
        {activeTab === 'swot' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Strengths</span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {swotData.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Weaknesses</span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {swotData.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Opportunities</span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {swotData.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Threats</span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {swotData.threats.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 3. PITCH DECK SLIDES TAB */}
        {activeTab === 'pitch' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              5-Slide Institutional Pitch Deck Framework
            </h3>
            <div className="space-y-3">
              {pitchDeckSlides.map((slide) => (
                <div key={slide.slide} className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Slide {slide.slide}
                    </span>
                    <h4 className="text-sm font-bold text-white">{slide.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{slide.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
