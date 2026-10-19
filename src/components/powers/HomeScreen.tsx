import React, { useState } from 'react';
import {
  MessageSquare,
  Wrench,
  Sparkles,
  PenTool,
  GraduationCap,
  Lightbulb,
  FileText,
  Code2,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  ChevronDown,
  Star,
  Check,
  Search,
  Globe,
  Loader2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { PowerId, HistoricalObject } from '../../types';
import { AstraMascotHero } from '../AstraMascotHero';
import { AstraLogo } from '../AstraLogo';
import { api } from '../../services/api';
import { ChatMarkdown } from '../chat/ChatMarkdown';

interface HomeScreenProps {
  onSelectPower: (power: PowerId) => void;
  onSelectObject?: (obj: HistoricalObject) => void;
  onDirectPrompt?: (prompt: string, targetPower: PowerId) => void;
  onOpenVoiceMode?: () => void;
  featuredObject?: HistoricalObject;
  databaseStats?: { totalObjects: number; verifiedObjects: number };
  onOpenUpgrade?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPower,
  onDirectPrompt,
  onOpenUpgrade,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [universalResult, setUniversalResult] = useState<{
    query: string;
    answer: string;
    sources: any[];
    category: string;
    toolRequired: string;
    answerMode: string;
    executionTimeMs?: number;
    cached?: boolean;
  } | null>(null);

  const universalTopics = [
    { label: 'Science', icon: '🔬', query: 'How does CRISPR gene editing work in modern biology?' },
    { label: 'Technology', icon: '💻', query: 'How do WebSockets and HTTP/2 multiplexing differ in performance?' },
    { label: 'Mathematics', icon: '🧮', query: 'Find the derivative of f(x) = x^3 * e^(2x) with step-by-step explanation.' },
    { label: 'History', icon: '🏛️', query: 'What were the major factors leading to the fall of the Western Roman Empire?' },
    { label: 'Business', icon: '📈', query: 'Explain the difference between venture capital equity and debt financing.' },
    { label: 'Current News', icon: '📰', query: 'What are the latest developments in nuclear fusion energy research?' },
    { label: 'Programming', icon: '⚡', query: 'Write a TypeScript function to debounce an async search input.' },
    { label: 'తెలుగు', icon: '🌐', query: 'సౌర వ్యవస్థలోని గ్రహాల గురించి క్లుప్తంగా వివరించండి.' },
    { label: 'हिंदी', icon: '🇮🇳', query: 'क्वांटम कंप्यूटिंग और शास्त्रीय कंप्यूटिंग में मुख्य अंतर क्या हैं?' }
  ];

  const handleExecuteUniversalSearch = async (queryToRun: string) => {
    const q = queryToRun.trim();
    if (!q) return;

    setCustomPrompt(q);
    setIsSearching(true);
    setUniversalResult(null);

    try {
      const res = await api.universalSearch(q, { answerLength: 'balanced' });
      if (res && res.answer) {
        setUniversalResult({
          query: q,
          answer: res.answer,
          sources: res.sources || [],
          category: res.category || 'GENERAL_KNOWLEDGE',
          toolRequired: res.toolRequired || 'ai_knowledge',
          answerMode: res.answerMode || 'rhythm',
          executionTimeMs: res.executionTimeMs,
          cached: res.cached
        });
      } else {
        // Fallback to chat if search endpoint yields empty
        if (onDirectPrompt) {
          onDirectPrompt(q, 'chat');
        } else {
          onSelectPower('chat');
        }
      }
    } catch (err) {
      console.warn('Universal search error, falling back to chat:', err);
      if (onDirectPrompt) {
        onDirectPrompt(q, 'chat');
      } else {
        onSelectPower('chat');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) {
      onSelectPower('chat');
      return;
    }
    handleExecuteUniversalSearch(customPrompt);
  };

  // 8 Core Tools matching user spec
  const tools = [
    {
      id: 'tool-assistant' as PowerId,
      name: 'AI Assistant',
      desc: 'Multipurpose reasoning, deep answers, brainstorming, and research synthesis.',
      icon: Sparkles,
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Reasoning',
      border: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    },
    {
      id: 'tool-writer' as PowerId,
      name: 'AI Writer',
      desc: 'Draft essays, blogs, emails, social captions, and polish grammar with ease.',
      icon: PenTool,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Writing',
      border: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    },
    {
      id: 'tool-study' as PowerId,
      name: 'Study Assistant',
      desc: 'Step-by-step problem solver, interactive flashcards, notes, and quiz tests.',
      icon: GraduationCap,
      color: 'from-amber-500 to-orange-500',
      badge: 'Education',
      border: 'hover:border-amber-300 dark:hover:border-amber-700',
    },
    {
      id: 'tool-ideas' as PowerId,
      name: 'Idea Generator',
      desc: 'Startup ideas, app concepts, project topics, and business model blueprints.',
      icon: Lightbulb,
      color: 'from-pink-500 to-rose-500',
      badge: 'Innovation',
      border: 'hover:border-pink-300 dark:hover:border-pink-700',
    },
    {
      id: 'tool-resume' as PowerId,
      name: 'Resume Builder',
      desc: 'Create job-winning resumes, optimize bullet points, and export ATS templates.',
      icon: FileText,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Career',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    },
    {
      id: 'tool-code' as PowerId,
      name: 'Code Assistant',
      desc: 'Write, debug, explain, improve, and convert code in 9+ languages with syntax highlighting.',
      icon: Code2,
      color: 'from-purple-500 to-violet-600',
      badge: 'Developer',
      border: 'hover:border-purple-300 dark:hover:border-purple-700',
    },
    {
      id: 'tool-image' as PowerId,
      name: 'Image Creator',
      desc: 'Transform text prompts into stunning 3D, anime, realistic, or concept artwork.',
      icon: ImageIcon,
      color: 'from-rose-500 to-pink-600',
      badge: 'Visual AI',
      border: 'hover:border-rose-300 dark:hover:border-rose-700',
    },
    {
      id: 'tool-more' as PowerId,
      name: 'More Tools',
      desc: 'Spreadsheet analyzer, ancient archaeology database, satellite cosmos, and vision AI.',
      icon: Layers,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Suite',
      border: 'hover:border-blue-300 dark:hover:border-blue-700',
    },
  ];

  // Quick Action Chips from Section 4 of spec
  const quickActionChips = [
    { label: 'AI Chat', power: 'chat' as PowerId, icon: MessageSquare },
    { label: 'Image Generation', power: 'tool-image' as PowerId, icon: ImageIcon },
    { label: 'Code Assistant', power: 'tool-code' as PowerId, icon: Code2 },
    { label: 'Study Helper', power: 'tool-study' as PowerId, icon: GraduationCap },
    { label: 'More Tools', power: 'tools' as PowerId, icon: Wrench },
  ];

  // FAQ Items
  const faqItems = [
    {
      q: 'What makes Astra 7 different from standard AI chatbots?',
      a: 'Astra 7 is a unified, multi-engine platform that brings together dedicated student study modes, ATS resume generation, multi-language coding, visual creation, and conversational reasoning in a single clean interface without subscriptions scatter.',
    },
    {
      q: 'How does the Study Assistant help students learn?',
      a: 'The Study Assistant breaks down complex concepts into step-by-step Socratic walkthroughs, generates interactive flashcards with flip testing, and produces customized quizzes across mathematics, sciences, programming, and humanities.',
    },
    {
      q: 'Can I export resumes created in the Resume Builder?',
      a: 'Yes! The Resume Builder provides ATS-compatible templates (Modern Gradient, Executive Classic, Tech Minimal), instant previewing, and direct printing or PDF export.',
    },
    {
      q: 'Which programming languages are supported in the Code Assistant?',
      a: 'Astra 7 natively supports Python, JavaScript, TypeScript, React, HTML/CSS, Java, C, C++, and SQL for generation, debugging, explanation, formatting, and language-to-language translation.',
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes. Astra 7 proxies all model queries through secure backend endpoints. Your sensitive API credentials and personal notes are never exposed in client bundles.',
    },
    {
      q: 'Can I use Astra 7 on mobile devices?',
      a: 'Astra 7 is designed with a responsive mobile bottom navigation bar and touch-optimized controls for phones, tablets, and desktops.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden pt-6 pb-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Soft pastel ambient background blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/30 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-cyan-200/40 to-blue-200/30 dark:from-cyan-950/30 dark:to-blue-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subheadline, Description, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Astra Brain 2.0 • Ultra-Fast Answer & Universal Search Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Astra 7</span>
            </h1>

            {/* Subheadline & Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Ask almost any question in science, technology, code, history, math, or current news. Receive fast, beautifully structured answers grounded in verified facts.
            </p>

            {/* Universal Search Box */}
            <div className="space-y-3 max-w-xl mx-auto lg:mx-0">
              <form
                onSubmit={handleHeroSubmit}
                className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-lg shadow-indigo-500/5 border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 transition-all"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-4 h-4 text-indigo-500" />
                </div>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ask Astra anything... (Science, Code, History, News, Math)"
                  className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shrink-0 shadow-md shadow-indigo-500/20 transition-transform active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <span>Instant Search</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Universal Domain Topic Quick Selectors */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">Topics:</span>
                {universalTopics.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => handleExecuteUniversalSearch(topic.query)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 shadow-xs transition-colors"
                  >
                    <span>{topic.icon}</span>
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Answer Result Card */}
            {isSearching && (
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-indigo-500/30 shadow-xl max-w-xl mx-auto lg:mx-0 flex items-center gap-3 animate-pulse">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin shrink-0" />
                <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                  Astra Brain 2.0 is routing query, checking live verified sources, and synthesizing structured answer...
                </div>
              </div>
            )}

            {universalResult && !isSearching && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-500/30 shadow-2xl max-w-2xl mx-auto lg:mx-0 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                      {universalResult.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{universalResult.toolRequired}</span>
                    </span>
                    {universalResult.cached && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                        ⚡ Instant Cache
                      </span>
                    )}
                    {universalResult.executionTimeMs && (
                      <span className="text-slate-400 text-[10px]">
                        {universalResult.executionTimeMs}ms
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setUniversalResult(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                  Q: {universalResult.query}
                </div>

                {/* Structured rhythm response */}
                <div className="text-xs sm:text-sm max-h-72 overflow-y-auto pr-1">
                  <ChatMarkdown content={universalResult.answer} />
                </div>

                {/* Grounded Sources */}
                {universalResult.sources && universalResult.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-indigo-400" />
                      <span>Verified Sources Grounded:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {universalResult.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 text-[10px] text-slate-600 dark:text-slate-300 transition-colors"
                        >
                          <span className="truncate max-w-[150px]">{s.title || s.domain}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow up in Chat */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Want to explore deeper or ask follow-ups?</span>
                  <button
                    onClick={() => {
                      if (onDirectPrompt) {
                        onDirectPrompt(universalResult.query, 'chat');
                      } else {
                        onSelectPower('chat');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 flex items-center gap-1 shadow-sm"
                  >
                    <span>Open in Full Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Call-to-action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onSelectPower('chat')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start Chat</span>
              </button>
              <button
                onClick={() => onSelectPower('tools')}
                className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 text-cyan-500" />
                <span>Explore AI Tools</span>
              </button>
            </div>

            {/* Feature Shortcuts / Quick Action Chips */}
            <div className="pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Quick Shortcuts
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {quickActionChips.map((chip) => {
                  const ChipIcon = chip.icon;
                  return (
                    <button
                      key={chip.label}
                      onClick={() => onSelectPower(chip.power)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium shadow-sm transition-colors"
                    >
                      <ChipIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Mascot Robot Visual */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <AstraMascotHero className="w-full max-w-[420px]" />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8 AI TOOLS GRID */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Unified AI Toolkit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Eight Creative Engines. Infinite Output.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Every tool is fully interactive and powered by deep intelligent reasoning. Pick a tool to begin immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onSelectPower(tool.id)}
                className={`group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 ${tool.border} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* WHY ASTRA 7? */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why Astra 7?
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for Speed, Deep Learning, and Polish
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Built from first principles for students, creative writers, and engineers who demand precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Sub-Second Responses</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrated with smart fallback cascades to ensure zero downtime even during high model demand spikes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pedagogical Tutoring</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Explains concepts step-by-step with practical examples and Socratic questions rather than just dumping answers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Secure Architecture</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Backend-only API resolution keeps your credentials safe and local storage keeps your work persistent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* AUDIENCE BENEFITS: Students, Creators, Developers */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Tailored Experiences
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for How You Think and Work
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Column */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">For Students</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Master complex STEM coursework, prepare for exams, and retain knowledge with spaced repetition.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Step-by-step calculus, physics, and chemistry solutions',
                  'Interactive flip flashcards with quiz self-testing',
                  'Automatic concept notes and high-yield summaries',
                  'Homework assistant with Socratic guidance'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onSelectPower('tool-study')}
              className="mt-8 w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold transition-colors"
            >
              Open Study Assistant
            </button>
          </div>

          {/* Creator Column */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">For Creators</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Generate high-converting copy, explore fresh startup concepts, and synthesize artwork in seconds.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Blog articles, newsletters, and essay drafts',
                  'Viral social captions tailored by platform and tone',
                  'Startup ideation engine with feasibility grading',
                  'Multi-style visual art generation from text prompts'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onSelectPower('tool-writer')}
              className="mt-8 w-full py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 text-xs font-bold transition-colors"
            >
              Open AI Writer
            </button>
          </div>

          {/* Developer Column */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">For Developers</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Write clean code, debug syntax errors, convert between languages, and accelerate engineering velocity.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Full-stack JavaScript, TypeScript, Python, and SQL support',
                  'Actionable bug diagnostics and refactoring hints',
                  'Language-to-language conversion with explanations',
                  'ATS-compliant resume generator for tech roles'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onSelectPower('tool-code')}
              className="mt-8 w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 text-xs font-bold transition-colors"
            >
              Open Code Assistant
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TESTIMONIALS */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Community Reviews
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Loved by Students, Builders, and Researchers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                “The Study Assistant completely transformed my Organic Chemistry prep. The flashcards and step-by-step problem solver explained reactions better than my textbook.”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs">
                  AR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Alex Rivera</div>
                  <div className="text-[10px] text-slate-500">Biochemistry Student</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                “I drafted my entire product pitch and built my engineering resume in Astra 7 in one afternoon. The ATS template got me 4 callbacks in two weeks.”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center font-bold text-xs">
                  DK
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">David Kim</div>
                  <div className="text-[10px] text-slate-500">Frontend Engineer</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                “The AI Writer is my daily driver for research summaries and newsletter drafts. It strikes the exact professional tone I need without generic fluff.”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs">
                  MP
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Maya Patel</div>
                  <div className="text-[10px] text-slate-500">Content Strategist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FAQ SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Frequently Asked Questions
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Got Questions? We’ve Got Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CALL TO ACTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-8 sm:p-12 text-center text-white shadow-xl shadow-indigo-500/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Think and Create Beyond?
            </h2>
            <p className="text-sm sm:text-base text-white/90">
              Join thousands of students, builders, and professionals who accelerate their learning and creative output with Astra 7.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onSelectPower('chat')}
                className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Launch Free Chat
              </button>
              <button
                onClick={() => onSelectPower('tools')}
                className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-sm border border-white/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore All 8 Tools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <AstraLogo size={32} showText tagline="secondary" />
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Astra 7 is your all-in-one AI companion — empowering students, developers, and creators to achieve more every day.
            </p>
            <div className="text-[11px] text-slate-400">
              &copy; {new Date().getFullYear()} Astra 7 Platform. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Product Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onSelectPower('tool-study')} className="hover:text-indigo-600 transition-colors">
                  Study Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPower('tool-writer')} className="hover:text-indigo-600 transition-colors">
                  AI Writer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPower('tool-code')} className="hover:text-indigo-600 transition-colors">
                  Code Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPower('tool-resume')} className="hover:text-indigo-600 transition-colors">
                  Resume Builder
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPower('tool-image')} className="hover:text-indigo-600 transition-colors">
                  Image Creator
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onSelectPower('profile')} className="hover:text-indigo-600 transition-colors">
                  About Astra 7
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPower('settings')} className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPower('settings')} className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPower('chat')} className="hover:text-indigo-600 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
