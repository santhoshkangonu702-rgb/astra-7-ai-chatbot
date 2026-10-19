import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Bookmark,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Cpu,
  Users,
  ArrowRight,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { IdeaCard } from '../../types';

export const IdeaGeneratorTool: React.FC = () => {
  const [category, setCategory] = useState('startup');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [ideas, setIdeas] = useState<IdeaCard[]>([
    {
      id: 'idea-seed-1',
      title: 'MentorGrid: Peer-to-Peer STEM Tutoring',
      tagline: 'Connect university upperclassmen with high schoolers for verified micro-mentorship.',
      category: 'startup',
      description: 'A platform that matches high school students facing challenging calculus or physics problems with top university engineering majors for 15-minute live whiteboard walk-throughs.',
      targetAudience: 'High school students, college undergraduates',
      feasibilityScore: 94,
      monetization: '15% platform match fee + subscription for unlimited messaging',
      keyFeatures: [
        'Real-time collaborative canvas',
        'Subject verified mentor credentials',
        'Socratic hint recorder',
        'Automatic study note transcript'
      ],
      techStack: ['React', 'WebRTC', 'Tailwind', 'Node.js', 'PostgreSQL']
    },
    {
      id: 'idea-seed-2',
      title: 'GreenPath: Carbon Footprint Micro-Habits',
      tagline: 'Gamified climate actions with rewards at local eco-conscious businesses.',
      category: 'app',
      description: 'Mobile app tracking daily lifestyle decisions (transit choices, meal planning, home energy) and turning carbon reductions into discounts at local cafes and markets.',
      targetAudience: 'Eco-conscious Gen Z and young professionals',
      feasibilityScore: 88,
      monetization: 'Local merchant sponsorship & affiliate partnership commissions',
      keyFeatures: [
        'Barcode scanner for sustainable goods',
        'Community impact leaderboard',
        'Automated receipt scanner',
        'Daily green streak challenges'
      ],
      techStack: ['React Native', 'FastAPI', 'Gemini Vision', 'Supabase']
    }
  ]);

  const categories = [
    { id: 'startup', label: 'Startup Ideas' },
    { id: 'app', label: 'App Ideas' },
    { id: 'website', label: 'Website Ideas' },
    { id: 'project', label: 'College / Portfolio Projects' },
    { id: 'business', label: 'Small Business Ideas' },
    { id: 'content', label: 'Content & Creator Concepts' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateIdeas({
        category,
        topic: topic.trim() || 'Modern AI & Software Utilities',
        audience: audience.trim() || 'Students & Digital Creators',
        skillLevel
      });
      if (res.ideas && res.ideas.length > 0) {
        setIdeas(res.ideas);
      }
    } catch (err: any) {
      console.error('Failed to generate ideas', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    setSavedIdeas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyIdea = (idea: IdeaCard) => {
    const text = `${idea.title} - ${idea.tagline}\n\nCategory: ${idea.category}\nAudience: ${idea.targetAudience}\nFeasibility: ${idea.feasibilityScore}/100\nMonetization: ${idea.monetization}\n\nDescription:\n${idea.description}\n\nKey Features:\n${idea.keyFeatures.map((f) => `- ${f}`).join('\n')}\n\nTech Stack:\n${idea.techStack.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Idea Generator</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-viability startup concepts, app blueprints, and project ideas with feasibility scoring.
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === c.id
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Topic or Industry Focus
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Clean Energy, EdTech, FinTech..."
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Remote workers, college students..."
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Skill / Complexity Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-pink-500"
              >
                <option value="beginner">Beginner / Weekend MVP</option>
                <option value="intermediate">Intermediate / Production App</option>
                <option value="advanced">Advanced / Scalable Venture</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Ideas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Ideas</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ideas.map((idea) => {
            const isSaved = !!savedIdeas[idea.id];
            const isCopied = copiedId === idea.id;

            return (
              <div
                key={idea.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-pink-300 dark:hover:border-pink-800 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 capitalize">
                        {idea.category}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {idea.title}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {idea.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopyIdea(idea)}
                        title="Copy idea blueprint"
                        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toggleSave(idea.id)}
                        title={isSaved ? 'Remove from saved' : 'Save to favorites'}
                        className={`p-1.5 rounded-xl transition-colors ${
                          isSaved ? 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400' : 'text-slate-400 hover:text-pink-600'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                    {idea.description}
                  </p>

                  {/* Metadata pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-500 truncate">Audience: <strong>{idea.targetAudience}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-slate-500">
                        Feasibility: <strong className="text-emerald-600 dark:text-emerald-400">{idea.feasibilityScore}/100</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <DollarSign className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-slate-500">Monetization: <strong>{idea.monetization}</strong></span>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mt-4 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Capabilities
                    </div>
                    {idea.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
                  <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                  {idea.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
