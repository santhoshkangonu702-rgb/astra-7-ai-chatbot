/**
 * Astra 7 — Voice Manager & Multi-Provider Architecture
 * 
 * Clean Provider Abstraction:
 * ├── SpeechRecognitionProvider
 * ├── AIResponseProvider
 * └── TextToSpeechProvider
 * 
 * States: READY | LISTENING | PROCESSING | SPEAKING | ERROR
 * 
 * Features:
 * - Natural duplex voice conversation (mic -> speech-to-text -> astra brain -> tts -> speaker)
 * - Continuous Talk Mode (hands-free auto loop)
 * - Interruption handling (user speech cancels active ASTRA TTS)
 * - Precise diagnostic error identification (no generic "Error occurred")
 * - Native Indian regional & international language synthesis (Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, English)
 * - Voice + Music integration (handles "play music", "pause", "next song" seamlessly)
 * - Shared chat conversation synchronization
 */

import { api } from './api';
import { classifyAstraIntent } from './astraBrain';
import { chatHistoryService } from './chatHistoryService';
import { musicManager, MusicTrack } from './musicManager';
import { ChatMessage, Conversation } from '../types';

export type VoiceState = 'READY' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export type SupportedVoiceLang = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'bn' | 'mr';

export interface VoiceLangConfig {
  code: SupportedVoiceLang;
  bcp47: string;
  name: string;
  nativeName: string;
  samplePrompt: string;
}

export const SUPPORTED_VOICE_LANGUAGES: VoiceLangConfig[] = [
  { code: 'en', bcp47: 'en-IN', name: 'English (India/Global)', nativeName: 'English', samplePrompt: 'Hello Astra, what are the latest space discoveries?' },
  { code: 'te', bcp47: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', samplePrompt: 'నమస్కారం ఆస్ట్రా, క్వాంటం కంప్యూటింగ్ గురించి వివరించండి.' },
  { code: 'hi', bcp47: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', samplePrompt: 'नमस्ते आस्ट्रा, भारत के प्रमुख अंतरिक्ष मिशन क्या हैं?' },
  { code: 'ta', bcp47: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', samplePrompt: 'வணக்கம் அஸ்ட்ரா, செயற்கை நுண்ணறிவு பற்றி கூறுங்கள்.' },
  { code: 'kn', bcp47: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', samplePrompt: 'ನಮಸ್ಕಾರ ಆಸ್ಟ್ರಾ, ಭವಿಷ್ಯದ ನಗರಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.' },
  { code: 'ml', bcp47: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', samplePrompt: 'നമസ്കാരം ആസ്ട്രാ, പുനരുപയോഗ ഊർജ്ജത്തെക്കുറിച്ച് പറയൂ.' },
  { code: 'bn', bcp47: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', samplePrompt: 'নমস্কার আস্ট্রা, বিজ্ঞান গবেষণার অগ্রগতি সম্পর্কে বলুন।' },
  { code: 'mr', bcp47: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', samplePrompt: 'नमस्कार आस्ट्रा, कृत्रिम बुद्धिमत्ता कशी काम करते?' }
];

export interface VoiceManagerEvent {
  state: VoiceState;
  transcript: string;
  interimTranscript: string;
  responseSpeech: string;
  routedCapability: string;
  audioLevel: number;
  errorMessage: string | null;
  errorActionType: 'permission' | 'unsupported' | 'ai_failed' | 'audio_blocked' | 'network' | 'none';
  isMuted: boolean;
  isContinuousMode: boolean;
  selectedLanguage: SupportedVoiceLang;
  voiceSpeed: number;
  voiceVolume: number;
  lastUserPrompt?: string;
}

export type VoiceManagerListener = (event: VoiceManagerEvent) => void;

// =========================================================================
// 1. Speech Recognition Provider
// =========================================================================
export class SpeechRecognitionProvider {
  private recognition: any = null;
  private isRecognizing = false;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return 'prompt';
    }
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: 'microphone' as any });
        return status.state;
      }
    } catch {
      // query permission not supported on all mobile browsers
    }
    return 'prompt';
  }

  public async requestMicrophoneAccess(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return true; // proceed to recognition API
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately after verifying permission
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: any) {
      console.warn('Microphone permission request rejected:', err);
      return false;
    }
  }

  public start(
    langBcp47: string,
    callbacks: {
      onStart: () => void;
      onInterim: (text: string) => void;
      onFinal: (text: string) => void;
      onError: (code: string, message: string) => void;
      onEnd: () => void;
    }
  ): boolean {
    if (!this.isSupported()) {
      callbacks.onError('unsupported', 'Speech recognition is not available in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    this.stop();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = langBcp47;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        this.isRecognizing = true;
        callbacks.onStart();
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (interim) {
          callbacks.onInterim(interim);
        }

        if (final) {
          this.isRecognizing = false;
          callbacks.onFinal(final.trim());
        }
      };

      rec.onerror = (event: any) => {
        this.isRecognizing = false;
        const errType = event.error;
        let message = 'ASTRA could not capture your voice input.';

        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          message = 'Microphone permission is required. Please enable microphone access in your browser settings.';
        } else if (errType === 'no-speech') {
          message = 'No speech was detected. Tap the microphone and speak again.';
        } else if (errType === 'network') {
          message = 'Network connection was lost during speech processing. Please try again.';
        } else if (errType === 'audio-capture') {
          message = 'No microphone device was detected on your hardware.';
        }

        callbacks.onError(errType, message);
      };

      rec.onend = () => {
        this.isRecognizing = false;
        callbacks.onEnd();
      };

      rec.start();
      this.recognition = rec;
      return true;
    } catch (err: any) {
      console.warn('Speech recognition startup exception:', err);
      callbacks.onError('start-failed', 'Could not initialize microphone. Please check browser permissions.');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
      this.recognition = null;
    }
    this.isRecognizing = false;
  }
}

// =========================================================================
// 2. Text-to-Speech Provider
// =========================================================================
export class TextToSpeechProvider {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string,
    options: {
      langBcp47: string;
      rate: number;
      volume: number;
      isMuted?: boolean;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: string) => void;
    }
  ): boolean {
    if (!this.isSupported()) {
      options.onError?.('Speech synthesis is not supported on this device.');
      return false;
    }

    this.stop();

    if (options.isMuted) {
      options.onEnd?.();
      return true;
    }

    const clean = text
      .replace(/[*#_`\[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) {
      options.onEnd?.();
      return true;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = Math.max(0.7, Math.min(1.5, options.rate));
      utterance.pitch = 1.02;
      utterance.volume = Math.max(0, Math.min(1, options.volume));
      utterance.lang = options.langBcp47;

      // Select preferred voice for language
      const voices = window.speechSynthesis.getVoices();
      const targetLangPrefix = options.langBcp47.split('-')[0].toLowerCase();

      // First find exact match or regional natural voice
      const matchingVoice =
        voices.find((v) => v.lang.toLowerCase() === options.langBcp47.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLangPrefix)) ||
        voices.find(
          (v) =>
            (v.name.includes('Natural') ||
              v.name.includes('Neural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Siri')) &&
            v.lang.startsWith('en')
        );

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        options.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e: any) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (e.error === 'not-allowed') {
          options.onError?.('Audio playback blocked by browser. Tap speaker to hear response.');
        } else if (e.error !== 'interrupted' && e.error !== 'canceled') {
          options.onError?.(`Speech synthesis issue: ${e.error || 'Failed'}`);
        } else {
          options.onEnd?.();
        }
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      console.warn('Speech synthesis call failed:', err);
      options.onError?.('Could not speak response aloud.');
      return false;
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.currentUtterance = null;
    this.isSpeaking = false;
  }
}

// =========================================================================
// 3. AI Response Provider & Intent Router
// =========================================================================
export class AIResponseProvider {
  /**
   * Process voice input, check for music/system voice commands,
   * query Astra Brain & server AI, and return conversational reply.
   */
  public async processQuery(
    prompt: string,
    langCode: SupportedVoiceLang,
    activeConversationId?: string
  ): Promise<{
    reply: string;
    capability: string;
    musicCommandExecuted?: boolean;
    musicActionName?: string;
  }> {
    const qLower = prompt.toLowerCase().trim();

    // 1. Music Voice Command Detection
    // "play music", "pause", "resume", "next song", "previous song"
    if (qLower === 'play music' || qLower === 'play' || qLower.startsWith('play song') || qLower.startsWith('play trending')) {
      const trending = await musicManager.getTrendingTracks();
      if (trending.length > 0) {
        await musicManager.playTrack(trending[0]);
        return {
          reply: `Starting authorized playback of "${trending[0].title}" by ${trending[0].artist}. Enjoy!`,
          capability: 'MUSIC',
          musicCommandExecuted: true,
          musicActionName: 'PLAY'
        };
      }
    }

    if (qLower.startsWith('play ') && !qLower.includes('role') && !qLower.includes('game')) {
      const songTerm = prompt.slice(5).trim();
      const results = await musicManager.searchTracks(songTerm);
      if (results.length > 0) {
        await musicManager.playTrack(results[0]);
        return {
          reply: `Now playing "${results[0].title}" by ${results[0].artist}.`,
          capability: 'MUSIC',
          musicCommandExecuted: true,
          musicActionName: 'PLAY_SEARCH'
        };
      } else {
        return {
          reply: `I searched for "${songTerm}" in authorized catalogs, but could not find a playable preview. Opening search for you.`,
          capability: 'MUSIC',
          musicCommandExecuted: false
        };
      }
    }

    if (qLower === 'pause' || qLower === 'pause music' || qLower === 'stop music') {
      musicManager.pause();
      return {
        reply: 'Music playback paused.',
        capability: 'MUSIC',
        musicCommandExecuted: true,
        musicActionName: 'PAUSE'
      };
    }

    if (qLower === 'resume' || qLower === 'resume music') {
      musicManager.resume();
      return {
        reply: 'Resuming music playback.',
        capability: 'MUSIC',
        musicCommandExecuted: true,
        musicActionName: 'RESUME'
      };
    }

    if (qLower === 'next' || qLower === 'next song' || qLower === 'skip song' || qLower === 'next track') {
      const hasNext = musicManager.nextTrack();
      return {
        reply: hasNext ? 'Skipped to the next track in queue.' : 'Reached the end of the music queue.',
        capability: 'MUSIC',
        musicCommandExecuted: true,
        musicActionName: 'NEXT'
      };
    }

    if (qLower === 'previous song' || qLower === 'previous track' || qLower === 'prev') {
      musicManager.prevTrack();
      return {
        reply: 'Playing the previous track.',
        capability: 'MUSIC',
        musicCommandExecuted: true,
        musicActionName: 'PREVIOUS'
      };
    }

    // 2. Classify General Intent via Astra Brain
    const intent = classifyAstraIntent(prompt);

    // 3. Retrieve conversation history to maintain conversational context
    const userData = chatHistoryService.loadUserData();
    const currentConv =
      userData.chats.find((c) => c.id === activeConversationId) ||
      userData.chats[0];

    const historyMessages = currentConv?.messages?.slice(-6) || [];

    // System instruction asking for conversational, clear speech response (concise for audio)
    const voiceAugmentedPrompt = `[MODE: VOICE CONVERSATION. Keep answers concise, natural, informative, and easy to understand when spoken aloud. Never use asterisks or formatting tokens that sound odd when read. Answer in ${langCode === 'te' ? 'Telugu (తెలుగు)' : langCode === 'hi' ? 'Hindi (हिंदी)' : langCode === 'ta' ? 'Tamil (தமிழ்)' : 'English'}]:\n${prompt}`;

    try {
      const res = await api.sendChat(voiceAugmentedPrompt, historyMessages, undefined, {
        language: langCode
      });

      const rawContent = res?.content || res?.reply || '';
      if (!rawContent) {
        throw new Error('Empty response from AI engine');
      }

      // Sync into shared chat history so both voice and text share the SAME conversation
      const userMsg: ChatMessage = {
        id: `msg-voice-user-${Date.now()}`,
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
        category: (intent.capability as any) || 'GENERAL_KNOWLEDGE'
      };

      const assistantMsg: ChatMessage = {
        id: `msg-voice-ast-${Date.now()}`,
        role: 'assistant',
        content: rawContent,
        timestamp: new Date().toISOString(),
        category: (intent.capability as any) || 'GENERAL_KNOWLEDGE'
      };

      const updatedChats = userData.chats.map((c) => {
        if (c.id === currentConv.id) {
          const smartTitle =
            c.messages.length <= 1 || c.title === 'New Conversation' || c.title === 'Astra 7 Assistant'
              ? chatHistoryService.generateSmartTitle(prompt)
              : c.title;

          return {
            ...c,
            title: smartTitle,
            messages: [...c.messages, userMsg, assistantMsg],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });

      chatHistoryService.saveUserData({
        chats: updatedChats,
        lastActiveConvId: currentConv.id
      });

      // Record in search history
      chatHistoryService.recordSearch(prompt, currentConv.id);

      return {
        reply: rawContent,
        capability: intent.capability
      };
    } catch (err: any) {
      console.warn('[Voice AI Provider] Failed to generate AI reply:', err);
      throw err;
    }
  }
}

// =========================================================================
// 4. Voice Manager Orchestrator
// =========================================================================
export class VoiceManager {
  private static instance: VoiceManager;

  public speechRecognition = new SpeechRecognitionProvider();
  public tts = new TextToSpeechProvider();
  public ai = new AIResponseProvider();

  private state: VoiceState = 'READY';
  private transcript = '';
  private interimTranscript = '';
  private responseSpeech = '';
  private routedCapability = 'CHAT';
  private audioLevel = 0.2;
  private errorMessage: string | null = null;
  private errorActionType: VoiceManagerEvent['errorActionType'] = 'none';

  private isMuted = false;
  private isContinuousMode = true;
  private selectedLanguage: SupportedVoiceLang = 'en';
  private voiceSpeed = 1.05;
  private voiceVolume = 1.0;
  private lastUserPrompt = '';

  private activeConversationId?: string;
  private listeners: Set<VoiceManagerListener> = new Set();
  private audioLevelInterval: any = null;

  private constructor() {
    // Try to load user settings
    try {
      const savedLang = localStorage.getItem('astra7_voice_lang');
      if (savedLang && SUPPORTED_VOICE_LANGUAGES.some((l) => l.code === savedLang)) {
        this.selectedLanguage = savedLang as SupportedVoiceLang;
      }
      const savedContinuous = localStorage.getItem('astra7_voice_continuous');
      if (savedContinuous !== null) {
        this.isContinuousMode = savedContinuous === 'true';
      }
    } catch {}
  }

  public static getInstance(): VoiceManager {
    if (!VoiceManager.instance) {
      VoiceManager.instance = new VoiceManager();
    }
    return VoiceManager.instance;
  }

  public subscribe(listener: VoiceManagerListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private emit() {
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => {
      try {
        fn(snap);
      } catch (err) {
        console.warn('VoiceManager listener error:', err);
      }
    });
  }

  public getSnapshot(): VoiceManagerEvent {
    return {
      state: this.state,
      transcript: this.transcript,
      interimTranscript: this.interimTranscript,
      responseSpeech: this.responseSpeech,
      routedCapability: this.routedCapability,
      audioLevel: this.audioLevel,
      errorMessage: this.errorMessage,
      errorActionType: this.errorActionType,
      isMuted: this.isMuted,
      isContinuousMode: this.isContinuousMode,
      selectedLanguage: this.selectedLanguage,
      voiceSpeed: this.voiceSpeed,
      voiceVolume: this.voiceVolume,
      lastUserPrompt: this.lastUserPrompt
    };
  }

  public setActiveConversationId(id: string) {
    this.activeConversationId = id;
  }

  public setLanguage(lang: SupportedVoiceLang) {
    this.selectedLanguage = lang;
    try {
      localStorage.setItem('astra7_voice_lang', lang);
    } catch {}
    this.emit();
  }

  public setContinuousMode(enabled: boolean) {
    this.isContinuousMode = enabled;
    try {
      localStorage.setItem('astra7_voice_continuous', String(enabled));
    } catch {}
    this.emit();
  }

  public setVoiceSpeed(speed: number) {
    this.voiceSpeed = Math.max(0.7, Math.min(1.5, speed));
    this.emit();
  }

  public setVoiceVolume(vol: number) {
    this.voiceVolume = Math.max(0, Math.min(1, vol));
    this.emit();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.state === 'SPEAKING') {
      this.tts.stop();
      this.state = 'READY';
    }
    this.emit();
  }

  /**
   * Start User Voice Conversation Loop
   */
  public async startTalk(): Promise<void> {
    // If speaking, stop TTS immediately (interruption handling)
    this.tts.stop();

    this.errorMessage = null;
    this.errorActionType = 'none';

    // Verify browser support
    if (!this.speechRecognition.isSupported()) {
      this.state = 'ERROR';
      this.errorMessage = 'Speech recognition is not available in this browser. Please use Chrome, Edge, or Safari.';
      this.errorActionType = 'unsupported';
      this.emit();
      return;
    }

    // Request or verify mic access
    const permGranted = await this.speechRecognition.requestMicrophoneAccess();
    if (!permGranted) {
      this.state = 'ERROR';
      this.errorMessage = 'Microphone permission is required. Please allow microphone access.';
      this.errorActionType = 'permission';
      this.emit();
      return;
    }

    const currentLangConfig =
      SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === this.selectedLanguage) ||
      SUPPORTED_VOICE_LANGUAGES[0];

    this.startAudioVisualizerSimulation();

    this.speechRecognition.start(currentLangConfig.bcp47, {
      onStart: () => {
        this.state = 'LISTENING';
        this.transcript = '';
        this.interimTranscript = '';
        this.errorMessage = null;
        this.emit();
      },
      onInterim: (text) => {
        this.interimTranscript = text;
        this.audioLevel = 0.5 + Math.random() * 0.5;
        this.emit();
      },
      onFinal: (text) => {
        this.transcript = text;
        this.interimTranscript = '';
        this.lastUserPrompt = text;
        this.handleCapturedUserText(text);
      },
      onError: (code, message) => {
        this.stopAudioVisualizer();
        this.state = 'ERROR';
        this.errorMessage = message;
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          this.errorActionType = 'permission';
        } else if (code === 'network') {
          this.errorActionType = 'network';
        } else {
          this.errorActionType = 'none';
        }
        this.emit();
      },
      onEnd: () => {
        if (this.state === 'LISTENING') {
          // Finished listening without final result
          this.stopAudioVisualizer();
          this.state = 'READY';
          this.emit();
        }
      }
    });
  }

  /**
   * Pipeline: TEXT -> ASTRA BRAIN -> AI RESPONSE -> TEXT-TO-SPEECH -> SPEAKER
   */
  private async handleCapturedUserText(userText: string) {
    if (!userText.trim()) {
      this.state = 'READY';
      this.stopAudioVisualizer();
      this.emit();
      return;
    }

    this.state = 'PROCESSING';
    this.stopAudioVisualizer();
    this.emit();

    try {
      const result = await this.ai.processQuery(
        userText,
        this.selectedLanguage,
        this.activeConversationId
      );

      this.routedCapability = result.capability || 'CHAT';
      this.responseSpeech = result.reply;

      // Speak response aloud through device speaker
      const currentLangConfig =
        SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === this.selectedLanguage) ||
        SUPPORTED_VOICE_LANGUAGES[0];

      this.state = 'SPEAKING';
      this.startAudioVisualizerSimulation();
      this.emit();

      this.tts.speak(result.reply, {
        langBcp47: currentLangConfig.bcp47,
        rate: this.voiceSpeed,
        volume: this.voiceVolume,
        isMuted: this.isMuted,
        onStart: () => {
          this.state = 'SPEAKING';
          this.emit();
        },
        onEnd: () => {
          this.stopAudioVisualizer();
          this.state = 'READY';
          this.emit();

          // Continuous Talk Mode: automatically loop back to listen
          if (this.isContinuousMode) {
            setTimeout(() => {
              if (this.state === 'READY') {
                this.startTalk();
              }
            }, 650);
          }
        },
        onError: (err) => {
          this.stopAudioVisualizer();
          this.state = 'ERROR';
          this.errorMessage = err;
          this.errorActionType = 'audio_blocked';
          this.emit();
        }
      });
    } catch (err: any) {
      this.stopAudioVisualizer();
      this.state = 'ERROR';
      this.errorMessage = 'ASTRA could not process the request. Please check your connection and retry.';
      this.errorActionType = 'ai_failed';
      this.emit();
    }
  }

  /**
   * Stop immediately: mic, speech recognition, TTS, pending speech
   */
  public stop(): void {
    this.speechRecognition.stop();
    this.tts.stop();
    this.stopAudioVisualizer();
    this.state = 'READY';
    this.interimTranscript = '';
    this.emit();
  }

  public retry(): void {
    this.errorMessage = null;
    this.errorActionType = 'none';
    this.startTalk();
  }

  private startAudioVisualizerSimulation() {
    this.stopAudioVisualizer();
    this.audioLevelInterval = setInterval(() => {
      this.audioLevel = Math.random() * 0.6 + 0.4;
      this.emit();
    }, 100);
  }

  private stopAudioVisualizer() {
    if (this.audioLevelInterval) {
      clearInterval(this.audioLevelInterval);
      this.audioLevelInterval = null;
    }
    this.audioLevel = 0.1;
  }
}

export const voiceManager = VoiceManager.getInstance();
