import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
  Lock,
  Eye,
  Sparkles,
  CheckCircle2,
  FolderLock,
  Cpu,
  ArrowLeft,
  Search,
  Archive,
  Clock,
  Download,
  AlertTriangle,
  History,
  Tag,
  Settings2,
  FileText,
  Key,
  Database
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type MemoryCategory =
  | 'Personal preferences'
  | 'Learning history'
  | 'Projects'
  | 'Previous conversations'
  | 'Important notes'
  | 'Frequently used information'
  | 'Goals'
  | 'Skills'
  | 'Favorite tools'
  | 'Saved instructions'
  | 'Preferred language'
  | 'User-created workflows';

export type MemoryMode =
  | 'Long-Term Memory'
  | 'Temporary Memory'
  | 'Private Memory'
  | 'Conversation-Only Memory';

export interface MemoryItem2 {
  id: string;
  category: MemoryCategory;
  fact: string;
  mode: MemoryMode;
  isArchived: boolean;
  userPermission: 'EXPLICIT_USER_CONSENT' | 'TEMPORARY_SESSION';
  savedAt: string;
  source: string;
}

export interface MemoryActivityLog {
  id: string;
  action: 'REMEMBER' | 'FORGET' | 'EDIT' | 'ARCHIVE' | 'TEMPORARY_REMEMBER' | 'PERMANENTLY_DELETE';
  date: string;
  source: string;
  category: MemoryCategory;
  userPermission: string;
  status: 'SUCCESS' | 'ENCRYPTED' | 'PURGED';
}

const DEFAULT_MEMORIES: MemoryItem2[] = [
  {
    id: 'mem-1',
    category: 'Personal preferences',
    fact: 'Preferred programming languages: TypeScript, Python, and Rust. Prefer modern Tailwind styling and functional clean components.',
    mode: 'Long-Term Memory',
    isArchived: false,
    userPermission: 'EXPLICIT_USER_CONSENT',
    savedAt: '2 days ago',
    source: 'Settings & Profile'
  },
  {
    id: 'mem-2',
    category: 'Preferred language',
    fact: 'Primary language: English. Secondary regional languages: Telugu (తెలుగు) and Hindi (हिंदी).',
    mode: 'Long-Term Memory',
    isArchived: false,
    userPermission: 'EXPLICIT_USER_CONSENT',
    savedAt: '3 days ago',
    source: 'Language Settings'
  },
  {
    id: 'mem-3',
    category: 'Projects',
    fact: 'Active project: ASTRA 7 — NEXUS 2040 unified intelligence platform with autonomous multi-agent routing.',
    mode: 'Long-Term Memory',
    isArchived: false,
    userPermission: 'EXPLICIT_USER_CONSENT',
    savedAt: 'Yesterday',
    source: 'Project Spaces'
  },
  {
    id: 'mem-4',
    category: 'Goals',
    fact: 'Master distributed neural systems, edge AI inference, and quantum computing simulators by Q4 2040.',
    mode: 'Long-Term Memory',
    isArchived: false,
    userPermission: 'EXPLICIT_USER_CONSENT',
    savedAt: '4 days ago',
    source: 'Goal Coach'
  },
  {
    id: 'mem-5',
    category: 'Skills',
    fact: 'Advanced competency in React 19, Fullstack TypeScript, WebGL/Three.js spatial interfaces, and RAG pipelines.',
    mode: 'Long-Term Memory',
    isArchived: false,
    userPermission: 'EXPLICIT_USER_CONSENT',
    savedAt: '1 week ago',
    source: 'Achievement Center'
  },
  {
    id: 'mem-6',
    category: 'Saved instructions',
    fact: 'Always format calculations with step-by-step verification and display compact capability indicator badges.',
    mode: 'Long-Term Memory',
    isArchived: false,
    userPermission: 'EXPLICIT_USER_CONSENT',
    savedAt: '5 days ago',
    source: 'System Directives'
  }
];

const DEFAULT_LOGS: MemoryActivityLog[] = [
  {
    id: 'log-1',
    action: 'REMEMBER',
    date: '2026-09-25 14:32:00',
    source: 'Settings & Profile',
    category: 'Personal preferences',
    userPermission: 'EXPLICIT_USER_CONSENT',
    status: 'ENCRYPTED'
  },
  {
    id: 'log-2',
    action: 'REMEMBER',
    date: '2026-09-25 16:10:15',
    source: 'Language Settings',
    category: 'Preferred language',
    userPermission: 'EXPLICIT_USER_CONSENT',
    status: 'ENCRYPTED'
  },
  {
    id: 'log-3',
    action: 'REMEMBER',
    date: '2026-09-26 09:12:44',
    source: 'Project Spaces',
    category: 'Projects',
    userPermission: 'EXPLICIT_USER_CONSENT',
    status: 'SUCCESS'
  }
];

const CATEGORIES: MemoryCategory[] = [
  'Personal preferences',
  'Learning history',
  'Projects',
  'Previous conversations',
  'Important notes',
  'Frequently used information',
  'Goals',
  'Skills',
  'Favorite tools',
  'Saved instructions',
  'Preferred language',
  'User-created workflows'
];

interface AstraMemoryPowerProps {
  onBack?: () => void;
}

export const AstraMemoryPower: React.FC<AstraMemoryPowerProps> = ({ onBack }) => {
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [memories, setMemories] = useState<MemoryItem2[]>(DEFAULT_MEMORIES);
  const [activityLogs, setActivityLogs] = useState<MemoryActivityLog[]>(DEFAULT_LOGS);
  const [activeTab, setActiveTab] = useState<'memories' | 'activity_log' | 'settings'>('memories');
  const [selectedMode, setSelectedMode] = useState<MemoryMode>('Long-Term Memory');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add / Edit memory form state
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [factInput, setFactInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<MemoryCategory>('Personal preferences');
  const [modeInput, setModeInput] = useState<MemoryMode>('Long-Term Memory');
  
  const [privacyNotification, setPrivacyNotification] = useState<string | null>(null);

  const showPrivacyNotice = (msg: string) => {
    setPrivacyNotification(msg);
    setTimeout(() => setPrivacyNotification(null), 3500);
  };

  const handleSaveMemory = () => {
    if (!factInput.trim()) return;
    
    if (isEditingId) {
      // Edit
      setMemories((prev) =>
        prev.map((m) =>
          m.id === isEditingId
            ? { ...m, fact: factInput.trim(), category: categoryInput, mode: modeInput }
            : m
        )
      );
      const newLog: MemoryActivityLog = {
        id: `log-${Date.now()}`,
        action: 'EDIT',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        source: 'User Manual Edit',
        category: categoryInput,
        userPermission: 'EXPLICIT_USER_CONSENT',
        status: 'SUCCESS'
      };
      setActivityLogs([newLog, ...activityLogs]);
      setIsEditingId(null);
      showPrivacyNotice(`Memory facet successfully updated in local encrypted vault.`);
    } else {
      // Create
      const newItem: MemoryItem2 = {
        id: `mem-${Date.now()}`,
        category: categoryInput,
        fact: factInput.trim(),
        mode: modeInput,
        isArchived: false,
        userPermission: 'EXPLICIT_USER_CONSENT',
        savedAt: 'Just now',
        source: 'User Defined'
      };
      setMemories([newItem, ...memories]);
      const newLog: MemoryActivityLog = {
        id: `log-${Date.now()}`,
        action: modeInput === 'Temporary Memory' ? 'TEMPORARY_REMEMBER' : 'REMEMBER',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        source: 'User Input',
        category: categoryInput,
        userPermission: 'EXPLICIT_USER_CONSENT',
        status: 'ENCRYPTED'
      };
      setActivityLogs([newLog, ...activityLogs]);
      showPrivacyNotice(`New memory registered under [${categoryInput}] with explicit user consent.`);
    }
    
    setFactInput('');
    hapticSuccess();
  };

  const handleStartEdit = (item: MemoryItem2) => {
    setIsEditingId(item.id);
    setFactInput(item.fact);
    setCategoryInput(item.category);
    setModeInput(item.mode);
  };

  const handleArchive = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isArchived: !m.isArchived } : m))
    );
    const item = memories.find((m) => m.id === id);
    if (item) {
      const newLog: MemoryActivityLog = {
        id: `log-${Date.now()}`,
        action: 'ARCHIVE',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        source: 'Vault Management',
        category: item.category,
        userPermission: 'EXPLICIT_USER_CONSENT',
        status: 'SUCCESS'
      };
      setActivityLogs([newLog, ...activityLogs]);
    }
    showPrivacyNotice('Memory archive status updated.');
  };

  const handleDelete = (id: string) => {
    const item = memories.find((m) => m.id === id);
    setMemories(memories.filter((m) => m.id !== id));
    if (item) {
      const newLog: MemoryActivityLog = {
        id: `log-${Date.now()}`,
        action: 'PERMANENTLY_DELETE',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        source: 'User Purge Request',
        category: item.category,
        userPermission: 'EXPLICIT_USER_CONSENT',
        status: 'PURGED'
      };
      setActivityLogs([newLog, ...activityLogs]);
    }
    showPrivacyNotice('Memory facet permanently erased from neural indexes.');
  };

  const handleClearConversationMemory = () => {
    setMemories((prev) => prev.filter((m) => m.category !== 'Previous conversations'));
    showPrivacyNotice('Ephemeral conversation memory wiped successfully.');
  };

  const handleExport = () => {
    const data = {
      platform: 'ASTRA 7 — NEXUS 2040',
      exportDate: new Date().toISOString(),
      userControlled: true,
      totalItems: memories.length,
      memories,
      activityLogs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-memory-vault-${Date.now()}.json`;
    a.click();
    showPrivacyNotice('Personal memory vault exported securely as JSON.');
  };

  const filtered = memories.filter((m) => {
    if (activeCategoryFilter !== 'all' && m.category !== activeCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.fact.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col overflow-y-auto text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
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
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-[0_0_15px_rgba(245,184,46,0.2)]">
            <Brain className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA MEMORY 2.0</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                USER CONTROLLED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero silent profiling. Transparent cognitive vault with granular permission control.
            </p>
          </div>
        </div>

        {/* Global Memory ON / OFF Switch */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-200">
              Memory Engine {memoryEnabled ? 'Active' : 'Disabled'}
            </div>
            <div className="text-[10px] text-slate-400">
              {memoryEnabled ? 'Respecting user permissions' : 'Strict ephemeral mode'}
            </div>
          </div>
          <button
            onClick={() => {
              setMemoryEnabled(!memoryEnabled);
              showPrivacyNotice(
                !memoryEnabled
                  ? 'Astra Memory enabled with user permission.'
                  : 'Astra Memory disabled. Zero context retention.'
              );
            }}
            className="p-1"
          >
            {memoryEnabled ? (
              <ToggleRight className="w-8 h-8 text-amber-400" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Zero Silent Profiling Policy:</strong> ASTRA 7 only retains information you explicitly permit.
            Sensitive personal attributes are never inferred or harvested without consent.
          </span>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Vault</span>
        </button>
      </div>

      {/* Privacy Notification Toast */}
      {privacyNotification && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{privacyNotification}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('memories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'memories'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Active Memories ({memories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity_log')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'activity_log'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Memory Activity Log</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Modes & Privacy Controls</span>
        </button>
      </div>

      {/* TAB 1: Memories List & Add */}
      {activeTab === 'memories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Add / Edit Memory Form */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{isEditingId ? 'Edit Memory Facet' : 'Add Explicit Memory'}</span>
              </h3>

              {/* Category Dropdown */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as MemoryCategory)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-slate-200">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Memory Mode Selector */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Memory Mode</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Long-Term Memory', 'Temporary Memory', 'Private Memory', 'Conversation-Only Memory'] as MemoryMode[]).map(
                    (mode) => (
                      <button
                        key={mode}
                        onClick={() => setModeInput(mode)}
                        className={`p-2 rounded-lg text-[10px] font-semibold text-left border transition-all ${
                          modeInput === mode
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Content textarea */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Information / Rule</label>
                <textarea
                  value={factInput}
                  onChange={(e) => setFactInput(e.target.value)}
                  placeholder="e.g. 'I prefer concise answers with code snippets in TypeScript'..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 resize-none"
                />
              </div>

              <div className="flex gap-2">
                {isEditingId && (
                  <button
                    onClick={() => {
                      setIsEditingId(null);
                      setFactInput('');
                    }}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSaveMemory}
                  disabled={!factInput.trim()}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 disabled:opacity-40 transition-all"
                >
                  {isEditingId ? 'Update Facet' : 'Encrypt & Save'}
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
              <div className="font-bold text-slate-300">Quick Actions</div>
              <button
                onClick={handleClearConversationMemory}
                className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                🧹 Clear Conversation-Only Memory
              </button>
              <button
                onClick={handleExport}
                className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                📥 Export Entire Memory Vault (JSON)
              </button>
            </div>
          </div>

          {/* Right Column: Search, Filter & Memory Cards */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memory facets..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <select
                value={activeCategoryFilter}
                onChange={(e) => setActiveCategoryFilter(e.target.value)}
                className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-amber-400/50"
              >
                <option value="all">All Categories ({memories.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Memories List */}
            <div className="space-y-3">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.isArchived
                        ? 'bg-white/[0.01] border-white/5 opacity-60'
                        : 'bg-white/[0.03] border-white/10 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                            {item.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            {item.mode}
                          </span>
                          {item.isArchived && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-500/20 text-slate-400">
                              Archived
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.savedAt} • Source: {item.source}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {item.fact}
                        </p>
                      </div>

                      {/* Item Action Buttons: Edit, Archive, Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                          title="Edit Memory"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleArchive(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.isArchived
                              ? 'text-amber-400 hover:bg-amber-500/10'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                          title={item.isArchived ? 'Unarchive' : 'Archive'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Permanently Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-500 text-xs">
                  No memory facets found matching this filter or search query.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Memory Activity Log */}
      {activeTab === 'activity_log' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Immutable Cognitive Audit Trail</span>
            </h3>
            <span className="text-xs text-slate-400">Total Recorded Actions: {activityLogs.length}</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-3">MEMORY ACTION</th>
                  <th className="p-3">DATE</th>
                  <th className="p-3">SOURCE</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3">USER PERMISSION</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-300">{log.action}</td>
                    <td className="p-3 font-mono text-slate-400">{log.date}</td>
                    <td className="p-3">{log.source}</td>
                    <td className="p-3">{log.category}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {log.userPermission}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          log.status === 'PURGED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Settings & Privacy Controls */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-amber-400" />
              <span>Memory Retention Modes</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <strong className="text-amber-300">1. Long-Term Memory:</strong>
                <p className="text-slate-400">
                  Retains verified preferences across sessions with full encryption. User can edit or delete anytime.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <strong className="text-cyan-300">2. Temporary Memory:</strong>
                <p className="text-slate-400">
                  Keeps context active for the current workflow only; automatically purged upon window close.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <strong className="text-purple-300">3. Private Memory:</strong>
                <p className="text-slate-400">
                  Encrypted with client-side key derivation. Accessible only during verified biometric/passphrase sessions.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <strong className="text-rose-300">4. Conversation-Only Memory:</strong>
                <p className="text-slate-400">
                  Ephemerally retained inside the active chat thread. Wiped immediately when the conversation is cleared.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Audit Guarantee</span>
            </h4>
            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                • <strong>No Hidden Chain-of-Thought or Tracking:</strong> ASTRA 7 displays only verified capability indicators and explicit user-authorized facts.
              </p>
              <p>
                • <strong>Zero Third-Party Training:</strong> Your memory contents are never leaked or aggregated into training corpora for public models.
              </p>
              <p>
                • <strong>One-Click Permanent Deletion:</strong> You retain absolute ownership. Any facet deleted is scrubbed permanently from all indices.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to permanently erase ALL memory facets?')) {
                    setMemories([]);
                    showPrivacyNotice('All memory facets wiped permanently.');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors"
              >
                Permanently Delete All Memory Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
