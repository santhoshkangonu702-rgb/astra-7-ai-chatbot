import React, { useState, useEffect } from 'react';
import {
  Search,
  Landmark,
  Sparkles,
  MessageSquare,
  BookOpen,
  PenTool,
  Eye,
  BarChart3,
  ArrowRight,
  Database,
  FolderKanban,
  Music,
  Globe2,
  MapPin,
  Film,
  Image as ImageIcon,
  Zap,
  Users,
  Trophy,
  Satellite,
  ShieldAlert,
  Heart,
  FlaskConical,
  Home,
  Car,
  Leaf,
  Palette,
  Network,
  Lock
} from 'lucide-react';
import { HistoricalObject, PowerId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPower: (power: PowerId) => void;
  onSelectObject: (obj: HistoricalObject) => void;
  objects: HistoricalObject[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectPower,
  onSelectObject,
  objects,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent or here
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredObjects = query.trim()
    ? objects.filter(
        (o) =>
          o.name.toLowerCase().includes(query.toLowerCase()) ||
          o.civilization.toLowerCase().includes(query.toLowerCase()) ||
          o.material.some((m) => m.toLowerCase().includes(query.toLowerCase())) ||
          o.museum.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : objects.slice(0, 4);

  const quickTools = [
    { id: 'datahub' as PowerId, name: 'Astra Data Hub', desc: 'Central data architecture with 5 verified branches', icon: Database },
    { id: 'personal-space' as PowerId, name: 'Personal Space', desc: 'Private user workspace unifying Memory, Projects & Goals', icon: Lock },
    { id: 'quick-answer' as PowerId, name: 'Quick Answer', desc: 'Instant definitions, calculations & conversions', icon: Zap },
    { id: 'satellite' as PowerId, name: 'Satellite Tracker', desc: 'Live ISS & space station orbital telemetry', icon: Satellite },
    { id: 'disaster' as PowerId, name: 'Disaster Center', desc: 'Official earthquakes, cyclones & floods monitoring', icon: ShieldAlert },
    { id: 'health' as PowerId, name: 'Health Education', desc: 'Anatomy, physiology, nutrition & pharmacology', icon: Heart },
    { id: 'astra-lab' as PowerId, name: 'Astra Virtual Lab', desc: 'Interactive circuit, physics & chemistry simulations', icon: FlaskConical },
    { id: 'smarthome' as PowerId, name: 'Smart Home Concept', desc: '2040 clean micro-grid, climate & robotics simulation', icon: Home },
    { id: 'mobility' as PowerId, name: 'Astra Mobility', desc: 'EV solid-state batteries, high-speed Maglev & eVTOL', icon: Car },
    { id: 'green' as PowerId, name: 'Astra Green', desc: 'Planetary renewables, water desalination & circular economy', icon: Leaf },
    { id: 'brandstudio' as PowerId, name: 'Brand Studio', desc: 'Brand Idea → Identity → Visual System → Brand Kit', icon: Palette },
    { id: 'socialstudio' as PowerId, name: 'Social Studio', desc: 'Reels, YouTube Shorts, captions & content calendar', icon: Sparkles },
    { id: 'source-graph' as PowerId, name: 'Astra Source Graph', desc: 'Visual evidence tree tracing claims back to primary data', icon: Network },
    { id: 'achievements' as PowerId, name: 'Achievement Center', desc: 'Truthfully tracks learning hours & verified credentials', icon: Trophy },
    { id: 'music' as PowerId, name: 'Astra Music', desc: 'Indian regional & global music discovery', icon: Music },
    { id: 'global-intelligence' as PowerId, name: 'Global & India Intel', desc: 'Verified country dossiers & states comparison', icon: Globe2 },
    { id: 'maps-places' as PowerId, name: 'Maps & Places', desc: 'Nearby transit, services & landmark routing', icon: MapPin },
    { id: 'cinema-studio' as PowerId, name: 'Cinema Studio', desc: 'Cinematic video editor & photo-to-video motion', icon: Film },
    { id: 'image-studio' as PowerId, name: 'Image Studio', desc: 'AI visual generation, enhancement & studio tools', icon: ImageIcon },
    { id: 'knowledge' as PowerId, name: 'Knowledge Hub', desc: 'Private knowledge spaces with semantic RAG citations', icon: Database },
    { id: 'projects' as PowerId, name: 'Project Spaces', desc: 'Workspaces with Kanban tasks, memory facts & deliverables', icon: FolderKanban },
    { id: 'chat' as PowerId, name: 'Astra Chat', desc: 'Ask general AI questions with RAG context', icon: MessageSquare },
    { id: 'history' as PowerId, name: 'Astra History', desc: 'Browse 5,000+ verified ancient objects', icon: Landmark },
    { id: 'search' as PowerId, name: 'Astra Search', desc: 'Deep research & web citation synthesis', icon: Search },
    { id: 'scholar' as PowerId, name: 'Astra Scholar', desc: 'Interactive flashcards, tutoring & quizzes', icon: BookOpen },
    { id: 'create' as PowerId, name: 'Astra Create', desc: 'Draft essays, proposals & professional copy', icon: PenTool },
    { id: 'vision' as PowerId, name: 'Astra Vision', desc: 'Image analysis & artifact recognition', icon: Eye },
    { id: 'data' as PowerId, name: 'Astra Data', desc: 'Analyze spreadsheets, CSVs & calculate trends', icon: BarChart3 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-20 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-[calc(100%-24px)] sm:w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-slate-950/50">
          <Search className="w-5 h-5 text-amber-400" />
          <input
            type="text"
            placeholder="Search artifacts, civilizations, tools, or research topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500 font-sans"
          />
          <kbd className="px-2 py-0.5 rounded bg-white/10 text-slate-400 text-xs font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Historical Artifacts */}
          <div>
            <div className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Verified Ancient Objects</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {filteredObjects.length} results
              </span>
            </div>
            <div className="space-y-1 mt-1">
              {filteredObjects.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => {
                    onSelectObject(obj);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-amber-500/20 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={obj.image.image_url}
                      alt={obj.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-amber-300 truncate">
                        {obj.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {obj.civilization} • {obj.date_display} • {obj.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {obj.object_id}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <div className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Astra 7 Powers
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
              {quickTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectPower(tool.id);
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 border border-white/5 text-left text-xs transition-colors group"
                >
                  <tool.icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-medium text-white group-hover:text-amber-300">{tool.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{tool.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
