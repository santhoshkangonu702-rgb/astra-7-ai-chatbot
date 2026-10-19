import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
  Globe,
  Share2,
  Bookmark,
  TrendingUp,
  Cpu,
  RefreshCw,
  Eye,
  Filter,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { api } from '../../services/api';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  timeAgo: string;
  readTime: string;
  imageUrl?: string;
  tags: string[];
  trendingScore: number;
  content: string;
  relatedStories: string[];
}

const NEWS_CATEGORIES = [
  'Top News',
  'India',
  'World',
  'Technology',
  'AI',
  'Business',
  'Sports',
  'Science',
  'Entertainment',
  'Education',
];

const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Quantum Advantage Milestone: 10,000 Qubit Fault-Tolerant Processor Achieved',
    summary: 'Global research consortia announce operational error-mitigated quantum computing with applications across molecular simulation and zero-carbon energy capture.',
    category: 'Technology',
    source: 'Quantum Chrono & MIT Tech',
    timeAgo: '18m ago',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    tags: ['Quantum', 'DeepTech', 'Supercomputing'],
    trendingScore: 99,
    content: 'Global quantum laboratories have officially validated a 10,000-qubit fault-tolerant quantum architecture. Operating with silicon photonic interconnects and continuous topological error correction, the system achieved stable simulation of nitrogenase enzymes at room-temperature equivalent parameters—a breakthrough for synthetic fertilizers and room-temperature superconducting substrates.',
    relatedStories: [
      'Topological Qubits Break Decoherence Barrier',
      'Optical Quantum Interconnects at Exascale'
    ]
  },
  {
    id: 'news-2',
    title: 'Autonomous AI Orchestration Engines Deployed Across Global Space Grid',
    summary: 'Satellite constellation telemetries transition to real-time decentralized neural mesh networks for orbital debris avoidance and asteroid deflection tracking.',
    category: 'AI',
    source: 'Astra Planetary Observatory',
    timeAgo: '42m ago',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    tags: ['AI Mesh', 'Astrophysics', 'Satellites'],
    trendingScore: 97,
    content: 'Low Earth Orbit constellations comprising over 40,000 active nodes have commenced coordinated neural autonomy. Through onboard neural accelerators operating under sub-10-watt solar budgets, satellites make collision avoidance maneuvers and optical crosslink adjustments autonomously in under 3 milliseconds without waiting for ground telemetry confirmation.',
    relatedStories: [
      'Deep Space Optical Communications Exceed 2.5 Gbps',
      'Solar Storm Early Warning Neural Mesh Validation'
    ]
  },
  {
    id: 'news-3',
    title: 'India Launches Next-Gen Solar Hyper-Grid & Green Hydrogen Corridor',
    summary: 'National renewable initiative integrates 250GW gigawatt solar arrays with direct oceanic desalination and high-purity hydrogen generation across Gujarat and Rajasthan.',
    category: 'India',
    source: 'Press Trust of India & Mint',
    timeAgo: '1h ago',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    tags: ['India', 'Clean Energy', 'Solar Infrastructure'],
    trendingScore: 95,
    content: 'In one of the largest infrastructure undertakings of the decade, India has integrated a unified ultra-high voltage direct current (UHVDC) solar supergrid connecting high-irradiance western desert zones directly with coastal electrolysis hubs, providing green industrial power and surplus desalted freshwater.',
    relatedStories: [
      'ISRO Prepares Shukrayaan Venus Atmospheric Probe',
      'Unified Digital Public Infrastructure Expands to 30 Global Nations'
    ]
  },
  {
    id: 'news-4',
    title: 'Fusion Power Plant Commercial Pilot Generates Net-Positive Megawatts for 30 Consecutive Days',
    summary: 'Magnetic confinement tokamak reactors sustain continuous Q=15 plasma discharge, marking a historic turning point for zero-emission baseload power grids.',
    category: 'Science',
    source: 'Global Energy Review',
    timeAgo: '2h ago',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    tags: ['Nuclear Fusion', 'Clean Energy', 'Physics'],
    trendingScore: 94,
    content: 'The reactor recorded an uninterrupted 720-hour steady burn with high-temperature superconducting magnets maintaining magnetic containment at negligible cryogenic power draw. Grid operators in Scandinavia have begun integrating the output into urban heating networks.',
    relatedStories: [
      'Superconducting YBCO Tapes Double Production Throughput',
      'Tritium Breeding Blankets Show 118% Efficiency'
    ]
  },
  {
    id: 'news-5',
    title: 'Global Chip Consortium Standardizes 1-Nanometer Optical Compute Architecture',
    summary: 'Semiconductor manufacturers adopt hybrid silicon-photonic co-packaged optics, cutting data center power consumption by 68%.',
    category: 'Business',
    source: 'Bloomberg & Nikkei Asia',
    timeAgo: '3h ago',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    tags: ['Semiconductors', 'Photonics', 'Markets'],
    trendingScore: 91,
    content: 'Semiconductor giants have unified their standard specifications for sub-nanometer monolithic optical engines. By swapping copper traces with photonic waveguides right at the silicon die boundary, latency drops into picoseconds while dramatically lowering cooling overhead.',
    relatedStories: [
      'Advanced Packaging Investments Surge by $45 Billion',
      'Automated Lithography Calibrations Reach Sub-Angstrom Precision'
    ]
  },
  {
    id: 'news-6',
    title: 'Adaptive Neural Tutoring Revolutionizes Higher Education Across 80 Nations',
    summary: 'Universities report 40% reduction in dropout rates as personalized cognitive AI tutors adapt real-time curricula to individual learning curves.',
    category: 'Education',
    source: 'World Academic Forum',
    timeAgo: '4h ago',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    tags: ['Education', 'Cognitive AI', 'Learning Paths'],
    trendingScore: 89,
    content: 'Empirical studies across leading engineering and medical faculties demonstrate that micro-tailored pedagogical feedback—praising effort and stepping through proofs hierarchically—accelerates complex conceptual mastery without causing cognitive burnout.',
    relatedStories: [
      'Interactive Step-by-Step Science Labs Accessible on Low-End Hardware',
      'Open Scholarly Credentials Formally Recognized by Global Consortia'
    ]
  }
];

export const NewsPower: React.FC<{
  onSelectArticleTopic?: (topic: string) => void;
  onBack?: () => void;
}> = ({ onSelectArticleTopic, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Top News');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(INITIAL_ARTICLES[0]);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleSaveArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'Top News' ||
      article.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="astra-news-portal" className="h-full flex flex-col overflow-hidden text-slate-100">
      {/* Top Header & Search Bar */}
      <div className="p-4 md:p-6 border-b border-amber-500/15 bg-slate-950/60 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0 mr-1"
                title="Return to Astra 7 Home"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Back</span>
              </button>
            )}
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>ASTRA NEWS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  LIVE 2040 FEED
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Verified global intelligence, technology breakthroughs & real-time updates
              </p>
            </div>
          </div>
        </div>

        {/* Search Input & Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, topics, keywords..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all"
            />
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 transition-all ${
              isRefreshing ? 'animate-spin text-amber-300' : ''
            }`}
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="px-4 md:px-6 py-2.5 border-b border-white/5 bg-slate-950/40 backdrop-blur-sm overflow-x-auto scrollbar-none flex items-center gap-2">
        {NEWS_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                  : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Content Layout: Grid + Reading Drawer / Modal */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* News Cards Grid */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
              Showing {filteredArticles.length} Stories in {selectedCategory}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time Indexing</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              const isActive = activeArticle?.id === article.id;
              const isSaved = savedArticleIds.includes(article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                    isActive
                      ? 'bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-amber-400/60 shadow-[0_0_25px_rgba(234,179,8,0.2)]'
                      : 'bg-slate-950/60 hover:bg-slate-900/80 border-white/10 hover:border-amber-400/30'
                  }`}
                >
                  {/* Article Thumbnail Image */}
                  {article.imageUrl && (
                    <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                        {article.category}
                      </div>
                      <button
                        onClick={(e) => toggleSaveArticle(article.id, e)}
                        className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all ${
                          isSaved
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-950/60 text-slate-300 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove Bookmark' : 'Save Article'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1.5">
                        <span className="font-semibold text-amber-300/90">{article.source}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.timeAgo}
                        </span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-200 line-clamp-2 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    {/* Tags & Action Bar */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {article.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 text-[10px]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-amber-300 font-semibold flex items-center gap-1 text-[11px]">
                        Read Story
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Article Reading & Intelligence Inspector (Right Panel) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-0">
          {activeArticle ? (
            <div className="rounded-2xl bg-slate-950/80 border border-amber-500/20 p-5 backdrop-blur-xl shadow-2xl flex flex-col h-[calc(100vh-210px)] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  ASTRA INTELLIGENCE DISPATCH
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30">
                  {activeArticle.trendingScore}% IMPACT SCORE
                </span>
              </div>

              {/* Title & Metadata */}
              <h2 className="text-lg font-extrabold text-white leading-snug mb-3">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                <span className="font-semibold text-cyan-300">{activeArticle.source}</span>
                <span>•</span>
                <span>{activeArticle.timeAgo}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>

              {/* Full Article Content Preview */}
              <div className="prose prose-invert prose-sm text-xs text-slate-300 leading-relaxed space-y-3 mb-6">
                <p className="font-medium text-slate-200 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  {activeArticle.summary}
                </p>
                <p>{activeArticle.content}</p>
              </div>

              {/* Related Stories */}
              {activeArticle.relatedStories && activeArticle.relatedStories.length > 0 && (
                <div className="mt-auto pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Correlated Signals
                  </h4>
                  <div className="space-y-2">
                    {activeArticle.relatedStories.map((related, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (onSelectArticleTopic) onSelectArticleTopic(related);
                        }}
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 cursor-pointer text-xs text-slate-300 hover:text-amber-200 transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{related}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Newspaper className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-xs">Select any article to read the full intelligence dispatch</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
