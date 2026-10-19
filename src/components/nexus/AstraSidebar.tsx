import React from 'react';
import {
  Home,
  MessageSquare,
  Search,
  Newspaper,
  Flame,
  GraduationCap,
  Code2,
  FileText,
  Image as ImageIcon,
  Play,
  Music,
  Database,
  Globe2,
  Grid,
  Sparkles,
  X,
  Compass,
  Settings,
  Menu
} from 'lucide-react';
import { PowerId, SubscriptionTier, UserProfile } from '../../types';
import { AstraCoreIcon } from './AstraCoreIcon';
import { hapticNavClick, hapticDrawer, triggerHaptic } from '../../utils/haptics';

interface AstraSidebarProps {
  activePower: PowerId;
  onSelectPower: (power: PowerId) => void;
  tier?: SubscriptionTier;
  user?: UserProfile | null;
  onOpenUpgrade?: () => void;
  onOpenHelp?: () => void;
  onOpenAuth?: () => void;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const AstraSidebar: React.FC<AstraSidebarProps> = ({
  activePower,
  onSelectPower,
  user,
  onOpenUpgrade,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  const handleNavClick = (id: PowerId) => {
    hapticNavClick();
    onSelectPower(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  /**
   * Required navigation order (Section 8):
   * Home
   * Chat
   * Core
   * Search
   * News
   * Trending
   * Study
   * Code
   * Documents
   * Image Studio
   * Video
   * More
   * Settings
   */
  const navItems: Array<{
    id: PowerId;
    label: string;
    icon: React.ElementType;
    symbol?: string;
  }> = [
    { id: 'home', label: 'Home', icon: Home, symbol: '⌂' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, symbol: '💬' },
    { id: 'voice', label: 'Core', icon: Compass, symbol: '◎' },
    { id: 'search', label: 'Search', icon: Search, symbol: '⌕' },
    { id: 'news', label: 'News', icon: Newspaper, symbol: '▣' },
    { id: 'future-lab', label: 'Trending', icon: Flame, symbol: '♨' },
    { id: 'study', label: 'Study', icon: GraduationCap, symbol: '📖' },
    { id: 'codelab', label: 'Code', icon: Code2, symbol: '</>' },
    { id: 'documents', label: 'Documents', icon: FileText, symbol: '▤' },
    { id: 'image-studio', label: 'Image Studio', icon: ImageIcon, symbol: '▧' },
    { id: 'cinema-studio', label: 'Video', icon: Play, symbol: '▶' },
    { id: 'music', label: 'Music', icon: Music, symbol: '♫' },
    { id: 'datahub', label: 'Data Universe', icon: Database, symbol: '⛁' },
    { id: 'global-intelligence', label: 'Global & India', icon: Globe2, symbol: '🌐' },
    { id: 'more', label: 'More', icon: Grid, symbol: '◉' },
    { id: 'settings', label: 'Settings', icon: Settings, symbol: '⚙' },
  ];

  return (
    <aside
      id="astra-7-sidebar"
      className={`relative h-full flex flex-col justify-between bg-[#04060C] border-r border-amber-500/20 text-slate-200 select-none z-30 transition-all duration-300 ${
        className ? className : `${isCollapsed ? 'w-[72px]' : 'w-[260px] xl:w-[280px]'}`
      }`}
      style={{
        width: className ? undefined : isCollapsed ? '72px' : undefined,
        maxWidth: className ? undefined : isCollapsed ? '72px' : '280px',
      }}
    >
      {/* Top Header lockup inside sidebar */}
      <div className="p-3.5 pb-2.5 border-b border-amber-500/15 flex items-center justify-between gap-2">
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          title="Return to Nexus 2040 Command"
        >
          <AstraCoreIcon size={isCollapsed ? 28 : 32} />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-white group-hover:text-amber-300 transition-colors">
                  ASTRA 7
                </span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  2040
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">
                GOLDEN CORE
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button X */}
        {onCloseMobile ? (
          <button
            onClick={() => {
              hapticDrawer();
              onCloseMobile();
            }}
            className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-all ml-auto shrink-0 flex items-center gap-1 text-xs font-mono"
            title="Close menu"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Close</span>
          </button>
        ) : onToggleCollapse ? (
          /* Desktop collapse/expand button ☰ */
          <button
            onClick={() => {
              triggerHaptic(15);
              onToggleCollapse();
            }}
            className={`p-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-300 transition-all ml-auto shrink-0 ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar (260-280px)' : 'Collapse sidebar (72px)'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Main Vertical Navigation */}
      <div className={`flex-1 overflow-y-auto py-2.5 space-y-1 scrollbar-thin ${isCollapsed ? 'px-1.5' : 'px-2.5'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected =
            activePower === item.id ||
            (item.id === 'study' && activePower === 'tool-study') ||
            (item.id === 'codelab' && activePower === 'tool-code') ||
            (item.id === 'documents' && (activePower === 'files' || activePower === 'document-gen')) ||
            (item.id === 'image-studio' && activePower === 'tool-image') ||
            (item.id === 'cinema-studio' && (activePower === 'cinema-studio' || activePower === 'image-to-game')) ||
            (item.id === 'settings' && activePower === 'settings') ||
            (item.id === 'more' && (activePower === 'tools' || activePower === 'explore' || activePower === 'profile' || activePower === 'help'));

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full group relative flex items-center rounded-xl text-left transition-all duration-200 ${
                isCollapsed
                  ? 'justify-center p-2.5'
                  : 'gap-3 px-3 py-2'
              } ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500/25 via-[#F5B82E]/20 to-amber-600/15 text-white font-bold border border-amber-400/50 shadow-[0_0_20px_rgba(245,184,46,0.22)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {/* Active Golden Bar */}
              {isSelected && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#F5B82E] shadow-[0_0_10px_#F5B82E]" />
              )}

              {/* Icon / Glyph */}
              <div
                className={`p-1 rounded-lg transition-colors shrink-0 ${
                  isSelected
                    ? 'text-[#FFD76A] drop-shadow-[0_0_8px_rgba(255,215,106,0.7)]'
                    : 'text-[#F5B82E]/80 group-hover:text-[#FFD76A]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Label */}
              {!isCollapsed && (
                <span className="text-xs tracking-tight truncate flex-1">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Sidebar Cards (Section 4 Requirements) */}
      <div className={`border-t border-amber-500/15 ${isCollapsed ? 'p-2 flex flex-col items-center' : 'p-3 space-y-2.5'}`}>
        {isCollapsed ? (
          <div
            onClick={() => handleNavClick('voice')}
            className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:text-white cursor-pointer transition-all shadow-[0_0_15px_rgba(245,184,46,0.15)]"
            title="Astra Core • Golden Core"
          >
            <AstraCoreIcon size={26} />
          </div>
        ) : (
          <>
            {/* Card 1: GOLDEN CORE */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#F5B82E]/10 to-transparent border border-amber-400/35 shadow-[0_0_20px_rgba(245,184,46,0.1)] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="text-[11px] font-black tracking-widest text-[#FFD76A] uppercase font-mono">
                  GOLDEN CORE
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  Think Deeper
                </div>
                <div className="text-[11px] text-amber-200/80">
                  Go Further
                </div>
              </div>
              <div className="shrink-0">
                <AstraCoreIcon size={34} />
              </div>
            </div>

            {/* Card 2: Tagline */}
            <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-amber-500/20 text-center">
              <p className="text-[11px] font-medium text-slate-300 italic tracking-tight">
                &ldquo;One Intelligence. Every Possibility.&rdquo;
              </p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
