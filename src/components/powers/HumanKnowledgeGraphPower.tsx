import React, { useState, useMemo } from 'react';
import {
  Network,
  Users,
  Search,
  BookOpen,
  Landmark,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Calendar,
  MapPin,
  ChevronRight,
  GitBranch,
  Activity
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface HumanKnowledgeGraphPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export interface KnowledgePerson {
  id: string;
  name: string;
  field: string;
  subField: string;
  lifespan: string;
  country: string;
  knownFor: string;
  majorWorks: string[];
  organizations: string[];
  relatedPeople: string[];
  relatedPlaces: string[];
  relatedEvents: string[];
  timeline: Array<{ year: string; event: string }>;
  sources: string[];
  verificationStatus: 'CONFIRMED_HISTORICAL' | 'ARCHIVAL_RECORDS' | 'SCHOLARLY_CONSENSUS';
}

const KNOWLEDGE_GRAPH_DATABASE: KnowledgePerson[] = [
  {
    id: 'kg-einstein',
    name: 'Albert Einstein',
    field: 'Theoretical Physics',
    subField: 'Relativity & Quantum Theory',
    lifespan: '1879 – 1955',
    country: 'Germany / Switzerland / USA',
    knownFor: 'Special and General Relativity, Photoelectric Effect (E = mc²)',
    majorWorks: [
      'Annus Mirabilis Papers (1905)',
      'General Theory of Relativity (1915)',
      'Bose-Einstein Condensate Theory (1924–25)'
    ],
    organizations: ['Swiss Patent Office', 'Prussian Academy of Sciences', 'Institute for Advanced Study, Princeton'],
    relatedPeople: ['Satyendra Nath Bose', 'Max Planck', 'Niels Bohr', 'Hendrik Lorentz'],
    relatedPlaces: ['Ulm, Germany', 'Bern, Switzerland', 'Princeton, New Jersey'],
    relatedEvents: ['1921 Nobel Prize in Physics', '1919 Solar Eclipse Eddington Verification', 'Solvay Conferences'],
    timeline: [
      { year: '1905', event: 'Published four revolutionary papers explaining Brownian motion, photoelectric effect, and special relativity.' },
      { year: '1915', event: 'Completed field equations of General Relativity describing gravity as spacetime curvature.' },
      { year: '1921', event: 'Awarded Nobel Prize in Physics for explanation of the photoelectric effect.' },
      { year: '1933', event: 'Emigrated to Princeton IAS amidst rise of totalitarianism in Europe.' }
    ],
    sources: ['The Collected Papers of Albert Einstein (Princeton University Press)', 'Nobel Foundation Archive'],
    verificationStatus: 'CONFIRMED_HISTORICAL'
  },
  {
    id: 'kg-bose',
    name: 'Satyendra Nath Bose',
    field: 'Theoretical Physics & Mathematics',
    subField: 'Quantum Statistics & Photons',
    lifespan: '1894 – 1974',
    country: 'India',
    knownFor: 'Bose-Einstein Statistics and the prediction of Bosons',
    majorWorks: [
      "Planck's Law and the Hypothesis of Light Quanta (1924)",
      'Unified Field Theory Formulations (with Einstein collaboration)'
    ],
    organizations: ['University of Calcutta', 'University of Dhaka', 'Visva-Bharati University', 'Saha Institute of Nuclear Physics'],
    relatedPeople: ['Albert Einstein', 'Meghnad Saha', 'P. C. Mahalanobis', 'Rabindranath Tagore'],
    relatedPlaces: ['Kolkata, West Bengal', 'Dhaka, Bangladesh', 'Berlin, Germany'],
    relatedEvents: ['Bose-Einstein Condensation First Realization (1995)', 'Discovery of Higgs Boson (2012)'],
    timeline: [
      { year: '1924', event: 'Derives Planck law without classical electrodynamics, sends paper to Einstein who translates it into German.' },
      { year: '1925', event: 'Collaborates with European quantum theorists in Berlin and Paris.' },
      { year: '1954', event: 'Awarded Padma Vibhushan by Government of India for distinguished service in science.' }
    ],
    sources: ['Indian National Science Academy (INSA) Biographical Memoirs', 'Bose Institute Archives'],
    verificationStatus: 'CONFIRMED_HISTORICAL'
  },
  {
    id: 'kg-lovelace',
    name: 'Ada Lovelace (Augusta Ada King)',
    field: 'Computing & Mathematics',
    subField: 'Algorithmic Computation & Analytical Engines',
    lifespan: '1815 – 1852',
    country: 'United Kingdom',
    knownFor: 'First Computer Algorithm and vision of general-purpose symbolic computing',
    majorWorks: [
      "Notes on Luigi Menabrea's Sketch of the Analytical Engine (1843)",
      'Algorithm for Computing Bernoulli Numbers'
    ],
    organizations: ['Collaborated directly with Charles Babbage'],
    relatedPeople: ['Charles Babbage', 'Mary Somerville', 'Lord Byron', 'Michael Faraday'],
    relatedPlaces: ['London, England', 'Surrey, England'],
    relatedEvents: ['Publication of Note G in Taylor Scientific Memoirs (1843)'],
    timeline: [
      { year: '1833', event: 'Meets Charles Babbage and inspects the prototype Difference Engine.' },
      { year: '1843', event: 'Translates Menabrea paper and adds extensive Notes including the Bernoulli algorithm.' },
      { year: '1980', event: 'US Department of Defense names programming language ADA in her honor.' }
    ],
    sources: ['Bodleian Library Oxford Manuscripts', 'British Library Archives'],
    verificationStatus: 'CONFIRMED_HISTORICAL'
  },
  {
    id: 'kg-kalam',
    name: 'Dr. A. P. J. Abdul Kalam',
    field: 'Aerospace Engineering & Statesmanship',
    subField: 'Rocket Propulsion, Satellite Launch Vehicles & Missiles',
    lifespan: '1931 – 2015',
    country: 'India',
    knownFor: 'SLV-III Project Director, Integrated Guided Missile Program, 11th President of India ("People\'s President")',
    majorWorks: [
      'Development of SLV-III (First indigenous satellite launch vehicle placing Rohini in orbit)',
      'Wings of Fire (Autobiography)',
      'India 2020: A Vision for the New Millennium'
    ],
    organizations: ['ISRO', 'DRDO', 'Government of India (President)', 'Anna University'],
    relatedPeople: ['Dr. Vikram Sarabhai', 'Prof. Satish Dhawan', 'Dr. Brahm Prakash'],
    relatedPlaces: ['Rameswaram, Tamil Nadu', 'Thiruvananthapuram, Kerala', 'New Delhi'],
    relatedEvents: ['Rohini Satellite Launch (1980)', 'Pokhran-II Nuclear Tests (1998)', 'Presidency of India (2002–2007)'],
    timeline: [
      { year: '1980', event: 'Directs successful launch of SLV-III making India the 6th spacefaring nation.' },
      { year: '1997', event: 'Conferred Bharat Ratna, India\'s highest civilian honor.' },
      { year: '2002', event: 'Elected 11th President of India with overwhelming cross-party support.' }
    ],
    sources: ['Rashtrapati Bhavan Presidential Archives', 'ISRO Historical Mission Records'],
    verificationStatus: 'CONFIRMED_HISTORICAL'
  }
];

export const HumanKnowledgeGraphPower: React.FC<HumanKnowledgeGraphPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<KnowledgePerson>(KNOWLEDGE_GRAPH_DATABASE[0]);

  const filteredPeople = useMemo(() => {
    return KNOWLEDGE_GRAPH_DATABASE.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.knownFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div
      id="astra-human-knowledge-graph-power"
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-amber-500/40 text-cyan-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                HUMAN KNOWLEDGE GRAPH
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Relational Ontology
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Person → Field → Major Works → Organizations → Timeline → Peer Citations
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge graph (e.g. Einstein, Bose, Lovelace, Kalam, relativity, quantum)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* 2 Column View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* People List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pioneers & Figures ({filteredPeople.length})
            </h3>
            <div className="space-y-2">
              {filteredPeople.map((person) => {
                const isSelected = selectedPerson.id === person.id;
                return (
                  <div
                    key={person.id}
                    onClick={() => {
                      setSelectedPerson(person);
                      triggerHaptic(8);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/10'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{person.name}</h4>
                      <p className="text-xs text-amber-300/80">{person.field}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{person.country} • {person.lifespan}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dossier View */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                  {selectedPerson.field}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedPerson.lifespan}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">{selectedPerson.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedPerson.subField} • {selectedPerson.country}
              </p>
            </div>

            {/* Known For */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Core Contribution</span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{selectedPerson.knownFor}</p>
            </div>

            {/* Major Works */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Seminal Works & Publications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedPerson.majorWorks.map((w, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relational Web (People, Places, Events) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-semibold text-slate-400 block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Related Figures
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedPerson.relatedPeople.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-semibold text-slate-400 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Key Locations
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedPerson.relatedPlaces.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-semibold text-slate-400 block flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-purple-400" />
                  Affiliated Institutions
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedPerson.organizations.join(', ')}
                </p>
              </div>
            </div>

            {/* Chronological Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Chronological Life Milestones
              </h4>
              <div className="space-y-2 text-xs">
                {selectedPerson.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-white/[0.02]">
                    <span className="font-mono font-bold text-amber-400 shrink-0">{item.year}</span>
                    <p className="text-slate-300">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources & Audit */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sources: {selectedPerson.sources.join('; ')}</span>
              </div>
              {onAskAstra && (
                <button
                  onClick={() => onAskAstra(`Trace the intellectual lineage and influence of ${selectedPerson.name} on modern science and technology.`)}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-[11px]"
                >
                  Explore Influence Graph →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
