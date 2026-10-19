import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Sparkles,
  RotateCcw,
  Check,
  Type,
  Maximize2,
  Sliders,
  Sun,
  Moon,
  Layers,
  Flame,
  Zap,
  Eye
} from 'lucide-react';
import {
  ChatThemeConfig,
  CHAT_THEME_PRESETS,
  DEFAULT_CHAT_THEME_ID,
  ChatFontFamily,
  ChatFontSize,
  ChatMessageSpacing,
  saveChatTheme
} from '../../types/chatTheme';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface ChatAppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ChatThemeConfig;
  onThemeChange: (theme: ChatThemeConfig) => void;
}

export const ChatAppearanceModal: React.FC<ChatAppearanceModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange
}) => {
  const [theme, setTheme] = useState<ChatThemeConfig>(currentTheme);
  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');

  if (!isOpen) return null;

  const handleSelectPreset = (presetKey: string) => {
    const selected = CHAT_THEME_PRESETS[presetKey];
    if (selected) {
      setTheme(selected);
      onThemeChange(selected);
      saveChatTheme(selected);
      triggerHaptic(18);
    }
  };

  const handleUpdateCustom = (updates: Partial<ChatThemeConfig>) => {
    const updated: ChatThemeConfig = {
      ...theme,
      ...updates,
      id: 'custom',
      isCustom: true
    };
    setTheme(updated);
    onThemeChange(updated);
    saveChatTheme(updated);
  };

  const handleResetTheme = () => {
    const defaultTheme = CHAT_THEME_PRESETS[DEFAULT_CHAT_THEME_ID];
    setTheme(defaultTheme);
    onThemeChange(defaultTheme);
    saveChatTheme(defaultTheme);
    hapticSuccess();
  };

  const fontOptions: { id: ChatFontFamily; label: string; preview: string }[] = [
    { id: 'inter', label: 'Inter', preview: 'Clean modern sans-serif' },
    { id: 'jakarta', label: 'Plus Jakarta Sans', preview: 'Geometric neo-grotesque' },
    { id: 'manrope', label: 'Manrope', preview: 'Balanced humanist tone' },
    { id: 'space-grotesk', label: 'Space Grotesk', preview: 'Futuristic technical headings' },
    { id: 'mono', label: 'JetBrains Mono', preview: 'Precision developer monospaced' },
    { id: 'noto', label: 'Noto Sans Multi', preview: 'Universal multilingual typography' }
  ];

  const presetList = Object.values(CHAT_THEME_PRESETS);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="chat-appearance-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-[calc(100%-24px)] sm:w-full max-w-2xl max-h-[90vh] bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Chat Appearance & Themes
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NEXUS 2040
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Personalize typography, color matrices, bubbles, and sensory ambient radiance
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic(12);
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/5 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'presets'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Curated Themes (10)
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'customize'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deep Customization & Typography
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Eye className="w-3.5 h-3.5" /> LIVE PREVIEW
              </span>
              <span>Theme: {theme.name}</span>
            </div>

            {/* Simulated Chat Messages */}
            <div className={`p-4 rounded-xl space-y-3 ${theme.background} border ${theme.border}`}>
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-sans ${theme.userBubble} border`}>
                  Can you analyze quantum photon entanglements in modern cryptography?
                </div>
              </div>

              {/* Assistant Bubble */}
              <div className="flex justify-start">
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm ${theme.assistantBubble} border`}>
                  <div className="flex items-center gap-2 mb-1.5 text-[11px] font-mono font-semibold" style={{ color: theme.accent }}>
                    <span>ASTRA BRAIN 3.0</span>
                    <span className="text-[10px] text-slate-400">• QUANTUM PROTOCOL</span>
                  </div>
                  <p className="leading-relaxed text-slate-200">
                    Quantum key distribution (<span style={{ color: theme.accent }} className="font-semibold">BB84 protocol</span>) leverages the no-cloning theorem. Any eavesdropping disrupts quantum states, making interception provably detectable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'presets' ? (
            /* 10 Theme Presets Grid */
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Select Theme Preset
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presetList.map((preset) => {
                  const isSelected = theme.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between group ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                          : 'border-white/10 bg-slate-950/40 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <span className={`text-sm font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {preset.description}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                          <span className="capitalize">{preset.font}</span>
                          <span>•</span>
                          <span className="capitalize">{preset.spacing}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="p-1 rounded-full bg-amber-400 text-slate-950 shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Deep Customization Options */
            <div className="space-y-6">
              {/* Font Family */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  Primary Typography System
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fontOptions.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleUpdateCustom({ font: font.id })}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        theme.font === font.id
                          ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-semibold'
                          : 'border-white/10 bg-slate-950/40 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium text-white">{font.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{font.preview}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size & Spacing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Font Size Scale
                  </label>
                  <div className="flex items-center gap-2">
                    {(['sm', 'base', 'lg'] as ChatFontSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleUpdateCustom({ fontSize: size })}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono uppercase transition-all ${
                          theme.fontSize === size
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                            : 'border-white/10 bg-slate-950/40 text-slate-400 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Message Rhythm & Spacing
                  </label>
                  <div className="flex items-center gap-2">
                    {(['compact', 'normal', 'relaxed'] as ChatMessageSpacing[]).map((spacing) => (
                      <button
                        key={spacing}
                        onClick={() => handleUpdateCustom({ spacing })}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono capitalize transition-all ${
                          theme.spacing === spacing
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                            : 'border-white/10 bg-slate-950/40 text-slate-400 hover:text-white'
                        }`}
                      >
                        {spacing}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Semantic Accent Highlight
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { hex: '#f59e0b', name: 'Amber Gold' },
                    { hex: '#06b6d4', name: 'Electric Cyan' },
                    { hex: '#ec4899', name: 'Cyber Pink' },
                    { hex: '#8b5cf6', name: 'Violet Galaxy' },
                    { hex: '#10b981', name: 'Aurora Emerald' },
                    { hex: '#f97316', name: 'Solar Flare' },
                    { hex: '#38bdf8', name: 'Sky Crystalline' }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => handleUpdateCustom({ accent: color.hex })}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950/50 hover:border-white/30 transition-all"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-slate-300 group-hover:text-white">{color.name}</span>
                      {theme.accent === color.hex && (
                        <Check className="w-3 h-3 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/80">
          <button
            onClick={handleResetTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Theme</span>
          </button>

          <button
            onClick={() => {
              hapticSuccess();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
