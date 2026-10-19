import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Globe2,
  Flag,
  CloudSun,
  Atom,
  Rocket,
  Cpu,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Plane,
  Trophy,
  Film,
  Music,
  Landmark,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Clock,
  Radio,
  Building2,
  Car,
  Zap,
  Wind,
  Layers,
  Activity,
  Sliders,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  astraDataUniverse,
  DataUniverseDomain,
  DataUniverseRecord
} from '../../services/astraDataHub';
import { triggerHaptic, hapticAction } from '../../utils/haptics';

interface AstraDataHubPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
  initialDomain?: DataUniverseDomain;
}

export const AstraDataHubPower: React.FC<AstraDataHubPowerProps> = ({
  onBack,
  onAskAstra,
  initialDomain
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DataUniverseDomain | 'ALL'>(initialDomain || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecord, setActiveRecord] = useState<DataUniverseRecord | null>(null);
  const [activeFutureSubSection, setActiveFutureSubSection] = useState<
    'overview' | 'map' | 'infrastructure' | 'mobility' | 'energy' | 'environment' | 'ai_city'
  >('overview');

  // Simulation controls state for Future City
  const [simAutonomousFlow, setSimAutonomousFlow] = useState(96);
  const [simRenewableMix, setSimRenewableMix] = useState(94);
  const [simAirPurity, setSimAirPurity] = useState(98);

  const domainIcons: Record<DataUniverseDomain, React.ElementType> = {
    'GLOBAL': Globe2,
    'INDIA': Flag,
    'EARTH': CloudSun,
    'SCIENCE': Atom,
    'SPACE': Rocket,
    'AI & TECHNOLOGY': Cpu,
    'EDUCATION': GraduationCap,
    'CAREER': Briefcase,
    'BUSINESS & ECONOMY': TrendingUp,
    'TRAVEL': Plane,
    'SPORTS': Trophy,
    'ENTERTAINMENT': Film,
    'MUSIC': Music,
    'HISTORY': Landmark,
    'FUTURE 2030 → 2050': Sparkles
  };

  const domainList = useMemo(() => astraDataUniverse.getDomains(), []);

  // Universal Search flow with compact Astra Brain routing indicator
  const searchResults = useMemo(() => {
    return astraDataUniverse.universalSearch(searchQuery, selectedDomain);
  }, [searchQuery, selectedDomain]);

  const handleSelectDomain = (domain: DataUniverseDomain | 'ALL') => {
    triggerHaptic(10);
    setSelectedDomain(domain);
    setActiveRecord(null);
  };

  const isFutureCityActive = selectedDomain === 'FUTURE 2030 → 2050';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6 select-none font-['Inter',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0"
              title="Return to Astra 7"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Database className="w-5 h-5 text-amber-400" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                ASTRA DATA UNIVERSE
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Central Knowledge Layer
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              15 sovereign knowledge domains • Real-time telemetry, audited facts & 2040 scenario simulations
            </p>
          </div>
        </div>

        {/* Brain Indicator & Ask Astra */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{searchResults.indicator}</span>
          </div>
          {onAskAstra && (
            <button
              onClick={() => onAskAstra('Explore the most impactful planetary telemetry in the Astra Data Universe.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Synthesize</span>
            </button>
          )}
        </div>
      </div>

      {/* Universal Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-amber-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search ASTRA Data... (e.g. India population, Future cities, Mars missions, Python, AI robotics, World War history)..."
          className="w-full pl-10 pr-28 py-3 rounded-2xl bg-black/60 border border-amber-500/25 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-14 pr-2 flex items-center text-slate-400 hover:text-white text-xs"
          >
            Clear
          </button>
        )}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            AUTO-ROUTED
          </span>
        </div>
      </div>

      {/* 15 Domain Selector Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Knowledge Domains (15 Sections):
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => handleSelectDomain('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDomain === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            All Domains
          </button>
          {domainList.map((domain) => {
            const Icon = domainIcons[domain];
            const isSelected = selectedDomain === domain;
            return (
              <button
                key={domain}
                onClick={() => handleSelectDomain(domain)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-black/40 hover:bg-white/5 text-slate-300 border border-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{domain}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DEDICATED FUTURE CITY BLUEPRINT WORKSPACE UNDER "FUTURE 2030 → 2050" */}
      {isFutureCityActive && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-black/80 to-black border border-amber-500/35 space-y-6 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
          {/* Prominent Concept Disclaimer Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-amber-400 text-slate-950 font-bold font-mono text-[10px]">
                NOTICE
              </span>
              <div>
                <strong className="font-semibold text-white">Concept / Simulation / Future Scenario</strong>
                <p className="text-[11px] text-amber-300/80">
                  This workspace simulates predictive 2040 municipal architectures and is clearly distinguished from current real-world baseline facts.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-amber-500/30 text-amber-400 shrink-0">
              SIMULATION HORIZON: 2040
            </span>
          </div>

          {/* Future City Blueprint Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  FUTURE CITY BLUEPRINT — ASTRA METROPOLIS 2040
                </h2>
                <p className="text-xs text-slate-400">
                  Integrated Autonomous Urban Systems • Clean Baseload • Algorithmic Civic Grid
                </p>
              </div>
            </div>
          </div>

          {/* 7 Future City Sub-Workspace Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none border-b border-white/10 pb-3">
            {[
              { id: 'overview', label: 'City Overview', icon: Layers },
              { id: 'map', label: 'City Map', icon: Building2 },
              { id: 'infrastructure', label: 'Smart Infrastructure', icon: Activity },
              { id: 'mobility', label: 'Future Mobility', icon: Car },
              { id: 'energy', label: 'Energy', icon: Zap },
              { id: 'environment', label: 'Environment', icon: Wind },
              { id: 'ai_city', label: 'AI City', icon: Cpu }
            ].map((sub) => {
              const SubIcon = sub.icon;
              const isActive = activeFutureSubSection === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveFutureSubSection(sub.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <SubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Workspace Views */}
          {activeFutureSubSection === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <span className="font-mono text-amber-400 uppercase font-bold text-[10px]">
                  METROPOLITAN SPECIFICATION
                </span>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">City Name:</span>
                    <span className="text-white font-semibold">Astra Metropolis (Nexus-2040)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Projected Population:</span>
                    <span className="text-white font-semibold">3,450,000 Inhabitants</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Geography:</span>
                    <span className="text-white font-semibold">Coastal Renewable Basin (420 km²)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Climate Resilience:</span>
                    <span className="text-white font-semibold">Active Storm Surge Absorbers & Bio-Swales</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Energy Topology:</span>
                    <span className="text-white font-semibold">100% Micro-Grid & Perovskite Facades</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <span className="font-mono text-amber-400 uppercase font-bold text-[10px]">
                  INTERACTIVE SIMULATION TELEMETRY
                </span>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Autonomous Transit Mesh:</span>
                      <span className="font-mono text-amber-400">{simAutonomousFlow}% Optimal</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={100}
                      value={simAutonomousFlow}
                      onChange={(e) => setSimAutonomousFlow(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Perovskite Solar & Microgrid Yield:</span>
                      <span className="font-mono text-amber-400">{simRenewableMix}% Self-Sustaining</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={100}
                      value={simRenewableMix}
                      onChange={(e) => setSimRenewableMix(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Urban Air Purity Index:</span>
                      <span className="font-mono text-emerald-400">{simAirPurity} AQI (Pristine)</span>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={100}
                      value={simAirPurity}
                      onChange={(e) => setSimAirPurity(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-emerald-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFutureSubSection === 'map' && (
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-xs">
              <span className="font-mono text-amber-400 uppercase font-bold text-[10px]">
                INTEGRATED CIVIC MAP CONDUITS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { title: 'Autonomous Arterials', count: '14 Core Conduits', color: 'text-amber-400' },
                  { title: 'Zero-Emission Buildings', count: '1,840 Towers', color: 'text-cyan-400' },
                  { title: 'Urban Forests & Parks', count: '48 Bio-Corridors', color: 'text-emerald-400' },
                  { title: 'Automated Hospitals', count: '12 Medical Hubs', color: 'text-rose-400' },
                  { title: 'STEM Universities', count: '6 Campus Nodes', color: 'text-purple-400' },
                  { title: 'eVTOL Vertiports', count: '32 Sky-Docks', color: 'text-amber-400' },
                  { title: 'Sub-Surface Hyperloop', count: '4 Intercity Lines', color: 'text-blue-400' },
                  { title: 'Inductive EV Charging', count: '100% Roadbed Coverage', color: 'text-emerald-400' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className={`font-semibold ${item.color}`}>{item.title}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeFutureSubSection === 'infrastructure' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">SMART ROADS</span>
                <p className="text-slate-300">
                  Piezoelectric roadbeds generate electricity from vehicle kinetic rolling pressure while dynamic inductive coils charge autonomous pods while driving.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">AI TRAFFIC MANAGEMENT</span>
                <p className="text-slate-300">
                  Eliminates red lights via V2X micro-routing where swarms pass each other seamlessly through mathematical intersection interleaving.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">SMART WATER & WASTE</span>
                <p className="text-slate-300">
                  Closed-loop greywater purification with 98% recapture; subterranean pneumatic trash conduits route waste directly to bio-gas digesters.
                </p>
              </div>
            </div>
          )}

          {activeFutureSubSection === 'mobility' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">AUTONOMOUS PODS</span>
                <p className="text-slate-300">
                  Shared fleet of 18,500 aerodynamic pods dispatched on demand within 45 seconds of summons; zero private car parking congestion.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">AIR MOBILITY (eVTOL)</span>
                <p className="text-slate-300">
                  Skyscraper rooftop vertiports operate quiet electric vertical takeoff shuttles for rapid inter-district travel and emergency trauma transport.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">HYPERLOOP CORRIDORS</span>
                <p className="text-slate-300">
                  Vacuum tube maglev links Astra Metropolis to regional industrial zones at 900 km/h, reducing 4-hour travel to 18 minutes.
                </p>
              </div>
            </div>
          )}

          {activeFutureSubSection === 'energy' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">PEROVSKITE SOLAR FACADES</span>
                <p className="text-slate-300">
                  Transparent architectural glass on all commercial towers captures ultraviolet and infrared light, generating 35% of building electricity.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">SODIUM-ION STORAGE</span>
                <p className="text-slate-300">
                  Basement vault modular solid-state sodium battery banks store 48 hours of municipal power reserve without cobalt or lithium dependencies.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-amber-400 text-[10px] font-bold">CLEAN FUSION RESEARCH</span>
                <p className="text-slate-300">
                  Sub-grid connected to pilot magnetic confinement fusion baseload generator producing clean energy with zero long-lived waste.
                </p>
              </div>
            </div>
          )}

          {activeFutureSubSection === 'environment' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-emerald-400 text-[10px] font-bold">VERTICAL BIO-FORESTS</span>
                <p className="text-slate-300">
                  High-rise facades integrate cascading native foliage absorbing 120,000 tons of CO2 annually while cooling urban heat islands by 4.2°C.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="font-mono text-emerald-400 text-[10px] font-bold">ACTIVE CLIMATE RESILIENCE</span>
                <p className="text-slate-300">
                  Subterranean retention reservoirs buffer 500-year storm deluges, automatically pumping excess water to agricultural aquifers.
                </p>
              </div>
            </div>
          )}

          {activeFutureSubSection === 'ai_city' && (
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 text-xs">
              <span className="font-mono text-amber-400 text-[10px] font-bold">
                DIGITAL TWIN & CIVIC AI CO-PILOT
              </span>
              <p className="text-slate-300">
                Astra Metropolis operates an algorithmic digital twin simulating every water valve, electrical sub-station, traffic wave, and emergency unit in 10ms increments to preempt failures before they manifest.
              </p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">
                  Civic Simulation Latency: 12ms
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                  Emergency Routing: 2.4 min avg
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Records Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Displaying verified knowledge records ({searchResults.records.length})</span>
          <span className="font-mono text-[11px] text-amber-400">Audited Primary Sources</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.records.map((rec) => {
            const Icon = domainIcons[rec.domain] || Database;
            const isLive = rec.dataType === 'live';
            const isSimulation = rec.isConceptSimulation || rec.dataType === 'concept_simulation';

            return (
              <div
                key={rec.id}
                onClick={() => {
                  triggerHaptic(6);
                  setActiveRecord(rec);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  activeRecord?.id === rec.id
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-amber-500/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-white/5 border border-white/5 text-amber-400">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                        {rec.domain} • {rec.section}
                      </span>
                    </div>

                    {/* Freshness Badge */}
                    {isSimulation ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-mono">
                        Concept / Simulation
                      </span>
                    ) : isLive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Telemetry</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 text-[10px] font-mono">
                        Audited Baseline
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{rec.content}</p>

                  {/* Primary Metric Pill */}
                  {rec.primaryMetric && (
                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{rec.metricLabel}</span>
                      <span className="text-sm font-bold font-mono text-amber-400">
                        {rec.primaryMetric}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer with verified source and timestamp */}
                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                    <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{rec.sourceName}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 font-mono">
                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                    <span>{rec.publishedDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Record Inspection Modal / Drawer */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#090C15] border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {activeRecord.domain}
                </span>
                <span className="text-xs text-slate-400">{activeRecord.section}</span>
              </div>
              <button
                onClick={() => setActiveRecord(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {activeRecord.isConceptSimulation && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                ⚠️ <strong>Concept / Simulation / Future Scenario:</strong> This record outlines experimental architectural projections for the 2040 horizon.
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold text-white mb-1">{activeRecord.title}</h2>
              <div className="text-xs text-slate-400 mb-3">{activeRecord.subtitle}</div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/5">
                {activeRecord.content}
              </p>
            </div>

            {/* Metrics Grid */}
            {activeRecord.secondaryMetrics && activeRecord.secondaryMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {activeRecord.secondaryMetrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/50 border border-white/5 text-xs">
                    <div className="text-slate-400 text-[11px]">{m.label}</div>
                    <div className="text-white font-bold font-mono text-sm mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Source & Verification Metadata */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 text-xs space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Verified Source:</span>
                <span className="text-slate-200 font-semibold">{activeRecord.sourceName}</span>
              </div>
              <div className="flex justify-between">
                <span>Date Published:</span>
                <span className="text-slate-200 font-mono">{activeRecord.publishedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-slate-200 font-mono">{activeRecord.retrievedAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence Rating:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {activeRecord.confidenceIndicator}% Verified
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {activeRecord.sourceUrl && (
                <a
                  href={activeRecord.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs"
                >
                  <span>Open Primary Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setActiveRecord(null)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
