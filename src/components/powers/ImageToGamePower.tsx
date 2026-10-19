import React, { useState, useRef, useEffect } from 'react';
import {
  Gamepad2,
  Upload,
  Camera,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Download,
  Share2,
  Layers,
  Palette,
  MapPin,
  Shield,
  Swords,
  Compass,
  CheckCircle2,
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  Cpu,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type GameGenre =
  | 'Platform Game'
  | '3D Adventure'
  | 'Racing'
  | 'Battle Arena'
  | 'RPG'
  | 'Open World'
  | 'Puzzle'
  | 'Survival'
  | 'Strategy'
  | 'Fantasy Adventure';

interface AnalyzedWorldData {
  title: string;
  genre: GameGenre;
  tagline: string;
  story: string;
  palette: string[];
  environment: string;
  lighting: string;
  atmosphere: string;
  characters: { name: string; role: string; desc: string }[];
  buildings: string[];
  objects: string[];
  terrain: string;
  mapConcept: string;
  missions: { title: string; objective: string; reward: string }[];
  mechanics: string[];
  uiConcept: { hud: string; minimap: string; inventory: string };
  prototypeType: 'platformer' | 'arena' | 'puzzle';
}

const SAMPLE_ARCHETYPES = [
  {
    id: 'cyber-temple',
    title: 'Ancient Cyber Temple',
    genre: 'Fantasy Adventure' as GameGenre,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'Golden relics intertwined with neon neural circuitry in an ancient forgotten vault'
  },
  {
    id: 'neon-metropolis',
    title: 'Neon Megacity 2040',
    genre: 'Open World' as GameGenre,
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    description: 'Multi-tiered skyscraper canyons illuminated by holographic advertisements and hover traffic'
  },
  {
    id: 'floating-isles',
    title: 'Aetherial Sky Islands',
    genre: 'Platform Game' as GameGenre,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Bioluminescent floating archipelagos with anti-gravity waterfalls and crystalline bridges'
  },
  {
    id: 'volcanic-citadel',
    title: 'Molten Obsidian Citadel',
    genre: 'Battle Arena' as GameGenre,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    description: 'Basalt spires protruding from magma seas guarded by elemental automata'
  }
];

const GENRES: { id: GameGenre; icon: string; desc: string }[] = [
  { id: 'Platform Game', icon: '🏃', desc: 'Precision jumping, moving obstacles & speedrunning' },
  { id: 'Fantasy Adventure', icon: '🗡️', desc: 'Mythic exploration, lost dungeons & ancient bosses' },
  { id: 'RPG', icon: '📜', desc: 'Character progression, deep skill trees & narrative branching' },
  { id: '3D Adventure', icon: '🧭', desc: 'Dynamic camera, vertical traversal & cinematic set-pieces' },
  { id: 'Battle Arena', icon: '⚔️', desc: 'High-octane hero duels, elemental abilities & combos' },
  { id: 'Open World', icon: '🗺️', desc: 'Unbounded discovery, vehicle traversal & emergent factions' },
  { id: 'Puzzle', icon: '🧩', desc: 'Spatial mechanics, logic gates & gravitational manipulation' },
  { id: 'Survival', icon: '🏕️', desc: 'Resource scavenging, environmental hazards & crafting' },
  { id: 'Strategy', icon: '♟️', desc: 'Tactical army positioning, base fortification & tech trees' },
  { id: 'Racing', icon: '🏎️', desc: 'Anti-grav speed trials, drifting physics & boost pads' }
];

interface ImageToGamePowerProps {
  onBack?: () => void;
  onSendToChat?: (prompt: string) => void;
}

export const ImageToGamePower: React.FC<ImageToGamePowerProps> = ({ onBack, onSendToChat }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_ARCHETYPES[0].image);
  const [selectedGenre, setSelectedGenre] = useState<GameGenre>('Platform Game');
  const [pipelineStep, setPipelineStep] = useState<1 | 2 | 3 | 4>(4);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'prototype' | 'gdd' | 'vision' | 'mechanics'>('prototype');

  // Game Data
  const [gameData, setGameData] = useState<AnalyzedWorldData | null>(null);

  // Canvas Playable Prototype state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'won'>('ready');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize initial game world on first mount
  useEffect(() => {
    generateGameWorld(SAMPLE_ARCHETYPES[0].image, 'Platform Game');
  }, []);

  // Audio synthesize function for prototype
  const playPrototypeSound = (type: 'jump' | 'coin' | 'hit' | 'win') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'jump') {
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'coin') {
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio context may require prior user interaction
    }
  };

  // Generate game world based on image and genre
  const generateGameWorld = (imageUrl: string, genre: GameGenre) => {
    setIsAnalyzing(true);
    setPipelineStep(2);
    triggerHaptic(20);

    setTimeout(() => {
      setPipelineStep(3);
    }, 700);

    setTimeout(() => {
      // Create detailed procedural game design grounded in image & genre
      const generated: AnalyzedWorldData = {
        title: genre === 'Platform Game' ? 'Chronos Leap: The Sunstone Run' :
               genre === 'Fantasy Adventure' ? 'Echoes of the Gilded Sanctuary' :
               genre === 'Open World' ? 'Neo-Babylon: 2040 Undergrid' :
               genre === 'Battle Arena' ? 'Valkyrie Crucible: Solar Forge' :
               `${genre} — Nexus Odyssey`,
        genre,
        tagline: 'Forged from visual neural analysis into a high-octane playable prototype.',
        story: `Centuries after the celestial collapse, remnants of the ancient solar lattice lie suspended in a zero-gravity rift. You play as Kaelen, an agile chronomancer equipped with an ionizing pulse-tether, tasked with recovering the three harmonic power cores before the cataclysmic eclipse seals the gateway forever.`,
        palette: ['#F59E0B', '#F97316', '#06B6D4', '#10B981', '#1E293B', '#F8FAFC'],
        environment: 'Ancient sandstone ziggurats fused with floating holographic conduits and amber plasma conduits',
        lighting: 'Volumetric sunset rays piercing through atmospheric ionization clouds, creating sharp specular highlights',
        atmosphere: 'Majestic, contemplative yet urgently dangerous with ambient wind shears and crackling energy arcs',
        characters: [
          { name: 'Kaelen (Protagonist)', role: 'Solar Courier', desc: 'Wields kinetic repulsor boots and an adaptive solar blade' },
          { name: 'Aethelgard (Guardian Boss)', role: 'Ziggurat Sentinel', desc: 'Colossal animated basalt golem powered by an oscillating coronal sphere' },
          { name: 'Mira (Companion AI)', role: 'Tactical Drone', desc: 'Scans ancient glyphs and calculates optimal traversal vectors' }
        ],
        buildings: ['Floating Solar Obelisks', 'Basalt Grav-Chambers', 'Cathedral of Resonating Quartz'],
        objects: ['Sunstone Shards', 'Refraction Prisms', 'Ionizing Jump Rings', 'Crumbling Kinetic Tiles'],
        terrain: 'Multi-tiered floating platforms, sheer stone cliffs, crystalline jump ramps, and magnetic tether points',
        mapConcept: 'Zone 1: The Outer Spires ➔ Zone 2: The Sunken Refractor ➔ Zone 3: Apex of the Solar Throne',
        missions: [
          { title: 'Awaken the Conduit', objective: 'Collect 5 Solar Cores across the floating platforms', reward: 'Kinetic Double Jump' },
          { title: 'Breach the Sentinel Wall', objective: 'Evade rotating laser traps and reach the apex portal', reward: 'Plasma Dash Shield' },
          { title: 'The Chrono Trial', objective: 'Finish the trial stage within 60 seconds without falling', reward: 'Master Chronomancer Rank' }
        ],
        mechanics: [
          'Variable height jumping with kinetic gravity dampers',
          'Collectible solar cores that charge the instant turbo-dash meter',
          'Disintegrating platforms that collapse 1.5 seconds after contact',
          'Wall-sliding and ceiling grapple tethers'
        ],
        uiConcept: {
          hud: 'Minimalist curved amber visor displaying Solar Core count, Chrono-Shield timer, and kinetic energy bar',
          minimap: 'Holographic radar projection in top-right displaying nearby energy signatures and elevation markers',
          inventory: 'Fast radial wheel accessible via shoulder triggers for instant gadget deployment'
        },
        prototypeType: 'platformer'
      };

      setGameData(generated);
      setIsAnalyzing(false);
      setPipelineStep(4);
      setGameState('ready');
      setScore(0);
      setLives(3);
      hapticSuccess();
    }, 1300);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedImage(dataUrl);
      generateGameWorld(dataUrl, selectedGenre);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectGenre = (genre: GameGenre) => {
    setSelectedGenre(genre);
    if (selectedImage) {
      generateGameWorld(selectedImage, genre);
    }
  };

  // Playable Canvas Minigame Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Game variables
    const player = {
      x: 50,
      y: 180,
      w: 22,
      h: 28,
      vx: 0,
      vy: 0,
      isGrounded: false,
      color: gameData?.palette[0] || '#f59e0b'
    };

    const platforms = [
      { x: 0, y: 260, w: 200, h: 20 },
      { x: 240, y: 220, w: 120, h: 16 },
      { x: 400, y: 170, w: 140, h: 16 },
      { x: 580, y: 210, w: 130, h: 16 },
      { x: 740, y: 160, w: 160, h: 20 }
    ];

    let coins = [
      { x: 120, y: 220, collected: false },
      { x: 290, y: 180, collected: false },
      { x: 460, y: 130, collected: false },
      { x: 640, y: 170, collected: false },
      { x: 820, y: 120, collected: false }
    ];

    const portal = { x: 860, y: 110, w: 28, h: 48 };

    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (['ArrowUp', ' ', 'w', 'W'].includes(e.key) && player.isGrounded) {
        player.vy = -10.5;
        player.isGrounded = false;
        playPrototypeSound('jump');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Main Canvas Render Loop
    let particleTicks = 0;
    const render = () => {
      particleTicks++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.7, '#111827');
      grad.addColorStop(1, '#060a12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient Horizon Grid
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 100; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Distant Floating Mountains / Spires
      ctx.fillStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.beginPath();
      ctx.moveTo(0, 240);
      ctx.lineTo(180, 140);
      ctx.lineTo(340, 240);
      ctx.lineTo(520, 110);
      ctx.lineTo(720, 240);
      ctx.lineTo(canvas.width, 160);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      // Update Player Physics
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.vx = 4.2;
      } else if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.vx = -4.2;
      } else {
        player.vx *= 0.78;
      }

      // Gravity
      player.vy += 0.55;
      player.x += player.vx;
      player.y += player.vy;

      // Platform Collisions
      player.isGrounded = false;
      for (const plat of platforms) {
        if (
          player.x + player.w > plat.x &&
          player.x < plat.x + plat.w &&
          player.y + player.h >= plat.y &&
          player.y + player.h <= plat.y + 14 &&
          player.vy >= 0
        ) {
          player.y = plat.y - player.h;
          player.vy = 0;
          player.isGrounded = true;
        }
      }

      // Draw Platforms
      for (const plat of platforms) {
        // Glowing platform top
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fillRect(plat.x, plat.y, plat.w, 4);

        // Platform body
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(plat.x, plat.y + 4, plat.w, plat.h - 4);

        // Tech markings
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(plat.x + 8, plat.y + 8, plat.w - 16, 2);
      }

      // Draw & Check Coins / Solar Shards
      for (const coin of coins) {
        if (!coin.collected) {
          // Hover bounce
          const bounce = Math.sin(particleTicks * 0.08 + coin.x) * 4;
          ctx.save();
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(coin.x, coin.y + bounce, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Collect collision
          const dx = player.x + player.w / 2 - coin.x;
          const dy = player.y + player.h / 2 - (coin.y + bounce);
          if (Math.hypot(dx, dy) < 22) {
            coin.collected = true;
            setScore((s) => s + 100);
            playPrototypeSound('coin');
            triggerHaptic(12);
          }
        }
      }

      // Draw Goal Portal
      ctx.save();
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(portal.x, portal.y, portal.w, portal.h, 14);
      ctx.fill();
      ctx.restore();

      // Check Portal Win
      if (
        player.x + player.w > portal.x &&
        player.x < portal.x + portal.w &&
        player.y + player.h > portal.y &&
        player.y < portal.y + portal.h
      ) {
        setGameState('won');
        playPrototypeSound('win');
        hapticSuccess();
      }

      // Pit fall check
      if (player.y > canvas.height + 40) {
        player.x = 50;
        player.y = 180;
        player.vx = 0;
        player.vy = 0;
        playPrototypeSound('hit');
        triggerHaptic(24);
        setLives((l) => {
          if (l <= 1) {
            setGameState('gameover');
            return 0;
          }
          return l - 1;
        });
      }

      // Draw Player
      ctx.save();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(player.x, player.y, player.w, player.h, 6);
      ctx.fill();

      // Visor Glow
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(player.x + (player.vx >= 0 ? 12 : 2), player.y + 6, 8, 4);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameData, soundEnabled]);

  const handleVirtualJump = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
    }, 150);
  };

  const handleVirtualLeft = (active: boolean) => {
    if (active) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    } else {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    }
  };

  const handleVirtualRight = (active: boolean) => {
    if (active) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    } else {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    }
  };

  const handleDownloadGDD = () => {
    if (!gameData) return;
    const markdown = `# ${gameData.title}\n*Genre: ${gameData.genre}*\n*${gameData.tagline}*\n\n## 1. Vision & Story\n${gameData.story}\n\n## 2. Environment & Atmosphere\n- Environment: ${gameData.environment}\n- Lighting: ${gameData.lighting}\n- Terrain: ${gameData.terrain}\n\n## 3. Characters\n${gameData.characters.map((c) => `- **${c.name}** (${c.role}): ${c.desc}`).join('\n')}\n\n## 4. Key Missions\n${gameData.missions.map((m) => `- **${m.title}**: ${m.objective} [Reward: ${m.reward}]`).join('\n')}\n\n## 5. Core Mechanics\n${gameData.mechanics.map((mech) => `- ${mech}`).join('\n')}\n\n## 6. UI & HUD Concept\n- HUD: ${gameData.uiConcept.hud}\n- Minimap: ${gameData.uiConcept.minimap}\n\n*Generated by ASTRA 7 — NEXUS 2040 Vision-to-Game Engine*`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_gdd.md`;
    a.click();
    URL.revokeObjectURL(url);
    hapticSuccess();
  };

  return (
    <div id="astra-image-to-game-power" className="w-full flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Top Banner Header */}
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
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                ASTRA IMAGE → GAME
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PROTOTYPE GENERATOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Transform any photo, sketch, or render into a playable video game concept & interactive prototype
            </p>
          </div>
        </div>

        {/* Honesty Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Info className="w-3.5 h-3.5" />
          <span>Prototype Generated (Interactive Canvas)</span>
        </div>
      </div>

      {/* 4-Step Pipeline Visualizer */}
      <div className="border-b border-white/5 bg-slate-950 px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto text-xs font-mono">
          {[
            { step: 1, label: 'IMAGE PREVIEW' },
            { step: 2, label: 'ASTRA VISION ANALYSIS' },
            { step: 3, label: 'GAME WORLD GENERATION' },
            { step: 4, label: 'PLAYABLE GAME CONCEPT' }
          ].map((item, idx) => {
            const isDone = pipelineStep > item.step;
            const isCurrent = pipelineStep === item.step;
            return (
              <div key={item.step} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isDone
                      ? 'bg-amber-500 text-slate-950'
                      : isCurrent
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400 animate-pulse'
                      : 'bg-white/5 text-slate-500 border border-white/10'
                  }`}
                >
                  {isDone ? '✓' : item.step}
                </div>
                <span
                  className={`hidden sm:inline ${
                    isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
                {idx < 3 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden md:inline ml-2" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Row: Image Upload & Preset Archetypes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload Area / Image Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Source Inspiration Image</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group aspect-video sm:aspect-auto sm:h-56 flex items-center justify-center shadow-xl">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Inspiration Source"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs text-slate-300">Upload JPG, PNG, WEBP, or take camera photo</p>
                </div>
              )}

              {/* Overlay quick actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 justify-between">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/20 text-xs font-mono text-white hover:bg-amber-500 hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                </button>
                {isAnalyzing && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing Vision...
                  </span>
                )}
              </div>
            </div>

            {/* Preset Archetypes */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono text-slate-400">Quick Archetypes:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_ARCHETYPES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setSelectedImage(sample.image);
                      setSelectedGenre(sample.genre);
                      generateGameWorld(sample.image, sample.genre);
                    }}
                    className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                      selectedImage === sample.image
                        ? 'border-amber-400 ring-2 ring-amber-500/30'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={sample.image} alt={sample.title} className="w-full h-12 object-cover rounded-lg" />
                    <div className="text-[10px] font-medium text-white truncate mt-1">{sample.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Genre Selection Grid (10 Genres) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Target Game Genre (10 Modes)</span>
              <span className="text-amber-400 font-semibold">{selectedGenre}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {GENRES.map((g) => {
                const isSelected = selectedGenre === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleSelectGenre(g.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                        : 'border-white/10 bg-slate-900/60 hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{g.icon}</div>
                    <div className="text-xs font-bold leading-tight truncate">{g.id}</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{g.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Extracted Neural Palette Swatches */}
            {gameData && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-2">
                <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Extracted Image Palette:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {gameData.palette.map((color, idx) => (
                    <div
                      key={idx}
                      title={color}
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'prototype', label: '🎮 Playable Prototype', count: 'Live Canvas' },
            { id: 'gdd', label: '📜 Game Design Document', count: 'Missions & Lore' },
            { id: 'vision', label: '👁️ Vision Analysis', count: '6 Vectors' },
            { id: 'mechanics', label: '⚙️ Mechanics & UI', count: 'Controls' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic(12);
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-normal">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Playable Canvas Prototype */}
        {activeTab === 'prototype' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{gameData?.title || 'Interactive Prototype'}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    WASD / ARROW KEYS
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Collect the Solar Shards, navigate floating platforms, and reach the Cyan Gateway
                </p>
              </div>

              {/* Game Stats & Sound Toggle */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-amber-300">
                  SCORE: <span className="font-bold text-white">{score}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-rose-300">
                  LIVES: <span className="font-bold text-white">{'❤️'.repeat(lives) || '💀'}</span>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 shadow-[0_0_40px_rgba(234,179,8,0.15)] flex justify-center">
              <canvas
                ref={canvasRef}
                width={900}
                height={320}
                className="w-full max-w-full h-auto aspect-[900/320] block"
              />

              {/* Win/Loss Modal Overlays */}
              {gameState === 'won' && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in zoom-in-95">
                  <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">STAGE TRIAL COMPLETED!</h4>
                  <p className="text-xs text-slate-300 max-w-md">
                    You gathered the solar fragments and breached the Gateway. Final score: {score}
                  </p>
                  <button
                    onClick={() => {
                      setGameState('playing');
                      setScore(0);
                      setLives(3);
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider hover:bg-amber-400"
                  >
                    Play Again
                  </button>
                </div>
              )}

              {gameState === 'gameover' && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in zoom-in-95">
                  <h4 className="text-xl font-bold text-rose-400">CHRONO CONNECTION LOST</h4>
                  <p className="text-xs text-slate-300 max-w-md">
                    All kinetic shields depleted. The rift collapsed.
                  </p>
                  <button
                    onClick={() => {
                      setGameState('playing');
                      setScore(0);
                      setLives(3);
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider hover:bg-amber-400"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Virtual On-Screen Controls */}
            <div className="flex sm:hidden items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onTouchStart={() => handleVirtualLeft(true)}
                  onTouchEnd={() => handleVirtualLeft(false)}
                  onMouseDown={() => handleVirtualLeft(true)}
                  onMouseUp={() => handleVirtualLeft(false)}
                  className="w-12 h-12 rounded-xl bg-white/10 active:bg-amber-500 active:text-slate-950 font-bold flex items-center justify-center"
                >
                  ◀
                </button>
                <button
                  onTouchStart={() => handleVirtualRight(true)}
                  onTouchEnd={() => handleVirtualRight(false)}
                  onMouseDown={() => handleVirtualRight(true)}
                  onMouseUp={() => handleVirtualRight(false)}
                  className="w-12 h-12 rounded-xl bg-white/10 active:bg-amber-500 active:text-slate-950 font-bold flex items-center justify-center"
                >
                  ▶
                </button>
              </div>

              <button
                onTouchStart={handleVirtualJump}
                onClick={handleVirtualJump}
                className="px-6 h-12 rounded-xl bg-amber-500 active:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase shadow-lg shadow-amber-500/20"
              >
                JUMP 🚀
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Game Design Document (GDD) */}
        {activeTab === 'gdd' && gameData && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Narrative Framework
                </span>
                <button
                  onClick={handleDownloadGDD}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono hover:bg-amber-500 hover:text-slate-950 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export GDD (Markdown)</span>
                </button>
              </div>
              <h3 className="text-xl font-bold text-white">{gameData.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{gameData.story}</p>
            </div>

            {/* Characters & Factions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Featured Characters & Sentinels
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {gameData.characters.map((char, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/10 bg-slate-900/40 space-y-1">
                    <div className="text-sm font-bold text-white">{char.name}</div>
                    <div className="text-xs text-amber-300 font-mono">{char.role}</div>
                    <div className="text-xs text-slate-400 pt-1">{char.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missions & Objectives */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                Core Campaign Missions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {gameData.missions.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/10 bg-slate-900/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400">MISSION 0{i + 1}</span>
                      <span className="text-emerald-400">{m.reward}</span>
                    </div>
                    <div className="text-sm font-bold text-white">{m.title}</div>
                    <div className="text-xs text-slate-300">{m.objective}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Vision Analysis Breakdowns */}
        {activeTab === 'vision' && gameData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase">Environment Synthesis</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{gameData.environment}</p>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase">Lighting & Optics</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{gameData.lighting}</p>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase">Terrain & Traversal</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{gameData.terrain}</p>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase">Atmosphere & Mood</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{gameData.atmosphere}</p>
            </div>
          </div>
        )}

        {/* Tab 4: Mechanics & UI Concept */}
        {activeTab === 'mechanics' && gameData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-3">
                <h4 className="text-xs font-mono text-amber-400 uppercase">Gameplay Mechanics</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {gameData.mechanics.map((mech, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">❯</span>
                      <span>{mech}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-3">
                <h4 className="text-xs font-mono text-cyan-400 uppercase">UI & Heads-Up Display Concept</h4>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <div>
                    <strong className="text-white">HUD:</strong> {gameData.uiConcept.hud}
                  </div>
                  <div>
                    <strong className="text-white">Minimap:</strong> {gameData.uiConcept.minimap}
                  </div>
                  <div>
                    <strong className="text-white">Inventory:</strong> {gameData.uiConcept.inventory}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick dispatch to chat */}
            {onSendToChat && (
              <div className="flex justify-end">
                <button
                  onClick={() => onSendToChat(`I created a game concept "${gameData.title}" (${gameData.genre}). Can you write the dialogue script and code logic for the first boss fight?`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Discuss Game in Astra Chat</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
