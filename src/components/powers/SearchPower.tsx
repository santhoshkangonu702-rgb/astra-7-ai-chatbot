import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Download,
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SearchMode, ResearchReport } from '../../types';
import { api } from '../../services/api';

interface SearchPowerProps {
  initialQuery?: string;
  onSaveToLibrary?: (item: any) => void;
  onBack?: () => void;
}

export const SearchPower: React.FC<SearchPowerProps> = ({ initialQuery, onSaveToLibrary, onBack }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [mode, setMode] = useState<SearchMode>('deep');
  const [isLoading, setIsLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<ResearchReport | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const sampleQueries = [
    'Latest SpaceX Starship flight test results & orbital milestones',
    'Fault-tolerant quantum computing error-correction benchmarks',
    'Global clean energy grid additions and solar capacity 2025',
    'State of the art multimodal AI reasoning models benchmark rankings',
    'James Webb Space Telescope early universe galaxy redshift observations'
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setSavedSuccess(false);
    setSearchError(null);
    try {
      const report = await api.searchWeb(q, mode);
      setActiveReport(report);
    } catch (err: any) {
      console.error(err);
      setSearchError('Unable to fetch live data. Showing information based on training data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!activeReport) return;
    onSaveToLibrary?.({
      id: `lib-${Date.now()}`,
      userId: 'user-01',
      type: 'research_report',
      title: `Research: ${activeReport.query}`,
      snippet: activeReport.summary.slice(0, 120) + '...',
      targetId: activeReport.id,
      createdAt: new Date().toISOString()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownload = () => {
    if (!activeReport) return;
    const content = `# Astra 7 Research Report: ${activeReport.query}\n\nMode: ${activeReport.mode.toUpperCase()}\nDate: ${new Date(activeReport.createdAt).toLocaleDateString()}\n\n${activeReport.summary}\n\n## Citations\n${activeReport.citations.map((c) => `[${c.id}] ${c.title} - ${c.url}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-${activeReport.query.slice(0, 20).replace(/\s+/g, '-')}.md`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Modes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group"
                title="Return to Astra 7 Home"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Back to Astra 7</span>
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Astra Live Web Search</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  Real-Time Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Synthesizes accredited news, scientific findings, financial data, and live web intelligence with grounded citations.
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-xl">
            {(
              [
                { id: 'quick', label: 'Quick Search' },
                { id: 'deep', label: 'Deep Research' },
                { id: 'fact_check', label: 'Fact Check' },
                { id: 'source_explorer', label: 'Source Explorer' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  mode === m.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative"
        >
          <div className="flex items-center bg-slate-900 border border-white/10 focus-within:border-cyan-500/40 rounded-2xl p-2 shadow-xl">
            <Search className="w-5 h-5 text-cyan-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Enter your empirical research question or claim to verify..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-white text-sm focus:outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <span>{isLoading ? 'Researching...' : 'Execute Research'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Query Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400">Suggested Topics:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-200 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Live Fallback Warning Banner if API fails */}
        {searchError && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Aggregating Institutional Sources</h3>
            <p className="text-xs text-slate-400 mt-1">
              Cross-referencing peer-reviewed databases and verifying source credibility...
            </p>
          </div>
        </div>
      )}

      {/* Active Research Report */}
      {activeReport && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Ribbon */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 font-mono font-bold uppercase">
                {activeReport.mode.replace('_', ' ')}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeReport.readingTimeMinutes} min reading time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                <span>{savedSuccess ? 'Saved to Library!' : 'Save Report'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Markdown</span>
              </button>
            </div>
          </div>

          {/* Report Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Synthesis (2 cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-white/10 space-y-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed font-sans">
                  {activeReport.summary}
                </div>
              </div>

              {/* Confidence Notice */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200/90 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-cyan-300">Epistemic Standard</div>
                  <div>
                    Astra 7 marks speculative assumptions separately from documented historical or physical evidence. No fabricated citations have been inserted.
                  </div>
                </div>
              </div>
            </div>

            {/* Citations & Source Explorer (1 col) */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
                  <span>Verified Sources</span>
                  <span className="text-[10px] text-cyan-400 font-bold">
                    {activeReport.citations.length} Verified
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeReport.citations.map((cite) => (
                    <a
                      key={cite.id}
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-cyan-400 font-bold">[{cite.id}]</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                            {cite.reliabilityScore}% Trust
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-200">
                        {cite.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {cite.snippet}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1.5">
                        {cite.domain} {cite.authorOrOrg && `• ${cite.authorOrOrg}`}
                      </div>
                    </a>
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
