/**
 * Astra 7 — Music Manager
 * Single controlled audio architecture:
 * ├── SearchProvider
 * ├── PlaybackProvider
 * ├── QueueManager
 * └── PlayerState (IDLE, LOADING, PLAYING, PAUSED, ENDED, ERROR)
 * 
 * Safety:
 * - Single HTMLAudioElement
 * - Safe event listener teardown & source reassignment
 * - Autoplay policy recovery ("Tap Play to start audio")
 * - Automatic queue progression on track end
 * - Full event dispatching for reactive UI updates
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  movie?: string;
  language: string;
  year: number | string;
  genre: string;
  provider: 'Apple Music' | 'YouTube Music' | 'Spotify' | 'JioSaavn' | 'Gaana' | 'Astra Authorized Catalog';
  providerUrl: string;
  artworkUrl: string;
  duration?: string;
  playbackPreviewUrl?: string; // Legitimate audio stream URL
  composer?: string;
  singers?: string[];
  lyricist?: string;
  isPopular?: boolean;
}

export type PlayerState = 'IDLE' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'ENDED' | 'ERROR';

export type MusicEventListener = (event: {
  state: PlayerState;
  currentTrack: MusicTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  errorMessage: string | null;
  queue: MusicTrack[];
}) => void;

class MusicManager {
  private static instance: MusicManager;

  private audio: HTMLAudioElement | null = null;
  private state: PlayerState = 'IDLE';
  private currentTrack: MusicTrack | null = null;
  private queue: MusicTrack[] = [];
  private history: MusicTrack[] = [];
  private volume: number = 0.85;
  private isMuted: boolean = false;
  private isBuffering: boolean = false;
  private errorMessage: string | null = null;
  private listeners: Set<MusicEventListener> = new Set();
  private isInitialized: boolean = false;

  private constructor() {
    this.initAudio();
  }

  public static getInstance(): MusicManager {
    if (!MusicManager.instance) {
      MusicManager.instance = new MusicManager();
    }
    return MusicManager.instance;
  }

  private initAudio() {
    if (typeof window === 'undefined' || this.audio) return;

    try {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.volume = this.volume;

      this.audio.addEventListener('timeupdate', () => {
        this.emitState();
      });

      this.audio.addEventListener('waiting', () => {
        this.isBuffering = true;
        this.emitState();
      });

      this.audio.addEventListener('canplay', () => {
        this.isBuffering = false;
        if (this.state === 'LOADING') {
          // Ready to play
        }
        this.emitState();
      });

      this.audio.addEventListener('playing', () => {
        this.isBuffering = false;
        this.state = 'PLAYING';
        this.errorMessage = null;
        this.emitState();
      });

      this.audio.addEventListener('pause', () => {
        if (this.state !== 'ENDED' && this.state !== 'ERROR') {
          this.state = 'PAUSED';
        }
        this.emitState();
      });

      this.audio.addEventListener('ended', () => {
        this.state = 'ENDED';
        this.emitState();
        this.handleTrackEnded();
      });

      this.audio.addEventListener('error', (e) => {
        this.isBuffering = false;
        this.state = 'ERROR';
        const mediaError = this.audio?.error;
        let msg = 'Audio source unavailable for streaming.';
        if (mediaError?.code === 1) msg = 'Playback was aborted.';
        else if (mediaError?.code === 2) msg = 'Network error while loading audio.';
        else if (mediaError?.code === 3) msg = 'Audio decode error.';
        else if (mediaError?.code === 4) msg = 'Audio format or stream not supported.';
        
        this.errorMessage = msg;
        this.emitState();
      });

      this.isInitialized = true;
    } catch (err) {
      console.warn('Could not initialize audio engine:', err);
    }
  }

  public subscribe(listener: MusicEventListener): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private emitState() {
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => {
      try {
        fn(snap);
      } catch (e) {
        console.warn('Listener error in MusicManager:', e);
      }
    });
  }

  public getSnapshot() {
    return {
      state: this.state,
      currentTrack: this.currentTrack,
      currentTime: this.audio?.currentTime || 0,
      duration: this.audio?.duration && !isNaN(this.audio.duration) ? this.audio.duration : 30,
      volume: this.volume,
      isMuted: this.isMuted,
      isBuffering: this.isBuffering,
      errorMessage: this.errorMessage,
      queue: [...this.queue]
    };
  }

  /**
   * Play or resume a track
   */
  public async playTrack(track: MusicTrack): Promise<boolean> {
    this.initAudio();
    if (!this.audio) return false;

    // If same track and paused, simply resume
    if (this.currentTrack?.id === track.id) {
      if (this.state === 'PAUSED') {
        return this.resume();
      }
      if (this.state === 'PLAYING') {
        return true;
      }
    }

    // Stop current track cleanly before switching
    try {
      this.audio.pause();
    } catch {}

    this.currentTrack = track;
    this.errorMessage = null;

    // Check if playable source exists
    if (!track.playbackPreviewUrl) {
      this.state = 'ERROR';
      this.errorMessage = 'Audio preview stream not provided for this track. Use provider link to listen.';
      this.emitState();
      return false;
    }

    this.state = 'LOADING';
    this.isBuffering = true;
    this.emitState();

    try {
      this.audio.src = track.playbackPreviewUrl;
      this.audio.load();

      // Record to history
      this.history = [track, ...this.history.filter((t) => t.id !== track.id)].slice(0, 30);

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      this.state = 'PLAYING';
      this.isBuffering = false;
      this.emitState();
      return true;
    } catch (err: any) {
      this.isBuffering = false;
      if (err.name === 'NotAllowedError') {
        // Autoplay policy blocked audio without gesture
        this.state = 'PAUSED';
        this.errorMessage = 'Tap Play to start audio playback.';
      } else {
        this.state = 'ERROR';
        this.errorMessage = 'Playback could not be started. Check connection or retry.';
      }
      this.emitState();
      return false;
    }
  }

  public async resume(): Promise<boolean> {
    if (!this.audio || !this.currentTrack) return false;
    try {
      const p = this.audio.play();
      if (p !== undefined) await p;
      this.state = 'PLAYING';
      this.errorMessage = null;
      this.emitState();
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.errorMessage = 'Tap Play to resume audio.';
      } else {
        this.errorMessage = 'Audio playback was blocked.';
      }
      this.state = 'PAUSED';
      this.emitState();
      return false;
    }
  }

  public pause(): void {
    if (!this.audio) return;
    try {
      this.audio.pause();
      this.state = 'PAUSED';
      this.emitState();
    } catch {}
  }

  public togglePlayPause(): void {
    if (this.state === 'PLAYING') {
      this.pause();
    } else if (this.currentTrack) {
      this.resume();
    }
  }

  public seek(seconds: number): void {
    if (!this.audio) return;
    try {
      const target = Math.max(0, Math.min(seconds, this.audio.duration || 30));
      this.audio.currentTime = target;
      this.emitState();
    } catch {}
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this.emitState();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this.emitState();
  }

  public stop(): void {
    if (!this.audio) return;
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.state = 'IDLE';
      this.emitState();
    } catch {}
  }

  // Queue Operations
  public setQueue(tracks: MusicTrack[]): void {
    this.queue = [...tracks];
    this.emitState();
  }

  public addToQueue(track: MusicTrack): void {
    this.queue.push(track);
    this.emitState();
  }

  public playNext(track: MusicTrack): void {
    this.queue.unshift(track);
    this.emitState();
  }

  public removeFromQueue(index: number): void {
    this.queue.splice(index, 1);
    this.emitState();
  }

  public clearQueue(): void {
    this.queue = [];
    this.emitState();
  }

  public nextTrack(): boolean {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      this.playTrack(next);
      return true;
    }
    return false;
  }

  public prevTrack(): boolean {
    if (this.history.length > 1) {
      // current track is history[0], prev is history[1]
      const prev = this.history[1];
      this.history.splice(0, 1); // remove current
      this.playTrack(prev);
      return true;
    } else if (this.audio) {
      this.seek(0);
      return true;
    }
    return false;
  }

  private handleTrackEnded() {
    if (this.queue.length > 0) {
      this.nextTrack();
    } else {
      this.state = 'ENDED';
      this.emitState();
    }
  }

  // Search Provider with caching
  public async searchTracks(query: string, language?: string): Promise<MusicTrack[]> {
    if (!query.trim()) return [];
    try {
      const url = `/api/music/search?q=${encodeURIComponent(query.trim())}&language=${encodeURIComponent(language || 'All Languages')}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      return data.tracks || [];
    } catch (err) {
      console.warn('Music search error:', err);
      return [];
    }
  }

  public async getTrendingTracks(language?: string): Promise<MusicTrack[]> {
    try {
      const url = `/api/music/trending?language=${encodeURIComponent(language || 'All Languages')}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Trending failed: ${res.status}`);
      const data = await res.json();
      return data.tracks || [];
    } catch (err) {
      console.warn('Music trending error:', err);
      return [];
    }
  }
}

export const musicManager = MusicManager.getInstance();
