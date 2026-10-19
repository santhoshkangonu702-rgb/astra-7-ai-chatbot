import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Search,
  BookOpen,
  Code2,
  LineChart,
  PenTool,
  GraduationCap,
  Compass,
  Languages,
  Database,
  Landmark,
  Plus,
  Check,
  MessageSquare,
  Power,
  Layers,
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';
import { DEFAULT_AGENTS } from '../../data/sampleData';
import { AIAgent } from '../../types';

interface AgentsPowerProps {
  onSelectAgentForChat: (agent: AIAgent) => void;
}

export const AgentsPower: React.FC<AgentsPowerProps> = ({ onSelectAgentForChat }) => {
  const [agents, setAgents] = useState<AIAgent[]>(DEFAULT_AGENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentDetail, setSelectedAgentDetail] = useState<AIAgent | null>(null);

  // New custom agent form state
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  const [newAgentCategory, setNewAgentCategory] = useState<'research' | 'creation' | 'technical' | 'history' | 'operations'>('creation');

  // Map icon strings to Lucide components
  const renderAgentIcon = (avatarName: string, size = 'w-5 h-5') => {
    switch (avatarName) {
      case 'Search':
        return <Search className={size} />;
      case 'BookOpen':
        return <BookOpen className={size} />;
      case 'Landmark':
        return <Landmark className={size} />;
      case 'Code2':
        return <Code2 className={size} />;
      case 'LineChart':
        return <LineChart className={size} />;
      case 'PenTool':
        return <PenTool className={size} />;
      case 'GraduationCap':
        return <GraduationCap className={size} />;
      case 'Compass':
        return <Compass className={size} />;
      case 'Languages':
        return <Languages className={size} />;
      case 'Sparkles':
        return <Sparkles className={size} />;
      case 'Database':
        return <Database className={size} />;
      default:
        return <Bot className={size} />;
    }
  };

  const toggleAgentStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const created: AIAgent = {
      id: `agent-custom-${Date.now()}`,
      name: newAgentName,
      slug: newAgentName.toLowerCase().replace(/\s+/g, '-'),
      role: newAgentRole || 'Custom Specialized Intelligence',
      avatar: 'Bot',
      badge: 'Custom Agent',
      description: newAgentDesc || 'User configured specialized Astra intelligence agent.',
      systemPrompt: newAgentPrompt || `You are ${newAgentName}. Provide expert domain guidance.`,
      capabilities: ['Personalized Reasoning', 'Domain Synthesis', 'Adaptive Guidance'],
      knowledgeSources: ['User Instruction Core', 'Global Web Index'],
      suggestedPrompts: [
        `How can you assist me as ${newAgentName}?`,
        'Provide a foundational analysis on your primary domain.'
      ],
      color: '#A855F7',
      enabled: true,
      category: newAgentCategory
    };

    setAgents([created, ...agents]);
    setIsCreatingCustom(false);
    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentDesc('');
    setNewAgentPrompt('');
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesCategory =
      selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="agents-power" className="flex flex-col gap-6 text-white max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet-950/40 via-[#0A0B18] to-purple-950/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Astra 7 Intelligence Matrix
              </span>
              <span className="text-xs text-purple-300 font-mono">
                {agents.filter((a) => a.enabled).length} of {agents.length} Agents Online
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-cyan-200 bg-clip-text text-transparent">
              Specialized AI Agents
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Activate dedicated domain intelligences for research, full-stack coding, antiquities provenance, Socratic teaching, creative writing, and data analysis.
            </p>
          </div>

          <button
            id="btn-create-agent"
            onClick={() => setIsCreatingCustom(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Agent</span>
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Dimensions' },
              { id: 'research', label: 'Research' },
              { id: 'history', label: 'History & Antiquities' },
              { id: 'technical', label: 'Code & Data' },
              { id: 'creation', label: 'Creation & Prose' },
              { id: 'operations', label: 'Operations' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-violet-600 text-white shadow'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgents.map((agent) => {
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentDetail(agent)}
              className="group relative rounded-2xl bg-[#0A0B18]/90 border border-white/10 hover:border-violet-500/50 p-5 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)] cursor-pointer"
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: `${agent.color}25`, border: `1px solid ${agent.color}50`, color: agent.color }}
                    >
                      {renderAgentIcon(agent.avatar, 'w-5 h-5')}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-[11px] text-purple-300 font-mono line-clamp-1">{agent.role}</p>
                    </div>
                  </div>

                  {/* Toggle Online/Offline Switch */}
                  <button
                    onClick={(e) => toggleAgentStatus(agent.id, e)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      agent.enabled
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                        : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
                    }`}
                    title={agent.enabled ? 'Agent Online (Click to suspend)' : 'Agent Offline (Click to enable)'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
                  {agent.description}
                </p>

                {/* Capabilities Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {agent.capabilities.slice(0, 3).map((cap, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/5 text-gray-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  {agent.badge}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgentForChat(agent);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0A0B18] border border-white/10 p-6 sm:p-8 flex flex-col gap-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow"
                  style={{
                    backgroundColor: `${selectedAgentDetail.color}30`,
                    border: `1px solid ${selectedAgentDetail.color}60`,
                    color: selectedAgentDetail.color
                  }}
                >
                  {renderAgentIcon(selectedAgentDetail.avatar, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedAgentDetail.name}</h3>
                  <p className="text-xs text-purple-300 font-mono">{selectedAgentDetail.role}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAgentDetail(null)}
                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-1.5">Overview</h4>
              <p className="text-xs text-gray-200 leading-relaxed">{selectedAgentDetail.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-1.5">System Prompt & Guidance</h4>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-cyan-200 leading-relaxed">
                {selectedAgentDetail.systemPrompt}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-1.5">Knowledge Sources</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgentDetail.knowledgeSources.map((source, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                    {source}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-1.5">Suggested Prompts</h4>
              <div className="space-y-1.5">
                {selectedAgentDetail.suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectAgentForChat(selectedAgentDetail);
                      setSelectedAgentDetail(null);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/5 hover:border-violet-500/40 text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>"{p}"</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedAgentDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectAgentForChat(selectedAgentDetail);
                  setSelectedAgentDetail(null);
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium flex items-center gap-2 shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat with {selectedAgentDetail.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Agent Modal */}
      {isCreatingCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateAgent}
            className="relative w-full max-w-lg rounded-2xl bg-[#0A0B18] border border-white/10 p-6 sm:p-8 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Create Custom Astra Agent</h3>
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-purple-300 uppercase block mb-1">Agent Name</label>
              <input
                type="text"
                required
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="e.g. Astra Epigraphy Expert"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-purple-300 uppercase block mb-1">Role / Subtitle</label>
              <input
                type="text"
                value={newAgentRole}
                onChange={(e) => setNewAgentRole(e.target.value)}
                placeholder="e.g. Hieroglyphic & Cuneiform Epigraphist"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-purple-300 uppercase block mb-1">Category</label>
              <select
                value={newAgentCategory}
                onChange={(e) => setNewAgentCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E1022] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="research">Research</option>
                <option value="history">History & Antiquities</option>
                <option value="technical">Technical & Coding</option>
                <option value="creation">Creation & Writing</option>
                <option value="operations">Operations & Planning</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-purple-300 uppercase block mb-1">Description</label>
              <textarea
                rows={2}
                value={newAgentDesc}
                onChange={(e) => setNewAgentDesc(e.target.value)}
                placeholder="Briefly describe this agent's specialization..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-purple-300 uppercase block mb-1">System Prompt / Instructions</label>
              <textarea
                rows={3}
                value={newAgentPrompt}
                onChange={(e) => setNewAgentPrompt(e.target.value)}
                placeholder="You are an expert in... always verify... answer with..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-semibold shadow"
              >
                Deploy Agent
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
