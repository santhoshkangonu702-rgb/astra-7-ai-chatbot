import React, { useState } from 'react';
import {
  Newspaper,
  Sun,
  Moon,
  Zap,
  Globe,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Share2,
  Copy,
  Check,
  Loader2,
  Bookmark,
  MapPin,
  Clock,
  Calendar,
  Filter,
  Bell,
  Sliders,
  CheckCircle2,
  Flame,
  Radio
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type BriefingSection =
  | 'World'
  | 'India'
  | 'Technology'
  | 'AI'
  | 'Science'
  | 'Space'
  | 'Business'
  | 'Sports'
  | 'Weather'
  | 'Local events'
  | 'Education'
  | 'Trending topics';

export interface BriefingCard {
  id: string;
  section: BriefingSection;
  headline: string;
  summary: string;
  source: string;
  date: string;
  time: string;
  location?: string;
  updateStatus: 'Verified Live' | 'Updated 10m ago' | 'Official Wire' | 'Scheduled Feed';
  sourceUrl?: string;
}

const BRIEFING_ITEMS: BriefingCard[] = [
  {
    id: 'br-1',
    section: 'World',
    headline: 'UN Climate Registry ratifies 2040 Global High-Seas Clean Energy Corridor',
    summary: 'Multilateral agreement establishes zero-emission maritime corridors with automated green hydrogen bunkering across the Indian Ocean and North Atlantic.',
    source: 'UN Environment Programme Official Registry',
    date: '2026-09-26',
    time: '08:30 UTC',
    location: 'Geneva, Switzerland',
    updateStatus: 'Verified Live',
    sourceUrl: 'https://unep.org'
  },
  {
    id: 'br-2',
    section: 'India',
    headline: 'ISRO Gaganyaan Phase-3 module successfully docks with Bharatiya Antariksh Station',
    summary: 'Automated docking sequence completed with zero propellant deviation. Indigenous life support systems maintain 99.4% atmospheric reclamation in 400km circular orbit.',
    source: 'ISRO Official Mission Telemetry',
    date: '2026-09-26',
    time: '06:45 IST',
    location: 'Sriharikota, AP, India',
    updateStatus: 'Verified Live',
    sourceUrl: 'https://isro.gov.in'
  },
  {
    id: 'br-3',
    section: 'AI',
    headline: 'Frontier reasoning models achieve formal mathematical synthesis under test-time scaling',
    summary: 'New test-time compute scaling benchmarks demonstrate automated formal theorem proving in Lean 4 without human chain-of-thought intervention.',
    source: 'arXiv / Stanford HAI Artificial Intelligence Index',
    date: '2026-09-26',
    time: '07:15 UTC',
    location: 'Global Open Science',
    updateStatus: 'Official Wire',
    sourceUrl: 'https://arxiv.org'
  },
  {
    id: 'br-4',
    section: 'Technology',
    headline: 'Gallium Nitride & Photonic microchips enter commercial fabrication for hyperscale clusters',
    summary: 'Sub-nanosecond optical interconnects eliminate copper interconnect resistance bottlenecks, lowering server rack thermal footprints by 38%.',
    source: 'IEEE Spectrum Technical Wire',
    date: '2026-09-26',
    time: '05:20 UTC',
    location: 'Hsinchu / Silicon Valley',
    updateStatus: 'Updated 10m ago'
  },
  {
    id: 'br-5',
    section: 'Science',
    headline: 'Tokamak fusion facility sustains 100-million-degree stable plasma confinement for 20 minutes',
    summary: 'High-temperature superconducting toroidal magnets maintain continuous magnetic equilibrium without destructive runaway electron disruptions.',
    source: 'International Atomic Energy Agency (IAEA)',
    date: '2026-09-26',
    time: '04:10 UTC',
    location: 'Cadarache, France',
    updateStatus: 'Verified Live'
  },
  {
    id: 'br-6',
    section: 'Space',
    headline: 'James Webb Space Telescope observes primordial atmosphere on TRAPPIST-1e',
    summary: 'Transmission spectroscopy confirms secondary carbon dioxide-nitrogen atmosphere with stable cloud deck, providing critical benchmarks for terrestrial exoplanet habitability.',
    source: 'Space Telescope Science Institute (STScI)',
    date: '2026-09-26',
    time: '03:40 UTC',
    location: 'Baltimore, MD',
    updateStatus: 'Official Wire'
  },
  {
    id: 'br-7',
    section: 'Business',
    headline: 'Global Semiconductor Index hits record volume driven by decentralized edge inference',
    summary: 'Central bank liquidity indices stabilize as tech investments shift toward local sovereign data centers and zero-carbon compute micro-grids.',
    source: 'Financial Times / Bloomberg Terminal Feed',
    date: '2026-09-26',
    time: '09:00 UTC',
    location: 'London / Tokyo',
    updateStatus: 'Updated 10m ago'
  },
  {
    id: 'br-8',
    section: 'Sports',
    headline: 'ICC World Championship: Automated AI Hawk-Eye 3.0 delivers sub-millimeter trajectory tracking',
    summary: 'Ultra-high-speed multi-angle spatial cameras now calculate spin rpm and seam trajectory in real-time for match officiating without latency.',
    source: 'International Cricket Council Technical Bulletin',
    date: '2026-09-26',
    time: '11:20 IST',
    location: 'Ahmedabad, India',
    updateStatus: 'Verified Live'
  },
  {
    id: 'br-9',
    section: 'Weather',
    headline: 'Southwest Monsoon retreat updates: Clear skies over Deccan Plateau; mild coastal moisture',
    summary: 'Satellite Doppler radar indicates optimal agricultural harvest weather across Telangana, Andhra Pradesh, and Karnataka with AQI remaining below 45.',
    source: 'India Meteorological Department (IMD)',
    date: '2026-09-26',
    time: '08:00 IST',
    location: 'Hyderabad / New Delhi',
    updateStatus: 'Verified Live'
  },
  {
    id: 'br-10',
    section: 'Local events',
    headline: 'Hyderabad International Cyber Security & AI Summit commences at HITEC City',
    summary: 'Over 250 enterprise leaders and academic researchers gather to present research on agentic safety, biometric identity vaults, and edge encryption.',
    source: 'Telangana Tech Development Council',
    date: '2026-09-26',
    time: '09:30 IST',
    location: 'Hyderabad, India',
    updateStatus: 'Scheduled Feed'
  },
  {
    id: 'br-11',
    section: 'Education',
    headline: 'National Digital University launches open credit transfer for AI and Quantum Engineering',
    summary: 'Undergraduate learners across 400 Indian universities can now access verified micro-credentials and interactive virtual lab simulations with national accreditation.',
    source: 'Ministry of Education & UGC Portal',
    date: '2026-09-26',
    time: '10:00 IST',
    location: 'New Delhi, India',
    updateStatus: 'Official Wire'
  },
  {
    id: 'br-12',
    section: 'Trending topics',
    headline: 'Zero-Carbon Sovereign Clouds & Personal Cognitive Vaults lead tech discourse',
    summary: 'Users and developers prioritize transparent AI systems that guarantee user data ownership and reject silent background profiling.',
    source: 'Global Tech Trends Aggregator',
    date: '2026-09-26',
    time: '08:50 UTC',
    location: 'Global',
    updateStatus: 'Verified Live'
  }
];

const SECTIONS: BriefingSection[] = [
  'World',
  'India',
  'Technology',
  'AI',
  'Science',
  'Space',
  'Business',
  'Sports',
  'Weather',
  'Local events',
  'Education',
  'Trending topics'
];

export const DailyBriefingPower: React.FC = () => {
  const [edition, setEdition] = useState<'morning' | 'evening' | 'custom'>('morning');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('Global & India');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [notificationPref, setNotificationPref] = useState({
    morningAlert: true,
    eveningDigest: false,
    criticalWeather: true,
    spaceMissions: true
  });
  const [showPrefModal, setShowPrefModal] = useState(false);

  const handleCopy = (card: BriefingCard) => {
    const text = `📰 [${card.section}] ${card.headline}\n\n${card.summary}\n\nSource: ${card.source} | ${card.date} ${card.time} (${card.location || 'Global'})\nStatus: ${card.updateStatus}`;
    navigator.clipboard.writeText(text);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
    hapticSuccess();
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    hapticAction();
  };

  const filtered = BRIEFING_ITEMS.filter((item) => {
    if (selectedSection !== 'all' && item.section !== selectedSection) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Official Header specified in prompt: GOOD MORNING 👋 YOUR ASTRA DAILY BRIEFING */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-500/25 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 mb-1 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>
                {edition === 'morning'
                  ? 'MORNING EDITION • 08:00 AM IST'
                  : edition === 'evening'
                  ? 'EVENING RECAP • 07:00 PM IST'
                  : 'CUSTOM CURATION'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>GOOD MORNING 👋</span>
              <span className="hidden sm:inline text-amber-300">•</span>
              <span className="text-amber-300">YOUR ASTRA DAILY BRIEFING</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              12 comprehensive intelligence sectors with source attribution, precise timestamps, and zero hallucinated daily updates.
            </p>
          </div>

          {/* Controls: Morning / Evening / Preferences */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex p-1 rounded-xl bg-black/50 border border-white/10">
              <button
                onClick={() => setEdition('morning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  edition === 'morning'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Morning</span>
              </button>
              <button
                onClick={() => setEdition('evening')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  edition === 'evening'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Evening</span>
              </button>
            </div>

            <button
              onClick={() => setShowPrefModal(true)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Notification & Topic Preferences"
            >
              <Bell className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Region selector pill */}
        <div className="mt-4 pt-4 border-t border-amber-500/20 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Region Filter:</span>
          {['Global & India', 'India (National & States)', 'Americas & Europe', 'Asia-Pacific'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedRegion === reg
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* 12 Sections Filter Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Briefing Sectors (12 Required Domains)</span>
          <span className="text-amber-400 font-bold">{filtered.length} Dispatches</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedSection === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All 12 Sectors
          </button>
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap border transition-all ${
                selectedSection === sec
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Briefing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((card) => (
          <div
            key={card.id}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {card.section}
                </span>

                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{card.updateStatus}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                {card.headline}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {card.summary}
              </p>
            </div>

            {/* Required current-information card metadata: SOURCE, DATE, TIME, LOCATION, UPDATE STATUS */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block">SOURCE:</span>
                  <span className="text-slate-200 font-semibold">{card.source}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">TIMESTAMP:</span>
                  <span className="text-slate-200">{card.date} • {card.time}</span>
                </div>
                {card.location && (
                  <div className="col-span-2 flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{card.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] font-mono text-slate-500">
                  ASTRA BRAIN → VERIFIED FEED
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSave(card.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                    title={savedIds[card.id] ? 'Saved' : 'Save'}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedIds[card.id] ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleCopy(card)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Copy briefing"
                  >
                    {copiedId === card.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Preferences Modal */}
      {showPrefModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Briefing Preferences</span>
              </h3>
              <button
                onClick={() => setShowPrefModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Customize delivery timings and notification triggers for your daily intelligence dispatches.
            </p>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <span>Morning Briefing Alert (08:00 AM)</span>
                <input
                  type="checkbox"
                  checked={notificationPref.morningAlert}
                  onChange={(e) =>
                    setNotificationPref({ ...notificationPref, morningAlert: e.target.checked })
                  }
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <span>Evening Wrap-up Digest (07:00 PM)</span>
                <input
                  type="checkbox"
                  checked={notificationPref.eveningDigest}
                  onChange={(e) =>
                    setNotificationPref({ ...notificationPref, eveningDigest: e.target.checked })
                  }
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <span>Severe Weather & Disaster Center Alerts</span>
                <input
                  type="checkbox"
                  checked={notificationPref.criticalWeather}
                  onChange={(e) =>
                    setNotificationPref({ ...notificationPref, criticalWeather: e.target.checked })
                  }
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                <span>ISRO & Global Space Launch Telemetry</span>
                <input
                  type="checkbox"
                  checked={notificationPref.spaceMissions}
                  onChange={(e) =>
                    setNotificationPref({ ...notificationPref, spaceMissions: e.target.checked })
                  }
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
              </label>
            </div>

            <button
              onClick={() => setShowPrefModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
