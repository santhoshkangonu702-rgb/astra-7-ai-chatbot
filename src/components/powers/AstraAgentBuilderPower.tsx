import React, { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Play,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sliders,
  History,
  ToggleLeft,
  ToggleRight,
  Layers,
  FileText,
  Newspaper,
  Code2
} from 'lucide-react';

interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  result: string;
  isEnabled: boolean;
  runCount: number;
  lastRun: string;
}

const DEFAULT_WORKFLOWS: AgentWorkflow[] = [
  {
    id: 'wf-pdf-quiz',
    name: 'PDF Document to 10-Question Quiz Engine',
    description: 'Watches for any uploaded academic paper, extracts key definitions, and synthesizes a 10-question multiple choice & short-answer exam sheet.',
    trigger: 'New PDF Uploaded to Documents Power',
    actions: [
      'Extract abstract and core theorem sections',
      'Analyze Bloom taxonomy levels 1 through 4',
      'Generate 10 questions with verified answer keys'
    ],
    result: 'Export to Study Flashcard Deck & PDF',
    isEnabled: true,
    runCount: 14,
    lastRun: 'Yesterday at 16:40'
  },
  {
    id: 'wf-daily-briefing',
    name: 'Morning Planetary Briefing Synthesizer',
    description: 'At 07:00 local time, pulls verified weather, top 3 global science discoveries, market indices, and user study reminders into a 2-minute concise briefing.',
    trigger: 'Time: 07:00 AM Daily',
    actions: [
      'Query Astra World Weather & Air Quality API',
      'Fetch top Nature/arXiv breakthrough publications',
      'Aggregate pending calendar deadlines'
    ],
    result: 'Deliver Daily Astra Briefing to Home Screen',
    isEnabled: true,
    runCount: 42,
    lastRun: 'Today at 07:00'
  },
  {
    id: 'wf-code-patch',
    name: 'Autonomous Code Bug Diagnostic & Test Harness',
    description: 'Parses runtime error stack traces, isolates faulty functions, writes reproducing regression tests, and proposes a minimal clean diff patch.',
    trigger: 'Exception Caught in Code Lab Console',
    actions: [
      'Parse AST and identify line number of unhandled rejection',
      'Synthesize unit test replicating failure state',
      'Generate verified TypeScript patch diff'
    ],
    result: 'Display Interactive Diff in Code Lab Sandbox',
    isEnabled: false,
    runCount: 9,
    lastRun: '3 days ago'
  }
];

interface AstraAgentBuilderPowerProps {
  onBack?: () => void;
}

export const AstraAgentBuilderPower: React.FC<AstraAgentBuilderPowerProps> = ({ onBack }) => {
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>(DEFAULT_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AgentWorkflow>(DEFAULT_WORKFLOWS[0]);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunNow = (wf: AgentWorkflow) => {
    setIsRunning(true);
    setExecutionMessage(`Executing "${wf.name}"... Triggering: ${wf.trigger}`);
    setTimeout(() => {
      setIsRunning(false);
      setExecutionMessage(`Workflow "${wf.name}" completed successfully! Result: ${wf.result}`);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === wf.id ? { ...w, runCount: w.runCount + 1, lastRun: 'Just now' } : w))
      );
      setTimeout(() => setExecutionMessage(null), 4000);
    }, 1000);
  };

  const handleToggle = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isEnabled: !w.isEnabled } : w))
    );
  };

  const handleDuplicate = (wf: AgentWorkflow) => {
    const clone: AgentWorkflow = {
      ...wf,
      id: `wf-${Date.now()}`,
      name: `${wf.name} (Copy)`,
      runCount: 0,
      lastRun: 'Never'
    };
    setWorkflows((prev) => [clone, ...prev]);
    setSelectedWorkflow(clone);
  };

  return (
    <div id="astra-agent-builder" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
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
                <Bot className="w-7 h-7 text-purple-400" />
                ASTRA AGENT BUILDER
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                WORKFLOW AUTOMATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-step cognitive pipelines: Trigger → Actions → Result • Autonomous background agents
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const newWf: AgentWorkflow = {
              id: `wf-custom-${Date.now()}`,
              name: 'Custom Research & Summary Pipeline',
              description: 'Autonomous multi-source research agent configured by user.',
              trigger: 'Manual Trigger or Scheduled',
              actions: ['Gather verified sources', 'Deduplicate facts', 'Draft high-density summary'],
              result: 'Save to Astra Project Spaces',
              isEnabled: true,
              runCount: 0,
              lastRun: 'Never'
            };
            setWorkflows((prev) => [newWf, ...prev]);
            setSelectedWorkflow(newWf);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Workflow</span>
        </button>
      </div>

      {executionMessage && (
        <div className="p-3.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>{executionMessage}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Workflow List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Configured Agent Pipelines ({workflows.length})</span>
            <span className="text-purple-400 font-mono text-[10px]">ASTRANET ACTIVE</span>
          </div>

          <div className="space-y-3">
            {workflows.map((wf) => {
              const isSelected = selectedWorkflow.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white line-clamp-1">{wf.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(wf.id);
                      }}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      {wf.isEnabled ? (
                        <ToggleRight className="w-6 h-6 text-purple-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-600" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{wf.description}</p>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Runs: {wf.runCount}</span>
                    <span>Last run: {wf.lastRun}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Pipeline Editor & Execution (7 cols) */}
        <div className="lg:col-span-7">
          {selectedWorkflow && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-2xl shadow-xl space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    Pipeline Architecture
                  </span>
                  <h2 className="text-lg font-black text-white mt-0.5">{selectedWorkflow.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicate(selectedWorkflow)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                    title="Duplicate Workflow"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleRunNow(selectedWorkflow)}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>Run Now</span>
                  </button>
                </div>
              </div>

              {/* Step Sequence: Trigger -> Actions -> Result */}
              <div className="space-y-3">
                {/* 1. Trigger */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-400/30 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TRIGGER STAGE</span>
                  </div>
                  <div className="text-xs font-bold text-white">{selectedWorkflow.trigger}</div>
                </div>

                {/* 2. Actions */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase text-purple-400 font-bold px-1">
                    SEQUENTIAL ACTIONS ({selectedWorkflow.actions.length})
                  </div>
                  {selectedWorkflow.actions.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                {/* 3. Result */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-400/30 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>EXPECTED OUTCOME / RESULT</span>
                  </div>
                  <div className="text-xs font-bold text-white">{selectedWorkflow.result}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
