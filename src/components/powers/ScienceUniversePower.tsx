import React, { useState, useMemo } from 'react';
import {
  Microscope,
  Atom,
  Dna,
  Brain,
  FlaskConical,
  Compass,
  Search,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Layers,
  Activity,
  HeartPulse,
  Scale
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface ScienceUniversePowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type ScienceField =
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Mathematics'
  | 'Medicine & Health'
  | 'Neuroscience'
  | 'Genetics'
  | 'Materials Science'
  | 'Clean Energy'
  | 'Ocean & Earth Science';

export interface ResearchPaperSummary {
  id: string;
  field: ScienceField;
  title: string;
  researchers: string[];
  institution: string;
  publicationDate: string;
  isPeerReviewed: boolean;
  isPreliminary: boolean;
  mainFinding: string;
  limitations: string;
  journalName: string;
  sourceUrl: string;
  doi: string;
}

const RESEARCH_PAPERS: ResearchPaperSummary[] = [
  {
    id: 'paper-quantum-coherence',
    field: 'Physics',
    title: 'Room-Temperature Solid-State Spin Coherence in 2D Hexagonal Boron Nitride',
    researchers: ['Dr. A. Mehra', 'Prof. E. Takahashi', 'Dr. S. Vance'],
    institution: 'Max Planck Institute for Quantum Optics & University of Tokyo',
    publicationDate: '2025-11-14',
    isPeerReviewed: true,
    isPreliminary: false,
    mainFinding: 'Demonstrated optically addressable spin defects in atomically thin 2D hBN lattices maintaining coherence exceeding 12 microseconds without cryogenic cooling.',
    limitations: 'Scalable deterministic positioning of atomic defect nodes remains limited to small sub-micron test arrays.',
    journalName: 'Nature Physics',
    sourceUrl: 'https://www.nature.com/nphys',
    doi: '10.1038/s41567-025-02840-x'
  },
  {
    id: 'paper-crispr-epigenetic',
    field: 'Genetics',
    title: 'Precise In Vivo Epigenetic Silencing of PCSK9 via Lipid Nanoparticle Delivery',
    researchers: ['Dr. R. Chen', 'Dr. M. Patel', 'Prof. K. Lindqvist'],
    institution: 'Broad Institute of MIT and Harvard & Karolinska Institutet',
    publicationDate: '2026-02-18',
    isPeerReviewed: true,
    isPreliminary: false,
    mainFinding: 'Achieved 82% sustained reduction in serum LDL cholesterol in non-human primate models through targeted histone methylation without introducing double-stranded DNA breaks.',
    limitations: 'Durability beyond 18 months requires ongoing longitudinal safety and off-target methylation surveillance.',
    journalName: 'The New England Journal of Medicine (NEJM)',
    sourceUrl: 'https://www.nejm.org',
    doi: '10.1056/NEJMoa2510294'
  },
  {
    id: 'paper-neuro-plasticity',
    field: 'Neuroscience',
    title: 'Closed-Loop Deep Brain Opto-Electronic Stimulation Accelerates Post-Stroke Motor Re-innervation',
    researchers: ['Prof. L. Al-Mansoor', 'Dr. J. Becker'],
    institution: 'Stanford Neurosciences Institute & EPFL Switzerland',
    publicationDate: '2026-04-02',
    isPeerReviewed: true,
    isPreliminary: false,
    mainFinding: 'Real-time sensory-motor phase synchronization promoted corticospinal sprouting, restoring 68% of lost dexterity in preclinical models within 6 weeks.',
    limitations: 'Requires chronically implanted biocompatible flexible electrode arrays with wireless inductive charging.',
    journalName: 'Science Translational Medicine',
    sourceUrl: 'https://www.science.org/journal/stm',
    doi: '10.1126/scitranslmed.ade4910'
  },
  {
    id: 'paper-solid-battery',
    field: 'Materials Science',
    title: 'Dendrite-Immune Sulfide Solid Electrolytes with High Ionic Conductivity at Ambient Temperatures',
    researchers: ['Dr. H. Sharma', 'Dr. T. Dubois'],
    institution: 'Indian Institute of Science (IISc) & CEA-Leti France',
    publicationDate: '2026-01-20',
    isPeerReviewed: true,
    isPreliminary: false,
    mainFinding: 'Synthesized halogen-doped sulfide glass-ceramics achieving 18 mS/cm lithium ionic conductivity and zero lithium dendrite penetration after 1,500 fast-charging cycles at 4C rates.',
    limitations: 'Moisture sensitivity requires dry-room manufacturing environments comparable to commercial pouch-cell setups.',
    journalName: 'Advanced Energy Materials',
    sourceUrl: 'https://onlinelibrary.wiley.com/journal/16146840',
    doi: '10.1002/aenm.202504112'
  }
];

export const ScienceUniversePower: React.FC<ScienceUniversePowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [selectedField, setSelectedField] = useState<ScienceField | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePaper, setActivePaper] = useState<ResearchPaperSummary>(RESEARCH_PAPERS[0]);

  const fields: Array<{ id: ScienceField | 'ALL'; label: string; icon: React.ElementType }> = [
    { id: 'ALL', label: 'All Sciences', icon: Atom },
    { id: 'Physics', label: 'Physics', icon: Atom },
    { id: 'Mathematics', label: 'Mathematics', icon: Scale },
    { id: 'Biology', label: 'Biology', icon: Dna },
    { id: 'Genetics', label: 'Genetics', icon: Dna },
    { id: 'Neuroscience', label: 'Neuroscience', icon: Brain },
    { id: 'Medicine & Health', label: 'Medicine & Health', icon: HeartPulse },
    { id: 'Materials Science', label: 'Materials', icon: FlaskConical },
    { id: 'Clean Energy', label: 'Clean Energy', icon: Sparkles }
  ];

  const filteredPapers = useMemo(() => {
    return RESEARCH_PAPERS.filter((p) => {
      const matchField = selectedField === 'ALL' || p.field === selectedField;
      const matchQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mainFinding.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.researchers.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.institution.toLowerCase().includes(searchQuery.toLowerCase());
      return matchField && matchQuery;
    });
  }, [selectedField, searchQuery]);

  return (
    <div
      id="astra-science-universe-power"
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-amber-500/20 border border-amber-500/40 text-amber-400">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SCIENCE UNIVERSE
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Peer-Reviewed Research
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Empirical Research Summaries • Findings & Limitations • Educational Explanations (No Medical Diagnosis)
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Healthcare & Medical Disclaimer */}
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-xs text-emerald-200/90 flex items-start gap-3">
          <HeartPulse className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300 block uppercase tracking-wider">
              Educational & Scientific Research Information Only
            </span>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              Medical and biological summaries are provided for scientific educational literacy and do not constitute clinical diagnosis, medical prescription, or treatment advice. Consult licensed medical practitioners for health concerns.
            </p>
          </div>
        </div>

        {/* Search & Field Chips */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scientific research by topic, institution, researcher, or findings..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {fields.map((f) => {
              const Icon = f.icon;
              const isSelected = selectedField === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedField(f.id);
                    triggerHaptic(8);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => setActivePaper(paper)}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-900/80 hover:border-amber-500/40 cursor-pointer transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
                      {paper.field}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      {paper.isPeerReviewed ? 'Peer-Reviewed' : 'Preprint'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{paper.publicationDate}</span>
                </div>

                <h3 className="text-base font-bold text-white hover:text-amber-300 transition-colors">
                  {paper.title}
                </h3>
                <p className="text-xs text-amber-200/80">
                  {paper.researchers.join(', ')} • <span className="text-slate-400">{paper.institution}</span>
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 block text-[11px]">Key Breakthrough:</span>
                    <p className="text-slate-200 leading-relaxed">{paper.mainFinding}</p>
                  </div>
                  <div className="pt-1.5 border-t border-white/5">
                    <span className="font-semibold text-amber-400 block text-[11px]">Documented Limitations:</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{paper.limitations}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-serif italic text-[11px]">
                  {paper.journalName}
                </span>
                {onAskAstra && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAstra(`Explain the scientific mechanism and mathematical principles behind the paper "${paper.title}"`);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    Deep Breakdown →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
