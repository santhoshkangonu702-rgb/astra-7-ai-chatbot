import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Square,
  Play,
  RotateCcw,
  Languages,
  ChevronDown,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { AstraOrb, OrbState } from './AstraOrb';
import {
  voiceManager,
  VoiceState,
  VoiceManagerEvent,
  SUPPORTED_VOICE_LANGUAGES,
  SupportedVoiceLang
} from '../services/voiceManager';
import { triggerHaptic, hapticAction } from '../utils/haptics';

interface VoiceModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (text: string) => Promise<string | void>;
  onOpenChatScreen?: () => void;
}

export const VoiceModeModal: React.FC<VoiceModeModalProps> = ({
  isOpen,
  onClose,
  onOpenChatScreen
}) => {
  const [voiceEvent, setVoiceEvent] = useState<VoiceManagerEvent>(() => voiceManager.getSnapshot());

  useEffect(() => {
    const unsub = voiceManager.subscribe((evt) => {
      setVoiceEvent(evt);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isOpen) {
      voiceManager.startTalk();
    } else {
      voiceManager.stop();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        voiceManager.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const {
    state,
    transcript,
    interimTranscript,
    responseSpeech,
    routedCapability,
    audioLevel,
    errorMessage,
    errorActionType,
    isMuted,
    isContinuousMode,
    selectedLanguage
  } = voiceEvent;

  // Map state to AstraOrb state
  const mapToOrbState = (): OrbState => {
    if (state === 'LISTENING') return 'voice';
    if (state === 'PROCESSING') return 'thinking';
    if (state === 'SPEAKING') return 'voice';
    return 'idle';
  };

  const currentLangConfig =
    SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_VOICE_LANGUAGES[0];

  const handleToggleMic = () => {
    triggerHaptic(15);
    if (state === 'LISTENING' || state === 'PROCESSING' || state === 'SPEAKING') {
      voiceManager.stop();
    } else {
      voiceManager.startTalk();
    }
  };

  return (
    <div
      id="astra-voice-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#060814]/95 border border-amber-500/35 p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-[0_0_50px_rgba(245,184,46,0.18)] min-h-[480px] overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="w-full flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-extrabold text-white tracking-wider font-['Space_Grotesk',sans-serif]">
              ASTRA TALK
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] border border-amber-500/40">
              {routedCapability}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  triggerHaptic(10);
                  voiceManager.setLanguage(e.target.value as SupportedVoiceLang);
                }}
                className="appearance-none pl-2.5 pr-6 py-1 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 text-[11px] font-mono focus:outline-none cursor-pointer"
              >
                {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-950 text-white">
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-amber-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                voiceManager.stop();
                onClose();
              }}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close Voice Talk (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Orb and State Animation */}
        <div className="my-auto flex flex-col items-center justify-center space-y-4 relative z-10">
          {/* Status Badge */}
          <div>
            {state === 'LISTENING' && (
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                🔴 LISTENING...
              </span>
            )}
            {state === 'PROCESSING' && (
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                ⏳ PROCESSING...
              </span>
            )}
            {state === 'SPEAKING' && (
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                🔊 ASTRA SPEAKING...
              </span>
            )}
            {state === 'READY' && (
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-white/5 text-slate-300 border border-white/10">
                READY • TAP MIC
              </span>
            )}
            {state === 'ERROR' && (
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                ATTENTION REQUIRED
              </span>
            )}
          </div>

          {/* Interactive Astra Orb */}
          <div
            onClick={handleToggleMic}
            className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            title={state === 'LISTENING' ? 'Stop listening' : 'Tap to talk'}
          >
            <AstraOrb state={mapToOrbState()} size={140} audioLevel={audioLevel} />
          </div>

          {/* Real-time Subtitle / Dialogue Display */}
          <div className="w-full max-w-sm min-h-[50px] px-3 py-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-center">
            {interimTranscript || transcript ? (
              <p className="text-xs text-amber-300 font-medium italic line-clamp-3">
                “{interimTranscript || transcript}”
              </p>
            ) : responseSpeech && state !== 'LISTENING' ? (
              <p className="text-xs text-slate-200 line-clamp-3">
                {responseSpeech}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 font-mono">
                {state === 'LISTENING' ? 'Listening to speech...' : `Say: "${currentLangConfig.samplePrompt}"`}
              </p>
            )}
          </div>

          {/* Diagnostics Error State */}
          {errorMessage && (
            <div className="space-y-2 text-xs text-rose-300 font-mono">
              <div className="flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => voiceManager.retry()}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold hover:brightness-110 text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
                {onOpenChatScreen && (
                  <button
                    onClick={() => {
                      voiceManager.stop();
                      onClose();
                      onOpenChatScreen();
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
                  >
                    <MessageSquare className="w-3 h-3 text-cyan-400" />
                    <span>Use Text Chat</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Controls */}
        <div className="w-full flex items-center justify-between gap-2.5 pt-3 border-t border-white/10 relative z-10">
          <button
            onClick={() => {
              triggerHaptic(10);
              voiceManager.toggleMute();
            }}
            className={`p-2.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute Speech' : 'Mute Speech'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleMic}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-lg active:scale-98 cursor-pointer ${
              state === 'LISTENING'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 animate-pulse'
                : state === 'SPEAKING'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/40'
                : state === 'PROCESSING'
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(245,184,46,0.3)]'
            }`}
          >
            {state === 'LISTENING' ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Listening</span>
              </>
            ) : state === 'SPEAKING' ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Speaking</span>
              </>
            ) : state === 'PROCESSING' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Tap to Talk</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              triggerHaptic(10);
              voiceManager.setContinuousMode(!isContinuousMode);
            }}
            className={`px-3 py-2 rounded-xl border text-[11px] font-mono transition-all ${
              isContinuousMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
            title="Toggle Continuous Talk mode"
          >
            Loop: {isContinuousMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
