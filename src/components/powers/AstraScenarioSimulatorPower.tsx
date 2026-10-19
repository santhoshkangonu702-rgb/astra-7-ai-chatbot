import React, { useState } from 'react';
import {
  ArrowLeft,
  GitBranch,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  Search,
  Sliders,
  RotateCcw,
  Zap,
  Globe2
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface ScenarioBranch {
  id: string;
  name: string;
  archetype: 'Optimistic Acceleration' | 'Pragmatic Hybrid' | 'Decentralized / Divergent';
  probabilityEstimate: string;
  description: string;
  assumptions: string[];
  benefits: string[];
  challenges: string[];
  evidencePillars: string[];
}

const DEFAULT_SCENARIOS: ScenarioBranch[] = [
  {
    id: 'sc-1',
    name: 'Scenario 1: Full Autonomous Hyper-Mobility',
    archetype: 'Optimistic Acceleration',
    probabilityEstimate: '35% Likelihood',
    description:
      'Ubiquitous V2X algorithmically coordinated electric and eVTOL vehicle pods completely replace private internal combustion transport in tier-1 cities by 2038.',
    assumptions: [
      'Battery energy density reaches >500 Wh/kg commercially by 2032',
      'Unified municipal V2X spectrum allocation ratified by international telecoms',
      'Insurance liability statutes shift entirely from driver to software manufacturer'
    ],
    benefits: [
      '98% reduction in urban traffic fatalities',
      'Reclamation of 40% urban asphalt surface previously dedicated to parking lots',
      'Zero ground-level transport particulate emissions'
    ],
    challenges: [
      'High upfront capital required for subterranean maglev and grid upgrades',
      'Vulnerability to cyber-physical grid attacks requiring quantum encryption'
    ],
    evidencePillars: [
      'Waymo / Baidu commercial driverless miles surpassing 50 million with 85% lower injury claims',
      'EU 2035 zero-emission vehicle regulatory mandates'
    ]
  },
  {
    id: 'sc-2',
    name: 'Scenario 2: Pragmatic Hybrid Transit & Retrofit Fleet',
    archetype: 'Pragmatic Hybrid',
    probabilityEstimate: '50% Likelihood',
    description:
      'High-speed rail and electrified public bus rapid transit (BRT) form the primary backbone, complemented by geo-fenced autonomous taxi pods in downtown density rings.',
    assumptions: [
      'Supply chain bottlenecks for rare-earth magnet materials constrain 100% private fleet turnover',
      'Legacy vehicles remain road-legal via strict clean fuel standards or carbon offsets'
    ],
    benefits: [
      'Lower economic disruption to existing municipal infrastructure',
      'Inclusive mobility accessibility across all income quintiles'
    ],
    challenges: [
      'Slower trajectory to absolute urban zero-emissions',
      'Intermittent congestion points remain outside automated highway corridors'
    ],
    evidencePillars: [
      'China and European massive capital deployment into 350 km/h high-speed rail networks',
      'Vehicle age statistics showing average car lifespan exceeding 12.8 years'
    ]
  },
  {
    id: 'sc-3',
    name: 'Scenario 3: Hyper-Localized 15-Minute Micro-Hubs',
    archetype: 'Decentralized / Divergent',
    probabilityEstimate: '15% Likelihood',
    description:
      'Physical commuting demand drops 60% due to full-presence spatial holographic workstations. Mobility shifts heavily toward active micro-mobility with freight handled by subterranean conduits.',
    assumptions: [
      'Spatial computing fidelity eliminates in-person white-collar office colocation requirements',
      'Zoning reforms enable hyper-dense mixed-use neighborhoods worldwide'
    ],
    benefits: [
      'Drastic reduction in global concrete and highway maintenance expenditure',
      'High civic social cohesion and neighborhood community vitality'
    ],
    challenges: [
      'Deep economic bifurcation between remote spatial workers and physical labor sectors',
      'Municipal tax revenue decline from automotive registration and fuel excise'
    ],
    evidencePillars: [
      'Sustained hybrid work patterns post-2020 across knowledge industries',
      'Paris, Melbourne, and Barcelona successful 15-minute city master plan rollouts'
    ]
  }
];

export const AstraScenarioSimulatorPower: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [topic, setTopic] = useState('Future of Transportation, Energy & Urban Systems in 2040');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioBranch>(DEFAULT_SCENARIOS[0]);

  // Interactive Assumption Variables: Cities, Economy, Transportation, Energy, Population, Technology, Climate, Infrastructure
  const [techAssumption, setTechAssumption] = useState(20); // +20%
  const [energyDemandAssumption, setEnergyDemandAssumption] = useState(-10); // -10%
  const [publicTransportAssumption, setPublicTransportAssumption] = useState(30); // +30%
  const [climateResilienceAssumption, setClimateResilienceAssumption] = useState(15); // +15%
  const [populationShift, setPopulationShift] = useState(5); // +5%

  const handleResetAssumptions = () => {
    setTechAssumption(20);
    setEnergyDemandAssumption(-10);
    setPublicTransportAssumption(30);
    setClimateResilienceAssumption(15);
    setPopulationShift(5);
    hapticAction();
  };

  // Simulated composite scores based on assumption sliders
  const simulatedCO2Drop = Math.max(5, (publicTransportAssumption * 0.8 - energyDemandAssumption * 1.2)).toFixed(1);
  const simulatedUrbanCongestionDelta = (-publicTransportAssumption * 0.9 + populationShift * 0.4).toFixed(1);
  const simulatedEconomicProductivity = (techAssumption * 1.1 + climateResilienceAssumption * 0.3).toFixed(1);

  return (
    <div id="astra-scenario-simulator" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-6 text-slate-100 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
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
            <GitBranch className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA WORLD SIMULATOR</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                SCENARIO EXPLORATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Modify Variables: Cities, Economy, Transportation, Energy, Population, Technology, Climate & Infrastructure
            </p>
          </div>
        </div>

        {/* Mandatory Guardrail: Never present simulation output as a real-world prediction */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-200">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>SIMULATION OUTPUT • NEVER PRESENTED AS A REAL-WORLD PREDICTION</span>
        </div>
      </div>

      {/* Interactive Variables Assumption Board */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Interactive Variable Sliders</span>
          </div>
          <button
            onClick={handleResetAssumptions}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Sliders</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          {/* Tech */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">TECHNOLOGY</span>
              <span className="text-amber-300 font-bold">{techAssumption > 0 ? `+${techAssumption}%` : `${techAssumption}%`}</span>
            </div>
            <input
              type="range"
              min={-30}
              max={50}
              value={techAssumption}
              onChange={(e) => setTechAssumption(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Energy Demand */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">ENERGY DEMAND</span>
              <span className="text-cyan-300 font-bold">{energyDemandAssumption > 0 ? `+${energyDemandAssumption}%` : `${energyDemandAssumption}%`}</span>
            </div>
            <input
              type="range"
              min={-50}
              max={30}
              value={energyDemandAssumption}
              onChange={(e) => setEnergyDemandAssumption(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Public Transport */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">PUBLIC TRANSIT</span>
              <span className="text-emerald-300 font-bold">{publicTransportAssumption > 0 ? `+${publicTransportAssumption}%` : `${publicTransportAssumption}%`}</span>
            </div>
            <input
              type="range"
              min={-20}
              max={60}
              value={publicTransportAssumption}
              onChange={(e) => setPublicTransportAssumption(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Climate Resilience */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">CLIMATE ADAPTATION</span>
              <span className="text-purple-300 font-bold">+{climateResilienceAssumption}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={climateResilienceAssumption}
              onChange={(e) => setClimateResilienceAssumption(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Population */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">URBAN POPULATION</span>
              <span className="text-rose-300 font-bold">+{populationShift}%</span>
            </div>
            <input
              type="range"
              min={-10}
              max={25}
              value={populationShift}
              onChange={(e) => setPopulationShift(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>
        </div>

        {/* Dynamic Simulated Telemetry Projection */}
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">SIMULATED EMISSIONS DELTA:</span>
            <span className="text-emerald-400 font-bold text-lg">-{simulatedCO2Drop}% CO2 Footprint</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">SIMULATED URBAN CONGESTION:</span>
            <span className="text-cyan-400 font-bold text-lg">{simulatedUrbanCongestionDelta}% Traffic Index</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">SIMULATED PRODUCTIVITY INDEX:</span>
            <span className="text-amber-400 font-bold text-lg">+{simulatedEconomicProductivity}% Regional GDP</span>
          </div>
        </div>
      </div>

      {/* 3 Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                hapticAction();
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer backdrop-blur-xl flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300">
                    {sc.archetype}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{sc.probabilityEstimate}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">{sc.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-amber-400 flex items-center justify-between">
                <span>View Pillars & Assumptions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Deep Dive */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-amber-400/30 backdrop-blur-2xl shadow-xl space-y-6">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
            Deep Scenario Deconstruction
          </span>
          <h2 className="text-xl font-black text-white mt-0.5">{selectedScenario.name}</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
            {selectedScenario.description}
          </p>
        </div>

        {/* 3 Pillars: Assumptions, Benefits, Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="font-mono text-[10px] uppercase text-amber-300 font-bold block">
              Key Assumptions
            </span>
            <ul className="space-y-2">
              {selectedScenario.assumptions.map((ass, i) => (
                <li key={i} className="text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{ass}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <span className="font-mono text-[10px] uppercase text-emerald-300 font-bold block">
              Possible Benefits
            </span>
            <ul className="space-y-2">
              {selectedScenario.benefits.map((ben, i) => (
                <li key={i} className="text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
            <span className="font-mono text-[10px] uppercase text-rose-300 font-bold block">
              Possible Challenges & Risks
            </span>
            <ul className="space-y-2">
              {selectedScenario.challenges.map((ch, i) => (
                <li key={i} className="text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
