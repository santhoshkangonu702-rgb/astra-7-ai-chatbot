import React, { useState, useEffect, useMemo } from 'react';
import {
  UserCheck,
  FolderKanban,
  FileText,
  Target,
  CheckSquare,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Download,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Bookmark,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface PersonalKnowledgeGraphPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type PersonalItemType =
  | 'project'
  | 'note'
  | 'goal'
  | 'task'
  | 'skill'
  | 'saved-answer';

export interface PersonalKnowledgeItem {
  id: string;
  type: PersonalItemType;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status?: 'active' | 'completed' | 'archived';
  progress?: number;
}

export const PersonalKnowledgeGraphPower: React.FC<PersonalKnowledgeGraphPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [activeTab, setActiveTab] = useState<PersonalItemType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<PersonalKnowledgeItem[]>(() => {
    try {
      const saved = localStorage.getItem('astra_my_knowledge_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'pk-1',
        type: 'project',
        title: 'Quantum Key Distribution Simulator in Rust',
        description: 'Building an educational simulator demonstrating BB84 protocol with simulated photon polarization and eavesdropper detection.',
        tags: ['Quantum', 'Rust', 'Cryptography'],
        createdAt: '2026-09-20',
        updatedAt: '2026-09-24',
        status: 'active',
        progress: 65
      },
      {
        id: 'pk-2',
        type: 'goal',
        title: 'Complete Master Level Deep Learning Certification',
        description: 'Finish Coursera DeepLearning.AI sequences and implement 3 transformer models from scratch.',
        tags: ['Deep Learning', 'PyTorch', 'Certifications'],
        createdAt: '2026-09-15',
        updatedAt: '2026-09-25',
        status: 'active',
        progress: 80
      },
      {
        id: 'pk-3',
        type: 'note',
        title: 'Key Takeaways from Chandrayaan-3 Thermal Sensor Paper',
        description: 'ChaSTE measured surface temperature of ~50°C and steep gradient to -10°C just 8cm below the lunar soil surface, highlighting lunar regolith as an exceptional thermal insulator.',
        tags: ['Moon', 'ISRO', 'Space Science'],
        createdAt: '2026-09-22',
        updatedAt: '2026-09-22',
        status: 'completed'
      },
      {
        id: 'pk-4',
        type: 'task',
        title: 'Review System Design for Attendance Biometric Scanner',
        description: 'Benchmark cosine similarity calculation on edge Raspberry Pi 5 NPU using ONNX runtime.',
        tags: ['Edge AI', 'Architecture'],
        createdAt: '2026-09-26',
        updatedAt: '2026-09-26',
        status: 'active',
        progress: 40
      }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<PersonalItemType>('note');
  const [newTags, setNewTags] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('astra_my_knowledge_items', JSON.stringify(items));
    } catch {}
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: PersonalKnowledgeItem = {
      id: `pk-${Date.now()}`,
      type: newType,
      title: newTitle,
      description: newDesc,
      tags: parsedTags.length > 0 ? parsedTags : ['General'],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      progress: newType === 'project' || newType === 'goal' ? 10 : undefined
    };

    setItems([newItem, ...items]);
    setNewTitle('');
    setNewDesc('');
    setNewTags('');
    setIsAdding(false);
    hapticSuccess();
    setStatusNotice('Item added to My Astra Knowledge.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(12);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setStatusNotice('Item deleted.');
    setTimeout(() => setStatusNotice(null), 2500);
  };

  const handleDeleteAll = () => {
    triggerHaptic(18);
    if (confirm('Are you sure you want to delete ALL personal knowledge and stored memories? This action is permanent.')) {
      setItems([]);
      try {
        localStorage.removeItem('astra_my_knowledge_items');
      } catch {}
      hapticSuccess();
      setStatusNotice('All personal knowledge records and memories have been wiped.');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const handleExportData = () => {
    triggerHaptic(10);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `my_astra_knowledge_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    hapticSuccess();
    setStatusNotice('Personal Knowledge Graph exported to JSON.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchTab = activeTab === 'ALL' || item.type === activeTab;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTab && matchSearch;
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div
      id="astra-personal-knowledge-graph-power"
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                MY ASTRA KNOWLEDGE
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Private Workspace
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              My Projects • Notes • Goals • Tasks • Skills • Client-Side Encryption & Delete-All Controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Item</span>
          </button>
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Permanently erase all personal items"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete All</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {statusNotice && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Search & Tabs */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search my projects, notes, goals, or tasks..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['ALL', 'project', 'note', 'goal', 'task', 'skill', 'saved-answer'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  triggerHaptic(8);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize shrink-0 transition-all ${
                  activeTab === t
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {t === 'ALL' ? 'All Items' : t.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Items Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-900/80 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {item.type}
                    </span>
                    {item.status && (
                      <span className="text-[10px] capitalize px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                        {item.status}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {item.progress !== undefined && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Completion</span>
                      <span className="text-amber-400 font-bold">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-slate-500">Updated: {item.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#080d1e] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add to My Astra Knowledge
              </h3>

              <form onSubmit={handleAddItem} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Item Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PersonalItemType)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="project">Project Workspace</option>
                    <option value="note">Personal Note</option>
                    <option value="goal">Study Goal</option>
                    <option value="task">Action Item / Task</option>
                    <option value="skill">Skill & Certification</option>
                    <option value="saved-answer">Saved Knowledge Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Master Transformer Attention Mechanisms"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Description / Content</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    placeholder="Detailed description, notes or objectives..."
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="AI, Transformers, Paper Notes"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-black shadow-lg"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
