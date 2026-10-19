import React, { useEffect, useState } from 'react';
import {
  X,
  Keyboard,
  Mic,
  Command,
  Sparkles,
  Search,
  Bot,
  Volume2,
  VolumeX,
  ArrowRight,
  Landmark,
  Satellite,
  BookOpen
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoiceMode?: () => void;
  onOpenSearch?: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onOpenVoiceMode,
  onOpenSearch,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'shortcuts' | 'voice'>('all');

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const keyboardShortcuts = [
    {
      combo: [`${modKey}`, 'K'],
      description: 'Open Global Command Palette & Unified Search',
      category: 'Navigation',
    },
    {
      combo: ['?'],
      description: 'Open this Help & Shortcuts guide',
      category: 'General',
    },
    {
      combo: ['Esc'],
      description: 'Close active modal, search palette, or voice overlay',
      category: 'General',
    },
    {
      combo: ['Enter'],
      description: 'Submit prompt or query in chat composer',
      category: 'Chat & Composer',
    },
    {
      combo: ['Shift', 'Enter'],
      description: 'Insert a new line in the chat composer without sending',
      category: 'Chat & Composer',
    },
  ];

  const voiceCommands = [
    {
      phrase: '“Explain [concept] step-by-step”',
      purpose: 'Invokes Socratic tutoring in Astra Scholar with intuitive clarity',
      icon: BookOpen,
      badge: 'Scholar',
    },
    {
      phrase: '“Track ISS” or “Where is James Webb?”',
      purpose: 'Queries live telemetry and orbital vectors from Astra Cosmos',
      icon: Satellite,
      badge: 'Cosmos',
    },
    {
      phrase: '“Examine Tutankhamun Mask”',
      purpose: 'Cross-references 5,000+ museum artifacts with provenance & source metadata',
      icon: Landmark,
      badge: 'Antiquities',
    },
    {
      phrase: '“Ask the Code Architect” or “Deploy Deep Researcher”',
      purpose: 'Delegates task to one of 11 domain-specialized AI agent cores',
      icon: Bot,
      badge: 'AI Agents',
    },
    {
      phrase: '“Mute” / “Stop speaking”',
      purpose: 'Instantly halts speech playback synthesis without interrupting thinking state',
      icon: VolumeX,
      badge: 'Playback',
    },
  ];

  return (
    <div
      id="astra-help-modal-overlay"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="astra-help-modal"
        className="w-full max-w-2xl bg-[#0B0D1B] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.25)] flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#070814]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-cyan-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Shortcuts & Voice Guide</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-purple-300 border border-violet-500/30 font-mono">
                  Astra Help
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Master rapid navigation, keyboard combos, and conversational voice triggers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-5 pt-3 pb-2 border-b border-white/5 flex items-center gap-2 bg-[#0A0C1A]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Commands
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'shortcuts'
                ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Command className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mode Commands</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm scrollbar-thin scrollbar-thumb-white/10">
          {/* Section 1: Keyboard Shortcuts */}
          {(activeTab === 'all' || activeTab === 'shortcuts') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 font-mono">
                  <Command className="w-4 h-4 text-cyan-400" />
                  <span>Essential Keyboard Shortcuts</span>
                </div>
                {onOpenSearch && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSearch();
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 hover:underline"
                  >
                    <span>Launch Search</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid gap-2">
                {keyboardShortcuts.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all group"
                  >
                    <div className="text-xs text-gray-300 font-medium">
                      {item.description}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      {item.combo.map((key, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 rounded bg-black/60 text-xs font-mono text-cyan-300 border border-white/10 shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Voice Mode Commands */}
          {(activeTab === 'all' || activeTab === 'voice') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 font-mono">
                  <Mic className="w-4 h-4 text-purple-400" />
                  <span>Voice Mode Commands & Triggers</span>
                </div>
                {onOpenVoiceMode && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVoiceMode();
                    }}
                    className="text-xs text-purple-300 hover:text-purple-200 font-mono flex items-center gap-1 hover:underline"
                  >
                    <span>Try Voice Mode</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid gap-2">
                {voiceCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-violet-500/20 text-cyan-300 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white font-mono text-cyan-200">
                            {cmd.phrase}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {cmd.purpose}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-purple-300 border border-violet-500/20 shrink-0">
                        {cmd.badge}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Voice Tips Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-violet-950/40 via-[#0A0D22] to-cyan-950/20 border border-violet-500/20 text-xs text-gray-300 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Audio & Speech Feedback</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  Voice Mode continuously listens when active. If your microphone is not permitted in browser settings, click the microphone button in the modal to manually input or check permissions. You can interrupt Astra speaking at any time by speaking or tapping Mute.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070814] flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-gray-300 border border-white/10">
              Esc
            </kbd>
            <span>to close</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVoiceMode && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVoiceMode();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-cyan-300 border border-violet-500/40 transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Launch Voice</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
