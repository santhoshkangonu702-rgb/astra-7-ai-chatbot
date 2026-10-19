import React from 'react';
import {
  Home,
  Wrench,
  MessageSquare,
  History,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PenTool,
  GraduationCap,
  Lightbulb,
  FileText,
  Code2,
  Image as ImageIcon,
  Compass,
  Zap,
  Layers,
  Database,
  FolderKanban,
  ShieldAlert,
  Newspaper,
  Calendar,
  Target
} from 'lucide-react';
import { PowerId, AppTheme, AccentColor } from '../types';
import { AstraLogo } from './AstraLogo';

interface NavigationProps {
  activePower: PowerId;
  onSelectPower: (power: PowerId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isAdmin?: boolean;
  theme?: AppTheme;
  accentColor?: AccentColor;
  onOpenUpgrade?: () => void;
}

interface NavItem {
  id: PowerId;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  color?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePower,
  onSelectPower,
  collapsed,
  onToggleCollapse,
  theme = 'light',
  onOpenUpgrade,
}) => {
  const isDark = theme === 'dark';

  // Core desktop navigation requested in prompt section 19:
  // Home, Tools, Chat, History, Settings, Profile
  const primaryNav: NavItem[] = [
    { id: 'home', label: 'Home', sublabel: 'Astra Hub', icon: Home },
    { id: 'workspace', label: 'Everything Workspace', sublabel: 'End-to-End Suite', icon: Layers, badge: 'New' },
    { id: 'navigator', label: 'Astra Navigator', sublabel: 'Planning Engine', icon: Compass, badge: 'Plan' },
    { id: 'knowledge', label: 'Knowledge Hub', sublabel: 'Semantic RAG', icon: Database, badge: 'RAG' },
    { id: 'projects', label: 'Project Spaces', sublabel: 'Tasks & Memory', icon: FolderKanban, badge: 'Active' },
    { id: 'tools', label: 'AI Tools', sublabel: '8 Creative Engines', icon: Wrench, badge: '8 Tools' },
    { id: 'chat', label: 'AI Chat', sublabel: 'Generative Assistant', icon: MessageSquare, badge: 'Live' },
    { id: 'history', label: 'History', sublabel: 'Past Conversations', icon: History },
    { id: 'settings', label: 'Settings', sublabel: 'Theme & Accents', icon: Settings },
    { id: 'profile', label: 'Profile', sublabel: 'Account & Plan', icon: User },
  ];

  // Workspace intelligence items
  const workspaceNav: Array<{ id: PowerId; label: string; icon: any; color: string; badge?: string }> = [
    { id: 'factcheck', label: 'Fact Check Mode', icon: ShieldAlert, color: 'text-blue-500', badge: 'Truth' },
    { id: 'briefing', label: 'Daily Briefing', icon: Newspaper, color: 'text-amber-500', badge: 'Live' },
    { id: 'planner', label: 'Smart Planner', icon: Calendar, color: 'text-violet-500', badge: 'Alerts' },
    { id: 'goalcoach', label: 'Goal Coach', icon: Target, color: 'text-emerald-500', badge: 'Skills' },
    { id: 'toolbox', label: 'Local Toolbox', icon: Wrench, color: 'text-cyan-500', badge: 'Fast' },
  ];

  // Quick shortcuts to the 7 core tools
  const quickToolShortcuts: Array<{ id: PowerId; label: string; icon: any; color: string }> = [
    { id: 'tool-assistant', label: 'AI Assistant', icon: Sparkles, color: 'text-indigo-500' },
    { id: 'tool-writer', label: 'AI Writer', icon: PenTool, color: 'text-cyan-500' },
    { id: 'tool-study', label: 'Study Assistant', icon: GraduationCap, color: 'text-amber-500' },
    { id: 'tool-ideas', label: 'Idea Generator', icon: Lightbulb, color: 'text-pink-500' },
    { id: 'tool-resume', label: 'Resume Builder', icon: FileText, color: 'text-emerald-500' },
    { id: 'tool-code', label: 'Code Assistant', icon: Code2, color: 'text-purple-500' },
    { id: 'tool-image', label: 'Image Creator', icon: ImageIcon, color: 'text-rose-500' },
  ];

  // Check if activePower is a tool sub-route
  const isToolActive = activePower === 'tools' || activePower.startsWith('tool-');

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside
        id="astra-desktop-nav"
        className={`hidden md:flex flex-col transition-all duration-300 z-30 shrink-0 select-none border-r ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white/90 border-slate-200/80 text-slate-800 shadow-sm'
        } backdrop-blur-xl ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div
          className={`h-18 px-4 flex items-center justify-between border-b ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <button
            onClick={() => onSelectPower('home')}
            className="flex items-center gap-2 text-left hover:opacity-95 transition-opacity"
            title="Astra 7 Home"
          >
            <AstraLogo size={36} showText={!collapsed} tagline="secondary" darkText={!isDark} />
          </button>
          <button
            onClick={onToggleCollapse}
            className={`p-2 rounded-xl transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Platform
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  v2.5
                </span>
              </div>
            )}
            <div className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.id === 'tools'
                    ? isToolActive
                    : activePower === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onSelectPower(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isDark
                            ? 'text-slate-400 group-hover:text-indigo-400'
                            : 'text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {!collapsed && (
                        <div className="text-left truncate">
                          <div className="truncate text-xs font-semibold">{item.label}</div>
                          {item.sublabel && (
                            <div
                              className={`text-[10px] truncate ${
                                isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {!collapsed && item.badge && (
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-indigo-100/70 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workspace & Intelligence (Desktop expanded) */}
          {!collapsed && (
            <div>
              <div className="px-3 mb-2 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Workspace Intelligence
                </span>
              </div>
              <div className="space-y-1">
                {workspaceNav.map((tool) => {
                  const ToolIcon = tool.icon;
                  const isCurrent = activePower === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onSelectPower(tool.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ToolIcon className={`w-3.5 h-3.5 shrink-0 ${tool.color}`} />
                        <span className="truncate text-[11px]">{tool.label}</span>
                      </div>
                      {tool.badge && (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {tool.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Tools Quick Access (Desktop expanded) */}
          {!collapsed && (
            <div>
              <div className="px-3 mb-2 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Quick Tools
                </span>
                <button
                  onClick={() => onSelectPower('tools')}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="space-y-1">
                {quickToolShortcuts.map((tool) => {
                  const ToolIcon = tool.icon;
                  const isCurrent = activePower === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onSelectPower(tool.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      <ToolIcon className={`w-3.5 h-3.5 shrink-0 ${tool.color}`} />
                      <span className="truncate text-[11px]">{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pro Plan Card in sidebar */}
        {!collapsed && onOpenUpgrade && (
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-200/50 dark:border-indigo-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Astra 7 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              Unlock priority Gemini generation, unlimited tools, and ATS resume export.
            </p>
            <button
              onClick={onOpenUpgrade}
              className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-bold shadow-sm shadow-indigo-500/20 transition-transform active:scale-95"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Bottom Status */}
        {!collapsed && (
          <div
            className={`p-3 border-t text-center text-[11px] ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
            }`}
          >
            <div className="font-semibold">ASTRA 7</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Think Beyond. Create Beyond.</div>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Navigation Bar (Home, Tools, Chat, Profile) */}
      <nav
        id="astra-mobile-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t backdrop-blur-xl z-50 flex items-center justify-around px-2 select-none ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-400'
            : 'bg-white/95 border-slate-200/90 text-slate-500 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]'
        }`}
      >
        <button
          id="mobile-nav-home"
          onClick={() => onSelectPower('home')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl text-[10px] font-medium transition-all ${
            activePower === 'home'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          id="mobile-nav-tools"
          onClick={() => onSelectPower('tools')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl text-[10px] font-medium transition-all ${
            isToolActive
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span>Tools</span>
        </button>

        <button
          id="mobile-nav-chat"
          onClick={() => onSelectPower('chat')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl text-[10px] font-medium transition-all relative ${
            activePower === 'chat'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span>Chat</span>
        </button>

        <button
          id="mobile-nav-profile"
          onClick={() => onSelectPower('profile')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl text-[10px] font-medium transition-all ${
            activePower === 'profile'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
};
