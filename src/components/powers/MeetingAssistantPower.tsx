import React, { useState } from 'react';
import {
  Users,
  Mic,
  FileText,
  CheckCircle2,
  Calendar,
  Clock,
  Download,
  Copy,
  Check,
  Search,
  ArrowLeft,
  ListTodo,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface MeetingDecisions {
  id: string;
  decision: string;
  rationale: string;
}

interface MeetingActionItem {
  id: string;
  task: string;
  assignee: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed';
}

const SAMPLE_TRANSCRIPT = `[00:01] Sarah (Engineering Lead): Good morning everyone. Today we are reviewing the Astra 7 Nexus 2040 edge deployment architecture and memory permission models.
[00:45] Vikram (Data Architect): On the data side, the 5-branch Astra Data Hub is fully configured. Live weather, space missions, and user encrypted memory are operating with zero leaks.
[02:10] Ananya (Product Director): What about user permission for meeting recordings and transcripts?
[02:35] Sarah (Engineering Lead): We made it strictly opt-in. Audio recording requires explicit browser permission, and we never train public models on user meetings.
[03:40] Vikram: Decision: Let's mandate client-side JSON export for all meeting deliverables and encrypt transcript caches.
[04:20] Ananya: Agreed. Action item for Vikram: Finalize the export schema by Friday. Sarah: Complete the 7-step pipeline test by Wednesday.`;

interface MeetingAssistantPowerProps {
  onBack?: () => void;
}

export const MeetingAssistantPower: React.FC<MeetingAssistantPowerProps> = ({ onBack }) => {
  const [meetingTitle, setMeetingTitle] = useState('Astra 7 — Architecture & Privacy Review');
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const [searchTranscriptQuery, setSearchTranscriptQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'decisions' | 'action_items' | 'transcript'>('summary');
  const [copied, setCopied] = useState(false);

  const [decisions, setDecisions] = useState<MeetingDecisions[]>([
    {
      id: 'dec-1',
      decision: 'Mandate client-side JSON/Markdown export for all meeting deliverables.',
      rationale: 'Guarantees user sovereignty and zero vendor lock-in.'
    },
    {
      id: 'dec-2',
      decision: 'Enforce strict explicit permission before accessing microphone or transcribing.',
      rationale: 'Prevents silent background recording and maintains user trust.'
    }
  ]);

  const [actionItems, setActionItems] = useState<MeetingActionItem[]>([
    {
      id: 'act-1',
      task: 'Finalize meeting report export schema with action item tracking',
      assignee: 'Vikram (Data Architect)',
      deadline: 'Friday, Oct 2, 2026',
      priority: 'High',
      status: 'pending'
    },
    {
      id: 'act-2',
      task: 'Run automated end-to-end test on 7-step meeting synthesis pipeline',
      assignee: 'Sarah (Engineering Lead)',
      deadline: 'Wednesday, Sep 30, 2026',
      priority: 'High',
      status: 'pending'
    },
    {
      id: 'act-3',
      task: 'Audit speaker attribution accuracy on regional accents (Telugu, Hindi)',
      assignee: 'Ananya (Product Director)',
      deadline: 'Monday, Oct 5, 2026',
      priority: 'Medium',
      status: 'pending'
    }
  ]);

  const toggleAction = (id: string) => {
    setActionItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' } : a))
    );
    hapticAction();
  };

  const handleExportMeeting = () => {
    const report = `# ${meetingTitle}
Date: ${new Date().toLocaleDateString()}
Pipeline: MEETING → TRANSCRIPT → SUMMARY → DECISIONS → ACTION ITEMS → TASKS → DEADLINES

## Executive Summary
Strategic review of Astra 7 Nexus 2040 edge deployment architecture and meeting assistant permission framework. The team confirmed zero-retention principles and client-side encryption.

## Decisions Made
${decisions.map((d, i) => `${i + 1}. **${d.decision}**\n   Rationale: ${d.rationale}`).join('\n\n')}

## Action Items & Deadlines
${actionItems.map((a, i) => `${i + 1}. [${a.status === 'completed' ? 'X' : ' '}] **${a.task}** | Assignee: ${a.assignee} | Due: ${a.deadline} | Priority: ${a.priority}`).join('\n')}

## Full Transcript
${transcript}
`;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-report-${Date.now()}.md`;
    a.click();
    hapticSuccess();
  };

  const filteredTranscript = transcript
    .split('\n')
    .filter((line) => !searchTranscriptQuery.trim() || line.toLowerCase().includes(searchTranscriptQuery.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-500/25 backdrop-blur-md">
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
            <Users className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA MEETING ASSISTANT</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ACTION-ORIENTED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              MEETING → TRANSCRIPT → SUMMARY → DECISIONS → ACTION ITEMS → TASKS → DEADLINES
            </p>
          </div>
        </div>

        <button
          onClick={handleExportMeeting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Meeting Report</span>
        </button>
      </div>

      {/* Safety Notice: Do not record or access microphones without appropriate user permission */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>User Permission Enforcement:</strong> Astra never listens or records microphones in the background.
            All transcripts require explicit upload or active recording authorization.
          </span>
        </div>
      </div>

      {/* Meeting Title Input */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Meeting Title / Topic</div>
        <input
          type="text"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-amber-400/50"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 pb-2 text-xs">
        {[
          { id: 'summary', label: 'Executive Summary', icon: Sparkles },
          { id: 'decisions', label: `Decisions (${decisions.length})`, icon: CheckCircle2 },
          { id: 'action_items', label: `Action Items & Deadlines (${actionItems.length})`, icon: ListTodo },
          { id: 'transcript', label: 'Transcript & Search', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Summary */}
      {activeTab === 'summary' && (
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Synthesized Executive Summary</h3>
            <span className="font-mono text-[10px] text-amber-400">ASTRA BRAIN → ANALYZED</span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            The engineering and product leadership convened to align on the 2040 edge deployment standards for Astra 7.
            Key achievements include verifying the 5-branch Astra Data Hub and confirming that zero sensitive information
            is ever retained without explicit user permission. The team committed to client-side Markdown and JSON report
            exporting and established deadlines for all deliverables.
          </p>

          <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[10px] font-mono">PARTICIPANTS</span>
              <span className="font-bold text-slate-200">Sarah, Vikram, Ananya</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[10px] font-mono">DECISIONS LOGGED</span>
              <span className="font-bold text-amber-300">{decisions.length} Ratified</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[10px] font-mono">ACTION ITEMS</span>
              <span className="font-bold text-cyan-300">{actionItems.length} Delegated</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Decisions */}
      {activeTab === 'decisions' && (
        <div className="space-y-3">
          {decisions.map((dec, idx) => (
            <div key={dec.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                  DECISION #{idx + 1}
                </span>
                <span className="font-bold text-white">{dec.decision}</span>
              </div>
              <p className="text-slate-400 pl-4 border-l-2 border-amber-500/30">
                <strong>Rationale:</strong> {dec.rationale}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Action Items */}
      {activeTab === 'action_items' && (
        <div className="space-y-3">
          {actionItems.map((act) => (
            <div
              key={act.id}
              onClick={() => toggleAction(act.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 text-xs ${
                act.status === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30 opacity-70'
                  : 'bg-white/[0.03] border-white/10 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={act.status === 'completed'}
                  onChange={() => toggleAction(act.id)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className={`font-bold ${act.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                    {act.task}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Assignee: {act.assignee} • Deadline: {act.deadline}
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  act.priority === 'High'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {act.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Transcript & Search */}
      {activeTab === 'transcript' && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTranscriptQuery}
                onChange={(e) => setSearchTranscriptQuery(e.target.value)}
                placeholder="Search dialogue by speaker or keyword..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2 font-mono text-[11px] max-h-80 overflow-y-auto">
            {filteredTranscript.map((line, idx) => (
              <div key={idx} className="text-slate-300 leading-relaxed">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
