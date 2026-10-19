import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Square,
  CheckSquare,
  Code,
  ArrowRight,
  Loader2,
  Compass,
  FileCode2,
  Share2
} from 'lucide-react';
import { api } from '../../services/api';

interface GoalRoadmap {
  goal: string;
  startingPoint: string;
  prerequisiteSkills: string[];
  coreSkills: string[];
  roadmap: Array<{ step: number; title: string; duration: string; focus: string }>;
  resources: Array<{ title: string; type: string; description: string }>;
  practiceProjects: Array<{ name: string; difficulty: string; prompt: string }>;
  milestones: Array<{ id: string; title: string; completed: boolean }>;
}

export const GoalCoachPower: React.FC = () => {
  const [goalInput, setGoalInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coachData, setCoachData] = useState<GoalRoadmap | null>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  const sampleGoals = [
    'I want to learn Python from scratch for data science',
    'I want to master System Design and Microservices',
    'I want to prepare for competitive technical interviews in 60 days',
    'I want to build modern full-stack web apps with React and TypeScript'
  ];

  const handleGenerate = async (targetGoal: string) => {
    const g = targetGoal.trim();
    if (!g) return;
    setIsGenerating(true);
    try {
      const data = await api.generateGoalCoachRoadmap(g);
      setCoachData(data);
      setCompletedMilestones({});
    } catch (err) {
      console.error('Goal coach generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMilestone = (id: string) => {
    setCompletedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 backdrop-blur-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Astra Goal Coach
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
              Personal Mastery
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tell Astra what you want to master. Get an adaptable starting point, skills roadmap, practice projects, and tracking milestones.
          </p>
        </div>
      </div>

      {/* Goal Input Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          What is your learning or career goal?
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate(goalInput)}
            placeholder="e.g. I want to learn Python, master deep learning, or become a product designer..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-slate-400"
          />
          <button
            onClick={() => handleGenerate(goalInput)}
            disabled={isGenerating || !goalInput.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Coaching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Build Roadmap</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Goal Presets */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-slate-400 py-1 font-medium">Popular Goals:</span>
          {sampleGoals.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGoalInput(sample);
                handleGenerate(sample);
              }}
              className="text-xs px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors truncate max-w-[300px]"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Roadmap */}
      {coachData && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Starting Point Banner */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Recommended Starting Point</span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {coachData.startingPoint}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roadmap Steps */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                  <span>Sequential Learning Roadmap</span>
                </h3>
                <div className="space-y-3">
                  {coachData.roadmap.map((step) => (
                    <div
                      key={step.step}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/20 text-sm">
                        {step.step}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {step.title}
                          </h4>
                          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          {step.focus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hands-on Practice Projects */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Code className="w-4 h-4 text-teal-500" />
                  <span>Hands-on Practice Projects</span>
                </h3>
                <div className="space-y-3">
                  {coachData.practiceProjects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {proj.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                          {proj.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {proj.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Skills, Milestones & Resources */}
            <div className="space-y-6">
              {/* Skills Checklist */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target Core Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {coachData.coreSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones Tracking */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>Milestones</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {Object.values(completedMilestones).filter(Boolean).length}/{coachData.milestones.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {coachData.milestones.map((m) => {
                    const isDone = completedMilestones[m.id];
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(m.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all text-xs font-medium ${
                          isDone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 line-through opacity-70'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-800 dark:text-slate-200">{m.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resources */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-500" />
                  <span>Curated Resources</span>
                </h3>
                <div className="space-y-2">
                  {coachData.resources.map((res, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {res.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {res.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
