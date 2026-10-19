import React from 'react';
import { Sparkles, Check, Palette } from 'lucide-react';
import { NexusThemeId } from '../../types';

export interface ThemeOption {
  id: NexusThemeId;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentGlow: string;
  isDark: boolean;
}

export const NEXUS_THEMES: ThemeOption[] = [
  {
    id: 'aurora-gold',
    name: 'Aurora Gold',
    description: 'Default 2040 Command: Gold + Cyan + Subtle Violet',
    primaryColor: '#EAB308',
    secondaryColor: '#06B6D4',
    accentGlow: 'rgba(234, 179, 8, 0.4)',
    isDark: true
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Deep cobalt sea with electric cyan and sapphire glow',
    primaryColor: '#00F0FF',
    secondaryColor: '#3B82F6',
    accentGlow: 'rgba(0, 240, 255, 0.4)',
    isDark: true
  },
  {
    id: 'cyber-sunset',
    name: 'Cyber Sunset',
    description: 'Neon magenta and solar amber cyber-nebula atmosphere',
    primaryColor: '#F43F5E',
    secondaryColor: '#F97316',
    accentGlow: 'rgba(244, 63, 94, 0.4)',
    isDark: true
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Emerald holographic matrices and quantum mint nodes',
    primaryColor: '#10B981',
    secondaryColor: '#00FFB2',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    isDark: true
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    description: 'Cyberpunk deep violet and electric pulse synth lighting',
    primaryColor: '#A855F7',
    secondaryColor: '#D946EF',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    isDark: true
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'High-contrast sci-fi platinum titanium with sleek cyan lines',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    accentGlow: 'rgba(59, 130, 246, 0.3)',
    isDark: false
  }
];

interface ThemeManagerProps {
  currentTheme: string;
  onSelectTheme: (themeId: NexusThemeId) => void;
  className?: string;
}

export const ThemeManager: React.FC<ThemeManagerProps> = ({
  currentTheme,
  onSelectTheme,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Theme Variations (2040 Spectrum)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-300">
          6 COGNITIVE PALETTES
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {NEXUS_THEMES.map((theme) => {
          const isSelected =
            currentTheme === theme.id ||
            (theme.id === 'aurora-gold' && (currentTheme === 'dark' || !currentTheme));

          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`p-3.5 rounded-2xl text-left transition-all relative border flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white/[0.08] border-amber-400/60 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/20'
              }`}
            >
              {/* Color Swatch Preview Pill */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full shadow-md"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full shadow-md"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                  {theme.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-snug mt-1">
                  {theme.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
