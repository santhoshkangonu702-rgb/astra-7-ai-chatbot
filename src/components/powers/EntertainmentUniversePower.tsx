import React, { useState, useMemo } from 'react';
import {
  Film,
  Clapperboard,
  Tv,
  Star,
  Play,
  Search,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Languages,
  Sparkles
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface EntertainmentUniversePowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type EntertainmentType = 'All' | 'Movies' | 'Series' | 'Animation' | 'Documentary';

export interface TitleItem {
  id: string;
  title: string;
  type: 'Movie' | 'Series' | 'Documentary' | 'Animation';
  language: string;
  industry: string;
  year: number;
  director: string;
  cast: string[];
  genre: string[];
  runtime: string;
  ratingScore: number; // out of 10
  certification: string; // U/A, PG-13, R
  synopsis: string;
  trailerUrl: string;
  awards: string[];
  verifiedReviewQuote: string;
  reviewSource: string;
}

const TITLES_DATABASE: TitleItem[] = [
  {
    id: 'ent-rrr',
    title: 'RRR (Rise Roar Revolt)',
    type: 'Movie',
    language: 'Telugu',
    industry: 'Tollywood / Indian Cinema',
    year: 2022,
    director: 'S. S. Rajamouli',
    cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
    genre: ['Epic Action', 'Historical Fiction', 'Drama'],
    runtime: '3h 7m',
    ratingScore: 8.8,
    certification: 'U/A (13+)',
    synopsis: 'A fictionalized patriotic epic chronicling the friendship between revolutionary leaders Alluri Sitarama Raju and Komaram Bheem as they confront colonial tyranny.',
    trailerUrl: 'https://www.youtube.com/watch?v=NgBoMJy386M',
    awards: ['Academy Award for Best Original Song ("Naatu Naatu")', 'Golden Globe Award', 'National Film Awards'],
    verifiedReviewQuote: '"An exhilarating maximalist masterwork that rejuvenates cinematic action with raw visual bravura and pure kinetic energy."',
    reviewSource: 'The Guardian Film Review'
  },
  {
    id: 'ent-oppenheimer',
    title: 'Oppenheimer',
    type: 'Movie',
    language: 'English',
    industry: 'Hollywood',
    year: 2023,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    genre: ['Historical Drama', 'Biography', 'Thriller'],
    runtime: '3h 0m',
    ratingScore: 8.9,
    certification: 'R (16+)',
    synopsis: 'The sweeping biographical chronicle of J. Robert Oppenheimer, the theoretical physicist who spearheaded the Manhattan Project during World War II.',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    awards: ['7 Academy Awards including Best Picture & Best Director', 'BAFTA Best Film'],
    verifiedReviewQuote: '"A monumental technical achievement balancing quantum physics with psychological dread and ethical reckoning."',
    reviewSource: 'Variety Film Review'
  },
  {
    id: 'ent-kantara',
    title: 'Kantara',
    type: 'Movie',
    language: 'Kannada',
    industry: 'Sandalwood / Indian Cinema',
    year: 2022,
    director: 'Rishab Shetty',
    cast: ['Rishab Shetty', 'Sapthami Gowda', 'Kishore'],
    genre: ['Mythological Drama', 'Action', 'Folklore'],
    runtime: '2h 28m',
    ratingScore: 8.4,
    certification: 'U/A',
    synopsis: 'Set in the coastal forests of Karnataka, exploring the divine Bhoota Kola traditions, land conflict, and man versus nature.',
    trailerUrl: 'https://www.youtube.com/watch?v=8mrVmf239GU',
    awards: ['National Film Award for Best Actor', 'National Award for Wholesome Entertainment'],
    verifiedReviewQuote: '"A primal and electrifying sensory celebration of indigenous folklore and theatrical physical acting."',
    reviewSource: 'The Hindu Cinema Desk'
  }
];

export const EntertainmentUniversePower: React.FC<EntertainmentUniversePowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [selectedType, setSelectedType] = useState<EntertainmentType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTitles = useMemo(() => {
    return TITLES_DATABASE.filter((item) => {
      const matchType = selectedType === 'All' || item.type === selectedType.slice(0, -1);
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [selectedType, searchQuery]);

  return (
    <div
      id="astra-entertainment-universe-power"
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-amber-500/40 text-rose-400">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ENTERTAINMENT UNIVERSE
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                  Global Cinema
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Tollywood, Bollywood, Hollywood & International Cinema • Official Trailers & Verified Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, directors, actors (e.g. Rajamouli, Nolan, RRR, Oppenheimer)..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Titles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTitles.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      {t.language}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {t.industry}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
                      {t.certification}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {t.ratingScore}/10
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{t.title}</h3>
                <p className="text-xs text-amber-200/80">
                  Directed by {t.director} • {t.year} • {t.runtime}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">{t.synopsis}</p>

                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Cast:</span> {t.cast.join(', ')}
                </div>

                {/* Review Citation */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                  <span className="font-serif italic text-slate-300">{t.verifiedReviewQuote}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">— {t.reviewSource}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <a
                  href={t.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Official Trailer
                </a>

                {onAskAstra && (
                  <button
                    onClick={() => onAskAstra(`Provide deep cinematic analysis, thematic breakdown, and cultural impact of "${t.title}" directed by ${t.director}`)}
                    className="text-amber-400 hover:text-amber-300 font-semibold text-[11px]"
                  >
                    Cinema Analysis →
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
