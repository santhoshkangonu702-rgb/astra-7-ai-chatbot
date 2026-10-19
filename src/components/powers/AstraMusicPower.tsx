import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Music,
  Search,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Radio,
  Flame,
  Globe2,
  Disc3,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle2,
  ListMusic,
  SlidersHorizontal,
  Info,
  Clock,
  Loader2,
  BookmarkPlus,
  RefreshCw,
  AlertTriangle,
  Trash2,
  Plus
} from 'lucide-react';
import {
  musicManager,
  MusicTrack,
  PlayerState
} from '../../services/musicManager';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface AstraMusicPowerProps {
  onBack?: () => void;
  onAskAstra?: (query: string) => void;
}

export const AstraMusicPower: React.FC<AstraMusicPowerProps> = ({ onBack, onAskAstra }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All Languages');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    'All Languages',
    'Telugu',
    'Hindi',
    'Tamil',
    'Malayalam',
    'Kannada',
    'Punjabi',
    'Bengali',
    'English'
  ]);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'trending' | 'queue' | 'favorites'>('discover');

  // Player state from single MusicManager instance
  const [playerState, setPlayerState] = useState<PlayerState>('IDLE');
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [queue, setQueue] = useState<MusicTrack[]>([]);

  // Persistent favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('astra7_favorite_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchDebounceRef = useRef<any>(null);
  const genres = ['All', 'Soundtrack', 'Bollywood', 'Tollywood', 'Melody', 'Pop', 'Dance', 'Hip-Hop', 'Classical', 'Rock', 'R&B'];

  // Subscribe to singleton MusicManager
  useEffect(() => {
    const unsubscribe = musicManager.subscribe((snap) => {
      setPlayerState(snap.state);
      setCurrentTrack(snap.currentTrack);
      setCurrentTime(snap.currentTime);
      setDuration(snap.duration);
      setVolume(snap.volume);
      setIsMuted(snap.isMuted);
      setIsBuffering(snap.isBuffering);
      setErrorMessage(snap.errorMessage);
      setQueue(snap.queue);
    });

    return () => unsubscribe();
  }, []);

  // Save favorites to storage
  useEffect(() => {
    try {
      localStorage.setItem('astra7_favorite_tracks', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Initial load: languages & trending tracks
  useEffect(() => {
    loadLanguages();
    loadTrendingTracks(selectedLanguage);
  }, []);

  const loadLanguages = async () => {
    try {
      const res = await fetch('/api/music/languages');
      if (res.ok) {
        const data = await res.json();
        if (data.languages && Array.isArray(data.languages)) {
          setAvailableLanguages(data.languages);
        }
      }
    } catch {}
  };

  const loadTrendingTracks = async (lang: string) => {
    setIsLoading(true);
    try {
      const results = await musicManager.getTrendingTracks(lang);
      setTracks(results);
      if (results.length > 0 && !currentTrack) {
        // Pre-populate queue with remaining tracks
        musicManager.setQueue(results.slice(1, 10));
      }
    } catch {
      setErrorMessage('Could not load trending tracks. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = useCallback(async (query: string, lang: string) => {
    if (!query.trim()) {
      loadTrendingTracks(lang);
      return;
    }
    setIsLoading(true);
    try {
      const results = await musicManager.searchTracks(query, lang);
      setTracks(results);
      if (results.length > 1) {
        musicManager.setQueue(results.slice(1, 10));
      }
    } catch {
      setErrorMessage('Search error encountered. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim().length > 1) {
      fetch(`/api/music/suggestions?q=${encodeURIComponent(value)}`)
        .then((r) => r.json())
        .then((d) => setSuggestions(d.suggestions || []))
        .catch(() => {});
    } else {
      setSuggestions([]);
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      performSearch(value, selectedLanguage);
    }, 320);
  };

  const handlePlayTrack = (track: MusicTrack) => {
    triggerHaptic(12);
    musicManager.playTrack(track);
  };

  const handleTogglePlayPause = () => {
    triggerHaptic(12);
    if (!currentTrack) {
      if (tracks.length > 0) {
        musicManager.playTrack(tracks[0]);
      }
      return;
    }
    musicManager.togglePlayPause();
  };

  const handleNextTrack = () => {
    triggerHaptic(10);
    const handled = musicManager.nextTrack();
    if (!handled && tracks.length > 0 && currentTrack) {
      // Loop around tracks list
      const idx = tracks.findIndex((t) => t.id === currentTrack.id);
      const nextIdx = (idx + 1) % tracks.length;
      musicManager.playTrack(tracks[nextIdx]);
    }
  };

  const handlePreviousTrack = () => {
    triggerHaptic(10);
    const handled = musicManager.prevTrack();
    if (!handled && tracks.length > 0 && currentTrack) {
      const idx = tracks.findIndex((t) => t.id === currentTrack.id);
      const prevIdx = (idx - 1 + tracks.length) % tracks.length;
      musicManager.playTrack(tracks[prevIdx]);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    musicManager.seek(val);
  };

  const handleToggleFavorite = (trackId: string) => {
    triggerHaptic(14);
    setFavorites((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const displayedTracks = tracks.filter((t) => {
    if (selectedGenre !== 'All' && t.genre && !t.genre.toLowerCase().includes(selectedGenre.toLowerCase())) {
      return false;
    }
    return true;
  });

  const favoriteTracks = tracks.filter((t) => favorites.includes(t.id));
  const isPlaying = playerState === 'PLAYING';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-48 space-y-6 select-none font-['Inter',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0"
              title="Return to Astra 7"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Music className="w-5 h-5 text-amber-400" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                ASTRA MUSIC
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Authorized Playback
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              High-fidelity audio streaming • Official 30s previews across Telugu, Hindi, Tamil & Global repertoires
            </p>
          </div>
        </div>

        {/* AI Music Command Advisor */}
        {onAskAstra && (
          <button
            onClick={() => onAskAstra('Recommend high-energy music for deep work and coding focus.')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Music Advisor</span>
          </button>
        )}
      </div>

      {/* Error / Diagnostic Alert Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentTrack) {
                  musicManager.playTrack(currentTrack);
                } else {
                  loadTrendingTracks(selectedLanguage);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:brightness-110 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
            {currentTrack?.providerUrl && (
              <a
                href={currentTrack.providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1"
              >
                <span>Open Provider</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white text-xs ml-1">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search songs, artists, soundtracks (e.g. Arijit Singh, Naatu Naatu, Sid Sriram, Kesariya, Blinding Lights)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/60 border border-amber-500/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                loadTrendingTracks(selectedLanguage);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Suggestions Pills */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-slate-500 font-mono">Suggestions:</span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(s);
                  setSuggestions([]);
                  performSearch(s, selectedLanguage);
                }}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/15 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 text-xs transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Filter Controls: Language & Genre Pills */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
          {/* Languages */}
          <div className="flex items-center gap-1.5 shrink-0">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  triggerHaptic(8);
                  setSelectedLanguage(lang);
                  if (searchQuery.trim()) {
                    performSearch(searchQuery, lang);
                  } else {
                    loadTrendingTracks(lang);
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                  selectedLanguage === lang
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Discover | Trending | Queue | Favorites */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'discover', label: 'All Catalog', icon: Disc3, count: displayedTracks.length },
            { id: 'trending', label: 'Trending Hits', icon: Flame },
            { id: 'queue', label: 'Queue', icon: ListMusic, count: queue.length },
            { id: 'favorites', label: 'Saved', icon: Heart, count: favoriteTracks.length }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic(8);
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Track List Grid */}
      {activeTab === 'queue' ? (
        // Queue Tab View
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-amber-400" />
              <span>Up Next in Queue ({queue.length})</span>
            </h3>
            {queue.length > 0 && (
              <button
                onClick={() => musicManager.clearQueue()}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Queue</span>
              </button>
            )}
          </div>

          {queue.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              Queue is empty. Click "+ Queue" on any track to add songs.
            </div>
          ) : (
            <div className="space-y-1.5">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/30 group text-xs transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center font-mono text-slate-500 text-[10px]">{idx + 1}</span>
                    <img
                      src={track.artworkUrl}
                      alt={track.title}
                      className="w-9 h-9 rounded-lg object-cover border border-white/10"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{track.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{track.artist}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                      title="Play now"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => musicManager.removeFromQueue(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'favorites' ? (
        // Favorites View
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-current" />
            <span>Saved Favorites ({favoriteTracks.length})</span>
          </h3>

          {favoriteTracks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              No favorite songs saved yet. Click the heart icon on any song to save it.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {favoriteTracks.map((track) => renderTrackCard(track))}
            </div>
          )}
        </div>
      ) : (
        // Discover / Trending Tracks Grid
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing {displayedTracks.length} verified tracks with authorized streams</span>
          </div>

          {displayedTracks.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono">
              No tracks found matching your search. Try another artist or song name.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {displayedTracks.map((track) => renderTrackCard(track))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sticky Player Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#060814]/95 backdrop-blur-2xl border-t border-amber-500/30 p-3 sm:p-4 shadow-[0_-10px_35px_rgba(0,0,0,0.85)] select-none">
          <div className="max-w-6xl mx-auto flex flex-col gap-2">
            {/* Upper row: Track metadata & Playback Status */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-amber-500/40 shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white truncate font-['Space_Grotesk',sans-serif]">
                      {currentTrack.title}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                      30s Preview
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {currentTrack.artist} {currentTrack.album ? `• ${currentTrack.album}` : ''}
                  </div>
                </div>
              </div>

              {/* External Provider Link */}
              <a
                href={currentTrack.providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-mono transition-colors shrink-0"
                title="Open track on authorized provider"
              >
                <span>{currentTrack.provider}</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
            </div>

            {/* Middle row: Timeline Scrubber */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 30}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 30)}</span>
              </div>
            </div>

            {/* Bottom row: Controls (⏮ ▶/⏸ ⏭, Volume, Queue, Save) */}
            <div className="flex items-center justify-between pt-0.5 flex-wrap gap-2">
              {/* Left: Volume Slider */}
              <div className="flex items-center gap-2 w-28 sm:w-36">
                <button
                  onClick={() => musicManager.toggleMute()}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => musicManager.setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Center: ⏮ ▶ / ⏸ ⏭ */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreviousTrack}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors active:scale-95"
                  title="Previous Track (⏮)"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={handleTogglePlayPause}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(245,184,46,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isBuffering ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors active:scale-95"
                  title="Next Track (⏭)"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Right: Add to Queue & Favorite */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerHaptic(10);
                    musicManager.addToQueue(currentTrack);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1"
                  title="Add to queue"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Queue</span>
                </button>

                <button
                  onClick={() => handleToggleFavorite(currentTrack.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    favorites.includes(currentTrack.id)
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'hover:bg-white/10 text-slate-400 hover:text-white'
                  }`}
                  title="Favorite Track"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(currentTrack.id) ? 'fill-current text-rose-400' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderTrackCard(track: MusicTrack) {
    const isCurrent = currentTrack?.id === track.id;
    const isCurrentPlaying = isCurrent && isPlaying;
    const isFav = favorites.includes(track.id);

    return (
      <div
        key={track.id}
        onClick={() => handlePlayTrack(track)}
        className={`group p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
          isCurrent
            ? 'bg-gradient-to-br from-amber-500/20 via-black to-[#060814] border-amber-500/50 shadow-[0_0_25px_rgba(245,184,46,0.18)]'
            : 'bg-black/50 hover:bg-black/80 border-white/5 hover:border-amber-500/30'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Artwork with overlay play button */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
            <img
              src={track.artworkUrl}
              alt={track.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                isCurrentPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {isCurrentPlaying ? (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md animate-pulse">
                  <Pause className="w-4 h-4 fill-current" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </div>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                {track.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {track.duration || '3:30'}
              </span>
            </div>
            <div className="text-xs text-slate-400 truncate mt-0.5">
              {track.artist}
            </div>
            {track.movie ? (
              <div className="text-[10px] text-amber-400/80 truncate font-mono mt-0.5">
                🎬 {track.movie}
              </div>
            ) : track.album ? (
              <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                {track.album}
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom card details: Language badge, Provider, Actions */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/5 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
            {track.language}
          </span>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {/* Add to Queue */}
            <button
              onClick={() => {
                triggerHaptic(8);
                musicManager.addToQueue(track);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
              title="Add to Queue"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Favorite button */}
            <button
              onClick={() => handleToggleFavorite(track.id)}
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
              title="Save to favorites"
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-400' : ''}`}
              />
            </button>

            {/* External link */}
            <a
              href={track.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              title={`Listen on ${track.provider}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }
};
