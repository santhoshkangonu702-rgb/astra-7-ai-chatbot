import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Sliders,
  Sparkles,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Layers,
  Palette,
  Sun,
  Flame,
  CheckCircle2,
  Eye,
  ArrowLeft,
  ChevronRight,
  Music,
  Mic,
  Maximize2,
  FileVideo,
  Clapperboard,
  Sparkle,
  Type
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type CinemaStylePreset =
  | 'Epic Indian Fantasy'
  | 'Historical Epic'
  | 'Royal Kingdom'
  | 'Mythological-inspired Fantasy'
  | 'Warrior Epic'
  | 'Grand Battle Atmosphere'
  | 'Ancient Kingdom'
  | 'Futuristic 2040'
  | 'Sci-Fi'
  | 'Dark Fantasy'
  | 'Action Trailer'
  | 'Cinematic Trailer';

interface StyleConfig {
  id: CinemaStylePreset;
  label: string;
  tagline: string;
  colorGrade: string; // CSS filter description
  overlayFilter: string;
  lutName: string;
  vignette: string;
  letterbox: boolean;
  particles: 'embers' | 'dust' | 'fog' | 'neon' | 'none';
  audioTrack: string;
  defaultTitle: string;
  defaultSubtitle: string;
}

const CINEMA_PRESETS: Record<CinemaStylePreset, StyleConfig> = {
  'Epic Indian Fantasy': {
    id: 'Epic Indian Fantasy',
    label: 'Epic Indian Fantasy',
    tagline: 'Colossal ancient kingdoms, warrior valor, golden sunbeam optics & thunderous orchestral percussion',
    colorGrade: 'contrast(125%) saturate(145%) sepia(20%) hue-rotate(-10deg) brightness(105%)',
    overlayFilter: 'radial-gradient(ellipse at center, rgba(234,179,8,0.15) 0%, rgba(20,10,2,0.85) 100%)',
    lutName: 'Gold-Amber Bahubali Grade',
    vignette: 'inset 0 0 100px rgba(15,8,2,0.85)',
    letterbox: true,
    particles: 'embers',
    audioTrack: 'Rudra War Drums & Orchestral Sitar',
    defaultTitle: 'THE SOLAR DYNASTY',
    defaultSubtitle: 'AN ORIGINAL CINEMATIC SAGA'
  },
  'Historical Epic': {
    id: 'Historical Epic',
    label: 'Historical Epic',
    tagline: 'Raw textured sandstone, marching banners, authentic brass armor and dusty sun-drenched plains',
    colorGrade: 'contrast(118%) saturate(110%) sepia(28%) brightness(98%)',
    overlayFilter: 'radial-gradient(ellipse at center, rgba(217,119,6,0.1) 0%, rgba(10,5,0,0.8) 100%)',
    lutName: 'Bronze Chronicle 35mm',
    vignette: 'inset 0 0 90px rgba(0,0,0,0.7)',
    letterbox: true,
    particles: 'dust',
    audioTrack: 'Chants of the Ancient Empire',
    defaultTitle: 'EMPIRES OF STONE',
    defaultSubtitle: 'BEFORE THE DAWN OF MEN'
  },
  'Royal Kingdom': {
    id: 'Royal Kingdom',
    label: 'Royal Kingdom',
    tagline: 'Imperial gold leaf, deep royal velvet crimsons, ornate marble architraves & stately grandeur',
    colorGrade: 'contrast(120%) saturate(135%) brightness(102%)',
    overlayFilter: 'radial-gradient(circle, rgba(185,28,28,0.12) 0%, rgba(20,5,5,0.75) 100%)',
    lutName: 'Imperial Crimson & Gold',
    vignette: 'inset 0 0 80px rgba(30,10,10,0.8)',
    letterbox: true,
    particles: 'embers',
    audioTrack: 'Coronation Horns & Sacred Choirs',
    defaultTitle: 'CROWN OF THE SUN',
    defaultSubtitle: 'DYNASTIC ASCENSION'
  },
  'Mythological-inspired Fantasy': {
    id: 'Mythological-inspired Fantasy',
    label: 'Mythological-inspired Fantasy',
    tagline: 'Ethereal celestial radiance, mystical fog, divine auras and legendary weapon illuminations',
    colorGrade: 'contrast(130%) saturate(140%) brightness(110%)',
    overlayFilter: 'radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, rgba(10,5,25,0.8) 100%)',
    lutName: 'Celestial Astra Radiance',
    vignette: 'inset 0 0 110px rgba(10,2,20,0.85)',
    letterbox: true,
    particles: 'fog',
    audioTrack: 'Symphony of the Devas',
    defaultTitle: 'ASTRA REVEALED',
    defaultSubtitle: 'WHERE GODS ONCE WALKED'
  },
  'Warrior Epic': {
    id: 'Warrior Epic',
    label: 'Warrior Epic',
    tagline: 'High-contrast grit, clash of forged blades, intense warm backlighting & battle-hardened steel',
    colorGrade: 'contrast(135%) saturate(120%) brightness(95%)',
    overlayFilter: 'linear-gradient(180deg, rgba(234,88,12,0.12) 0%, rgba(5,5,5,0.8) 100%)',
    lutName: 'Blood & Forged Steel',
    vignette: 'inset 0 0 120px rgba(0,0,0,0.9)',
    letterbox: true,
    particles: 'embers',
    audioTrack: 'March of the 10,000 Blades',
    defaultTitle: 'WRATH OF THE VALIANT',
    defaultSubtitle: 'HONOR IN DESTINY'
  },
  'Grand Battle Atmosphere': {
    id: 'Grand Battle Atmosphere',
    label: 'Grand Battle Atmosphere',
    tagline: 'Massive scale armies, burning horizons, billowing smoke and earth-shaking war horns',
    colorGrade: 'contrast(140%) saturate(125%) hue-rotate(-5deg) brightness(98%)',
    overlayFilter: 'radial-gradient(ellipse, rgba(239,68,68,0.15) 0%, rgba(15,5,5,0.9) 100%)',
    lutName: 'Kurukshetra War Horizon',
    vignette: 'inset 0 0 140px rgba(10,0,0,0.92)',
    letterbox: true,
    particles: 'embers',
    audioTrack: 'Thunderclap of Armies',
    defaultTitle: 'BATTLE FOR THE REALM',
    defaultSubtitle: 'THE FINAL CONVERGENCE'
  },
  'Ancient Kingdom': {
    id: 'Ancient Kingdom',
    label: 'Ancient Kingdom',
    tagline: 'Timeless granite pillars, sacred temple courtyards, torchlit corridors and mystic reverence',
    colorGrade: 'contrast(115%) saturate(115%) sepia(22%) brightness(100%)',
    overlayFilter: 'radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, rgba(10,10,10,0.8) 100%)',
    lutName: 'Dravidian Temple Torchlight',
    vignette: 'inset 0 0 85px rgba(0,0,0,0.8)',
    letterbox: true,
    particles: 'dust',
    audioTrack: 'Temple Flute & Bronze Bells',
    defaultTitle: 'SANCTUM OF THE AGES',
    defaultSubtitle: 'SECRETS OF CHOLAS & PANDYAS'
  },
  'Futuristic 2040': {
    id: 'Futuristic 2040',
    label: 'Futuristic 2040',
    tagline: 'Ultra-clean cyan anamorphic flares, holographic interfaces and polished carbon titanium',
    colorGrade: 'contrast(125%) saturate(130%) brightness(105%) hue-rotate(15deg)',
    overlayFilter: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(2,6,23,0.85) 100%)',
    lutName: 'Quantum Nexus Teal-Cyan',
    vignette: 'inset 0 0 95px rgba(2,6,23,0.85)',
    letterbox: true,
    particles: 'neon',
    audioTrack: 'Cybernetic Pulse & Quantum Sub-Bass',
    defaultTitle: 'NEXUS 2040',
    defaultSubtitle: 'THE TRANSCENDENCE MATRIX'
  },
  'Sci-Fi': {
    id: 'Sci-Fi',
    label: 'Sci-Fi',
    tagline: 'Deep space obsidian, stellar nebulae, warp speed reflections and cold blue exterior hulls',
    colorGrade: 'contrast(130%) saturate(120%) brightness(98%) hue-rotate(180deg)',
    overlayFilter: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, rgba(2,6,23,0.9) 100%)',
    lutName: 'Interstellar Voyager Blue',
    vignette: 'inset 0 0 100px rgba(0,0,0,0.9)',
    letterbox: true,
    particles: 'neon',
    audioTrack: 'Gravity Well Soundscape',
    defaultTitle: 'BEYOND EVENT HORIZON',
    defaultSubtitle: 'DEEP SPACE TELEMETRY'
  },
  'Dark Fantasy': {
    id: 'Dark Fantasy',
    label: 'Dark Fantasy',
    tagline: 'Desaturated moonlight, blood moon shadows, brooding castle ruins and chilling whisper mist',
    colorGrade: 'contrast(145%) saturate(85%) brightness(88%) hue-rotate(-20deg)',
    overlayFilter: 'radial-gradient(ellipse, rgba(127,29,29,0.2) 0%, rgba(5,5,5,0.95) 100%)',
    lutName: 'Gothic Eclipse Bleach Bypass',
    vignette: 'inset 0 0 130px rgba(0,0,0,0.95)',
    letterbox: true,
    particles: 'fog',
    audioTrack: 'Requiem of the Fallen',
    defaultTitle: 'ECLIPSE OF SOULS',
    defaultSubtitle: 'WHERE SHADOWS DWELL'
  },
  'Action Trailer': {
    id: 'Action Trailer',
    label: 'Action Trailer',
    tagline: 'Fast paced rhythmic cuts, punchy teal & orange blockbusters, sub-bass braams and speed ramps',
    colorGrade: 'contrast(135%) saturate(140%) brightness(102%)',
    overlayFilter: 'linear-gradient(45deg, rgba(234,88,12,0.15) 0%, rgba(8,47,73,0.85) 100%)',
    lutName: 'Hollywood Blockbuster Teal-Orange',
    vignette: 'inset 0 0 105px rgba(0,0,0,0.85)',
    letterbox: true,
    particles: 'embers',
    audioTrack: 'Orchestral Hybrid BRAAM Trailer',
    defaultTitle: 'POINT OF IMPACT',
    defaultSubtitle: 'EVERY SECOND COUNTS'
  },
  'Cinematic Trailer': {
    id: 'Cinematic Trailer',
    label: 'Cinematic Trailer',
    tagline: 'Prestigious festival color grading, 2.39:1 cinemascope bars, atmospheric grain and quiet tension',
    colorGrade: 'contrast(120%) saturate(115%) brightness(100%)',
    overlayFilter: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, rgba(10,10,10,0.8) 100%)',
    lutName: 'Kodak Vision3 500T Stock',
    vignette: 'inset 0 0 75px rgba(0,0,0,0.75)',
    letterbox: true,
    particles: 'dust',
    audioTrack: 'Acoustic Cello & Atmospheric Piano',
    defaultTitle: 'THE ODYSSEY',
    defaultSubtitle: 'DIRECTED BY ASTRA 7'
  }
};

const SAMPLE_CLIPS = [
  {
    id: 'clip-palace',
    title: 'Imperial Fort & Citadel',
    duration: '0:14',
    url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
    type: 'image-backdrop'
  },
  {
    id: 'clip-battlefield',
    title: 'Warrior on Ancient Horizon',
    duration: '0:18',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    type: 'image-backdrop'
  },
  {
    id: 'clip-cyber',
    title: 'Futuristic Neo-Citadel 2040',
    duration: '0:12',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    type: 'image-backdrop'
  }
];

interface CinemaStudioPowerProps {
  onBack?: () => void;
}

export const CinemaStudioPower: React.FC<CinemaStudioPowerProps> = ({ onBack }) => {
  const [selectedStyle, setSelectedStyle] = useState<CinemaStylePreset>('Epic Indian Fantasy');
  const [pipelineStep, setPipelineStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.25 | 0.5 | 1 | 1.5 | 2>(1);
  const [isSlowMoSection, setIsSlowMoSection] = useState(true);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [splitPos, setSplitPos] = useState(50); // percentage for split view

  // Editing state
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(15);
  const [activeTab, setActiveTab] = useState<'style' | 'edit' | 'audio' | 'titles' | 'export'>('style');
  const [customTitle, setCustomTitle] = useState(CINEMA_PRESETS['Epic Indian Fantasy'].defaultTitle);
  const [customSubtitle, setCustomSubtitle] = useState(CINEMA_PRESETS['Epic Indian Fantasy'].defaultSubtitle);
  const [enableWidescreenBars, setEnableWidescreenBars] = useState(true);
  const [enableParticles, setEnableParticles] = useState(true);
  const [audioVolume, setAudioVolume] = useState(80);
  const [activeClipIndex, setActiveClipIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStyleConfig = CINEMA_PRESETS[selectedStyle];

  // Playback timer ticker
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= trimEnd) {
            setIsPlaying(false);
            return trimStart;
          }
          return prev + 0.1 * playbackSpeed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, trimEnd, trimStart]);

  const handleSelectPreset = (styleId: CinemaStylePreset) => {
    setSelectedStyle(styleId);
    setCustomTitle(CINEMA_PRESETS[styleId].defaultTitle);
    setCustomSubtitle(CINEMA_PRESETS[styleId].defaultSubtitle);
    triggerHaptic(18);
  };

  const togglePlay = () => {
    triggerHaptic(12);
    setIsPlaying(!isPlaying);
  };

  const handleResetTimeline = () => {
    setCurrentTime(trimStart);
    setIsPlaying(false);
    triggerHaptic(14);
  };

  const handleExportRender = () => {
    hapticSuccess();
    alert(`Rendering "${customTitle}" with [${selectedStyle}] grade (${currentStyleConfig.lutName}). Cinematic Master package downloaded.`);
  };

  return (
    <div id="astra-cinema-studio-power" className="w-full flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                triggerHaptic(12);
                onBack();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Clapperboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                ASTRA CINEMA STUDIO
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                AI CINEMATIC EDITOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Transform footage into epic Indian fantasy, royal kingdom sagas, or 2040 sci-fi cinema trailers
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              showBeforeAfter
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Before / After Split</span>
          </button>

          <button
            onClick={handleExportRender}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-rose-500/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Master</span>
          </button>
        </div>
      </div>

      {/* 6-Step Pipeline Visualizer */}
      <div className="border-b border-white/5 bg-slate-950 px-4 sm:px-8 py-2.5">
        <div className="flex items-center justify-between max-w-5xl mx-auto text-[11px] font-mono overflow-x-auto">
          {[
            { step: 1, label: 'VIDEO UPLOAD' },
            { step: 2, label: 'ANALYSIS' },
            { step: 3, label: 'SCENE DETECTION' },
            { step: 4, label: 'CINEMATIC STYLE' },
            { step: 5, label: 'AI EDITING' },
            { step: 6, label: 'EXPORT' }
          ].map((item, idx) => {
            const isDone = pipelineStep >= item.step;
            return (
              <div key={item.step} className="flex items-center gap-1.5 shrink-0 px-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-500'
                  }`}
                >
                  {item.step}
                </span>
                <span className={isDone ? 'text-slate-200 font-semibold' : 'text-slate-500'}>
                  {item.label}
                </span>
                {idx < 5 && <ChevronRight className="w-3 h-3 text-slate-700 mx-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Cinema Monitor Viewport */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] aspect-video sm:h-[420px] flex items-center justify-center">
          {/* Active Background Video / Frame */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={SAMPLE_CLIPS[activeClipIndex].url}
              alt="Footage"
              className="w-full h-full object-cover transition-all duration-300"
              style={{
                filter: showBeforeAfter ? undefined : currentStyleConfig.colorGrade,
                transform: isPlaying ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 10s ease-out'
              }}
            />

            {/* Split Screen Before / After Comparison */}
            {showBeforeAfter && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)` }}
              >
                <img
                  src={SAMPLE_CLIPS[activeClipIndex].url}
                  alt="Graded Footage"
                  className="w-full h-full object-cover"
                  style={{ filter: currentStyleConfig.colorGrade }}
                />
                <div
                  className="absolute top-4 right-4 px-2.5 py-1 rounded bg-rose-500/80 text-white font-mono text-[10px] uppercase font-bold"
                >
                  AI Graded ({selectedStyle})
                </div>
              </div>
            )}

            {showBeforeAfter && (
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-slate-900/80 text-slate-300 font-mono text-[10px] uppercase font-bold pointer-events-none">
                Original Log
              </div>
            )}
          </div>

          {/* Vignette & Ambient Radial Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: currentStyleConfig.overlayFilter,
              boxShadow: currentStyleConfig.vignette
            }}
          />

          {/* Floating Atmospheric Particles (Embers / Fog / Dust) */}
          {enableParticles && currentStyleConfig.particles === 'embers' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
              <div className="absolute w-2 h-2 rounded-full bg-amber-400 blur-[1px] animate-ping top-1/4 left-1/3" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-orange-500 blur-[1px] animate-pulse top-2/3 right-1/4" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping top-1/2 left-2/3" />
            </div>
          )}

          {/* 2.39:1 Cinemascope Letterbox Bars */}
          {enableWidescreenBars && (
            <>
              <div className="absolute top-0 left-0 right-0 h-10 sm:h-12 bg-black z-20 pointer-events-none shadow-md" />
              <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-black z-20 pointer-events-none shadow-md" />
            </>
          )}

          {/* Epic Title Card Overlay */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <h2
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-sans"
              style={{ letterSpacing: '0.2em' }}
            >
              {customTitle}
            </h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-2" />
            <p className="text-xs sm:text-sm font-mono tracking-widest text-amber-200/90 uppercase drop-shadow">
              {customSubtitle}
            </p>
          </div>

          {/* Central Play/Pause Trigger */}
          <button
            onClick={togglePlay}
            className="absolute z-40 p-4 rounded-full bg-slate-950/70 hover:bg-rose-500 border border-white/20 hover:border-transparent text-white transition-all transform hover:scale-110 shadow-2xl backdrop-blur-md"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
          </button>

          {/* Bottom Monitor Scrubber Bar */}
          <div className="absolute bottom-3 left-6 right-6 z-40 flex items-center justify-between text-xs font-mono text-white/90">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-amber-300">
                LUT: {currentStyleConfig.lutName}
              </span>
              <span className="text-[10px] text-slate-400">
                SPEED: {playbackSpeed}x {isSlowMoSection && '(SLOW-MO ON)'}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber & Speed Controls */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetTimeline}
                className="hover:text-white p-1 rounded bg-white/5"
                title="Rewind to start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span>Timeline Range: {trimStart.toFixed(1)}s ➔ {trimEnd.toFixed(1)}s</span>
            </div>
            {/* Speed Ramping */}
            <div className="flex items-center gap-1.5">
              <span>Speed:</span>
              {([0.25, 0.5, 1, 1.5, 2] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                    playbackSpeed === spd
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Progress Slider */}
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Editor Controls Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'style', label: '🎬 Cinematic Styles (12)', icon: Palette },
            { id: 'edit', label: '✂️ Trim & Slow-Mo', icon: Scissors },
            { id: 'audio', label: '🎵 Music & Soundscape', icon: Music },
            { id: 'titles', label: '✍️ Titles & Cards', icon: Type }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic(12);
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Cinematic Styles (12 Presets) */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Choose Original Cinematic Interpretation (12 Styles)</span>
              <span className="text-amber-400 font-bold">{selectedStyle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(Object.keys(CINEMA_PRESETS) as CinemaStylePreset[]).map((styleKey) => {
                const cfg = CINEMA_PRESETS[styleKey];
                const isSelected = selectedStyle === styleKey;
                return (
                  <button
                    key={styleKey}
                    onClick={() => handleSelectPreset(styleKey)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                        : 'border-white/10 bg-slate-900/60 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                          {cfg.label}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {cfg.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{cfg.lutName}</span>
                      <span className="uppercase text-amber-400/80">{cfg.particles}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Trim, Split & Slow-Mo */}
        {activeTab === 'edit' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase text-amber-400 flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                Trim In & Out Range
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>In-Point: {trimStart}s</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={trimEnd - 1}
                    value={trimStart}
                    onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Out-Point: {trimEnd}s</span>
                  </div>
                  <input
                    type="range"
                    min={trimStart + 1}
                    max={duration}
                    value={trimEnd}
                    onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase text-cyan-400 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Cinematic Effects & Slow-Motion
              </h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer text-xs">
                  <span>Slow-Motion Section (0.25x Hero Cadence)</span>
                  <input
                    type="checkbox"
                    checked={isSlowMoSection}
                    onChange={(e) => setIsSlowMoSection(e.target.checked)}
                    className="accent-amber-400 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer text-xs">
                  <span>2.39:1 Cinemascope Widescreen Bars</span>
                  <input
                    type="checkbox"
                    checked={enableWidescreenBars}
                    onChange={(e) => setEnableWidescreenBars(e.target.checked)}
                    className="accent-amber-400 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer text-xs">
                  <span>Atmospheric Particles ({currentStyleConfig.particles})</span>
                  <input
                    type="checkbox"
                    checked={enableParticles}
                    onChange={(e) => setEnableParticles(e.target.checked)}
                    className="accent-amber-400 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Audio & Orchestral Tracks */}
        {activeTab === 'audio' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
            <h4 className="text-xs font-mono uppercase text-amber-400 flex items-center gap-2">
              <Music className="w-4 h-4" />
              Synchronized Orchestral Soundtrack
            </h4>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">{currentStyleConfig.audioTrack}</div>
                <div className="text-xs text-slate-400">Mastered for high dynamic range & cinema surround</div>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseInt(e.target.value))}
                  className="w-28 accent-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Titles & Cards */}
        {activeTab === 'titles' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
            <h4 className="text-xs font-mono uppercase text-amber-400 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Cinematic Title Cards & Lower Thirds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Main Film Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm font-bold tracking-widest uppercase focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-sm font-mono tracking-wider uppercase focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
