import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Menu,
  Plus,
  Search,
  Pin,
  Star,
  Trash2,
  Edit3,
  Share2,
  Archive,
  MoreVertical,
  X,
  MessageSquare,
  Clock,
  History,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Check,
  AlertTriangle,
  FolderArchive
} from 'lucide-react';
import { Conversation } from '../../types';
import { ChatSearchEntry } from '../../services/chatHistoryService';
import { AstraCoreIcon } from '../nexus/AstraCoreIcon';
import { triggerHaptic, hapticAction } from '../../utils/haptics';

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  activeConvId: string;
  onSelectConversation: (id: string) => void;
  onCreateNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onShareConversation: (conv: Conversation) => void;
  onOpenSettings?: () => void;
  
  // Search history
  searchHistory: ChatSearchEntry[];
  onSelectSearchQuery: (query: string) => void;
  onRemoveSearchQuery: (id: string) => void;
  onClearAllSearches: () => void;

  // Responsive Drawer & Collapse state
  isOpen: boolean; // on desktop controls full width vs collapsed rail; on mobile controls drawer visibility
  isMobile: boolean;
  onCloseMobileDrawer: () => void;
  onToggleSidebarCollapse: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  conversations,
  activeConvId,
  onSelectConversation,
  onCreateNewChat,
  onRenameConversation,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onDeleteConversation,
  onShareConversation,
  onOpenSettings,
  searchHistory,
  onSelectSearchQuery,
  onRemoveSearchQuery,
  onClearAllSearches,
  isOpen,
  isMobile,
  onCloseMobileDrawer,
  onToggleSidebarCollapse
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeMenuConvId, setActiveMenuConvId] = useState<string | null>(null);
  const [deleteConfirmConv, setDeleteConfirmConv] = useState<Conversation | null>(null);
  
  // Inline rename state
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Section collapse states
  const [isPinnedOpen, setIsPinnedOpen] = useState(true);
  const [isSavedOpen, setIsSavedOpen] = useState(true);
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);

  // Close menus on outside click
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuConvId(null);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  // Filter conversations
  const filteredList = useMemo(() => {
    if (!searchFilter.trim()) return conversations;
    const q = searchFilter.toLowerCase().trim();
    return conversations.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchMessages = c.messages?.some(
        (m) => typeof m.content === 'string' && m.content.toLowerCase().includes(q)
      );
      return matchTitle || matchMessages;
    });
  }, [conversations, searchFilter]);

  // Group conversations chronologically & by status
  const { pinned, saved, today, yesterday, previous7Days, older, archived } = useMemo(() => {
    const pinnedArr: Conversation[] = [];
    const savedArr: Conversation[] = [];
    const todayArr: Conversation[] = [];
    const yesterdayArr: Conversation[] = [];
    const prev7Arr: Conversation[] = [];
    const olderArr: Conversation[] = [];
    const archivedArr: Conversation[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 6 * 86400000;

    filteredList.forEach((c) => {
      if (c.isArchived) {
        archivedArr.push(c);
        return;
      }
      if (c.isPinned) {
        pinnedArr.push(c);
      }
      if (c.isFavorite) {
        savedArr.push(c);
      }

      // Chronological placement
      const updatedTime = new Date(c.updatedAt || c.createdAt).getTime();
      if (updatedTime >= todayStart) {
        todayArr.push(c);
      } else if (updatedTime >= yesterdayStart) {
        yesterdayArr.push(c);
      } else if (updatedTime >= weekStart) {
        prev7Arr.push(c);
      } else {
        olderArr.push(c);
      }
    });

    const sortByDate = (a: Conversation, b: Conversation) =>
      new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();

    return {
      pinned: pinnedArr.sort(sortByDate),
      saved: savedArr.sort(sortByDate),
      today: todayArr.sort(sortByDate),
      yesterday: yesterdayArr.sort(sortByDate),
      previous7Days: prev7Arr.sort(sortByDate),
      older: olderArr.sort(sortByDate),
      archived: archivedArr.sort(sortByDate)
    };
  }, [filteredList]);

  const handleStartRename = (c: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuConvId(null);
    setEditingConvId(c.id);
    setEditingTitle(c.title);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingConvId(null);
  };

  const handleActionMenuClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(10);
    setActiveMenuConvId(activeMenuConvId === id ? null : id);
  };

  // Render a single chat row
  const renderChatRow = (conv: Conversation) => {
    const isActive = conv.id === activeConvId;
    const isEditing = editingConvId === conv.id;
    const isMenuOpen = activeMenuConvId === conv.id;

    return (
      <div
        key={conv.id}
        onClick={() => {
          if (!isEditing) {
            triggerHaptic(12);
            onSelectConversation(conv.id);
            if (isMobile) onCloseMobileDrawer();
          }
        }}
        className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all select-none ${
          isActive
            ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(245,184,46,0.15)]'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
        }`}
      >
        {/* Left gold active indicator bar */}
        {isActive && (
          <div className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_8px_#F5B82E]" />
        )}

        <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-1">
          <MessageSquare
            className={`w-3.5 h-3.5 shrink-0 ${
              isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400/70'
            }`}
          />

          {isEditing ? (
            <div className="flex items-center gap-1.5 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename(conv.id);
                  if (e.key === 'Escape') setEditingConvId(null);
                }}
                autoFocus
                className="w-full bg-black/80 border border-amber-400/60 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => handleSaveRename(conv.id)}
                className="p-1 text-emerald-400 hover:text-emerald-300"
                title="Save title"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="truncate flex-1">
              <span className={`truncate block font-medium ${isActive ? 'text-amber-100 font-semibold' : ''}`}>
                {conv.title || 'Untitled Conversation'}
              </span>
            </div>
          )}
        </div>

        {/* Hover/Active Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {conv.isPinned && (
              <Pin className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
            )}
            {conv.isFavorite && (
              <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
            )}

            {/* Three-dot Menu Trigger Button */}
            <div className="relative">
              <button
                onClick={(e) => handleActionMenuClick(conv.id, e)}
                className={`p-1 rounded-lg transition-all ${
                  isMenuOpen
                    ? 'opacity-100 bg-white/10 text-white'
                    : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Chat Options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Action Dropdown Menu */}
              {isMenuOpen && (
                <div
                  ref={menuRef}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#090D18]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    onClick={(e) => handleStartRename(conv, e)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rename</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(null);
                      onTogglePin(conv.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                  >
                    <Pin className={`w-3.5 h-3.5 ${conv.isPinned ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                    <span>{conv.isPinned ? 'Unpin' : 'Pin to Top'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(null);
                      onToggleFavorite(conv.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                  >
                    <Star className={`w-3.5 h-3.5 ${conv.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                    <span>{conv.isFavorite ? 'Unfavorite' : 'Save to Favorites'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(null);
                      onShareConversation(conv);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(null);
                      onToggleArchive(conv.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                  >
                    <Archive className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{conv.isArchived ? 'Unarchive' : 'Archive'}</span>
                  </button>

                  <div className="h-px bg-white/10 my-1" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(null);
                      setDeleteConfirmConv(conv);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/15 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Section Header Component
  const renderSectionHeader = (
    title: string,
    icon: React.ReactNode,
    isOpenState: boolean,
    onToggle: () => void,
    count?: number
  ) => (
    <div
      onClick={onToggle}
      className="flex items-center justify-between px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-amber-400/80 cursor-pointer select-none transition-colors"
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span>{title}</span>
        {count !== undefined && count > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-white/5 text-slate-400 text-[9px]">
            {count}
          </span>
        )}
      </div>
      {isOpenState ? (
        <ChevronDown className="w-3 h-3 opacity-60" />
      ) : (
        <ChevronRight className="w-3 h-3 opacity-60" />
      )}
    </div>
  );

  // If collapsed rail on desktop (when !isOpen and !isMobile)
  if (!isOpen && !isMobile) {
    return (
      <div className="w-16 border-r border-amber-500/20 bg-[#060814]/95 backdrop-blur-xl flex flex-col items-center py-3 justify-between shrink-0 z-20">
        <div className="flex flex-col items-center gap-4">
          {/* Hamburger Expand Button */}
          <button
            onClick={onToggleSidebarCollapse}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            title="Expand Chat History (☰)"
          >
            <Menu className="w-5 h-5 text-amber-400" />
          </button>

          {/* New Chat Icon */}
          <button
            onClick={onCreateNewChat}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center hover:brightness-110 shadow-[0_0_15px_rgba(245,184,46,0.3)] transition-all"
            title="New Chat (✚)"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={onToggleSidebarCollapse}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Search Chats (🔍)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Chats Icon */}
          <button
            onClick={onToggleSidebarCollapse}
            className="p-2.5 rounded-xl text-amber-400 bg-amber-500/10 border border-amber-500/30 transition-colors"
            title={`Conversations (${conversations.length})`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Saved Icon */}
          {saved.length > 0 && (
            <button
              onClick={onToggleSidebarCollapse}
              className="p-2.5 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-colors"
              title={`Saved Chats (${saved.length})`}
            >
              <Star className="w-4 h-4 fill-amber-400/40" />
            </button>
          )}
        </div>

        {/* Bottom Settings Icon */}
        <div className="flex flex-col items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Chat Settings & Themes (⚙)"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          <AstraCoreIcon size={22} />
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-[#060814]/98 backdrop-blur-2xl border-r border-amber-500/20 text-slate-200 select-none">
      {/* 1. SIDEBAR HEADER: ☰ ASTRA 7 + Close/Collapse */}
      <div className="p-3.5 border-b border-amber-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={isMobile ? onCloseMobileDrawer : onToggleSidebarCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            title={isMobile ? 'Close Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-4 h-4 text-amber-400" />
          </button>
          <div className="flex items-center gap-2">
            <AstraCoreIcon size={20} />
            <span className="font-extrabold text-white tracking-wider text-sm font-['Space_Grotesk',sans-serif]">
              ASTRA 7
            </span>
          </div>
        </div>

        {isMobile ? (
          <button
            onClick={onCloseMobileDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Drawer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onToggleSidebarCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-xs font-mono"
            title="Collapse Sidebar"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      {/* 2. ＋ NEW CHAT BUTTON */}
      <div className="p-3 space-y-2 shrink-0 border-b border-white/5">
        <button
          onClick={() => {
            triggerHaptic(20);
            onCreateNewChat();
            if (isMobile) onCloseMobileDrawer();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-98 transition-all shadow-[0_0_20px_rgba(245,184,46,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Chat</span>
        </button>

        {/* 3. 🔍 SEARCH CHATS INPUT */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-black/50 border border-white/10 focus:border-amber-500/50 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 4. CHAT LIST (Scrollable, Categorized) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
        {/* Pinned Section */}
        {pinned.length > 0 && (
          <div className="space-y-0.5">
            {renderSectionHeader('PINNED', <Pin className="w-3 h-3 text-amber-400" />, isPinnedOpen, () => setIsPinnedOpen(!isPinnedOpen), pinned.length)}
            {isPinnedOpen && pinned.map(renderChatRow)}
          </div>
        )}

        {/* Saved / Favorites Section */}
        {saved.length > 0 && (
          <div className="space-y-0.5">
            {renderSectionHeader('SAVED', <Star className="w-3 h-3 text-amber-400" />, isSavedOpen, () => setIsSavedOpen(!isSavedOpen), saved.length)}
            {isSavedOpen && saved.map(renderChatRow)}
          </div>
        )}

        {/* Today Section */}
        {today.length > 0 && (
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-400/70" />
              <span>TODAY</span>
            </div>
            {today.map(renderChatRow)}
          </div>
        )}

        {/* Yesterday Section */}
        {yesterday.length > 0 && (
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              YESTERDAY
            </div>
            {yesterday.map(renderChatRow)}
          </div>
        )}

        {/* Previous 7 Days Section */}
        {previous7Days.length > 0 && (
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              THIS WEEK
            </div>
            {previous7Days.map(renderChatRow)}
          </div>
        )}

        {/* Older Section */}
        {older.length > 0 && (
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              OLDER CONVERSATIONS
            </div>
            {older.map(renderChatRow)}
          </div>
        )}

        {/* 5. SEARCH HISTORY SECTION */}
        {searchHistory && searchHistory.length > 0 && (
          <div className="pt-2 border-t border-white/5 space-y-1">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              <div
                onClick={() => setIsSearchHistoryOpen(!isSearchHistoryOpen)}
                className="flex items-center gap-1.5 cursor-pointer hover:text-amber-400"
              >
                <History className="w-3 h-3 text-cyan-400" />
                <span>SEARCH HISTORY</span>
                {isSearchHistoryOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </div>
              {isSearchHistoryOpen && (
                <button
                  onClick={onClearAllSearches}
                  className="text-[9px] text-slate-500 hover:text-rose-400 transition-colors"
                  title="Clear search queries"
                >
                  Clear
                </button>
              )}
            </div>

            {isSearchHistoryOpen && (
              <div className="space-y-1 pl-1">
                {searchHistory.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      triggerHaptic(10);
                      onSelectSearchQuery(entry.query);
                      if (isMobile) onCloseMobileDrawer();
                    }}
                    className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 group-hover:text-cyan-400 text-xs">🔎</span>
                      <span className="truncate">{entry.query}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSearchQuery(entry.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Archived Section */}
        {archived.length > 0 && (
          <div className="pt-2 border-t border-white/5 space-y-0.5">
            {renderSectionHeader('ARCHIVED', <FolderArchive className="w-3 h-3 text-indigo-400" />, isArchivedOpen, () => setIsArchivedOpen(!isArchivedOpen), archived.length)}
            {isArchivedOpen && archived.map(renderChatRow)}
          </div>
        )}

        {filteredList.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-500">
            No chats found matching "{searchFilter}"
          </div>
        )}
      </div>

      {/* 6. SIDEBAR FOOTER: Settings & Session Counter */}
      <div className="p-3 border-t border-amber-500/20 bg-black/40 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <span className="font-mono text-[11px] text-slate-500">
          {conversations.length} Active {conversations.length === 1 ? 'Session' : 'Sessions'}
        </span>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors text-[11px] font-mono text-slate-300"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Settings</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal for Permanent Chat Deletion */}
      {deleteConfirmConv && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setDeleteConfirmConv(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-sm w-full rounded-2xl bg-[#0A0D1A] border border-rose-500/30 p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Delete Conversation?</h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  "{deleteConfirmConv.title}"
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete this conversation and its complete message history. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmConv(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteConversation(deleteConfirmConv.id);
                  setDeleteConfirmConv(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-950"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // If mobile drawer
  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onCloseMobileDrawer}
        />
        {/* Drawer container (width 80-88vw, max 360px) */}
        <div className="relative w-[85vw] max-w-[360px] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-250">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Desktop regular container (270px width)
  return (
    <div className="w-[270px] shrink-0 h-full flex flex-col z-20 transition-all duration-200">
      {sidebarContent}
    </div>
  );
};
