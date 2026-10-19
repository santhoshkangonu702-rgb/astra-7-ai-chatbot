import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  FileText,
  Compass,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';

interface CareerPath {
  id: string;
  role: string;
  industry: string;
  marketDemand: 'Ultra High' | 'High' | 'Emerging';
  salaryRange: string;
  currentSkillMatch: number;
  missingSkills: string[];
  keyProjects: string[];
  roadmapSteps: string[];
}

const SAMPLE_CAREER_PATHS: CareerPath[] = [
  {
    id: 'ai-infra',
    role: 'AI Infrastructure & Systems Engineer',
    industry: 'Cloud & Distributed Computing',
    marketDemand: 'Ultra High',
    salaryRange: '$160,000 - $240,000',
    currentSkillMatch: 78,
    missingSkills: ['CUDA C++ Kernel Tuning', 'vLLM / TensorRT-LLM Serving', 'RoCE v2 Distributed Networking'],
    keyProjects: [
      'High-throughput multi-GPU inference server with continuous batching',
      'Distributed checkpointing pipeline for 70B parameter models'
    ],
    roadmapSteps: [
      'Phase 1: Deep dive into GPU hardware hierarchy & memory bandwidth bottlenecks',
      'Phase 2: Master CUDA kernel writing & Triton programming for custom flash attention',
      'Phase 3: Deploy production Kubernetes cluster with NVLink topology awareness'
    ]
  },
  {
    id: 'fullstack-agent',
    role: 'Full-Stack Agentic Systems Architect',
    industry: 'Enterprise Software & AI Products',
    marketDemand: 'Ultra High',
    salaryRange: '$145,000 - $210,000',
    currentSkillMatch: 86,
    missingSkills: ['Evals Harness & LLM Benchmarking', 'Vector Index Sharding', 'Real-time WebRTC Audio Streams'],
    keyProjects: [
      'Multi-agent collaborative software engineering platform with git rollbacks',
      'Offline-first mobile client with local NPU fallback'
    ],
    roadmapSteps: [
      'Phase 1: Architect stateful agent orchestration engines with Human-in-the-Loop',
      'Phase 2: Build deterministic evaluation pipelines with synthetic edge cases',
      'Phase 3: Package portfolio demonstrations and contribute to open-source agent frameworks'
    ]
  }
];

interface AstraCareerPowerProps {
  onBack?: () => void;
}

export const AstraCareerPower: React.FC<AstraCareerPowerProps> = ({ onBack }) => {
  const [selectedRole, setSelectedRole] = useState<CareerPath>(SAMPLE_CAREER_PATHS[0]);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'gap' | 'projects' | 'interview'>('roadmap');

  return (
    <div id="astra-career-module" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
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
                <Briefcase className="w-7 h-7 text-amber-400" />
                ASTRA CAREER
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ROADMAP & GAP ANALYSIS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Skills • Skill Gaps • Learning Roadmap • Projects • Portfolio • Interview Prep
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Informational guidance • No employment outcome guarantee</span>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_CAREER_PATHS.map((career) => {
          const isSelected = selectedRole.id === career.id;
          return (
            <div
              key={career.id}
              onClick={() => setSelectedRole(career)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer backdrop-blur-xl ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                  {career.industry}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {career.marketDemand} Demand
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-2">{career.role}</h3>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs">
                <div>
                  <span className="text-slate-400">Match Score: </span>
                  <span className="font-mono font-bold text-amber-300">{career.currentSkillMatch}%</span>
                </div>
                <div className="text-slate-300 font-mono text-[11px]">{career.salaryRange}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Roadmap & Projects (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950/70 border border-amber-400/30 backdrop-blur-2xl shadow-xl space-y-5">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              {[
                { id: 'roadmap', label: 'Learning Roadmap' },
                { id: 'gap', label: 'Skill Gap Breakdown' },
                { id: 'projects', label: 'Portfolio Projects' },
                { id: 'interview', label: 'Interview Prep Questions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Roadmap Tab */}
            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400">
                  Target: Transition to <strong>{selectedRole.role}</strong> with verified competency benchmarks:
                </div>
                <div className="space-y-3">
                  {selectedRole.roadmapSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gap Tab */}
            {activeTab === 'gap' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400">
                  Identified deficits preventing interview shortlisting for high-tier engineering bands:
                </div>
                <div className="space-y-2.5">
                  {selectedRole.missingSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-amber-200 font-semibold">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>{skill}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">EST: 2 WEEKS DEDICATED</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400">
                  High-signal repository ideas to prove production readiness to engineering managers:
                </div>
                <div className="space-y-3">
                  {selectedRole.keyProjects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2"
                    >
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{proj}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Include automated CI/CD unit tests, latency benchmarks, and an architecture diagram.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interview Prep Tab */}
            {activeTab === 'interview' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-200 space-y-1">
                  <div className="font-bold text-white">System Design Mock Question:</div>
                  <p className="text-slate-400">
                    "How would you architect a fault-tolerant model inference proxy with KV cache sharing across distributed worker nodes?"
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-200 space-y-1">
                  <div className="font-bold text-white">Behavioral / Leadership Question:</div>
                  <p className="text-slate-400">
                    "Describe a critical production outage or memory leak you diagnosed under pressure."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Resume & Quick Action (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-amber-400/30 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                Resume ATS Analyzer
              </span>
              <span className="text-[10px] font-mono text-emerald-400">READY</span>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p>
                Astra scans your resume against current market job descriptions to ensure ATS keyword compliance.
              </p>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-mono text-slate-400">
                Current Resume: "Software_Engineer_CV.pdf" (Uploaded)
              </div>
            </div>

            <button
              onClick={() => alert('Astra ATS Optimization: Optimized bullet points generated with STAR framework.')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              Optimize Resume for {selectedRole.role}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
