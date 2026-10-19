import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  AlertCircle,
  Radio,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Square,
  Loader2,
  Settings2,
  MessageSquare
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

export type VoiceState = 'ready' | 'listening' | 'processing' | 'speaking';

export interface VoiceInputHandlerProps {
  /** Callback fired with the transcribed text and finality status */
  onTranscript: (text: string, isFinal: boolean) => void;
  /** Direct submission callback to send spoken message to Astra Brain */
  onSubmitPrompt?: (prompt: string) => void;
  /** Existing text in the target input field */
  currentValue?: string;
  /** Whether AI is actively thinking/generating response */
  isProcessing?: boolean;
  /** Whether TTS speech is currently active */
  isSpeaking?: boolean;
  /** Callback to stop current speech */
  onStopSpeaking?: () => void;
  /** Theme accent */
  accentColor?: 'amber' | 'cyan' | 'rose' | 'emerald';
  /** BCP 47 language tag */
  language?: string;
  /** Sizing */
  size?: 'sm' | 'md' | 'lg';
  /** Tooltip or title text */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Auto speak state */
  autoSpeak?: boolean;
  onToggleAutoSpeak?: () => void;
  /** Open continuous Voice Chat conversation mode */
  onOpenVoiceChat?: () => void;
}

export const VoiceInputHandler: React.FC<VoiceInputHandlerProps> = ({
  onTranscript,
  onSubmitPrompt,
  currentValue = '',
  isProcessing = false,
  isSpeaking = false,
  onStopSpeaking,
  accentColor = 'amber',
  language = 'en-US',
  size = 'md',
  label = 'Voice Input',
  disabled = false,
  autoSpeak = false,
  onToggleAutoSpeak,
  onOpenVoiceChat
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [pulseScale, setPulseScale] = useState(1);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const finalAccumulatorRef = useRef('');

  // Determine active visual state
  const currentState: VoiceState = isSpeaking
    ? 'speaking'
    : isProcessing
    ? 'processing'
    : isListening
    ? 'listening'
    : 'ready';

  // Check speech recognition capability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  // Visualizer pulsing effect
  useEffect(() => {
    let animTimer: any;
    if (isListening || isSpeaking || isProcessing) {
      animTimer = setInterval(() => {
        setPulseScale(1 + Math.random() * 0.18);
      }, 120);
    } else {
      setPulseScale(1);
    }
    return () => clearInterval(animTimer);
  }, [isListening, isSpeaking, isProcessing]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    triggerHaptic(14);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setTimeout(() => {
      setInterimText('');
    }, 1200);
  }, []);

  const startListening = useCallback(async () => {
    if (disabled) return;

    // If currently speaking, stop speech first
    if (isSpeaking && onStopSpeaking) {
      onStopSpeaking();
      return;
    }

    if (!isSupported) {
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setErrorMessage(null);
    setIsPermissionDenied(false);
    setInterimText('');
    finalAccumulatorRef.current = '';

    // Request microphone permission explicitly via getUserMedia first if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close tracks immediately after permission check
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('Microphone permission check error:', err);
        setIsPermissionDenied(true);
        setErrorMessage('Microphone permission is required for voice chat.');
        return;
      }
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // single sentence turn
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        hapticAction();
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcriptSegment;
          } else {
            interim += transcriptSegment;
          }
        }

        if (finalChunk) {
          finalAccumulatorRef.current += (finalAccumulatorRef.current ? ' ' : '') + finalChunk.trim();
          const recognizedText = finalAccumulatorRef.current.trim();
          onTranscript(recognizedText, true);
          triggerHaptic(18);

          // Auto submit to Astra Brain directly
          if (onSubmitPrompt) {
            hapticSuccess();
            onSubmitPrompt(recognizedText);
          }
        }

        if (interim) {
          setInterimText(interim);
          onTranscript(interim.trim(), false);
        } else {
          setInterimText('');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed') {
          setIsPermissionDenied(true);
          setErrorMessage('Microphone permission is required for voice chat.');
        } else if (event.error === 'network') {
          setErrorMessage('Speech service network error. Check connection.');
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Voice service: ${event.error}`);
        }
        stopListening();
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          stopListening();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Could not initialize microphone. Please check permissions.');
      setIsListening(false);
      isListeningRef.current = false;
    }
  }, [disabled, isSpeaking, onStopSpeaking, isSupported, language, onTranscript, onSubmitPrompt, stopListening]);

  const handleMicButtonClick = () => {
    if (isSpeaking && onStopSpeaking) {
      onStopSpeaking();
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1 font-['Inter',sans-serif]">
      {/* 5 States Microphone Button:
          🎤 Ready
          🔴 Listening...
          ⏳ Processing...
          🔊 Speaking...
          ⏹ Stop
      */}
      <button
        type="button"
        id="astra-mic-input-btn"
        onClick={handleMicButtonClick}
        disabled={disabled || isProcessing}
        title={
          isSpeaking
            ? 'Speaking... Click to Stop'
            : isProcessing
            ? 'Processing with Astra Brain...'
            : isListening
            ? 'Listening... Click to finish'
            : 'Speak to Astra 7'
        }
        className={`relative flex items-center justify-center p-2 rounded-xl border transition-all duration-200 outline-none select-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
          isSpeaking
            ? 'bg-rose-500/25 border-rose-400 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
            : isListening
            ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/40'
            : isProcessing
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
            : 'text-slate-400 hover:text-amber-300 hover:bg-white/10 border-transparent'
        }`}
        aria-label="Voice Microphone"
      >
        {/* State Icon Rendering */}
        {isSpeaking ? (
          <Square className="w-4 h-4 fill-current text-rose-400" />
        ) : isProcessing ? (
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
        ) : isListening ? (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Elegant Voice Visualizer Indicator when Active (Listening, Thinking, Speaking) */}
      {(isListening || isProcessing || isSpeaking) && (
        <div className="absolute bottom-full right-0 mb-3 z-50 flex flex-col items-center pointer-events-none animate-fadeIn">
          <div className="px-3.5 py-2 rounded-2xl bg-[#090C15]/95 border border-amber-500/40 shadow-[0_0_30px_rgba(0,0,0,0.9),0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-md text-[11px] font-mono flex flex-col items-center gap-1.5 whitespace-nowrap">
            {/* Subtle Animated Visualizer ASCII:
                    ✦
                ASTRA CORE
               ))) ◉ (((
                  VOICE
            */}
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px]">
              <span className="text-[12px] animate-pulse">✦</span>
              <span>ASTRA CORE</span>
              <span className="text-[12px] animate-pulse">✦</span>
            </div>

            <div
              className="flex items-center gap-2 text-xs font-mono text-amber-300 transition-transform duration-100"
              style={{ transform: `scale(${pulseScale})` }}
            >
              <span className="text-amber-500/80">)))</span>
              <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" />
              <span className="text-amber-500/80">(((</span>
            </div>

            <div className="text-[10px] uppercase font-bold tracking-wider">
              {isListening && (
                <span className="text-amber-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  🎤 LISTENING
                </span>
              )}
              {isProcessing && (
                <span className="text-cyan-300 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  ◌ THINKING
                </span>
              )}
              {isSpeaking && (
                <span className="text-emerald-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  🔊 SPEAKING
                </span>
              )}
            </div>

            {interimText && (
              <div className="max-w-[240px] truncate text-[10px] text-slate-300 italic pt-0.5 border-t border-white/10">
                “{interimText}”
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="w-2.5 h-2.5 rotate-45 bg-[#090C15] border-r border-b border-amber-500/40 -mt-1.5" />
        </div>
      )}

      {/* Permission Denied / Error Toast with Retry and Use Text Chat Buttons */}
      {errorMessage && (
        <div className="absolute bottom-full right-0 mb-3 z-50 flex flex-col items-end gap-1.5 p-3 rounded-2xl bg-rose-950/95 border border-rose-500/50 text-rose-200 text-xs font-mono shadow-[0_0_25px_rgba(0,0,0,0.9)] backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            {isPermissionDenied && (
              <button
                type="button"
                onClick={startListening}
                className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-[10px] transition-all cursor-pointer"
              >
                Try Again
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsPermissionDenied(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] transition-all cursor-pointer"
            >
              Use Text Chat
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
