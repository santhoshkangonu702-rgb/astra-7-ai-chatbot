import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  Download,
  FolderKanban,
  RotateCcw,
  Loader2,
  AlertCircle,
  BookOpen,
  Share2
} from 'lucide-react';
import { api } from '../../services/api';
import { PowerId } from '../../types';

interface NavigatorPlan {
  goal: string;
  category: string;
  requirements: string[];
  steps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    duration: string;
  }>;
  timeline: Array<{
    phase: string;
    period: string;
    milestone: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    estimatedHours: number;
  }>;
  resources: Array<{
    name: string;
    type: 'tool' | 'documentation' | 'service' | 'course';
    description: string;
  }>;
  completionChecklist: string[];
}

interface NavigatorPowerProps {
  onSelectPower?: (power: PowerId) => void;
  initialGoal?: string;
}

export const NavigatorPower: React.FC<NavigatorPowerProps> = ({ onSelectPower, initialGoal }) => {
  const [goalInput, setGoalInput] = useState(initialGoal || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<NavigatorPlan | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [completedChecklist, setCompletedChecklist] = useState<Record<number, boolean>>({});

  const sampleGoals = [
    'Plan a 7-day budget travel itinerary to Kyoto and Tokyo',
    'Build and launch a full-stack SaaS MVP in 30 days',
    'Prepare for AWS Certified Solutions Architect Associate exam in 6 weeks',
    'Organize a 150-person tech community conference in 3 months',
    'Write, edit, and publish a 5-part technical newsletter series'
  ];

  const handleGenerate = async (targetGoal: string) => {
    const g = targetGoal.trim();
    if (!g) return;
    setIsGenerating(true);
    try {
      const data = await api.generateNavigatorPlan(g);
      setPlan(data);
      setCompletedTasks({});
      setCompletedChecklist({});
    } catch (err) {
      console.error('Navigator planning error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChecklist = (idx: number) => {
    setCompletedChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const downloadPlan = () => {
    if (!plan) return;
    const content = `# Astra Navigator Plan: ${plan.goal}
Category: ${plan.category}

## 1. Requirements
${plan.requirements.map(r => `- ${r}`).join('\n')}

## 2. Steps
${plan.steps.map(s => `### Step ${s.stepNumber}: ${s.title} (${s.duration})\n${s.description}`).join('\n\n')}

## 3. Timeline
${plan.timeline.map(t => `- **${t.phase}** (${t.period}): ${t.milestone}`).join('\n')}

## 4. Tasks
${plan.tasks.map(t => `- [${completedTasks[t.id] ? 'x' : ' '}] ${t.title} (Priority: ${t.priority}, Est: ${t.estimatedHours}h)`).join('\n')}

## 5. Resources
${plan.resources.map(r => `- **${r.name}** [${r.type}]: ${r.description}`).join('\n')}

## 6. Completion Checklist
${plan.completionChecklist.map((c, i) => `- [${completedChecklist[i] ? 'x' : ' '}] ${c}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Astra_Navigator_${plan.category}_Plan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 border border-teal-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Astra Navigator
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/30">
                Planning Engine
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Transform any objective into a structured execution pipeline: Goal → Requirements → Steps → Timeline → Tasks → Resources.
            </p>
          </div>
        </div>
      </div>

      {/* Goal Input Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          What do you want to accomplish?
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate(goalInput)}
            placeholder="e.g. Plan a 10-day trip to Europe, build a machine learning pipeline, or organize a hackathon..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-slate-400"
          />
          <button
            onClick={() => handleGenerate(goalInput)}
            disabled={isGenerating || !goalInput.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-sm shadow-md shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Navigating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Quick Goals */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-slate-400 py-1 flex items-center gap-1 font-medium">
            Try:
          </span>
          {sampleGoals.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGoalInput(sample);
                handleGenerate(sample);
              }}
              className="text-xs px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors truncate max-w-[280px]"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Plan View */}
      {plan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Plan Action Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                {plan.category}
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {plan.goal}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadPlan}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-teal-500" />
                <span>Export Markdown</span>
              </button>
              {onSelectPower && (
                <button
                  onClick={() => onSelectPower('projects')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-bold text-white shadow-sm hover:opacity-90 flex items-center gap-1.5"
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Sync to Project Space</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Requirements & Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Requirements */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  <span>Prerequisites & Requirements</span>
                </h3>
                <ul className="space-y-2">
                  {plan.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Execution Steps */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-500" />
                  <span>Sequential Execution Steps</span>
                </h3>
                <div className="space-y-4">
                  {plan.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center shrink-0 border border-teal-500/20 text-sm">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {step.title}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Tasks Checklist */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-teal-500" />
                    <span>Actionable Tasks</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {Object.values(completedTasks).filter(Boolean).length} / {plan.tasks.length} Completed
                  </span>
                </div>
                <div className="space-y-2">
                  {plan.tasks.map((task) => {
                    const isDone = completedTasks[task.id];
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                          isDone
                            ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800 line-through opacity-70'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-teal-300 dark:hover:border-teal-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-teal-500" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            task.priority === 'high'
                              ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {task.estimatedHours}h
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Timeline, Resources & Completion */}
            <div className="space-y-6">
              {/* Timeline Phases */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-500" />
                  <span>Timeline & Milestones</span>
                </h3>
                <div className="relative pl-6 border-l-2 border-teal-500/30 space-y-6">
                  {plan.timeline.map((phase, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white dark:ring-slate-900" />
                      <div className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
                        {phase.period}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {phase.phase}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        🎯 {phase.milestone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Resources */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  <span>Resources & Tooling</span>
                </h3>
                <div className="space-y-2.5">
                  {plan.resources.map((res, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {res.name}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {res.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Completion Checklist */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>Final Completion Checklist</span>
                </h3>
                <div className="space-y-2">
                  {plan.completionChecklist.map((check, idx) => {
                    const isDone = completedChecklist[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklist(idx)}
                        className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <span className="mt-0.5">
                          {isDone ? (
                            <CheckSquare className="w-3.5 h-3.5 text-teal-500" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </span>
                        <span className={isDone ? 'line-through opacity-60' : ''}>
                          {check}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
