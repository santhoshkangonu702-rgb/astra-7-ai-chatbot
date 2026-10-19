import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Bot,
  Cpu,
  Rocket,
  Atom,
  Car,
  Building2,
  Zap,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Leaf,
  Layers,
  Glasses,
  Radio,
  ExternalLink,
  Info,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export type CertaintyTier =
  | 'KNOWN_FACTS'
  | 'CURRENT_TECHNOLOGY'
  | 'RESEARCH'
  | 'PREDICTION'
  | 'SPECULATION';

export interface FutureItem {
  id: string;
  category: string;
  title: string;
  status: CertaintyTier;
  timeframe: string;
  summary: string;
  empiricalEvidence: string;
  potential2040Scenario: string;
  confidenceScore: number;
  sources: string[];
}

const CERTAINTY_CONFIG: Record<
  CertaintyTier,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  KNOWN_FACTS: {
    label: 'KNOWN FACTS',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    desc: 'Empirically proven laws of physics, established mathematics, and verified historical baselines.',
  },
  CURRENT_TECHNOLOGY: {
    label: 'CURRENT TECH',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    desc: 'Commercially deployed, active in production, or operational today.',
  },
  RESEARCH: {
    label: 'ACTIVE RESEARCH',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    desc: 'Peer-reviewed academic lab breakthroughs, pre-clinical trials, and early working prototypes.',
  },
  PREDICTION: {
    label: 'PREDICTION',
    bg: 'bg-purple-500/10',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    desc: 'Econometric or scientific forecast extrapolated from scaling laws and historical trajectories.',
  },
  SPECULATION: {
    label: 'SPECULATION',
    bg: 'bg-rose-500/10',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    desc: 'Theorized future state without guaranteed engineering pathways; exploratory scenarios.',
  },
};

const FUTURE_KNOWLEDGE_BASE: FutureItem[] = [
  {
    id: 'ai-reasoning',
    category: 'Future AI',
    title: 'Autonomous Multi-Agent Scientific Reasoning & Discovery',
    status: 'RESEARCH',
    timeframe: '2027–2032',
    summary: 'Autonomous AI architectures formulating novel biological hypotheses and validating them in automated wet labs.',
    empiricalEvidence: 'DeepMind AlphaFold 3, automated synthesis robotics, and test-time compute scaling laws.',
    potential2040Scenario: 'Possible 2040 scenario: AI research collectives designing material structures at atomic resolution with minimal human oversight.',
    confidenceScore: 78,
    sources: ['Nature 2024 AlphaFold3 publication', 'Stanford AI Index 2025'],
  },
  {
    id: 'quantum-fault-tolerant',
    category: 'Quantum Computing',
    title: 'Fault-Tolerant Logical Qubits & Material Simulation',
    status: 'RESEARCH',
    timeframe: '2028–2035',
    summary: 'Surface-code error-corrected quantum processors exceeding 10,000 logical qubits for exact chemical bonding simulations.',
    empiricalEvidence: 'Demonstrations of neutral-atom and superconducting quantum error mitigation by Harvard, QuEra, and Google Quantum AI.',
    potential2040Scenario: 'Possible 2040 scenario: Room-temperature or high-temperature superconducting candidates synthesized via quantum ground-state solvers.',
    confidenceScore: 70,
    sources: ['Google Quantum AI Roadmap', 'Harvard Physical Review Letters 2024'],
  },
  {
    id: 'space-starship',
    category: 'Space',
    title: 'Reusable Heavy-Lift Planetary Logistics & Lunar Gateway',
    status: 'CURRENT_TECHNOLOGY',
    timeframe: 'Operational 2025–2030',
    summary: 'Fully reusable orbital class boosters reducing payload-to-orbit costs to under $50/kg.',
    empiricalEvidence: 'Successful orbital test flights of SpaceX Starship and NASA Artemis missions.',
    potential2040Scenario: 'Possible 2040 scenario: Permanently crewed scientific stations on Lunar Shackleton Crater with continuous in-situ resource propellant extraction.',
    confidenceScore: 88,
    sources: ['NASA Artemis Program Architecture', 'ESA Space Transportation Reports'],
  },
  {
    id: 'fusion-ignition',
    category: 'Renewable Energy',
    title: 'Commercial Fusion Power & High-Field Superconducting Magnets',
    status: 'RESEARCH',
    timeframe: '2032–2040',
    summary: 'Net-energy-positive magnetic confinement fusion delivering continuous baseload electricity into public power grids.',
    empiricalEvidence: 'Net energy gain (Q > 1) demonstrated at Lawrence Livermore National Ignition Facility; Commonwealth Fusion SPARC tokamak construction.',
    potential2040Scenario: 'Possible 2040 scenario: Modular 200MW fusion generation plants powering municipal water desalination and regional compute centers.',
    confidenceScore: 65,
    sources: ['LLNL National Ignition Facility 2023–2024', 'ITER Technical Documentation'],
  },
  {
    id: 'robotics-humanoid',
    category: 'Robotics',
    title: 'General-Purpose Humanoid Bipedal Workforces',
    status: 'CURRENT_TECHNOLOGY',
    timeframe: '2025–2035',
    summary: 'Vision-language-action (VLA) neural policies powering dexterous bipedal robots in industrial manufacturing and logistics.',
    empiricalEvidence: 'Production-line trials of Figure 02, Boston Dynamics Atlas (electric), and Tesla Optimus in automotive factories.',
    potential2040Scenario: 'Possible 2040 scenario: Standardized robotic labor assisting in emergency response, heavy construction, and elderly care infrastructure.',
    confidenceScore: 82,
    sources: ['Figure AI Industrial Trial 2024', 'IEEE Robotics & Automation Society'],
  },
  {
    id: 'smart-cities-grid',
    category: 'Smart Cities',
    title: 'Dynamic Autonomous Traffic Orchestration & Biophilic Urban Design',
    status: 'PREDICTION',
    timeframe: '2030–2040',
    summary: 'Decentralized sensor meshes coordinating self-driving transit fleets to eliminate traffic signals and gridlock.',
    empiricalEvidence: 'Waymo driverless operations exceeding 100k rides/week in San Francisco and Phoenix.',
    potential2040Scenario: 'Possible 2040 scenario: Cities reclaiming 40% of parking real estate for urban forests and carbon-capture wetlands.',
    confidenceScore: 74,
    sources: ['MIT Senseable City Lab', 'World Economic Forum Urban Mobility Index'],
  },
  {
    id: 'healthcare-mrna',
    category: 'Healthcare Technology',
    title: 'Personalized mRNA Neoantigen Cancer Vaccines & Genomic Repair',
    status: 'RESEARCH',
    timeframe: '2026–2033',
    summary: 'Patient-specific mRNA sequences generated via tumor biopsy sequencing within 48 hours to instruct immune T-cells.',
    empiricalEvidence: 'Phase 3 randomized trials by Moderna/Merck for personalized melanoma therapies.',
    potential2040Scenario: 'Possible 2040 scenario: Preventative quarterly epigenetic rejuvenation injections arresting cellular senescence.',
    confidenceScore: 76,
    sources: ['New England Journal of Medicine', 'FDA Fast Track Guidance'],
  },
  {
    id: 'climate-dac',
    category: 'Climate Technology',
    title: 'Gigaton-Scale Direct Air Capture & Basalt Mineralization',
    status: 'CURRENT_TECHNOLOGY',
    timeframe: '2025–2040',
    summary: 'Geothermal-powered atmospheric air capture facilities chemically converting CO2 into underground rock structures.',
    empiricalEvidence: 'Climeworks Mammoth facility operating in Iceland; Carbfix basalt mineralization chemistry.',
    potential2040Scenario: 'Possible 2040 scenario: Global carbon removal capacity matching annual hard-to-abate industrial emissions.',
    confidenceScore: 68,
    sources: ['IPCC Working Group III Sixth Assessment', 'Climeworks Technical Reports'],
  },
  {
    id: 'bci-neural',
    category: 'Human-Computer Interaction',
    title: 'High-Bandwidth Neural Interfaces & Direct Cortical Encoding',
    status: 'RESEARCH',
    timeframe: '2028–2038',
    summary: 'Sub-millimeter implantable electrode arrays restoring motor autonomy and enabling high-throughput thought-to-text.',
    empiricalEvidence: 'Synchron Stentrode human trials and Neuralink Telepathy patient demonstrating wireless digital control.',
    potential2040Scenario: 'Possible 2040 scenario: Non-invasive or minimally invasive neural links enabling ambient contextual collaboration.',
    confidenceScore: 62,
    sources: ['Nature Neuroscience 2024', 'BrainGate Research Consortium'],
  },
  {
    id: 'ar-spatial',
    category: 'AR/VR',
    title: 'Retinal Projection Glasses & Seamless Spatial Computing',
    status: 'CURRENT_TECHNOLOGY',
    timeframe: '2026–2032',
    summary: 'Sub-60-gram holographic waveguides replacing desktop monitors with interactive spatial floating canvas displays.',
    empiricalEvidence: 'Meta Orion prototype demonstrations, Apple Vision Pro spatial audio and eye-tracking accuracy.',
    potential2040Scenario: 'Possible 2040 scenario: Physical smartphone screens become obsolete, replaced by direct microLED retinal projection.',
    confidenceScore: 84,
    sources: ['Meta Connect 2024 Orion disclosures', 'SID Display Week 2024'],
  },
  {
    id: 'advanced-computing-optics',
    category: 'Advanced Computing',
    title: 'Optical Neuromorphic Silicon & Photonic Matrix Accelerators',
    status: 'RESEARCH',
    timeframe: '2027–2035',
    summary: 'Photonic tensor processing units executing matrix multiplications at the speed of light with 1/100th the thermal dissipation.',
    empiricalEvidence: 'Lightmatter and Celestial AI commercial wafer-scale optical interconnects entering production.',
    potential2040Scenario: 'Possible 2040 scenario: Exascale AI superclusters running on photonics with negligible electrical grid impact.',
    confidenceScore: 72,
    sources: ['IEEE Journal of Selected Topics in Quantum Electronics', 'Hot Chips 36'],
  },
  {
    id: 'speculation-uploading',
    category: 'Future AI',
    title: 'Sub-Cellular Connectome Emulation & Artificial Consciousness',
    status: 'SPECULATION',
    timeframe: '2040+ Hypothetical',
    summary: 'Nanoscale electron microscope slicing and reconstruction of whole mammalian connectomes.',
    empiricalEvidence: 'Harvard/Google reconstruction of 1 cubic millimeter of human cerebral cortex (1.4 petabytes).',
    potential2040Scenario: 'Speculative scenario: Non-biological consciousness preservation debates and legal personhood frameworks.',
    confidenceScore: 28,
    sources: ['Science 2024 Harvard Connectomics Map', 'Oxford Future of Humanity Institute'],
  },
];

const CATEGORIES = [
  'All',
  'Future AI',
  'Robotics',
  'Space',
  'Quantum Computing',
  'Future Transportation',
  'Smart Cities',
  'Renewable Energy',
  'Healthcare Technology',
  'Education Technology',
  'Future Jobs',
  'Climate Technology',
  'Human-Computer Interaction',
  'AR/VR',
  'Advanced Computing',
  'Future Communication',
];

interface FutureLabPowerProps {
  onBack?: () => void;
  onExploreTopic?: (prompt: string) => void;
}

export const FutureLabPower: React.FC<FutureLabPowerProps> = ({
  onBack,
  onExploreTopic,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCertainty, setSelectedCertainty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<FutureItem | null>(null);

  const filteredItems = FUTURE_KNOWLEDGE_BASE.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesCertainty =
      selectedCertainty === 'All' || item.status === selectedCertainty;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCertainty && matchesSearch;
  });

  return (
    <div className="min-h-full p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group"
              title="Return to Astra 7 Home"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back to Astra 7</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                NEXUS 2040 ENGINE
              </span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Future Lab</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirically grounded future trajectories. Rigorously separating established science from predictive modeling.
            </p>
          </div>
        </div>

        {/* Epistemic Rigor Notice */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Never presents 2040 predictions as established facts.</span>
        </div>
      </div>

      {/* Epistemic Certainty Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(CERTAINTY_CONFIG) as CertaintyTier[]).map((tier) => {
          const cfg = CERTAINTY_CONFIG[tier];
          const isSelected = selectedCertainty === tier;
          return (
            <button
              key={tier}
              onClick={() => setSelectedCertainty(isSelected ? 'All' : tier)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? `${cfg.bg} ${cfg.border} ring-1 ring-amber-400/40`
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${cfg.text}`}>
                  {cfg.label}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {cfg.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 2040 technologies, quantum physics, space, energy..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          {selectedCertainty !== 'All' && (
            <button
              onClick={() => setSelectedCertainty('All')}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300 hover:bg-white/10 flex items-center gap-1.5"
            >
              <span>Clear Filter ({selectedCertainty})</span>
            </button>
          )}
        </div>

        {/* Category Pills (horizontal scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-white">No 2040 trajectories match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or selecting "All" categories to browse the complete Future Lab knowledge base.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCertainty('All');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const cfg = CERTAINTY_CONFIG[item.status];
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 hover:border-amber-400/30 transition-all flex flex-col justify-between group space-y-4"
              >
                <div>
                  {/* Category & Status Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {item.category} • {item.timeframe}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${cfg.bg} ${cfg.text} ${cfg.border} border`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-2">
                    {item.title}
                  </h3>

                  {/* Core Summary */}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Empirical Evidence vs 2040 Scenario Box */}
                  <div className="mt-4 space-y-2 rounded-xl bg-white/[0.03] border border-white/5 p-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 block mb-0.5">
                        EMPIRICAL BASELINE (TODAY):
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {item.empiricalEvidence}
                      </p>
                    </div>
                    <div className="border-t border-white/5 pt-2">
                      <span className="text-[10px] font-mono font-bold text-amber-300 block mb-0.5">
                        2040 TRAJECTORY MODEL:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed italic">
                        "{item.potential2040Scenario}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer: Sources & Explore in Chat */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                    Ref: {item.sources.join(', ')}
                  </div>
                  {onExploreTopic && (
                    <button
                      onClick={() =>
                        onExploreTopic(
                          `Analyze the 2040 trajectory of "${item.title}". Differentiate known scientific facts from predictive modeling and speculate on potential societal impacts.`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
                      title="Analyze with Astra Brain 2.0"
                    >
                      <span>Explore in Chat</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
