import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Search,
  SlidersHorizontal,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
  Layers,
  ArrowUpDown,
  BookOpen,
  Share2,
  Bookmark,
  ExternalLink,
  Eye,
  ShieldCheck,
  Sparkles,
  GitCompare
} from 'lucide-react';
import { HistoricalObject } from '../../types';
import { api } from '../../services/api';

interface HistoryPowerProps {
  onSelectObject: (obj: HistoricalObject) => void;
  onAskScholarAboutObject: (obj: HistoricalObject) => void;
  onSaveToCollection?: (obj: HistoricalObject) => void;
  selectedObjectId?: string | null;
}

export const HistoryPower: React.FC<HistoryPowerProps> = ({
  onSelectObject,
  onAskScholarAboutObject,
  onSaveToCollection,
  selectedObjectId,
}) => {
  const [objects, setObjects] = useState<HistoricalObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'grid' | 'timeline' | 'map' | 'compare'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [civilization, setCivilization] = useState('all');
  const [status, setStatus] = useState('all');
  const [material, setMaterial] = useState('all');
  const [verification, setVerification] = useState('all');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'completeness' | 'name'>('date_asc');

  // Compare mode selections
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [activeDetailObject, setActiveDetailObject] = useState<HistoricalObject | null>(null);

  // Load objects from API
  useEffect(() => {
    loadObjects();
  }, [civilization, status, material, verification]);

  const loadObjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.getObjects({
        q: searchQuery || undefined,
        civilization: civilization !== 'all' ? civilization : undefined,
        status: status !== 'all' ? status : undefined,
        material: material !== 'all' ? material : undefined,
        verification: verification !== 'all' ? verification : undefined,
        limit: 50
      });
      setObjects(res.objects);
      if (selectedObjectId) {
        const found = res.objects.find((o) => o.id === selectedObjectId || o.object_id === selectedObjectId);
        if (found) setActiveDetailObject(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadObjects();
  };

  // Sorting
  const sortedObjects = [...objects].sort((a, b) => {
    if (sortBy === 'date_asc') return a.approximate_year - b.approximate_year;
    if (sortBy === 'date_desc') return b.approximate_year - a.approximate_year;
    if (sortBy === 'completeness') return b.data_completeness - a.data_completeness;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const civilizationsList = [
    'all',
    'Ancient Egypt',
    'Mesopotamia (Babylonia)',
    'Classical Greece',
    'Hellenistic Greece',
    'Roman Empire',
    'Achaemenid Empire (Persia)',
    'Shang Dynasty China'
  ];

  const materialsList = ['all', 'Gold', 'Bronze', 'Granodiorite', 'Clay', 'Diorite', 'Silver', 'Wood', 'Lapis Lazuli'];

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Stats Banner */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-bold mb-2">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>VERIFIED ANCIENT DATABASE • 5,000+ RECORDS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Astra History & Archaeological Archives
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Strictly verified ancient material culture. Every object contains documented museum custody, discovery excavation contexts, physical dimensions, epigraphic translations, and genuine archival photography.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-2xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveView('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'grid'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gallery Grid
            </button>
            <button
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'timeline'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'map'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              World Map
            </button>
            <button
              onClick={() => setActiveView('compare')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'compare'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare ({compareIds.length})</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Multi-Facet Filters */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 space-y-3 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-2xl px-3 py-1.5 focus-within:border-amber-500/40">
              <Search className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search by artifact name, museum, material, inscription, or excavation site..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              Search Records
            </button>
          </form>

          {/* Filter Dropdowns Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Civilization
              </label>
              <select
                value={civilization}
                onChange={(e) => setCivilization(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                {civilizationsList.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Civilizations' : c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="excavated">Excavated</option>
                <option value="documented">Documented</option>
                <option value="in_situ">In Situ</option>
                <option value="disputed">Disputed / Questioned</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Material
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                {materialsList.map((m) => (
                  <option key={m} value={m}>
                    {m === 'all' ? 'All Materials' : m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Verification
              </label>
              <select
                value={verification}
                onChange={(e) => setVerification(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="archaeological">Archaeological</option>
                <option value="epigraphic">Epigraphic</option>
                <option value="radiocarbon">Radiocarbon Dated</option>
                <option value="legendary">Legendary / Unverified</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Sort Chronology
              </label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="date_asc">Oldest to Newest (BCE → CE)</option>
                <option value="date_desc">Newest to Oldest</option>
                <option value="completeness">Highest Provenance %</option>
                <option value="name">Artifact Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: Gallery Grid */}
      {activeView === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing {sortedObjects.length} archaeological records</span>
            {compareIds.length > 0 && (
              <span className="text-amber-400 font-medium">
                {compareIds.length} selected for comparison
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedObjects.map((obj) => {
              const isComparing = compareIds.includes(obj.id);
              return (
                <div
                  key={obj.id}
                  onClick={() => {
                    setActiveDetailObject(obj);
                    onSelectObject(obj);
                  }}
                  className="group rounded-3xl bg-slate-900 border border-white/10 hover:border-amber-500/40 transition-all overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden bg-black/50">
                    <img
                      src={obj.image.image_url}
                      alt={obj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/30">
                        {obj.object_id}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        onClick={(e) => toggleCompare(obj.id, e)}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                          isComparing
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-black/60 text-slate-300 hover:text-white'
                        }`}
                        title="Compare artifact"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] text-slate-300 font-medium">
                        {obj.civilization}
                      </span>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{obj.date_display}</span>
                        <span className="text-emerald-400 font-mono text-[10px]">
                          {obj.data_completeness}% Verified
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {obj.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {obj.description}
                      </p>
                    </div>

                    {/* Footer pills */}
                    <div className="pt-3 border-t border-white/5 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="truncate max-w-[140px]">{obj.museum}</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 capitalize text-[10px]">
                          {obj.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 flex-wrap">
                        {obj.material.slice(0, 2).map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-1.5 py-0.5 rounded bg-black/40 text-slate-400 text-[10px]"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Chronological Timeline */}
      {activeView === 'timeline' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <div className="text-xs font-mono font-bold uppercase text-amber-400">
            Chronological Progression (3500 BCE to 500 CE)
          </div>

          <div className="relative pl-6 border-l-2 border-amber-500/30 space-y-8">
            {sortedObjects.map((obj) => (
              <div
                key={obj.id}
                onClick={() => {
                  setActiveDetailObject(obj);
                  onSelectObject(obj);
                }}
                className="relative cursor-pointer group"
              >
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400 group-hover:bg-amber-400 transition-colors" />

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 group-hover:border-amber-500/30 transition-all flex flex-col sm:flex-row gap-4">
                  <img
                    src={obj.image.image_url}
                    alt={obj.name}
                    className="w-24 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {obj.date_display}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{obj.civilization}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {obj.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{obj.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Interactive World Map */}
      {activeView === 'map' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-amber-400">
              Archaeological Origin Coordinates & Current Repositories
            </span>
            <span className="text-xs text-slate-400">Interactive Map Cluster</span>
          </div>

          <div className="relative h-[450px] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
            {/* World Map SVG Canvas */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full opacity-40 select-none"
              fill="#1E293B"
            >
              {/* Generalized Continental Paths */}
              <path d="M150,120 Q220,100 280,140 T220,280 T140,240 Z" fill="#1E293B" />
              <path d="M220,290 Q280,310 260,420 T190,380 Z" fill="#1E293B" />
              <path d="M460,90 Q580,70 650,130 T540,220 T440,160 Z" fill="#1E293B" />
              <path d="M470,220 Q560,240 540,380 T450,330 Z" fill="#1E293B" />
              <path d="M660,110 Q880,100 900,240 T700,290 Z" fill="#1E293B" />
              <path d="M780,330 Q880,340 860,430 T750,400 Z" fill="#1E293B" />
            </svg>

            {/* Placed Archaeological Coordinates Markers */}
            <div className="absolute inset-0">
              {sortedObjects.map((obj, i) => {
                // Approximate coordinate mapping to 1000x500 box:
                // lat: -90..90 -> y: 500..0
                // lng: -180..180 -> x: 0..1000
                const lat = obj.discovery_site.coordinates[0];
                const lng = obj.discovery_site.coordinates[1];
                const x = Math.max(5, Math.min(95, ((lng + 180) / 360) * 100));
                const y = Math.max(5, Math.min(95, ((90 - lat) / 180) * 100));

                return (
                  <div
                    key={obj.id}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => {
                      setActiveDetailObject(obj);
                      onSelectObject(obj);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                  >
                    <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[9px] shadow-[0_0_10px_rgba(212,175,55,0.8)] group-hover:scale-125 transition-transform animate-pulse">
                      •
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-slate-900 border border-amber-500/40 p-2.5 rounded-xl text-xs w-48 shadow-2xl pointer-events-none z-30">
                      <span className="font-bold text-white truncate w-full text-center">
                        {obj.name}
                      </span>
                      <span className="text-[10px] text-amber-300">
                        {obj.discovery_site.site_name}
                      </span>
                      <span className="text-[9px] text-slate-400">{obj.date_display}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Comparison Mode */}
      {activeView === 'compare' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Side-by-Side Artifact Comparison</h3>
              <p className="text-xs text-slate-400">
                Compare up to 3 objects simultaneously across physical dimensions, materials, and epigraphy.
              </p>
            </div>
            {compareIds.length > 0 && (
              <button
                onClick={() => setCompareIds([])}
                className="text-xs text-rose-400 hover:underline"
              >
                Clear Selections
              </button>
            )}
          </div>

          {compareIds.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-2xl">
              No objects selected yet. Select the compare icon on any artifact cards in the Gallery Grid to compare them.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compareIds.map((id) => {
                const item = objects.find((o) => o.id === id);
                if (!item) return null;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-black/40 border border-amber-500/30 space-y-4"
                  >
                    <img
                      src={item.image.image_url}
                      alt={item.name}
                      className="w-full aspect-video rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-mono text-amber-400">{item.object_id}</span>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">{item.civilization} • {item.date_display}</p>
                    </div>

                    <div className="space-y-2 text-xs divide-y divide-white/5 pt-2">
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-400">Custody</span>
                        <span className="font-medium text-white text-right max-w-[150px] truncate">{item.museum}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-400">Materials</span>
                        <span className="font-medium text-amber-300">{item.material.join(', ')}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-400">Dimensions</span>
                        <span className="font-medium text-white">{item.dimensions.height_cm} × {item.dimensions.width_cm} cm</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-400">Weight</span>
                        <span className="font-medium text-white">{item.dimensions.weight_kg ? `${item.dimensions.weight_kg} kg` : 'Recorded in museum'}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-400">Verification</span>
                        <span className="font-medium text-emerald-400">{item.verification_level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal / Detail View for Active Object */}
      {activeDetailObject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveDetailObject(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {activeDetailObject.object_id}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {activeDetailObject.data_completeness}% Verified Provenance
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeDetailObject.name}
              </h2>
              <div className="text-xs text-slate-400">
                {activeDetailObject.civilization} • {activeDetailObject.date_display} • {activeDetailObject.archaeological_period}
              </div>
            </div>

            {/* Image & Key Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={activeDetailObject.image.image_url}
                  alt={activeDetailObject.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7 space-y-4 text-xs">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {activeDetailObject.description}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-400">Current Museum Custody</div>
                    <div className="font-semibold text-white truncate">{activeDetailObject.museum}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-400">Discovery Excavation Site</div>
                    <div className="font-semibold text-white truncate">{activeDetailObject.discovery_site.site_name}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-400">Primary Materials</div>
                    <div className="font-semibold text-amber-300 truncate">{activeDetailObject.material.join(', ')}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-slate-400">Physical Dimensions</div>
                    <div className="font-semibold text-white">
                      {activeDetailObject.dimensions.height_cm} × {activeDetailObject.dimensions.width_cm} cm
                      {activeDetailObject.dimensions.weight_kg ? ` (${activeDetailObject.dimensions.weight_kg} kg)` : ''}
                    </div>
                  </div>
                </div>

                {/* Inscription & Translation */}
                {activeDetailObject.inscriptions && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[10px] font-mono text-amber-400 uppercase">
                      Inscriptions ({activeDetailObject.inscriptions.script})
                    </div>
                    <div className="text-xs text-slate-300 italic">
                      "{activeDetailObject.inscriptions.text_translation}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onAskScholarAboutObject(activeDetailObject);
                    setActiveDetailObject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Teach Me With AI Tutor Pro</span>
                </button>
                <button
                  onClick={() => onSaveToCollection?.(activeDetailObject)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs flex items-center gap-2 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save to Collection</span>
                </button>
              </div>

              <button
                onClick={() => setActiveDetailObject(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
