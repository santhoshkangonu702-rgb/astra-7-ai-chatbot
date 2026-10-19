import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Type,
  Layout,
  Share2,
  Download,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  Sliders,
  Layers
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export interface BrandKit {
  name: string;
  tagline: string;
  colorPalette: Array<{ name: string; hex: string; role: string }>;
  typography: { heading: string; body: string; code: string };
  logoConcepts: string[];
  brandGuidelines: string[];
}

interface BrandStudioPowerProps {
  onBack?: () => void;
}

export const BrandStudioPower: React.FC<BrandStudioPowerProps> = ({ onBack }) => {
  const [brandIdea, setBrandIdea] = useState('Aura Clean Tech — Hydrogen Drone Delivery');
  const [activeStep, setActiveStep] = useState(0);
  const [brandKit, setBrandKit] = useState<BrandKit>({
    name: 'AURA FLIGHT',
    tagline: 'Zero-Emission Aerial Logistical Intelligence',
    colorPalette: [
      { name: 'Aurora Amber', hex: '#F5B82E', role: 'Primary Accent & CTAs' },
      { name: 'Obsidian Space', hex: '#0B0F19', role: 'Deep Background' },
      { name: 'Cyan Telemetry', hex: '#06B6D4', role: 'Secondary Highlights' },
      { name: 'Clean Titanium', hex: '#E2E8F0', role: 'Legible High-Contrast Body' }
    ],
    typography: {
      heading: 'Space Grotesk (Bold, Futuristic)',
      body: 'Inter / Plus Jakarta Sans (Readable, Clean)',
      code: 'JetBrains Mono (Technical Precision)'
    },
    logoConcepts: [
      'Minimalist geometric delta-wing intersected by a golden circular orbit.',
      'Stylized letter "A" fused with an upward aerodynamic jet stream.',
      'Symmetrical infinity glyph representing perpetual clean energy flight.'
    ],
    brandGuidelines: [
      'Always maintain generous negative space (minimum 24px clearance around logo).',
      'Use Aurora Amber solely for primary actions and active statuses to avoid sensory fatigue.',
      'Body typography must never fall below 12px for universal legibility.',
      'Backgrounds must utilize deep obsidian neutral gradients rather than harsh solid black.'
    ]
  });

  const handleExportBrandKit = () => {
    const text = `# BRAND GUIDELINES & ASSET KIT: ${brandKit.name}
Tagline: "${brandKit.tagline}"
Pipeline: BRAND IDEA → IDENTITY → VISUAL SYSTEM → ASSETS → BRAND KIT

## 1. Color Palette
${brandKit.colorPalette.map((c) => `- **${c.name}** (${c.hex}): ${c.role}`).join('\n')}

## 2. Typography Hierarchy
- Headings: ${brandKit.typography.heading}
- Body Copy: ${brandKit.typography.body}
- Technical/Code: ${brandKit.typography.code}

## 3. Logo Concepts & Motifs
${brandKit.logoConcepts.map((l, i) => `${i + 1}. ${l}`).join('\n')}

## 4. Brand Governance Guidelines
${brandKit.brandGuidelines.map((g, i) => `${i + 1}. ${g}`).join('\n')}
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandKit.name.toLowerCase().replace(/\s+/g, '-')}-brand-kit.md`;
    a.click();
    hapticSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border border-amber-500/25 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0 mr-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back</span>
            </button>
          )}
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <Palette className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">ASTRA BRAND STUDIO</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ORIGINAL IDENTITY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pipeline: BRAND IDEA → IDENTITY → VISUAL SYSTEM → ASSETS → BRAND KIT
            </p>
          </div>
        </div>

        <button
          onClick={handleExportBrandKit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Brand Kit</span>
        </button>
      </div>

      {/* 5-Step Pipeline Badge */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
        <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
          Brand Architecture Pipeline
        </div>
        <div className="flex items-center gap-2 overflow-x-auto text-[10px] font-mono">
          {['BRAND IDEA', 'IDENTITY', 'VISUAL SYSTEM', 'ASSETS', 'BRAND KIT'].map((st, i) => (
            <React.Fragment key={st}>
              <div className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {st}
              </div>
              {i < 4 && <span className="text-slate-600">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Brand Identity Card */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">OFFICIAL BRAND IDENTITY</div>
            <h2 className="text-2xl font-black text-white">{brandKit.name}</h2>
            <p className="text-xs text-amber-300 font-mono mt-0.5 font-semibold">"{brandKit.tagline}"</p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-md">
              AF
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">AURA FLIGHT</span>
              <span className="text-[10px] text-slate-400 font-mono">Original Vector Glyph</span>
            </div>
          </div>
        </div>

        {/* Color System */}
        <div className="space-y-2 pt-3 border-t border-white/5">
          <div className="text-xs font-bold text-slate-300 font-mono uppercase">Color Palette System</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {brandKit.colorPalette.map((col, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="w-full h-8 rounded-lg shadow-inner" style={{ backgroundColor: col.hex }} />
                <div>
                  <div className="text-xs font-bold text-white">{col.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{col.hex}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{col.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography System */}
        <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
          <div className="font-bold text-slate-300 font-mono uppercase">Typography System</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">HEADINGS</span>
              <span className="font-bold text-white">{brandKit.typography.heading}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">BODY COPY</span>
              <span className="font-bold text-white">{brandKit.typography.body}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">CODE / MONOSPACE</span>
              <span className="font-bold text-amber-300">{brandKit.typography.code}</span>
            </div>
          </div>
        </div>

        {/* Logo Concepts */}
        <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
          <div className="font-bold text-slate-300 font-mono uppercase">Original Logo Concepts</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {brandKit.logoConcepts.map((concept, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">CONCEPT #{idx + 1}</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">{concept}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Guidelines */}
        <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
          <div className="font-bold text-slate-300 font-mono uppercase">Brand Governance Rules</div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            {brandKit.brandGuidelines.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
