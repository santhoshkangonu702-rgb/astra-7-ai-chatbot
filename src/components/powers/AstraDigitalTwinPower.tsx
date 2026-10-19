import React, { useState } from 'react';
import {
  ArrowLeft,
  UserCheck,
  Brain,
  Database,
  Sliders,
  Trash2,
  Edit3,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface KnowledgeFacet {
  id: string;
  category: 'USER_PROVIDED' | 'STORED_FACT' | 'AI_GENERATED' | 'AI_ASSUMPTION';
  title: string;
  content: string;
  confidence: string;
  lastUpdated: string;
}

const SAMPLE_FACETS: KnowledgeFacet[] = [
  {
    id: 'f-1',
    category: 'USER_PROVIDED',
    title: 'Preferred Programming Paradigm',
    content: 'TypeScript with strict typing, modular directory hierarchies, functional reactive hooks, and Tailwind utility styling.',
    confidence: '100% (Direct User Statement)',
    lastUpdated: '2 days ago'
  },
  {
    id: 'f-2',
    category: 'STORED_FACT',
    title: 'Active Research Trajectory',
    content: 'Investigating high-throughput test-time compute scaling and distributed KV cache sharing architectures.',
    confidence: '95% (Extracted from recent queries)',
    lastUpdated: 'Yesterday'
  },
  {
    id: 'f-3',
    category: 'AI_GENERATED',
    title: 'Personalized Study Profile',
    content: 'Learns most effectively via Socratic question hints followed by mathematical first-principles derivations before code implementations.',
    confidence: '88% (Synthesized from interaction patterns)',
    lastUpdated: '3 days ago'
  },
  {
    id: 'f-4',
    category: 'AI_ASSUMPTION',
    title: 'Assumed Target Career Horizon',
    content: 'Targeting Staff AI Systems Engineer or Principal Distributed Systems Architect role within the next 24 months.',
    confidence: '72% (Inferred assumption - please confirm or edit)',
    lastUpdated: '4 days ago'
  }
];

interface AstraDigitalTwinPowerProps {
  onBack?: () => void;
}

export const AstraDigitalTwinPower: React.FC<AstraDigitalTwinPowerProps> = ({ onBack }) => {
  const [facets, setFacets] = useState<KnowledgeFacet[]>(SAMPLE_FACETS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [notice, setNotice] = useState<string | null>(null);

  const getCategoryBadge = (cat: KnowledgeFacet['category']) => {
    switch (cat) {
      case 'USER_PROVIDED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'STORED_FACT':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'AI_GENERATED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'AI_ASSUMPTION':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(facets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra_digital_twin_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice('Digital Twin knowledge representation exported (JSON).');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = (id: string) => {
    setFacets((prev) => prev.filter((f) => f.id !== id));
    setNotice('Facet purged permanently from Astra Digital Twin.');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSaveEdit = (id: string) => {
    setFacets((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, content: editContent, lastUpdated: 'Just now (User Confirmed)' } : f
      )
    );
    setEditId(null);
    setNotice('Knowledge facet updated.');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div id="astra-digital-twin" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <UserCheck className="w-7 h-7 text-cyan-400" />
                ASTRA DIGITAL TWIN
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                PERSONAL KNOWLEDGE REPOSITORY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent personal knowledge model • Clear division between User Data, Stored Facts, AI Outputs, & Assumptions
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Twin Schema</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Category Distinction Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'all', label: 'All Knowledge Facets' },
          { id: 'USER_PROVIDED', label: 'User Provided (100%)' },
          { id: 'STORED_FACT', label: 'Stored Facts' },
          { id: 'AI_GENERATED', label: 'AI Generated' },
          { id: 'AI_ASSUMPTION', label: 'AI Assumptions (Verify)' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveCategoryFilter(btn.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategoryFilter === btn.id
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-slate-400'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Facet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facets
          .filter((f) => activeCategoryFilter === 'all' || f.category === activeCategoryFilter)
          .map((facet) => (
            <div
              key={facet.id}
              className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryBadge(
                      facet.category
                    )}`}
                  >
                    {facet.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{facet.confidence}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{facet.title}</h3>

                {editId === facet.id ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-cyan-400 text-xs text-white focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(facet.id)}
                        className="px-3 py-1 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    {facet.content}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                <span className="text-[10px] font-mono">Updated: {facet.lastUpdated}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditId(facet.id);
                      setEditContent(facet.content);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                    title="Edit Facet"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(facet.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                    title="Purge Facet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
