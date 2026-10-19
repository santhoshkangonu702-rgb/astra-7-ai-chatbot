import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  Settings2,
  ChevronDown,
  ArrowLeft,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
  Play,
  Pause,
  Music,
  CheckCircle2,
  Languages
} from 'lucide-react';
import { AstraCore, AstraCoreState } from '../nexus/AstraCore';
import {
  voiceManager,
  VoiceState,
  VoiceManagerEvent,
  SUPPORTED_VOICE_LANGUAGES,
  SupportedVoiceLang
} from '../../services/voiceManager';
import { musicManager, PlayerState } from '../../services/musicManager';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface VoiceAstraPowerProps {
  onBack?: () => void;
  onOpenTextChat?: () => void;
}

export const VoiceAstraPower: React.FC<VoiceAstraPowerProps> = ({ onBack, onOpenTextChat }) => {
  const [voiceEvent, setVoiceEvent] = useState<VoiceManagerEvent>(() => voiceManager.getSnapshot());
  const [musicState, setMusicState] = useState<PlayerState>('IDLE');
  const [currentSongTitle, setCurrentSongTitle] = useState<string | null>(null);

  // Subscribe to voiceManager
  useEffect(() => {
    const unsubVoice = voiceManager.subscribe((evt) => {
      setVoiceEvent(evt);
    });

    const unsubMusic = musicManager.subscribe((evt) => {
      setMusicState(evt.state);
      setCurrentSongTitle(evt.currentTrack ? `${evt.currentTrack.title} • ${evt.currentTrack.artist}` : null);
    });

    return () => {
      unsubVoice();
      unsubMusic();
      voiceManager.stop();
    };
  }, []);

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
    selectedLanguage,
    voiceSpeed,
    voiceVolume,
    lastUserPrompt
  } = voiceEvent;

  // Map VoiceState to AstraCoreState for the 3D orbital core animation
  const mapToCoreState = (): AstraCoreState => {
    if (state === 'LISTENING') return 'searching';
    if (state === 'PROCESSING') return 'thinking';
    if (state === 'SPEAKING') return 'speaking';
    return 'idle';
  };

  const handleMainActionClick = () => {
    triggerHaptic(15);
    if (state === 'LISTENING' || state === 'PROCESSING' || state === 'SPEAKING') {
      voiceManager.stop();
    } else {
      voiceManager.startTalk();
    }
  };

  // Generate 32 audio waveform bars based on live audioLevel
  const waveHeights = Array.from({ length: 32 }, (_, i) => {
    if (state === 'LISTENING' || state === 'SPEAKING') {
      const sinOffset = Math.sin((i / 32) * Math.PI * 2);
      const height = Math.floor(audioLevel * 50 + sinOffset * 15 + 10);
      return Math.max(6, Math.min(60, height));
    }
    return 8;
  });

  const currentLangConfig =
    SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_VOICE_LANGUAGES[0];

  return (
    <div
      id="astra-voice-screen"
      className="h-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 text-slate-100 overflow-y-auto relative select-none"
    >
      {/* Background Subtle Golden Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,184,46,0.08)_0%,rgba(6,182,212,0.04)_45%,transparent_75%)] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between relative z-10 flex-wrap gap-3 pb-2 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={() => {
                voiceManager.stop();
                onBack();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group shrink-0"
              title="Return to Astra 7 Home"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          )}

          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                ASTRA TALK
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                NEXUS 2040 DUPLEX
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 hidden sm:inline">
              LIVE MICROPHONE → BRAIN → NEURAL TTS
            </span>
          </div>
        </div>

        {/* Top Controls: Language & Continuous Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Languages className="w-3.5 h-3.5 absolute left-2.5 text-amber-400 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                triggerHaptic(10);
                voiceManager.setLanguage(e.target.value as SupportedVoiceLang);
              }}
              className="appearance-none pl-8 pr-7 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 hover:border-amber-400/60 text-xs font-semibold text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400/50 cursor-pointer"
              title="Select Voice Language"
            >
              {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-950 text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-amber-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Continuous Talk Mode Toggle */}
          <button
            onClick={() => {
              triggerHaptic(10);
              voiceManager.setContinuousMode(!isContinuousMode);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all border ${
              isContinuousMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,184,46,0.2)]'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Auto-listen for follow-up questions after Astra speaks"
          >
            <span>Continuous: {isContinuousMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Music Playing Notification Banner if active */}
      {musicState === 'PLAYING' && currentSongTitle && (
        <div className="w-full max-w-xl my-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 truncate">
            <Music className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-amber-200 font-medium truncate">{currentSongTitle}</span>
          </div>
          <button
            onClick={() => musicManager.pause()}
            className="px-2 py-0.5 rounded bg-black/40 text-amber-300 hover:text-white border border-amber-400/30 text-[10px] font-mono shrink-0 ml-2"
          >
            Pause Music
          </button>
        </div>
      )}

      {/* Center Stage: Golden Core Orb + State Telemetry */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl py-4 relative z-10 space-y-5">
        {/* Core State Capsule Indicator */}
        <div className="flex items-center gap-2">
          {state === 'LISTENING' && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>🔴 LISTENING... SPEAK NOW</span>
            </div>
          )}

          {state === 'PROCESSING' && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>⏳ ASTRA BRAIN PROCESSING → {routedCapability}</span>
            </div>
          )}

          {state === 'SPEAKING' && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold animate-pulse shadow-[0_0_20px_rgba(245,184,46,0.3)]">
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>🔊 ASTRA SPEAKING...</span>
            </div>
          )}

          {state === 'READY' && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>READY • TAP CORE OR MIC TO TALK</span>
            </div>
          )}

          {state === 'ERROR' && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>ATTENTION REQUIRED</span>
            </div>
          )}
        </div>

        {/* 3D Golden Core Component */}
        <div
          onClick={handleMainActionClick}
          className="cursor-pointer transform hover:scale-105 transition-transform duration-300 focus:outline-none"
          title={state === 'LISTENING' ? 'Tap to stop' : 'Tap to talk'}
        >
          <AstraCore
            state={mapToCoreState()}
            size={220}
            audioLevel={audioLevel}
            statusText={
              state === 'LISTENING'
                ? 'Listening to user...'
                : state === 'PROCESSING'
                ? 'Synthesizing with Astra Brain...'
                : state === 'SPEAKING'
                ? 'Voicing response...'
                : 'Tap to Talk'
            }
          />
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex items-end justify-center gap-1 h-12 w-full max-w-sm px-4">
          {waveHeights.map((h, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-100 ${
                state === 'LISTENING'
                  ? 'bg-gradient-to-t from-rose-500 to-amber-400'
                  : state === 'SPEAKING'
                  ? 'bg-gradient-to-t from-amber-500 via-amber-300 to-cyan-400'
                  : state === 'PROCESSING'
                  ? 'bg-gradient-to-t from-cyan-500 to-purple-400'
                  : 'bg-white/10'
              }`}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Live Conversation Transcript Display */}
        <div className="w-full max-w-xl p-4 rounded-2xl bg-black/60 border border-amber-500/25 backdrop-blur-xl space-y-2.5 shadow-2xl text-center">
          {/* User Interim or Final Speech */}
          {(interimTranscript || transcript) && (
            <div className="text-xs text-amber-200 font-medium italic">
              “{interimTranscript || transcript}”
            </div>
          )}

          {/* Assistant Voice Response Display */}
          {responseSpeech && state !== 'LISTENING' && (
            <div className="text-sm text-slate-100 font-['Space_Grotesk',sans-serif] leading-relaxed">
              {responseSpeech}
            </div>
          )}

          {/* Placeholder prompt guide if completely empty */}
          {!interimTranscript && !transcript && !responseSpeech && state === 'READY' && (
            <div className="space-y-1">
              <p className="text-xs text-slate-400">
                Speak naturally in {currentLangConfig.name}. Try asking:
              </p>
              <p className="text-xs text-amber-300 font-medium">
                "{currentLangConfig.samplePrompt}"
              </p>
            </div>
          )}

          {/* Error Message with Specific Diagnostics */}
          {errorMessage && (
            <div className="pt-2 text-xs text-rose-300 font-mono space-y-2">
              <div className="flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => voiceManager.retry()}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold hover:brightness-110 transition-all text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </button>

                {onOpenTextChat && (
                  <button
                    onClick={() => {
                      voiceManager.stop();
                      onOpenTextChat();
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all text-xs"
                  >
                    <MessageSquare className="w-3 h-3 text-cyan-400" />
                    <span>Use Text Chat</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#060814]/90 backdrop-blur-2xl border border-amber-500/35 shadow-2xl relative z-10 flex-wrap">
        {/* Mute Button */}
        <button
          onClick={() => {
            triggerHaptic(10);
            voiceManager.toggleMute();
          }}
          className={`p-2.5 rounded-xl border transition-all ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title={isMuted ? 'Unmute Speech Audio' : 'Mute Speech Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Center Primary Action Button: 🎙 Tap to Talk / ⏹ Stop */}
        <button
          onClick={handleMainActionClick}
          className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xl active:scale-98 cursor-pointer ${
            state === 'LISTENING'
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 animate-pulse'
              : state === 'SPEAKING'
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/40'
              : state === 'PROCESSING'
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40 animate-pulse'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(245,184,46,0.35)]'
          }`}
        >
          {state === 'LISTENING' ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Listening</span>
            </>
          ) : state === 'SPEAKING' ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Speaking</span>
            </>
          ) : state === 'PROCESSING' ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 stroke-[2.5]" />
              <span>Tap to Talk</span>
            </>
          )}
        </button>

        {/* Stop All Button */}
        <button
          onClick={() => {
            triggerHaptic(10);
            voiceManager.stop();
          }}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors"
          title="Stop All Audio & Recognition (⏹)"
        >
          <Square className="w-4 h-4" />
        </button>

        {/* Switch to Chat Button */}
        {onOpenTextChat && (
          <button
            onClick={() => {
              voiceManager.stop();
              onOpenTextChat();
            }}
            className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Open Chat Stream"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Open Chat</span>
          </button>
        )}
      </div>
    </div>
  );
};
