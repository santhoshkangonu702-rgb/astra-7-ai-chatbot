import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Zap,
  Clock,
  HardDrive,
  Users,
  Search,
  MessageSquare,
  Landmark,
  Satellite,
  BarChart2,
  TrendingUp,
  FolderKanban,
  FileText,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PowerId, AIAgent } from '../../types';
import { DEFAULT_AGENTS } from '../../data/sampleData';

interface DashboardPowerProps {
  onNavigate: (powerId: PowerId) => void;
  onSelectAgent: (agent: AIAgent) => void;
  onStartChat: (prompt?: string) => void;
}

export const DashboardPower: React.FC<DashboardPowerProps> = ({
  onNavigate,
  onSelectAgent,
  onStartChat
}) => {
  const [activeMetricRange, setActiveMetricRange] = useState<'24h' | '7d' | '30d'>('7d');

  // Usage trends data points for custom SVG chart
  const usagePoints = [
    { label: 'Mon', tokens: 42, requests: 18 },
    { label: 'Tue', tokens: 68, requests: 29 },
    { label: 'Wed', tokens: 85, requests: 44 },
    { label: 'Thu', tokens: 62, requests: 27 },
    { label: 'Fri', tokens: 110, requests: 58 },
    { label: 'Sat', tokens: 94, requests: 46 },
    { label: 'Sun', tokens: 135, requests: 72 }
  ];

  const maxTokens = 150;

  return (
    <div id="dashboard-power" className="flex flex-col gap-6 text-white max-w-7xl mx-auto w-full">
      {/* Top Cosmic System Overview Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet-950/40 via-[#0A0B18] to-cyan-950/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                System Overview
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Quantum Core Active • Latency 14ms
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-cyan-200 bg-clip-text text-transparent">
              Cosmic Intelligence Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Real-time monitoring across seven intelligence dimensions, conversational telemetry, verified antiquities records, and active task pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setActiveMetricRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  activeMetricRange === range
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Quick System Telemetry Bento Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-mono uppercase text-purple-300">Tokens Processed</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">596.2K</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs last cycle</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-mono uppercase text-purple-300">Research Sweeps</span>
              <Search className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">248</div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono mt-1">
              <ShieldCheck className="w-3 h-3" />
              <span>99.4% Source Verified</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-mono uppercase text-purple-300">Curated Antiquities</span>
              <Landmark className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">5,000+</div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              Verified Museum Records
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-mono uppercase text-purple-300">Cosmos Satellites</span>
              <Satellite className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">12,480</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              Live orbital track active
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Charts & Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Futuristic Usage & Activity Charts */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Futuristic Activity & Token Graph */}
          <div className="p-6 rounded-2xl bg-[#0A0B18] border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  AI Compute & Token Stream Velocity
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Quantum token throughput across generative and multi-modal models
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Tokens (k)
                </span>
                <span className="flex items-center gap-1.5 text-violet-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                  Queries
                </span>
              </div>
            </div>

            {/* Custom SVG Gradient Bar & Area Chart */}
            <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
              {usagePoints.map((item, idx) => {
                const tokenHeight = (item.tokens / maxTokens) * 100;
                const reqHeight = (item.requests / maxTokens) * 100 * 1.5;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Token Bar */}
                      <div
                        className="w-4 sm:w-6 rounded-t-md bg-gradient-to-t from-violet-600 via-purple-500 to-cyan-400 group-hover:brightness-125 transition-all relative"
                        style={{ height: `${tokenHeight}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {item.tokens}k
                        </div>
                      </div>

                      {/* Request Bar */}
                      <div
                        className="w-2 sm:w-3 rounded-t-md bg-cyan-500/50 group-hover:bg-cyan-400 transition-all relative"
                        style={{ height: `${reqHeight}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 font-mono mt-4 pt-1">
              <span>Peak Capacity: 135K tokens/day</span>
              <span className="text-cyan-400 font-semibold">Average Generation Latency: 420ms</span>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigate('search')}
              className="p-5 rounded-2xl bg-[#0A0B18] border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                Deep Research Hub
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Multi-source academic sweeps with reliability scoring and claim fact-checking.
              </p>
            </div>

            <div
              onClick={() => onNavigate('history')}
              className="p-5 rounded-2xl bg-[#0A0B18] border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                Ancient Objects System
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Verified antiquities, authentic museum photographs, 10,000 BCE timeline, and site map.
              </p>
            </div>

            <div
              onClick={() => onNavigate('cosmos')}
              className="p-5 rounded-2xl bg-[#0A0B18] border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Satellite className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                Astra Cosmos
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Earth vector models, ISS & JWST orbital telemetry, planetary physical features.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Active Agents & Recent Workflows */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active AI Agents Status Panel */}
          <div className="p-6 rounded-2xl bg-[#0A0B18] border border-white/10 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                Active Specialized Agents
              </h3>
              <button
                onClick={() => onNavigate('agents')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {DEFAULT_AGENTS.slice(0, 5).map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => onSelectAgent(agent)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: `${agent.color}25`, border: `1px solid ${agent.color}50`, color: agent.color }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono line-clamp-1">
                        {agent.role}
                      </div>
                    </div>
                  </div>

                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('agents')}
              className="w-full mt-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-xs text-purple-300 font-medium border border-violet-500/30 transition-colors"
            >
              Open Agent Matrix ({DEFAULT_AGENTS.length} Specialized Cores)
            </button>
          </div>

          {/* Recent Research Tasks & Conversations */}
          <div className="p-6 rounded-2xl bg-[#0A0B18] border border-white/10 shadow-xl flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Intelligence Workflows
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { title: 'Antikythera Mechanism Gear Epigraphy', time: '14 mins ago', type: 'History' },
                { title: 'JWST Exoplanet Atmospheric Spectra Analysis', time: '1 hour ago', type: 'Cosmos' },
                { title: 'Bronze Age Trade Route Disruption Chronology', time: '3 hours ago', type: 'Scholar' },
                { title: 'Satellite Collision Vector Calculation', time: 'Yesterday', type: 'Code' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onStartChat(`Review recent investigation regarding: ${item.title}`)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {item.time} • Dimension: {item.type}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
