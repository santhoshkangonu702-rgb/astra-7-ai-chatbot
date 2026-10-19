import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Newspaper,
  GraduationCap,
  Code2,
  FileText,
  Image as ImageIcon,
  Mic,
  BarChart3,
  Sparkles,
  ArrowRight,
  Zap,
  Radio,
  Upload,
  Cpu,
  Layers,
  ChevronRight,
  Globe2,
  Rocket,
  ShieldCheck,
  Bookmark,
  Share2,
  RefreshCw,
  EyeOff,
  Clock,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar,
  Briefcase,
  Database,
  Music,
  MapPin,
  Film
} from 'lucide-react';
import { PowerId, NexusThemeId, UserProfile } from '../../types';
import { AstraCore, AstraCoreState } from './AstraCore';
import { ThemeManager } from './ThemeManager';
import { classifyAstraIntent, AstraIntentMatch } from '../../services/astraBrain';
import { AstraBrainRoutingModal } from './AstraBrainRoutingModal';
import { AstraRoutingVisualizer } from './AstraRoutingVisualizer';
import { BrainRoutingAnimation } from './BrainRoutingAnimation';
import { ControlRoom2040 } from './ControlRoom2040';
import {
  hapticAction,
  hapticSuccess,
  hapticNavClick,
  hapticModeSwitch,
} from '../../utils/haptics';

interface NexusDashboardProps {
  onSelectPower: (power: PowerId) => void;
  onDirectPrompt?: (prompt: string, targetPower: PowerId) => void;
  onOpenVoiceMode?: () => void;
  onOpenUpgrade?: () => void;
  currentTheme: string;
  onSelectTheme: (themeId: NexusThemeId) => void;
  user?: UserProfile | null;
}

export type AstraMode = 'present' | 'future-2040';

interface DiscoveryItem {
  id: string;
  category: string;
  title: string;
  snippet: string;
  source: string;
  time: string;
  isSaved?: boolean;
}

const INITIAL_DISCOVERY_FEED: DiscoveryItem[] = [
  {
    id: 'disc-1',
    category: 'AI & FRONTIER MODELS',
    title: 'Test-Time Compute Scaling Outpaces Traditional Parameter Growth',
    snippet: 'Autonomous verification architectures demonstrate 94.6% accuracy on complex reasoning by allocating dynamic inference compute loops.',
    source: 'arXiv / Labs Benchmark',
    time: '42m ago'
  },
  {
    id: 'disc-2',
    category: 'SCIENCE & BIOTECH',
    title: 'Epigenetic Reversion Validated in Primate Cellular Respiration',
    snippet: 'Transient Yamanaka factor mRNA delivery demonstrates significant microvascular cardiac rejuvenation without oncogenic risk.',
    source: 'Nature Biotechnology',
    time: '2h ago'
  },
  {
    id: 'disc-3',
    category: 'SPACE EXPLORATION',
    title: 'Lunar Gateway Habitation Module Passes Flight Readiness Review',
    snippet: 'NASA Artemis international coalition verifies near-rectilinear halo orbit trajectory for deep space crewed operations.',
    source: 'NASA SLS Manifest',
    time: '3h ago'
  },
  {
    id: 'disc-4',
    category: 'FUTURE 2040 TECH',
    title: 'Solid-State Sand Thermal Storage Reaches 92% Roundtrip Efficiency',
    snippet: 'Municipal district heating networks in Scandinavia successfully balance solar intermittency for 45,000 homes.',
    source: 'Clean Grid Consortium',
    time: '4h ago'
  }
];

export const NexusDashboard: React.FC<NexusDashboardProps> = ({
  onSelectPower,
  onDirectPrompt,
  onOpenVoiceMode,
  currentTheme,
  onSelectTheme,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [coreState, setCoreState] = useState<AstraCoreState>('idle');
  const [astraMode, setAstraMode] = useState<AstraMode>('present');
  const [routingModalOpen, setRoutingModalOpen] = useState(false);
  const [showRoutingVisualizer, setShowRoutingVisualizer] = useState(false);
  const [routingDisplayMode, setRoutingDisplayMode] = useState<'overlay' | 'inline'>('overlay');
  const [activeVisualizerQuery, setActiveVisualizerQuery] = useState('');
  const [detectedIntent, setDetectedIntent] = useState<AstraIntentMatch | null>(null);

  // Discovery Feed State
  const [discoveryItems, setDiscoveryItems] = useState<DiscoveryItem[]>(INITIAL_DISCOVERY_FEED);
  const [followedTags, setFollowedTags] = useState<string[]>(['AI', 'Space', 'Clean Energy']);

  const handleExecutePrompt = (customQuery?: string) => {
    const q = (customQuery || promptInput).trim();
    if (!q) return;

    hapticAction();

    if (customQuery) {
      setPromptInput(customQuery);
    }

    // Use Astra Brain 3.0 to classify intent
    const intent = classifyAstraIntent(q);
    setDetectedIntent(intent);
    setActiveVisualizerQuery(q);
    setCoreState('thinking');
    setShowRoutingVisualizer(true);
  };

  const handleRoutingComplete = (targetPowerId: PowerId, query: string) => {
    hapticSuccess();
    setShowRoutingVisualizer(false);
    setCoreState('idle');
    if (onDirectPrompt) {
      onDirectPrompt(query, targetPowerId);
    } else {
      onSelectPower(targetPowerId);
    }
  };

  const handleProceedFromModal = (powerId: PowerId) => {
    setCoreState('idle');
    if (onDirectPrompt) {
      onDirectPrompt(promptInput, powerId);
    } else {
      onSelectPower(powerId);
    }
  };

  // Section 21: The 6 Main Quick Modules
  const mainQuickModules: Array<{
    id: PowerId;
    title: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
    accent: string;
  }> = [
    {
      id: 'chat',
      title: 'CHAT',
      description: 'Conversational Cognitive Core',
      icon: MessageSquare,
      accent: 'from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-400/30'
    },
    {
      id: 'search',
      title: 'SEARCH',
      description: 'Real-Time Grounded Web',
      icon: Search,
      badge: 'LIVE',
      accent: 'from-cyan-500/20 to-blue-500/5 text-cyan-300 border-cyan-400/30'
    },
    {
      id: 'study',
      title: 'STUDY',
      description: 'Personal Tutor & Learn Loops',
      icon: GraduationCap,
      accent: 'from-emerald-500/20 to-teal-500/5 text-emerald-300 border-emerald-400/30'
    },
    {
      id: 'codelab',
      title: 'CODE',
      description: 'Sandbox & Algorithmic Lab',
      icon: Code2,
      accent: 'from-purple-500/20 to-violet-500/5 text-purple-300 border-purple-400/30'
    },
    {
      id: 'world',
      title: 'WORLD',
      description: 'Live World Intelligence (12 Feeds)',
      icon: Globe2,
      badge: '12 FEEDS',
      accent: 'from-blue-500/20 to-cyan-500/5 text-blue-300 border-blue-400/30'
    },
    {
      id: 'future-lab',
      title: 'FUTURE',
      description: '2030-2040 Tech & Simulations',
      icon: Rocket,
      badge: '2040',
      accent: 'from-pink-500/20 to-amber-500/5 text-pink-300 border-pink-400/30'
    }
  ];

  // Quick Action Shortcuts
  const quickActions: Array<{
    label: string;
    icon: React.ElementType;
    action: () => void;
  }> = [
    { label: 'Astra Data Hub', icon: Database, action: () => onSelectPower('datahub') },
    { label: 'Astra Music', icon: Music, action: () => onSelectPower('music') },
    { label: 'Global & India Intel', icon: Globe2, action: () => onSelectPower('global-intelligence') },
    { label: 'Maps & Places', icon: MapPin, action: () => onSelectPower('maps-places') },
    { label: 'Cinema Studio', icon: Film, action: () => onSelectPower('cinema-studio') },
    { label: 'Astra World', icon: Globe2, action: () => onSelectPower('world') },
    { label: 'Future Lab', icon: Rocket, action: () => onSelectPower('future-lab') },
    { label: 'Future City', icon: Zap, action: () => onSelectPower('future-city') },
    { label: 'Deep Research', icon: FileText, action: () => onSelectPower('research') },
    { label: 'Personal Tutor', icon: GraduationCap, action: () => onSelectPower('study') },
    { label: 'Agent Builder', icon: Cpu, action: () => onSelectPower('agents') },
    { label: 'Creative Studio', icon: ImageIcon, action: () => onSelectPower('create') },
    { label: 'Privacy Center', icon: ShieldCheck, action: () => onSelectPower('settings') },
    { label: 'Data Universe', icon: BarChart3, action: () => onSelectPower('data-analyst') },
    { label: 'Translator', icon: Globe2, action: () => onSelectPower('translator') },
    { label: 'Spatial Mode', icon: Layers, action: () => onSelectPower('spatial') }
  ];

  const handleToggleSaveDiscovery = (id: string) => {
    setDiscoveryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSaved: !item.isSaved } : item))
    );
  };

  const handleHideDiscovery = (id: string) => {
    setDiscoveryItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      id="astra-nexus-dashboard"
      className="w-full min-w-0 max-w-full overflow-x-hidden px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-8 sm:space-y-10 text-slate-100 pb-24 md:pb-12"
    >
      {/* Astra Brain 3.0 Routing Visualization Modal */}
      <AstraBrainRoutingModal
        isOpen={routingModalOpen}
        onClose={() => {
          setRoutingModalOpen(false);
          setCoreState('idle');
        }}
        intentMatch={detectedIntent}
        onProceedToPower={handleProceedFromModal}
      />

      {/* 1. TOP HERO: ASTRA 7 — NEXUS 2040 */}
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        {/* Futuristic Identity Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[11px] font-mono font-semibold text-amber-300 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>ASTRA 7 // NEXUS 2040</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="text-cyan-300">“ONE INTELLIGENCE. EVERY POSSIBILITY.”</span>
        </div>

        {/* Display: ✦ What can I help you explore? */}
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-amber-200 via-white to-cyan-200 bg-clip-text text-transparent">
            ✦ What can I help you explore?
          </span>
        </h1>

        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          Unified cognitive intelligence orchestrating conversation, live planetary data, deep research, coding, and future 2040 technological foresight.
        </p>

        {/* Section 22: PRESENT + FUTURE 2040 TOGGLE */}
        <div className="pt-2 flex items-center justify-center">
          <div className="p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl flex items-center gap-2 shadow-lg">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2 font-bold">
              ASTRA MODE:
            </span>
            <button
              onClick={() => {
                hapticModeSwitch();
                setAstraMode('present');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                astraMode === 'present'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              [ PRESENT ]
            </button>
            <button
              onClick={() => {
                hapticModeSwitch();
                setAstraMode('future-2040');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                astraMode === 'future-2040'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              [ FUTURE 2040 ]
            </button>
          </div>
        </div>

        {/* Mode Explanatory Subtitle */}
        <div className="text-[11px] font-mono text-slate-400 max-w-md">
          {astraMode === 'present' ? (
            <span className="text-cyan-300">
              ● PRESENT ACTIVE: Verified live world data • Grounded breaking news • Current science & market feeds
            </span>
          ) : (
            <span className="text-amber-300">
              ● FUTURE 2040 ACTIVE: Emerging tech research • Scenarios • Smart cities • Space missions • Simulations
            </span>
          )}
        </div>

        {/* Central Search / Universal Prompt Bar OR Inline Brain Routing Animation */}
        {showRoutingVisualizer && detectedIntent && routingDisplayMode === 'inline' ? (
          <div className="w-full max-w-2xl relative pt-2 animate-in fade-in zoom-in-95 duration-300">
            <BrainRoutingAnimation
              mode="inline"
              query={activeVisualizerQuery}
              intentMatch={detectedIntent}
              onCancel={() => {
                setShowRoutingVisualizer(false);
                setCoreState('idle');
              }}
              onComplete={handleRoutingComplete}
            />
          </div>
        ) : (
          <div className="w-full max-w-2xl relative pt-2">
            <div className="relative flex items-center rounded-2xl bg-white/[0.04] border border-amber-400/40 p-1.5 shadow-[0_0_25px_rgba(234,179,8,0.15)] backdrop-blur-xl focus-within:border-amber-300 focus-within:shadow-[0_0_35px_rgba(234,179,8,0.3)] transition-all">
              <Sparkles className="w-5 h-5 text-amber-400 ml-3 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecutePrompt()}
                placeholder={
                  astraMode === 'present'
                    ? 'Ask anything, query live world data, debug code, or analyze research...'
                    : 'Explore 2040 scenarios, quantum computing, humanoid robots, or fusion energy...'
                }
                className="w-full bg-transparent text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none py-2 pr-3"
              />
              <button
                onClick={() => handleExecutePrompt()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex-shrink-0"
                title="Execute with Astra Brain 3.0"
              >
                <span>ASK ASTRA 7</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode selector (Overlay vs Inline Replacement) & Quick Neural Intent Sample Chips */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Routing Display:
                </span>
                <div className="inline-flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setRoutingDisplayMode('overlay')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      routingDisplayMode === 'overlay'
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Overlay
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoutingDisplayMode('inline')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      routingDisplayMode === 'inline'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Replace Content
                  </button>
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hidden sm:inline">
                Astra Brain 3.0 Real-time
              </span>
            </div>

            {/* Quick Neural Intent Sample Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
              <button
                onClick={() => handleExecutePrompt('Explain quantum entanglement step by step with hints')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.03] hover:bg-white/[0.08] text-amber-300 border border-amber-400/20 transition-all flex items-center gap-1.5"
              >
                <span>📚 AI Tutor: Quantum Concepts</span>
              </button>
              <button
                onClick={() => handleExecutePrompt('Show live air quality, weather and planetary telemetry in Tokyo')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.03] hover:bg-white/[0.08] text-cyan-300 border border-cyan-400/20 transition-all flex items-center gap-1.5"
              >
                <span>🌍 World Data: Tokyo Telemetry</span>
              </button>
              <button
                onClick={() => handleExecutePrompt('Architect 2040 clean energy microgrid simulation')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.03] hover:bg-white/[0.08] text-purple-300 border border-purple-400/20 transition-all flex items-center gap-1.5"
              >
                <span>🏙️ Future City: Microgrid Blueprint</span>
              </button>
              <button
                onClick={() => handleExecutePrompt('Research paper citations on room-temperature superconductivity')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.03] hover:bg-white/[0.08] text-emerald-300 border border-emerald-400/20 transition-all flex items-center gap-1.5"
              >
                <span>🔬 Research: Superconductivity Matrix</span>
              </button>
            </div>
          </div>
        )}

        {/* BrainRoutingAnimation Overlay Mode */}
        {showRoutingVisualizer && detectedIntent && routingDisplayMode === 'overlay' && (
          <BrainRoutingAnimation
            mode="overlay"
            query={activeVisualizerQuery}
            intentMatch={detectedIntent}
            onCancel={() => {
              setShowRoutingVisualizer(false);
              setCoreState('idle');
            }}
            onComplete={handleRoutingComplete}
          />
        )}
      </div>

      {/* 2. SECTION 21: MAIN QUICK MODULES GRID */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Primary Capabilities
          </span>
          <span className="text-[10px] font-mono text-cyan-400">ASTRA BRAIN 3.0 READY</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
          {mainQuickModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                id={`nexus-main-module-${mod.id}`}
                onClick={() => onSelectPower(mod.id)}
                className={`group relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br bg-slate-950/70 hover:bg-slate-900/80 border transition-all duration-300 text-left flex items-start justify-between backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 ${mod.accent}`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 min-w-0">
                  <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.05] group-hover:bg-white/[0.1] border border-white/10 transition-colors shadow-inner shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-base font-extrabold tracking-wider text-slate-100 group-hover:text-white truncate">
                        {mod.title}
                      </span>
                      {mod.badge && (
                        <span className="px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {mod.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-300 transition-colors mt-0.5 sm:mt-1 line-clamp-2">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block p-1 rounded-full text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SECTION 21: LARGE FUTURISTIC ASTRA CORE BENEATH MAIN MODULES */}
      <div className="w-full flex flex-col items-center justify-center py-6 text-center space-y-3 max-w-full overflow-hidden">
        <div className="max-w-full flex items-center justify-center overflow-visible">
          <AstraCore
            state={coreState}
            size={typeof window !== 'undefined' && window.innerWidth < 640 ? 210 : 260}
            onClick={() => {
              setCoreState((prev) => (prev === 'idle' ? 'thinking' : 'idle'));
            }}
          />
        </div>
        <div className="text-[11px] font-mono text-slate-400 max-w-xs sm:max-w-md px-4">
          Click Astra Core to trigger neural state synthesis • Status: Active
        </div>
      </div>

      {/* SECTION 59: ASTRA 2040 CONTROL ROOM (LIVE NOW • LOOKING AHEAD • MY WORLD) */}
      <div className="max-w-5xl mx-auto w-full">
        <ControlRoom2040 onSelectPower={onSelectPower} />
      </div>

      {/* 4. SECTION 23: DAILY ASTRA BRIEFING */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-amber-400/25 backdrop-blur-2xl shadow-2xl space-y-5 max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-wide text-white">
                  ASTRA DAILY BRIEFING
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED SOURCES
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Planetary morning briefing: News • AI • Technology • Space • Weather • Markets • Study Reminders
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-cyan-400 hidden sm:block">
            UPDATED TODAY 07:00 UTC
          </span>
        </div>

        {/* Briefing Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-cyan-300 uppercase">Weather & Air Quality</span>
              <span>Sensor Mesh</span>
            </div>
            <div className="text-xs font-bold text-white">Tokyo: 18°C Mild Clear • AQI 22 (Good)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No coastal storm warnings across North Pacific routes today.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-300 uppercase">Global Markets</span>
              <span>Exchange 15s Lag</span>
            </div>
            <div className="text-xs font-bold text-white">S&P 500: 5,912.40 (+0.84%)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Semiconductor infrastructure and cloud AI equipment earnings lead intraday gains.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-purple-300 uppercase">Study Reminder</span>
              <span>Personal Tutor</span>
            </div>
            <div className="text-xs font-bold text-white">Pointers & Memory Allocation Quiz</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Next revision cycle scheduled for today: 3 flagged mistakes to resolve.
            </p>
          </div>
        </div>
      </div>

      {/* 5. SECTION 24: ASTRA DISCOVERY FEED */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/70 border border-cyan-500/25 backdrop-blur-2xl shadow-2xl space-y-5 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-extrabold tracking-wide text-white">
                ASTRA DISCOVERY FEED
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                PERSONALIZED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Follow, Save, Share, Hide, & Refresh high-signal research across AI, Science, Space, & 2040 Tech
            </p>
          </div>

          <button
            onClick={() => alert('Discovery feed refreshed from verified journals.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh Feed</span>
          </button>
        </div>

        {/* Discovery Feed Cards */}
        <div className="space-y-3">
          {discoveryItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/30 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {item.time}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.snippet}</p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-300">{item.source}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSaveDiscovery(item.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      item.isSaved
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                    }`}
                    title={item.isSaved ? 'Saved' : 'Save for later'}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => alert(`Shared link: ${item.title}`)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
                    title="Share item"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleHideDiscovery(item.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
                    title="Hide item"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ASTRA 7 COMPANION & VOICE TRIGGER */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-cyan-500/10 border border-amber-400/25 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden max-w-5xl mx-auto">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 p-[2px] shadow-[0_0_25px_rgba(234,179,8,0.3)] flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <span className="text-lg font-black bg-gradient-to-r from-amber-200 to-cyan-200 bg-clip-text text-transparent">
                  A7
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                  ASTRA 7 COMPANION
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/10 text-cyan-300">
                  ONLINE
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white">
                “Hello! I’m Astra 7, your AI companion. How can I help you today?”
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              if (onOpenVoiceMode) onOpenVoiceMode();
              else onSelectPower('voice');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex-shrink-0"
          >
            <Mic className="w-4 h-4" />
            <span>Talk with Astra</span>
          </button>
        </div>
      </div>

      {/* 7. QUICK ACTIONS BAR */}
      <div className="space-y-3 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Quick Ecosystem Shortcuts
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">RAPID DISPATCH</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <button
                key={i}
                onClick={qa.action}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span>{qa.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. THEME SELECTOR */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl max-w-5xl mx-auto">
        <ThemeManager currentTheme={currentTheme} onSelectTheme={onSelectTheme} />
      </div>
    </div>
  );
};
