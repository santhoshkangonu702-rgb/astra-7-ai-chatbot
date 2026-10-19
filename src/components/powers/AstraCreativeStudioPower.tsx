import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Palette,
  FileText,
  Video,
  Image as ImageIcon,
  Layout,
  Layers,
  Download,
  Share2,
  Copy,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export type CreativeFormat =
  | 'logo'
  | 'poster'
  | 'thumbnail'
  | 'social'
  | 'presentation'
  | 'storyboard'
  | 'video-script'
  | 'ad-concept'
  | 'brand-kit';

export type CreativeStage = 'idea' | 'concept' | 'design' | 'content' | 'output';

interface FormatConfig {
  id: CreativeFormat;
  label: string;
  icon: React.ElementType;
  description: string;
  aspectRatio: string;
}

const CREATIVE_FORMATS: FormatConfig[] = [
  { id: 'logo', label: 'Logo & Identity', icon: Sparkles, description: 'Vector marks, responsive lockups, & favicon sets', aspectRatio: '1:1' },
  { id: 'poster', label: 'Event / Keynote Poster', icon: Layout, description: 'Futuristic typographic layouts & visual hierarchy', aspectRatio: '4:5' },
  { id: 'thumbnail', label: 'Video / Stream Thumbnail', icon: ImageIcon, description: 'High-contrast CTR-optimized YouTube & Twitch art', aspectRatio: '16:9' },
  { id: 'social', label: 'Social Campaign Carousel', icon: Palette, description: 'Multi-slide LinkedIn, Instagram, & X visual units', aspectRatio: '1:1' },
  { id: 'presentation', label: 'Pitch Deck & Slides', icon: Layers, description: 'Clean executive presentation frames & infographics', aspectRatio: '16:9' },
  { id: 'storyboard', label: 'Cinematic Storyboard', icon: Video, description: 'Keyframe panels, camera movement notes & lighting', aspectRatio: '16:9' },
  { id: 'video-script', label: 'Production Video Script', icon: FileText, description: 'Two-column audio/video synchronized screenplay', aspectRatio: 'N/A' },
  { id: 'ad-concept', label: 'Advertising Campaign', icon: Sliders, description: 'Headline variants, copy angles, & hero visual cues', aspectRatio: 'Flexible' },
  { id: 'brand-kit', label: 'Comprehensive Brand Kit', icon: Palette, description: 'Color palettes, font pairings, & voice guidelines', aspectRatio: 'Design System' }
];

interface AstraCreativeStudioPowerProps {
  onBack?: () => void;
}

export const AstraCreativeStudioPower: React.FC<AstraCreativeStudioPowerProps> = ({ onBack }) => {
  const [selectedFormat, setSelectedFormat] = useState<CreativeFormat>('logo');
  const [currentStage, setCurrentStage] = useState<CreativeStage>('concept');
  const [creativePrompt, setCreativePrompt] = useState('Minimalist quantum computing logo with holographic gold and neon cyan refractions');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(
    'Concept Blueprint Ready: Geometric hypercube intersecting a golden spiral glyph with 60° isometric angles.'
  );

  const stages: Array<{ id: CreativeStage; label: string; number: string }> = [
    { id: 'idea', label: 'IDEA', number: '01' },
    { id: 'concept', label: 'CONCEPT', number: '02' },
    { id: 'design', label: 'DESIGN', number: '03' },
    { id: 'content', label: 'CONTENT', number: '04' },
    { id: 'output', label: 'OUTPUT', number: '05' }
  ];

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setGeneratedOutput(`High-Resolution Creative Artifact synthesized for ${selectedFormat.toUpperCase()} using prompt: "${creativePrompt}". Ready for vector export.`);
      setCurrentStage('output');
    }, 800);
  };

  return (
    <div id="astra-creative-studio" className="h-full overflow-y-auto px-4 py-6 md:px-8 space-y-8 text-slate-100 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <Palette className="w-7 h-7 text-pink-400" />
                ASTRA CREATIVE STUDIO
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-400/30">
                MULTI-FORMAT SUITE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Image • Design • Writing • Video Planning • Idea → Concept → Design → Content → Final Output
            </p>
          </div>
        </div>
      </div>

      {/* 5-Stage Pipeline Navigation */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {stages.map((stage) => {
          const isCurrent = currentStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setCurrentStage(stage.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-pink-500/20 to-amber-500/20 border-pink-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-pink-400">{stage.number}</div>
              <div className="text-xs font-black tracking-wider mt-0.5">{stage.label}</div>
            </button>
          );
        })}
      </div>

      {/* Format Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CREATIVE_FORMATS.map((fmt) => {
          const Icon = fmt.icon;
          const isSelected = selectedFormat === fmt.id;
          return (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-pink-500/20 border-pink-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-pink-400" />
              <span>{fmt.label}</span>
              <span className="text-[9px] font-mono text-slate-500">({fmt.aspectRatio})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Studio Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prompt & Parameters (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950/70 border border-pink-500/30 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider">
                  Target Format: {selectedFormat.toUpperCase()}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">Creative Direction & Directives</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-300">GPU NEURAL ACCELERATED</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold">Prompt & Style Directives:</label>
              <textarea
                value={creativePrompt}
                onChange={(e) => setCreativePrompt(e.target.value)}
                rows={4}
                className="w-full p-4 rounded-2xl bg-slate-900/60 border border-white/10 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-400"
              />
            </div>

            {/* Aesthetic Style Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400">Recommended Aesthetic Palettes:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Cyberpunk Neon', 'Swiss Typographic', 'Bauhaus Geometric', 'Dark Holographic Glass', 'Organic Minimalist'].map(
                  (style) => (
                    <button
                      key={style}
                      onClick={() => setCreativePrompt((prev) => `${prev}, ${style} style`)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px]"
                    >
                      + {style}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white font-extrabold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,63,94,0.3)] disabled:opacity-50"
            >
              {isSynthesizing ? 'Synthesizing High-Resolution Artifact...' : 'Generate Creative Blueprint'}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Stage Canvas & Output (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-pink-500/30 backdrop-blur-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                Live Studio Canvas Preview
              </span>
              <span className="text-[10px] font-mono text-emerald-400">VECTOR READY</span>
            </div>

            {/* Visual Canvas Sandbox */}
            <div className="min-h-[260px] rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-pink-950/30 border border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-pink-500/30 to-amber-400/30 border border-pink-400/50 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(244,63,94,0.25)] group-hover:scale-105 transition-transform">
                <Sparkles className="w-10 h-10 text-pink-300 animate-pulse" />
              </div>

              <div className="text-sm font-black text-white">{selectedFormat.toUpperCase()} PREVIEW</div>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                {generatedOutput}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => alert('Exporting SVG and PNG high-res assets...')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
              >
                <Download className="w-4 h-4 text-pink-400" />
                <span>Export Vector Assets</span>
              </button>

              <button
                onClick={() => alert('Brand design spec copied to clipboard.')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-xs font-semibold text-pink-200 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>Copy CSS & Design Tokens</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
