/**
 * Astra 7 — NEXUS 2040
 * Golden Core Chat System Appearance & Theme Registry
 * 10 Presets:
 * 1. Golden Core (Default)
 * 2. Astra Dark
 * 3. Neon Future
 * 4. Crystal Glass
 * 5. Galaxy
 * 6. Aurora
 * 7. Ocean
 * 8. Midnight
 * 9. Light
 * 10. Custom
 */

export type ChatFontFamily = 'space-grotesk' | 'inter' | 'jakarta' | 'manrope' | 'mono' | 'noto';
export type ChatFontSize = 'sm' | 'base' | 'lg';
export type ChatMessageSpacing = 'compact' | 'normal' | 'relaxed';

export interface ChatThemeConfig {
  id: string;
  name: string;
  description: string;
  background: string;
  userBubble: string;
  assistantBubble: string;
  border: string;
  glow: string;
  accent: string;
  font: ChatFontFamily;
  fontSize: ChatFontSize;
  spacing: ChatMessageSpacing;
  isCustom?: boolean;
}

export const CHAT_THEME_PRESETS: Record<string, ChatThemeConfig> = {
  'golden-core': {
    id: 'golden-core',
    name: 'Golden Core',
    description: 'Astra 7 Signature deep-space black with luminous #F5B82E solar gold glow',
    background: 'bg-[#05060A]',
    userBubble: 'bg-gradient-to-r from-amber-500/25 via-[#F5B82E]/20 to-[#A66A00]/25 text-amber-50 border-amber-400/50 shadow-[0_0_20px_rgba(245,184,46,0.18)]',
    assistantBubble: 'bg-[#0A0D18]/90 text-slate-100 border-amber-500/25 shadow-[0_0_30px_rgba(245,184,46,0.12)]',
    border: 'border-amber-500/35',
    glow: 'shadow-[0_0_35px_rgba(245,184,46,0.25)]',
    accent: '#F5B82E',
    font: 'space-grotesk',
    fontSize: 'base',
    spacing: 'normal'
  },
  'astra-dark': {
    id: 'astra-dark',
    name: 'Astra Dark',
    description: 'Deep obsidian matrix with muted golden highlights and razor contrast',
    background: 'bg-[#030508]',
    userBubble: 'bg-slate-900/90 text-white border-amber-500/30',
    assistantBubble: 'bg-slate-950/90 text-slate-100 border-white/10 shadow-lg',
    border: 'border-amber-500/20',
    glow: 'shadow-[0_0_25px_rgba(234,179,8,0.15)]',
    accent: '#f59e0b',
    font: 'inter',
    fontSize: 'base',
    spacing: 'normal'
  },
  'neon-future': {
    id: 'neon-future',
    name: 'Neon Future',
    description: 'High-contrast cyberpunk neon pink and electric cybernetic violet',
    background: 'bg-[#08020f]',
    userBubble: 'bg-gradient-to-r from-pink-500/25 to-purple-600/25 text-pink-100 border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.2)]',
    assistantBubble: 'bg-[#120624]/90 text-slate-100 border-pink-500/20 shadow-[0_0_25px_rgba(236,72,153,0.15)]',
    border: 'border-pink-500/30',
    glow: 'shadow-[0_0_30px_rgba(236,72,153,0.25)]',
    accent: '#ec4899',
    font: 'space-grotesk',
    fontSize: 'base',
    spacing: 'relaxed'
  },
  'crystal-glass': {
    id: 'crystal-glass',
    name: 'Crystal Glass',
    description: 'Frosted crystalline glassmorphism blur with iridescent edge refraction',
    background: 'bg-[#060814]/90 backdrop-blur-2xl',
    userBubble: 'bg-white/10 backdrop-blur-md text-white border-white/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]',
    assistantBubble: 'bg-white/5 backdrop-blur-xl text-slate-100 border-white/15 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]',
    border: 'border-white/20',
    glow: 'shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]',
    accent: '#38bdf8',
    font: 'jakarta',
    fontSize: 'base',
    spacing: 'normal'
  },
  'galaxy': {
    id: 'galaxy',
    name: 'Galaxy',
    description: 'Deep cosmic amethyst nebula and distant starlight radiance',
    background: 'bg-[#090416]',
    userBubble: 'bg-gradient-to-r from-violet-600/30 to-purple-600/30 text-violet-100 border-violet-400/40',
    assistantBubble: 'bg-[#140b2a]/90 text-slate-100 border-violet-500/25 shadow-[0_0_25px_rgba(139,92,246,0.2)]',
    border: 'border-violet-500/30',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    accent: '#8b5cf6',
    font: 'manrope',
    fontSize: 'base',
    spacing: 'normal'
  },
  'aurora': {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights emerald, teal ionized curtains and twilight atmosphere',
    background: 'bg-[#021310]',
    userBubble: 'bg-gradient-to-r from-emerald-500/25 to-teal-600/25 text-emerald-100 border-emerald-400/40',
    assistantBubble: 'bg-[#05241e]/90 text-slate-100 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    accent: '#10b981',
    font: 'manrope',
    fontSize: 'base',
    spacing: 'relaxed'
  },
  'ocean': {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep abyssal oceanic blues with bioluminescent turquoise currents',
    background: 'bg-[#020b18]',
    userBubble: 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-100 border-cyan-400/40',
    assistantBubble: 'bg-[#07172e]/90 text-slate-100 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
    accent: '#06b6d4',
    font: 'jakarta',
    fontSize: 'base',
    spacing: 'normal'
  },
  'midnight': {
    id: 'midnight',
    name: 'Midnight',
    description: 'Pure stealth pitch black with crisp silver lines and zero distraction',
    background: 'bg-black',
    userBubble: 'bg-white/10 text-white border-white/20',
    assistantBubble: 'bg-neutral-900/95 text-slate-200 border-neutral-800 shadow-md',
    border: 'border-neutral-800',
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.05)]',
    accent: '#e2e8f0',
    font: 'inter',
    fontSize: 'base',
    spacing: 'normal'
  },
  'light': {
    id: 'light',
    name: 'Light',
    description: 'Architectural gallery white with warm gold borders and high contrast',
    background: 'bg-[#FAFAFA]',
    userBubble: 'bg-amber-500 text-slate-950 font-semibold border-amber-600 shadow-md',
    assistantBubble: 'bg-white text-slate-800 border-amber-300/60 shadow-lg',
    border: 'border-amber-300',
    glow: 'shadow-[0_4px_20px_rgba(245,184,46,0.15)]',
    accent: '#D97706',
    font: 'jakarta',
    fontSize: 'base',
    spacing: 'normal'
  },
  'custom': {
    id: 'custom',
    name: 'Custom',
    description: 'Personalized user-tuned matrix styling & tailored sensory palette',
    background: 'bg-[#05060A]',
    userBubble: 'bg-amber-500/25 text-white border-amber-500/40 shadow-sm',
    assistantBubble: 'bg-slate-900/90 text-slate-100 border-white/10',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_rgba(245,184,46,0.2)]',
    accent: '#F5B82E',
    font: 'space-grotesk',
    fontSize: 'base',
    spacing: 'normal',
    isCustom: true
  }
};

export const DEFAULT_CHAT_THEME_ID = 'golden-core';

export const LOCAL_STORAGE_THEME_KEY = 'astra7_chat_theme_config';

export function loadSavedChatTheme(): ChatThemeConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && CHAT_THEME_PRESETS[parsed.id]) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return CHAT_THEME_PRESETS[DEFAULT_CHAT_THEME_ID];
}

export function saveChatTheme(theme: ChatThemeConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(theme));
  } catch {
    // fallback
  }
}
