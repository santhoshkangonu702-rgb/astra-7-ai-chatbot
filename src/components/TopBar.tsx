import React, { useState } from 'react';
import {
  Menu,
  Search,
  Sparkles,
  Shield,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Mic,
  Bell,
  ArrowLeft,
  X,
  Zap
} from 'lucide-react';
import { PowerId, UserProfile, AppTheme } from '../types';
import { AstraCoreIcon } from './nexus/AstraCoreIcon';
import { DEFAULT_USERS } from '../data/sampleData';
import { hapticNavClick, hapticWorkspaceTransition, hapticAction, hapticDrawer } from '../utils/haptics';

interface TopBarProps {
  activePower: PowerId;
  onSelectPower: (power: PowerId) => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  onOpenSearch: () => void;
  onOpenVoiceMode?: () => void;
  onOpenHelp?: () => void;
  onOpenMobileDrawer?: () => void;
  onToggleMobileDrawer?: () => void;
  isMobileDrawerOpen?: boolean;
  hasGeminiKey: boolean;
  theme?: AppTheme;
  onOpenAuth?: () => void;
  onOpenUpgrade?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activePower,
  onSelectPower,
  currentUser,
  onSwitchUser,
  onOpenSearch,
  onOpenVoiceMode,
  onOpenHelp,
  onOpenMobileDrawer,
  onToggleMobileDrawer,
  isMobileDrawerOpen = false,
  hasGeminiKey,
  onOpenUpgrade,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Golden Core Online', desc: 'Astra Brain 3.0 initialized with real-time reasoning', time: 'Just now' },
    { id: 2, title: 'Multimodal Models Synced', desc: 'Veo 3.1 & Gemini 3.1 multimodal pipelines active', time: '12m ago' },
    { id: 3, title: 'Quantum Memory Vault', desc: 'User context and preferences securely encrypted', time: '1h ago' }
  ];

  return (
    <header
      id="astra-top-bar"
      className="h-16 px-3 sm:px-6 bg-[#04060C]/90 backdrop-blur-2xl border-b border-amber-500/20 flex items-center justify-between z-30 shrink-0 sticky top-0 text-white select-none transition-colors shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
    >
      {/* LEFT: ☰ Menu, ASTRA 7, NEXUS 2040, Glowing Astra Core Icon */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* ☰ Mobile / Drawer hamburger button */}
        <button
          id="topbar-mobile-hamburger"
          onClick={() => {
            hapticDrawer();
            if (onToggleMobileDrawer) {
              onToggleMobileDrawer();
            } else if (onOpenMobileDrawer) {
              onOpenMobileDrawer();
            }
          }}
          className={`lg:hidden p-2 rounded-xl transition-all shrink-0 ${
            isMobileDrawerOpen
              ? 'text-amber-300 bg-amber-500/20 border border-amber-400/40 shadow-[0_0_15px_rgba(245,184,46,0.35)]'
              : 'text-slate-300 hover:text-amber-300 hover:bg-white/5 border border-white/5'
          }`}
          title="Toggle Navigation Menu"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileDrawerOpen}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Back to Home Button when active power is not Home */}
        {activePower !== 'home' && (
          <button
            onClick={() => {
              hapticWorkspaceTransition();
              onSelectPower('home');
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all group shrink-0"
            title="Back to Nexus 2040 Command"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[11px] sm:text-xs">Back</span>
          </button>
        )}

        {/* Glowing Astra Core Icon */}
        <div
          onClick={() => {
            hapticNavClick();
            onSelectPower('home');
          }}
          className="cursor-pointer shrink-0"
          title="Astra Core • Click to return Home"
        >
          <AstraCoreIcon size={28} />
        </div>

        {/* Brand Lockup: ASTRA 7 & NEXUS 2040 */}
        <div
          onClick={() => {
            hapticNavClick();
            onSelectPower('home');
          }}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group min-w-0"
        >
          <span className="font-extrabold text-sm sm:text-base tracking-wider text-white group-hover:text-amber-200 transition-colors truncate">
            ASTRA 7
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,184,46,0.2)] shrink-0">
            NEXUS 2040
          </span>
        </div>
      </div>

      {/* CENTER: Search anything... (Thin gold border, dark glass, subtle glow) */}
      <div className="flex-1 min-w-0 max-w-sm lg:max-w-md mx-2 sm:mx-4 md:mx-6 flex justify-center">
        <div
          onClick={() => {
            hapticAction();
            onOpenSearch();
          }}
          className="w-full max-w-full flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-black/50 border border-amber-500/25 hover:border-amber-400/50 shadow-[0_0_15px_rgba(245,184,46,0.06)] hover:shadow-[0_0_20px_rgba(245,184,46,0.18)] cursor-pointer transition-all group overflow-hidden"
          title="Search anything across Astra 7 (Cmd+K)"
        >
          <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400/70 group-hover:text-amber-300 transition-colors shrink-0" />
          <span className="text-xs text-slate-400 group-hover:text-slate-200 truncate flex-1 min-w-0">
            <span className="hidden sm:inline">Search anything...</span>
            <span className="sm:hidden">Search...</span>
          </span>
          <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 group-hover:text-amber-200">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* RIGHT: Notifications, Voice, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              hapticAction();
              setShowNotifications(!showNotifications);
            }}
            className={`relative p-2 rounded-xl border transition-all ${
              showNotifications
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(245,184,46,0.25)]'
                : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border-amber-500/20'
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F5B82E]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#090D18]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  System Notifications
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Voice Trigger */}
        {onOpenVoiceMode && (
          <button
            onClick={() => {
              hapticAction();
              onOpenVoiceMode();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#F5B82E]/10 to-amber-600/15 hover:from-amber-500/25 hover:to-amber-600/25 text-amber-300 hover:text-amber-100 border border-amber-500/30 hover:border-amber-400/50 shadow-[0_0_15px_rgba(245,184,46,0.12)] text-xs font-semibold transition-all group"
            title="Launch Astra Voice Mode"
          >
            <Mic className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Voice</span>
          </button>
        )}

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-white/[0.04] border border-amber-500/20 hover:border-amber-400/40 hover:bg-white/[0.08] transition-all"
            title="Account & Profile"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#A66A00] via-[#F5B82E] to-[#FFD76A] p-[1px] shadow-[0_0_10px_rgba(245,184,46,0.3)]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-300 font-bold text-xs">
                {currentUser?.fullName?.[0] || 'C'}
              </div>
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-200 truncate max-w-[80px]">
              {currentUser?.fullName?.split(' ')[0] || 'Commander'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#090D18]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-300 font-bold">
                    {currentUser?.fullName?.[0] || 'C'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{currentUser.fullName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    GOLDEN CORE PRO
                  </div>
                </div>
              </div>

              <div className="space-y-1 mt-2">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectPower('profile');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Account & Metrics</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectPower('settings');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Security & Memory Vault</span>
                </button>
                {onOpenUpgrade && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenUpgrade();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-amber-300 hover:bg-amber-500/10 transition-colors text-left font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upgrade Capabilities</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
