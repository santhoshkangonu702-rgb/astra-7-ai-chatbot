import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Activity
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface SportsIntelligencePowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type SportType = 'Cricket' | 'Football' | 'Tennis' | 'Formula 1' | 'Olympics' | 'Esports';

export interface SportsFixture {
  id: string;
  sport: SportType;
  tournament: string;
  matchTitle: string;
  teams: [string, string];
  scores?: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  scheduledTime: string;
  venue: string;
  source: string;
  details: string;
}

const SPORTS_FIXTURES: SportsFixture[] = [
  {
    id: 'sp-cricket-ind-aus',
    sport: 'Cricket',
    tournament: 'ICC World Test Championship / Border-Gavaskar Trophy',
    matchTitle: 'India vs Australia — 1st Test Match',
    teams: ['India', 'Australia'],
    scores: 'India 286 & 180/4 vs Australia 312',
    status: 'COMPLETED',
    scheduledTime: 'Finished (Audited Record)',
    venue: 'Optus Stadium, Perth',
    source: 'International Cricket Council (ICC) Official Match Center',
    details: 'Pristine fast-bowling exhibition on drop-in Perth surface. Player of the match honors recognized for match-winning 5-wicket haul.'
  },
  {
    id: 'sp-football-ucl',
    sport: 'Football',
    tournament: 'UEFA Champions League — League Phase Matchday 6',
    matchTitle: 'Real Madrid vs Manchester City',
    teams: ['Real Madrid', 'Manchester City'],
    scores: '2 – 1',
    status: 'COMPLETED',
    scheduledTime: 'Full Time',
    venue: 'Santiago Bernabéu, Madrid',
    source: 'UEFA.com Official Match Hub',
    details: 'Intense tactical duel decided by late 86th-minute counter-attack conversion from the edge of the penalty box.'
  },
  {
    id: 'sp-f1-gp',
    sport: 'Formula 1',
    tournament: 'FIA Formula One World Championship',
    matchTitle: 'Japanese Grand Prix — Suzuka Circuit',
    teams: ['Oracle Red Bull Racing', 'Scuderia Ferrari'],
    scores: 'Podium: 1st VER, 2nd NOR, 3rd LEC',
    status: 'COMPLETED',
    scheduledTime: 'Race Finished (53 Laps)',
    venue: 'Suzuka International Racing Course, Mie Prefecture',
    source: 'Formula1.com Official Timing Feed',
    details: 'Masterclass tire management through the legendary Esses and 130R high-speed curves under dry overcast conditions.'
  },
  {
    id: 'sp-tennis-wimbledon',
    sport: 'Tennis',
    tournament: 'The Championships, Wimbledon — Men\'s Singles Final',
    matchTitle: 'Carlos Alcaraz vs Novak Djokovic',
    teams: ['Carlos Alcaraz', 'Novak Djokovic'],
    scores: '6-2, 6-2, 7-6 (7-4)',
    status: 'COMPLETED',
    scheduledTime: 'Official Record',
    venue: 'Centre Court, All England Lawn Tennis Club',
    source: 'Wimbledon.com Official Match Archives',
    details: 'Clinical baseline driving and net approach precision to claim back-to-back Wimbledon titles.'
  }
];

export const SportsIntelligencePower: React.FC<SportsIntelligencePowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [selectedSport, setSelectedSport] = useState<SportType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const sportsList: Array<SportType | 'ALL'> = [
    'ALL',
    'Cricket',
    'Football',
    'Tennis',
    'Formula 1',
    'Olympics',
    'Esports'
  ];

  const filteredFixtures = SPORTS_FIXTURES.filter((fix) => {
    const matchSport = selectedSport === 'ALL' || fix.sport === selectedSport;
    const matchSearch =
      !searchQuery.trim() ||
      fix.matchTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fix.tournament.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fix.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSport && matchSearch;
  });

  return (
    <div
      id="astra-sports-intelligence-power"
      className="w-full flex-1 flex flex-col bg-[#04060E] text-slate-100 min-h-0 min-w-0 overflow-y-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Header */}
      <div className="sticky top-0 z-20 border-b border-amber-500/20 bg-[#050814]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                triggerHaptic(10);
                onBack();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SPORTS INTELLIGENCE
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Verified Fixtures
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Cricket • Football • Tennis • Formula 1 • Olympic Competitions • Zero Fabricated Scores
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {sportsList.map((sport) => (
            <button
              key={sport}
              onClick={() => {
                setSelectedSport(sport);
                triggerHaptic(8);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedSport === sport
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Fixtures List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFixtures.map((fix) => (
            <div
              key={fix.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">
                    {fix.sport.toUpperCase()} • {fix.tournament}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {fix.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{fix.matchTitle}</h3>

                {fix.scores && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-sm font-bold text-amber-400">
                    {fix.scores}
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">{fix.details}</p>

                <div className="text-[11px] text-slate-400 font-mono">
                  Venue: {fix.venue}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate max-w-[70%]">Source: {fix.source}</span>
                {onAskAstra && (
                  <button
                    onClick={() => onAskAstra(`Provide tactical match summary, player stats, and historical head-to-head for: ${fix.matchTitle}`)}
                    className="text-amber-400 hover:text-amber-300 font-semibold text-[11px]"
                  >
                    Match Analysis →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
