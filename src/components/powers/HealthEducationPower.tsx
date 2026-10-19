import React, { useState } from 'react';
import {
  Heart,
  Activity,
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  Apple,
  Dna,
  BookOpen,
  Pill,
  Search,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type HealthTopic =
  | 'Human body'
  | 'Anatomy'
  | 'Nutrition basics'
  | 'Diseases'
  | 'Medical terminology'
  | 'Medicines'
  | 'Fitness science'
  | 'Public health';

interface HealthArticle {
  id: string;
  topic: HealthTopic;
  title: string;
  summary: string;
  scientificMechanism: string;
  keyPoints: string[];
  reference: string;
}

const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: 'ha-1',
    topic: 'Anatomy',
    title: 'The Human Cardiovascular Conduction System & SA Node Pacemaker',
    summary:
      'The sinoatrial (SA) node located in the superior right atrium initiates electrical action potentials that coordinate atrial and ventricular depolarization via the AV node and Purkinje fibers.',
    scientificMechanism:
      'Funny currents (I_f) driven by hyperpolarization-activated cyclic nucleotide-gated (HCN) channels generate rhythmic autonomic pacemaking at 60–100 beats per minute.',
    keyPoints: [
      'SA node acts as the intrinsic primary pacemaker.',
      'AV node delays conduction by ~100ms to permit ventricular filling.',
      'Purkinje fibers conduct action potentials rapidly (2–4 m/s).'
    ],
    reference: 'Guyton and Hall Textbook of Medical Physiology, 14th Edition'
  },
  {
    id: 'ha-2',
    topic: 'Nutrition basics',
    title: 'Macronutrient Bioenergetics: Glycolysis, Beta-Oxidation & Ketogenesis',
    summary:
      'Exploration of cellular ATP production from carbohydrates, lipids, and amino acids across fed and fasting metabolic states.',
    scientificMechanism:
      'Glucose yields net 2 ATP via anaerobic glycolysis and up to 30–32 ATP via mitochondrial oxidative phosphorylation. Fatty acids yield higher energy per gram via beta-oxidation into Acetyl-CoA.',
    keyPoints: [
      'Carbohydrates: 4 kcal/g, primary rapid energy substrate.',
      'Fats: 9 kcal/g, essential for cellular lipid membranes and hormonal synthesis.',
      'Proteins: 4 kcal/g, primarily structural and enzymatic catalysts.'
    ],
    reference: 'Harper’s Illustrated Biochemistry, 32nd Edition'
  },
  {
    id: 'ha-3',
    topic: 'Fitness science',
    title: 'Hypertrophy Mechanisms: Mechanical Tension, Muscle Damage & Metabolic Stress',
    summary:
      'Review of the physiological stimuli that trigger myofibrillar protein synthesis (MPS) via the mTORC1 signaling pathway in skeletal muscle.',
    scientificMechanism:
      'Focal adhesion complexes transmit mechanical stretch to costamere integrins, activating intracellular phosphatidic acid and downstream mTORC1 translation.',
    keyPoints: [
      'Mechanical tension through progressive overload is the primary driver.',
      'Muscle protein synthesis requires adequate leucine and amino acid availability.',
      'Recovery and sleep are necessary for satellite cell myoblast fusion.'
    ],
    reference: 'Journal of Strength and Conditioning Research & Sports Medicine Reviews'
  },
  {
    id: 'ha-4',
    topic: 'Medicines',
    title: 'Pharmacodynamics vs Pharmacokinetics: Absorption, Distribution, Metabolism & Excretion (ADME)',
    summary:
      'Fundamental principles governing drug transit through the human body and receptor-ligand interaction dynamics.',
    scientificMechanism:
      'Hepatic Cytochrome P450 (CYP) enzymes facilitate Phase I oxidation and Phase II conjugation for renal or biliary elimination.',
    keyPoints: [
      'Pharmacokinetics: What the body does to the drug (ADME).',
      'Pharmacodynamics: What the drug does to the body (Receptor binding, IC50).',
      'Bioavailability varies significantly by route of administration (IV = 100%).'
    ],
    reference: 'Goodman & Gilman’s The Pharmacological Basis of Therapeutics'
  }
];

interface HealthEducationPowerProps {
  onBack?: () => void;
}

export const HealthEducationPower: React.FC<HealthEducationPowerProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle>(HEALTH_ARTICLES[0]);

  const filtered = HEALTH_ARTICLES.filter((a) => {
    if (selectedTopic !== 'all' && a.topic !== selectedTopic) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/25 backdrop-blur-md">
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
            <Heart className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA HEALTH EDUCATION</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                SCIENTIFIC CURRICULUM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Anatomy, Physiology, Nutrition, Cellular Bioenergetics & Pharmacology Principles
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Prominent Medical Disclaimer required by prompt */}
      <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 space-y-1.5">
        <div className="flex items-center gap-2 font-bold font-mono text-[11px] uppercase tracking-wider text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>EDUCATIONAL INFORMATION ≠ PERSONAL DIAGNOSIS</span>
        </div>
        <p className="leading-relaxed">
          The content provided by ASTRA 7 is exclusively for educational, physiological, and scientific knowledge.
          It does not constitute medical advice, clinical diagnosis, or treatment planning. For any personal medical
          concerns or symptoms, always consult with a licensed and qualified healthcare professional.
        </p>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'Anatomy', 'Nutrition basics', 'Fitness science', 'Medicines'].map((top) => (
          <button
            key={top}
            onClick={() => setSelectedTopic(top)}
            className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
              selectedTopic === top
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {top}
          </button>
        ))}
      </div>

      {/* Main Grid: Articles + Detailed Mechanism */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedArticle(item);
                hapticAction();
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedArticle.id === item.id
                  ? 'bg-emerald-500/15 border-emerald-500/40 shadow-md'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                {item.topic}
              </span>
              <h4 className="text-sm font-bold text-white mt-1.5">{item.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.summary}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-black/50 border border-white/10 space-y-4">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-300">
              {selectedArticle.topic}
            </span>
            <h3 className="text-lg font-black text-white">{selectedArticle.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedArticle.summary}</p>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs">
              <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                PHYSIOLOGICAL MECHANISM
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">{selectedArticle.scientificMechanism}</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">KEY CONCEPTS</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {selectedArticle.keyPoints.map((kp, idx) => (
                  <li key={idx}>{kp}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-slate-500">
              Academic Reference: {selectedArticle.reference}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
