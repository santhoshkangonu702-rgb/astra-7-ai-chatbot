import React from 'react';
import {
  Home,
  MessageSquare,
  Search,
  Newspaper,
  Grid,
  Sparkles
} from 'lucide-react';
import { PowerId } from '../../types';
import { hapticNavClick, hapticCorePulse, hapticDrawer } from '../../utils/haptics';

interface MobileBottomNavProps {
  activePower: PowerId;
  onSelectPower: (power: PowerId) => void;
  onOpenVoiceMode?: () => void;
  onOpenMobileDrawer?: () => void;
  onToggleMobileDrawer?: () => void;
  isMobileDrawerOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePower,
  onSelectPower,
  onOpenVoiceMode,
  onOpenMobileDrawer,
  onToggleMobileDrawer,
  isMobileDrawerOpen = false,
}) => {
  return (
    <nav
      id="astra-mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-amber-500/20 px-2 sm:px-4 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-5px_30px_rgba(0,0,0,0.9)] select-none max-w-full overflow-hidden"
    >
      {/* 1. HOME */}
      <button
        id="mobile-nav-home"
        onClick={() => {
          hapticNavClick();
          onSelectPower('home');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          activePower === 'home'
            ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-400/30 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* 2. CHAT */}
      <button
        id="mobile-nav-chat"
        onClick={() => {
          hapticNavClick();
          onSelectPower('chat');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          activePower === 'chat'
            ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-400/30 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Chat</span>
      </button>

      {/* 3. CENTRAL FLOATING ASTRA CORE ORB */}
      <button
        id="mobile-nav-core"
        onClick={() => {
          hapticCorePulse();
          if (onOpenVoiceMode) onOpenVoiceMode();
          else onSelectPower('voice');
        }}
        className="relative -top-3 flex flex-col items-center group active:scale-95 transition-transform"
        title="Astra Core & Voice"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 p-[2px] shadow-[0_0_22px_rgba(234,179,8,0.6)]">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-300 font-black text-xs">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold text-amber-300 mt-0.5 tracking-wider">
          CORE
        </span>
      </button>

      {/* 4. SEARCH */}
      <button
        id="mobile-nav-search"
        onClick={() => {
          hapticNavClick();
          onSelectPower('search');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          activePower === 'search'
            ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-400/30 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Search</span>
      </button>

      {/* 5. NEWS */}
      <button
        id="mobile-nav-news"
        onClick={() => {
          hapticNavClick();
          onSelectPower('news');
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          activePower === 'news'
            ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-400/30 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Newspaper className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">News</span>
      </button>

      {/* 6. MORE (Drawer Toggle) */}
      <button
        id="mobile-nav-more"
        onClick={() => {
          hapticDrawer();
          if (onToggleMobileDrawer) {
            onToggleMobileDrawer();
          } else if (onOpenMobileDrawer) {
            onOpenMobileDrawer();
          } else {
            onSelectPower('more');
          }
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          isMobileDrawerOpen || activePower === 'more'
            ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-400/30 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="More Capabilities"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">More</span>
      </button>
    </nav>
  );
};
