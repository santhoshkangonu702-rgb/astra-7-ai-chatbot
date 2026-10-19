import React, { useState } from 'react';
import {
  Sparkles,
  PenTool,
  GraduationCap,
  Lightbulb,
  FileText,
  Code2,
  Image as ImageIcon,
  Layers,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Star,
  Compass,
  ShieldAlert,
  Newspaper,
  Calendar,
  Target,
  Wrench,
  ArrowLeft,
  Music,
  Zap,
  Users,
  Trophy,
  Satellite,
  Heart,
  FlaskConical,
  Home,
  Car,
  Leaf,
  Network,
  Lock,
  Cpu,
  Palette,
  Share2
} from 'lucide-react';
import { PowerId } from '../../types';

interface ToolsScreenProps {
  onSelectPower: (power: PowerId) => void;
  onBack?: () => void;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({ onSelectPower, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Engines' },
    { id: 'workspace', label: 'Workspace & Planning' },
    { id: 'education', label: 'Study & Learning' },
    { id: 'writing', label: 'Writing & Content' },
    { id: 'dev', label: 'Developer & Tech' },
    { id: 'career', label: 'Career & Work' },
    { id: 'creative', label: 'Creative & Visual' },
  ];

  const tools = [
    {
      id: 'tool-assistant' as PowerId,
      name: 'AI Assistant',
      category: 'all',
      desc: 'Multipurpose reasoning, deep problem solving, synthesis, and conversational intelligence.',
      icon: Sparkles,
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Reasoning',
      popular: true,
      features: ['Deep Socratic answers', 'Custom response tones', 'Speech playback', 'Fast citations']
    },
    {
      id: 'tool-writer' as PowerId,
      name: 'AI Writer',
      category: 'writing',
      desc: 'Generate essays, blogs, emails, social captions, and professional rewrites in multiple languages.',
      icon: PenTool,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Writing',
      popular: true,
      features: ['8+ Content templates', '6 Tone adjustments', 'Word & character count', 'One-click copy']
    },
    {
      id: 'tool-study' as PowerId,
      name: 'Study Assistant',
      category: 'education',
      desc: 'Step-by-step math solver, interactive flashcards, high-yield notes, and practice quiz tests.',
      icon: GraduationCap,
      color: 'from-amber-500 to-orange-500',
      badge: 'Education',
      popular: true,
      features: ['Step-by-step STEM walkthroughs', 'Interactive flip flashcards', 'Auto-generated 5-Q quizzes', 'Study planner']
    },
    {
      id: 'tool-ideas' as PowerId,
      name: 'Idea Generator',
      category: 'creative',
      desc: 'Brainstorm startup concepts, app blueprints, project topics, and monetization strategies.',
      icon: Lightbulb,
      color: 'from-pink-500 to-rose-500',
      badge: 'Innovation',
      popular: false,
      features: ['Feasibility scoring', 'Target audience analysis', 'Monetization breakdown', 'Tech stack recommendations']
    },
    {
      id: 'tool-resume' as PowerId,
      name: 'Resume Builder',
      category: 'career',
      desc: 'Build job-winning resumes, optimize bullet points with AI, and export ATS-friendly layouts.',
      icon: FileText,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Career',
      popular: true,
      features: ['3 ATS templates', 'AI bullet enhancer', 'Real-time live preview', 'Instant print & PDF']
    },
    {
      id: 'tool-code' as PowerId,
      name: 'Code Assistant',
      category: 'dev',
      desc: 'Write, debug, explain, optimize, and convert code in 9+ languages with syntax highlighting.',
      icon: Code2,
      color: 'from-purple-500 to-violet-600',
      badge: 'Developer',
      popular: true,
      features: ['9+ Languages supported', 'Automated bug detection', 'Cross-language translation', 'Performance advice']
    },
    {
      id: 'tool-image' as PowerId,
      name: 'Image Creator',
      category: 'creative',
      desc: 'Generate artwork, 3D scenes, avatars, illustrations, and concept graphics from text prompts.',
      icon: ImageIcon,
      color: 'from-rose-500 to-pink-600',
      badge: 'Visual AI',
      popular: false,
      features: ['Multiple artistic styles', 'Aspect ratio presets', 'Saved prompt gallery', 'High-res preview']
    },
    {
      id: 'workspace' as PowerId,
      name: 'Everything Workspace',
      category: 'workspace',
      desc: 'Execute end-to-end multi-stage pipelines: Research → Synthesis → Structured Drafting → Slide Outlines.',
      icon: Layers,
      color: 'from-purple-600 to-pink-500',
      badge: 'New Suite',
      popular: true,
      features: ['Multi-stage pipeline execution', 'Meeting minutes extractor', 'Document generator', 'Keynote deck export']
    },
    {
      id: 'navigator' as PowerId,
      name: 'Astra Navigator',
      category: 'workspace',
      desc: 'Transform any ambitious goal into requirements, execution steps, timelines, actionable tasks, and resources.',
      icon: Compass,
      color: 'from-teal-500 to-cyan-500',
      badge: 'Planning',
      popular: true,
      features: ['Sequential execution steps', 'Interactive checklist', 'Timeline phases', 'One-click Markdown export']
    },
    {
      id: 'factcheck' as PowerId,
      name: 'Fact Check Mode',
      category: 'workspace',
      desc: 'Objective truth & evidence verification engine with grounded search sources and confidence scoring.',
      icon: ShieldAlert,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Truth',
      popular: true,
      features: ['Verdict status indicator', 'Confidence percentage meter', 'Verified grounded sources', 'Shareable report']
    },
    {
      id: 'briefing' as PowerId,
      name: 'Daily Briefing',
      category: 'workspace',
      desc: 'Personalized live digest: curated headlines, concise summaries, and "Why It Matters" context.',
      icon: Newspaper,
      color: 'from-amber-500 to-orange-500',
      badge: 'Live',
      popular: true,
      features: ['9 Category channels', 'Morning & evening editions', 'Why it matters insights', 'Save & bookmark']
    },
    {
      id: 'planner' as PowerId,
      name: 'Smart Planner & Reminders',
      category: 'workspace',
      desc: 'Goal-to-timeframe scheduler with target milestones, daily task checklists, and smart recurring reminders.',
      icon: Calendar,
      color: 'from-violet-600 to-indigo-600',
      badge: 'Scheduler',
      popular: false,
      features: ['Feasibility estimation', 'Milestone checkpoints', 'Task priority toggles', 'Browser notification alerts']
    },
    {
      id: 'goalcoach' as PowerId,
      name: 'Goal Coach',
      category: 'education',
      desc: 'Personal mastery engine: skill roadmaps, recommended starting points, practice projects, and capstones.',
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Mastery',
      popular: false,
      features: ['Prerequisite & core skills', 'Sequential study roadmap', 'Hands-on practice projects', 'Milestone badges']
    },
    {
      id: 'toolbox' as PowerId,
      name: 'Astra Toolbox',
      category: 'workspace',
      desc: 'Instant zero-latency utilities: Calculator, Unit Converter, Word Counter, JSON Formatter, QR Generator & Color tools.',
      icon: Wrench,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Instant',
      popular: false,
      features: ['Scientific calculator', 'Multi-unit conversion', 'Live QR code generator', 'JSON prettifier & minifier']
    },
    {
      id: 'tool-more' as PowerId,
      name: 'More Specialized Tools',
      category: 'all',
      desc: 'Explore the Ancient Antiquities database, Satellite Cosmos visualizer, Spreadsheet analyzer, and Vision AI.',
      icon: Layers,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Suite',
      popular: false,
      features: ['Archaeological database', 'Orbital cosmos tracker', 'Data spreadsheet engine', 'Multimodal image vision']
    },
    {
      id: 'datahub' as PowerId,
      name: 'Astra Data Hub',
      category: 'workspace',
      desc: 'Central data architecture connecting Live Data, Knowledge Graph, User Data, File Data, and Future Data.',
      icon: Layers,
      color: 'from-amber-500 to-cyan-500',
      badge: 'Core Hub',
      popular: true,
      features: ['5 Connected branches', 'Source verification', 'Confidence ratings', 'Audit trail']
    },
    {
      id: 'global-intelligence' as PowerId,
      name: 'Global & India Intel',
      category: 'workspace',
      desc: 'Neutral country dossiers, GDP, inflation, census, state comparisons, and government welfare schemes.',
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Grounded',
      popular: true,
      features: ['195 Country benchmarks', 'All 28 States & UTs', 'Government schemes', 'Side-by-side comparison']
    },
    {
      id: 'maps-places' as PowerId,
      name: 'Maps & Places',
      category: 'workspace',
      desc: 'Nearby hospitals, colleges, railway stations, airports, fuel, and heritage landmarks with directions.',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Spatial',
      popular: true,
      features: ['Location permission toggle', 'Turn-by-turn directions', 'Operating hours', 'Saved favorites']
    },
    {
      id: 'finance-economy' as PowerId,
      name: 'Finance & Calculators',
      category: 'workspace',
      desc: 'Live market indices, precious metals, forex reference rates, and interactive EMI & SIP calculators.',
      icon: Sparkles,
      color: 'from-amber-500 to-emerald-500',
      badge: 'Finance',
      popular: true,
      features: ['Interactive loan EMI', 'Compound wealth planner', 'Market benchmarks', 'Informational disclaimer']
    },
    {
      id: 'travel-intelligence' as PowerId,
      name: 'Travel Intelligence',
      category: 'workspace',
      desc: 'Day-by-day itinerary generator, estimated cost breakdown, flights, trains, and destination visa protocols.',
      icon: Compass,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Mobility',
      popular: true,
      features: ['Day-by-day timeline', 'Cost tier breakdowns', 'Weather-adaptive tips', 'One-click JSON export']
    },
    {
      id: 'science-universe' as PowerId,
      name: 'Science Universe',
      category: 'education',
      desc: 'Peer-reviewed research summaries, physics, genetics, neuroscience, and educational science models.',
      icon: Sparkles,
      color: 'from-emerald-500 to-cyan-600',
      badge: 'Empirical',
      popular: true,
      features: ['Peer-reviewed papers', 'Breakthrough findings', 'Documented limitations', 'Non-medical disclaimer']
    },
    {
      id: 'human-knowledge' as PowerId,
      name: 'Human Knowledge Graph',
      category: 'education',
      desc: 'Searchable relational ontology: Person → Field → Major Works → Organizations → Timeline → Citations.',
      icon: Layers,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Ontology',
      popular: true,
      features: ['Scientists & pioneers', 'Seminal works list', 'Chronological milestones', 'Relational web']
    },
    {
      id: 'tech-radar' as PowerId,
      name: 'AI & Tech Radar',
      category: 'dev',
      desc: 'Frontier technological ladder: Current Reality → Recent Breakthrough → Research → Limitations → Future.',
      icon: Code2,
      color: 'from-cyan-500 to-amber-500',
      badge: 'Frontier',
      popular: true,
      features: ['Humanoid robotics', 'Quantum computing', 'BCI implants', '5-stage maturity ladder']
    },
    {
      id: 'app-builder' as PowerId,
      name: 'Astra App Builder',
      category: 'dev',
      desc: '9-Stage full-stack synthesis workspace: Idea → Requirements → UI → DB → Frontend → Backend → Preview.',
      icon: Code2,
      color: 'from-violet-600 to-pink-500',
      badge: 'Full-Stack',
      popular: true,
      features: ['File tree explorer', 'TypeScript code editor', 'Database schemas', 'Exportable scaffold']
    },
    {
      id: 'business-lab' as PowerId,
      name: 'Astra Business Lab',
      category: 'career',
      desc: 'Venture architecture: Value proposition, unit economics, SWOT analysis, and 5-slide pitch deck.',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      badge: 'Venture',
      popular: true,
      features: ['Dual revenue models', 'SWOT matrix', 'Institutional pitch deck', 'FPO channel strategy']
    },
    {
      id: 'personal-knowledge' as PowerId,
      name: 'My Astra Knowledge',
      category: 'workspace',
      desc: 'Private encrypted workspace for personal projects, study goals, notes, tasks, and delete-all privacy.',
      icon: Layers,
      color: 'from-amber-400 to-purple-500',
      badge: 'Private',
      popular: true,
      features: ['Projects & goals', 'Personal notes', 'Local storage isolation', 'One-click wipe all']
    },
    {
      id: 'security-center' as PowerId,
      name: 'Security Center',
      category: 'workspace',
      desc: 'Session management, Two-Factor Authentication, zero client API key leaks, and immutable audit trails.',
      icon: ShieldAlert,
      color: 'from-emerald-500 to-cyan-500',
      badge: 'Zero-Trust',
      popular: true,
      features: ['Active device sessions', '2FA toggle', 'Audit trail manifest', 'Session kill-switch']
    },
    {
      id: 'sports' as PowerId,
      name: 'Sports Intelligence',
      category: 'all',
      desc: 'Cricket, Football, Tennis, Formula 1, and Olympic fixtures with verified scores and timing feeds.',
      icon: Star,
      color: 'from-amber-500 to-rose-500',
      badge: 'Verified',
      popular: false,
      features: ['ICC cricket matches', 'UEFA Champions League', 'Formula 1 Grand Prix', 'Zero fake scores']
    },
    {
      id: 'entertainment' as PowerId,
      name: 'Entertainment Universe',
      category: 'all',
      desc: 'Tollywood, Bollywood, Hollywood & World Cinema with official trailers, cast, and verified reviews.',
      icon: Flame,
      color: 'from-rose-500 to-amber-500',
      badge: 'Cinema',
      popular: false,
      features: ['Official trailers', 'Cast & director notes', 'Verified review quotes', 'Certification ratings']
    },
    {
      id: 'gaming-intelligence' as PowerId,
      name: 'Gaming Studio & Builder',
      category: 'creative',
      desc: '10-stage game builder: Concept → World → Characters → Map → Gameplay → UI → Code → Assets → Preview.',
      icon: Sparkles,
      color: 'from-purple-500 to-amber-500',
      badge: 'Studio',
      popular: false,
      features: ['10-Stage builder ladder', 'Combat & world lore', 'HTML5 & WebGL path', 'Transparent labeling']
    },
    {
      id: 'music' as PowerId,
      name: 'Astra Music',
      category: 'creative',
      desc: 'Explore Indian Regional (Telugu, Hindi, Tamil, Kannada, Punjabi, etc.) & Global music catalogs with verified previews.',
      icon: Music,
      color: 'from-amber-400 to-rose-500',
      badge: 'Music',
      popular: true,
      features: ['Telugu, Hindi, Tamil, Kannada & more', 'Curated Indian playlists', 'Verified audio playback', 'Zero lyrics copyright breach']
    },
    {
      id: 'quick-answer' as PowerId,
      name: 'Quick Answer',
      category: 'education',
      desc: 'Instant definitions, unit conversions, math calculations, and direct verified answers.',
      icon: Zap,
      color: 'from-amber-400 to-yellow-500',
      badge: 'Instant',
      popular: true,
      features: ['Sub-second latency', 'Math calculation', 'Unit conversions', 'No preamble']
    },
    {
      id: 'personal-space' as PowerId,
      name: 'Astra Personal Space',
      category: 'career',
      desc: 'Private user workspace unifying Memory, Projects, Documents, Goals, Tasks & Skills.',
      icon: Lock,
      color: 'from-amber-500 to-purple-600',
      badge: 'Private',
      popular: true,
      features: ['Zero silent profiling', 'Encrypted vault', 'One-click purge', 'User sovereign']
    },
    {
      id: 'meeting' as PowerId,
      name: 'Meeting Assistant',
      category: 'productivity',
      desc: 'Synthesizes transcripts into summaries, decisions, action items, and deadline calendars.',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Actions',
      popular: false,
      features: ['Decision logging', 'Action item delegation', 'Search transcript', 'Markdown export']
    },
    {
      id: 'achievements' as PowerId,
      name: 'Achievement Center',
      category: 'education',
      desc: 'Truthfully tracks skills, courses completed, learning hours, and certificates.',
      icon: Trophy,
      color: 'from-yellow-400 to-amber-600',
      badge: 'Verified',
      popular: false,
      features: ['Learning hours', 'Skills radar', 'Truthful credentials', 'Zero vanity certs']
    },
    {
      id: 'satellite' as PowerId,
      name: 'Satellite Tracker',
      category: 'science',
      desc: 'Live orbital telemetry for ISS, Bharatiya Antariksh Station, JWST, and Earth observation.',
      icon: Satellite,
      color: 'from-sky-400 to-blue-600',
      badge: 'Live LEO',
      popular: true,
      features: ['Altitude & velocity', 'Ground footprints', 'TLE propagation', 'ISRO & NASA feeds']
    },
    {
      id: 'disaster' as PowerId,
      name: 'Disaster Center',
      category: 'science',
      desc: 'Grounded monitoring for earthquakes, cyclones, floods, tsunamis, and severe weather.',
      icon: ShieldAlert,
      color: 'from-rose-500 to-orange-600',
      badge: 'Alerts',
      popular: true,
      features: ['Official seismic feeds', 'No fabricated alerts', 'Severity rankings', 'Advisories']
    },
    {
      id: 'health' as PowerId,
      name: 'Health Education',
      category: 'education',
      desc: 'Curriculum-grade anatomy, physiological bioenergetics, nutrition, and pharmacology.',
      icon: Heart,
      color: 'from-emerald-400 to-teal-600',
      badge: 'Curriculum',
      popular: false,
      features: ['Cardiovascular mechanics', 'ADME pharmacokinetics', 'Strict medical disclaimer']
    },
    {
      id: 'astra-lab' as PowerId,
      name: 'Astra Virtual Lab',
      category: 'education',
      desc: 'Interactive STEM laboratory simulations: Ohm’s law circuit, pendulum physics, and acid-base titration.',
      icon: FlaskConical,
      color: 'from-purple-500 to-pink-600',
      badge: 'Lab',
      popular: true,
      features: ['DC circuit simulator', 'Harmonic pendulum', 'Titration pH curve', 'Formulas']
    },
    {
      id: 'engineering-lab' as PowerId,
      name: 'Engineering Lab',
      category: 'dev',
      desc: 'Calculators and formulas across Civil, Mechanical, Electrical, Computer, and Aerospace disciplines.',
      icon: Cpu,
      color: 'from-amber-500 to-orange-600',
      badge: 'Engineering',
      popular: false,
      features: ['7 Engineering branches', 'Rocket Delta-V equation', 'Euler buckling', 'Approximations labeled']
    },
    {
      id: 'smarthome' as PowerId,
      name: 'Smart Home Concept',
      category: 'dev',
      desc: 'Futuristic 2040 smart home simulation: Perovskite solar balance, geothermal HVAC, and robotics.',
      icon: Home,
      color: 'from-cyan-400 to-blue-600',
      badge: 'Simulation',
      popular: false,
      features: ['Solar micro-grid', 'Circadian lighting', 'Biometric perimeter', 'Simulation labeled']
    },
    {
      id: 'mobility' as PowerId,
      name: 'Astra Mobility',
      category: 'science',
      desc: 'Transportation intelligence: Solid-state EVs, high-speed Maglev, and hydrogen eVTOL aviation.',
      icon: Car,
      color: 'from-blue-400 to-cyan-500',
      badge: 'Transport',
      popular: false,
      features: ['EV battery platforms', 'Superconductor Maglev', 'Autonomous V2X', 'Environmental impact']
    },
    {
      id: 'green' as PowerId,
      name: 'Astra Green',
      category: 'science',
      desc: 'Planetary sustainability dashboard: Renewable grid share, water desalination, and circular economy.',
      icon: Leaf,
      color: 'from-emerald-400 to-green-600',
      badge: 'Green',
      popular: false,
      features: ['Renewables telemetry', 'Graphene desalination', 'Critical mineral recycling', 'Reports']
    },
    {
      id: 'brandstudio' as PowerId,
      name: 'Brand Studio',
      category: 'creative',
      desc: 'Brand Idea → Identity → Visual System → Assets → Brand Kit pipeline with original concepts.',
      icon: Palette,
      color: 'from-amber-400 to-rose-500',
      badge: 'Brand Kit',
      popular: false,
      features: ['Logo concepts', 'Color systems', 'Typography hierarchy', 'Brand guidelines export']
    },
    {
      id: 'socialstudio' as PowerId,
      name: 'Social Studio',
      category: 'creative',
      desc: 'Creator studio: Reels concepts, YouTube Shorts scripts, captions, and content calendars.',
      icon: Share2,
      color: 'from-pink-500 to-purple-600',
      badge: 'Creator',
      popular: true,
      features: ['Multi-platform aspect ratios', 'Script hooks', 'Caption optimizer', 'Calendar export']
    },
    {
      id: 'source-graph' as PowerId,
      name: 'Astra Source Graph',
      category: 'science',
      desc: 'Visual evidence tree tracing claims back to primary data, research, and official information.',
      icon: Network,
      color: 'from-amber-500 to-cyan-500',
      badge: 'Evidence Tree',
      popular: true,
      features: ['Interactive graph nodes', 'Methodology audit', 'Date of retrieval', 'Direct links']
    }
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === 'all' ||
      tool.category === activeCategory ||
      (activeCategory === 'education' && (tool.id === 'tool-study' || tool.id === 'goalcoach')) ||
      (activeCategory === 'writing' && (tool.id === 'tool-writer' || tool.id === 'tool-assistant')) ||
      (activeCategory === 'dev' && (tool.id === 'tool-code' || tool.id === 'toolbox')) ||
      (activeCategory === 'career' && (tool.id === 'tool-resume' || tool.id === 'planner')) ||
      (activeCategory === 'creative' && (tool.id === 'tool-image' || tool.id === 'tool-ideas'));

    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.badge.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all group shrink-0"
                  title="Return to Astra 7 Home"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-indigo-500 group-hover:-translate-x-0.5 transition-transform" />
                  <span>← Back</span>
                </button>
              )}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Astra 7 Multi-Engine Studio</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              AI Tools & Workspaces
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select a specialized engine tailored to your workflow. Every tool runs interactive AI logic.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools or features..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onSelectPower(tool.id)}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {tool.popular && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Flame className="w-2.5 h-2.5" />
                          Popular
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tool.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tool.desc}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    {tool.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No tools matched your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for &apos;study&apos;, &apos;resume&apos;, &apos;code&apos;, or reset filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
