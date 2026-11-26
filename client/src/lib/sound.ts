/**
 * High-Performance Procedural Web Audio Engine & Cyberpunk Soundscape for Triad Arena.
 * 
 * Features:
 * - Real-time procedural ambient synthwave background music (BGM) generated with Web Audio API oscillators,
 *   sub-bass drones, and atmospheric arpeggios (zero external MP3 assets, zero network latency).
 * - Full suite of responsive, crisp futuristic SFX: click, hover, lock-in, clash shockwave, victory fanfare, defeat tone.
 * - Automatic browser interaction unlocking (resumes AudioContext on first click/keypress/touch).
 * - Independent SFX and Music controls with persistent volume settings in localStorage.
 * - Tab visibility listener: seamlessly pauses music when tab is hidden and resumes when focused.
 */

export interface AudioState {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  isUnlocked: boolean;
  isMusicPlaying: boolean;
}

type AudioListener = (state: AudioState) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Preferences
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.35;

  private isUnlocked: boolean = false;
  private isMusicPlaying: boolean = false;

  // Music scheduler state
  private musicInterval: any = null;
  private currentStep: number = 0;
  private currentChordIndex: number = 0;

  // Listeners
  private listeners: Set<AudioListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Load saved preferences with intelligent defaults
      const savedSfx = localStorage.getItem('triad_sound_sfx_enabled');
      const savedMusic = localStorage.getItem('triad_sound_music_enabled');
      const savedLegacy = localStorage.getItem('triad_sound_enabled');
      const savedSfxVol = localStorage.getItem('triad_sound_sfx_volume');
      const savedMusicVol = localStorage.getItem('triad_sound_music_volume');

      if (savedSfx !== null) {
        this.sfxEnabled = savedSfx === 'true';
      } else if (savedLegacy !== null) {
        this.sfxEnabled = savedLegacy === 'true';
      } else {
        this.sfxEnabled = true; // Default ON for great immediate UX
      }

      if (savedMusic !== null) {
        this.musicEnabled = savedMusic === 'true';
      } else {
        this.musicEnabled = true; // Default ON
      }

      if (savedSfxVol !== null) {
        const vol = parseFloat(savedSfxVol);
        if (!isNaN(vol)) this.sfxVolume = Math.max(0, Math.min(1, vol));
      }

      if (savedMusicVol !== null) {
        const vol = parseFloat(savedMusicVol);
        if (!isNaN(vol)) this.musicVolume = Math.max(0, Math.min(1, vol));
      }

      // Register global interaction unlocker
      this.setupGlobalUnlocker();

      // Listen for tab visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseMusicTemporarily();
        } else {
          this.resumeMusicTemporarily();
        }
      });
    }
  }

  /**
   * Safe getter / initializer for Web Audio context.
   */
  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;
      this.ctx = new AudioCtxClass();

      // Create master gain nodes
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Sets up global interaction listeners to unlock AudioContext across modern browsers.
   */
  private setupGlobalUnlocker(): void {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.unlockAudio();
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
    };

    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
  }

  /**
   * Explicit audio unlock called on user gesture.
   */
  public unlockAudio(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this.isUnlocked = true;
        this.notify();
        if (this.musicEnabled && !this.isMusicPlaying) {
          this.startMusic();
        }
      }).catch(() => {});
    } else {
      this.isUnlocked = true;
      this.notify();
      if (this.musicEnabled && !this.isMusicPlaying) {
        this.startMusic();
      }
    }
  }

  /**
   * Subscribe to state updates.
   */
  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public getState(): AudioState {
    return {
      sfxEnabled: this.sfxEnabled,
      musicEnabled: this.musicEnabled,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume,
      isUnlocked: this.isUnlocked,
      isMusicPlaying: this.isMusicPlaying
    };
  }

  // ==========================================
  // CONTROLS & TOGGLES
  // ==========================================

  public isEnabled(): boolean {
    return this.sfxEnabled || this.musicEnabled;
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setEnabled(enable: boolean): void {
    this.setSfxEnabled(enable);
    this.setMusicEnabled(enable);
  }

  public toggle(): boolean {
    const next = !this.isEnabled();
    this.setEnabled(next);
    return next;
  }

  public setSfxEnabled(enable: boolean): void {
    this.sfxEnabled = enable;
    if (typeof window !== 'undefined') {
      localStorage.setItem('triad_sound_sfx_enabled', String(enable));
      localStorage.setItem('triad_sound_enabled', String(enable));
    }
    this.notify();
  }

  public toggleSfx(): boolean {
    this.setSfxEnabled(!this.sfxEnabled);
    if (this.sfxEnabled) {
      this.playClick();
    }
    return this.sfxEnabled;
  }

  public setMusicEnabled(enable: boolean): void {
    this.musicEnabled = enable;
    if (typeof window !== 'undefined') {
      localStorage.setItem('triad_sound_music_enabled', String(enable));
    }

    if (enable) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    this.notify();
  }

  public toggleMusic(): boolean {
    this.setMusicEnabled(!this.musicEnabled);
    return this.musicEnabled;
  }

  public setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('triad_sound_sfx_volume', String(this.sfxVolume));
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('triad_sound_music_volume', String(this.musicVolume));
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  // ==========================================
  // PROCEDURAL CYBERPUNK SYNTHWAVE MUSIC ENGINE
  // ==========================================

  /**
   * Starts ambient generative cyberpunk synth music.
   */
  public startMusic(): void {
    if (!this.musicEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.notify();

    // Fade in music gain
    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(ctx.currentTime);
      this.musicGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, ctx.currentTime + 1.2);
    }

    // Progression: Am7 -> Fmaj7 -> Cmaj7 -> G
    // Melodic notes in A minor pentatonic: A, C, D, E, G
    const chords = [
      { root: 110.0, freqs: [110.0, 164.81, 196.0, 261.63], name: 'Am' },
      { root: 87.31, freqs: [87.31, 130.81, 164.81, 220.0], name: 'F' },
      { root: 130.81, freqs: [130.81, 164.81, 196.0, 261.63], name: 'C' },
      { root: 98.0, freqs: [98.0, 146.83, 196.0, 246.94], name: 'G' }
    ];

    const arpNotes = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0]; // A4, C5, D5, E5, G5, A5
    const stepDurationMs = 280; // ~107 BPM 16th feel

    // Step scheduler
    this.musicInterval = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
      if (this.ctx.state === 'suspended') return;

      const t = this.ctx.currentTime;
      const chord = chords[this.currentChordIndex];

      // On step 0 of each 8-step bar: trigger chord pad & bass pulse
      if (this.currentStep === 0) {
        this.playPadChord(chord.freqs, t, 2.2);
        this.playBassPulse(chord.root, t, 0.45);
      } else if (this.currentStep === 4) {
        // Half-bar bass pulse
        this.playBassPulse(chord.root, t, 0.35);
      }

      // Soft arpeggio note on selective steps (0, 2, 3, 5, 6)
      if ([0, 2, 3, 5, 6].includes(this.currentStep)) {
        const noteIdx = (this.currentStep * 2 + this.currentChordIndex * 3) % arpNotes.length;
        this.playArpNote(arpNotes[noteIdx], t, 0.22);
      }

      // Advance step
      this.currentStep = (this.currentStep + 1) % 8;
      if (this.currentStep === 0) {
        this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;
      }
    }, stepDurationMs);
  }

  /**
   * Stops procedural background music with smooth fade-out.
   */
  public stopMusic(): void {
    if (!this.isMusicPlaying) return;
    this.isMusicPlaying = false;

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    }

    this.notify();
  }

  private pauseMusicTemporarily(): void {
    if (this.isMusicPlaying && this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private resumeMusicTemporarily(): void {
    if (this.isMusicPlaying && this.musicEnabled && !this.musicInterval) {
      this.isMusicPlaying = false;
      this.startMusic();
    }
  }

  /**
   * Synthesize atmospheric cyberpunk pad chord
   */
  private playPadChord(freqs: number[], startTime: number, duration: number): void {
    if (!this.ctx || !this.musicGain) return;

    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      // Subtle detune for lush analog warmth
      osc.detune.setValueAtTime((i - 1.5) * 8, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, startTime);
      filter.frequency.linearRampToValueAtTime(580, startTime + duration * 0.5);
      filter.frequency.linearRampToValueAtTime(280, startTime + duration);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.6);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  /**
   * Synthesize deep punchy cyberpunk sub-bass
   */
  private playBassPulse(freq: number, startTime: number, duration: number): void {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, startTime);
    filter.frequency.exponentialRampToValueAtTime(70, startTime + duration);

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  /**
   * Synthesize bell-like glowing futuristic arpeggio note
   */
  private playArpNote(freq: number, startTime: number, duration: number): void {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.2, startTime);
    filter.Q.setValueAtTime(2.0, startTime);

    gain.gain.setValueAtTime(0.045, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  // ==========================================
  // SFX SYNTHESIZERS (ZERO LATENCY NATIVE AUDIO)
  // ==========================================

  private getSfxDestination(): GainNode | null {
    if (!this.sfxEnabled) return null;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return null;
    return this.sfxGain;
  }

  /**
   * Subtle UI click sound (high-tech crisp tick)
   */
  public playClick(): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(dest);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  }

  /**
   * Soft hover tick sound
   */
  public playHover(): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(dest);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  }

  /**
   * Laser lock-in chime when move is committed
   */
  public playLock(): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.16);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.16);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  }

  /**
   * Dramatic clash shockwave impact (sub-bass drop + white noise collision burst)
   */
  public playClash(): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const now = ctx.currentTime;

    // 1. Sub bass impact drop
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(220, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    subGain.gain.setValueAtTime(0.3, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    subOsc.connect(subGain);
    subGain.connect(dest);
    subOsc.start(now);
    subOsc.stop(now + 0.5);

    // 2. Metallic collision transient
    const clangOsc = ctx.createOscillator();
    const clangGain = ctx.createGain();
    clangOsc.type = 'square';
    clangOsc.frequency.setValueAtTime(540, now);
    clangOsc.frequency.exponentialRampToValueAtTime(160, now + 0.2);

    clangGain.gain.setValueAtTime(0.08, now);
    clangGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    clangOsc.connect(clangGain);
    clangGain.connect(dest);
    clangOsc.start(now);
    clangOsc.stop(now + 0.24);
  }

  /**
   * Victory harmonic fanfare
   */
  public playWin(): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  /**
   * Defeat low descending stinger
   */
  public playLose(): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.45);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.52);
  }

  /**
   * Countdown tick (3, 2, 1) and shoot stinger
   */
  public playCountdown(count?: number): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (count === 0) {
      // "SHOOT!" stinger
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    } else {
      // 3, 2, 1 pip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    }

    osc.connect(gain);
    gain.connect(dest);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  }

  /**
   * Radiant level-up sparkle
   */
  public playLevelUp(): void {
    const dest = this.getSfxDestination();
    const ctx = this.ctx;
    if (!dest || !ctx) return;

    const now = ctx.currentTime;
    const arps = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    arps.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);

      gain.gain.setValueAtTime(0.08, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.35);
    });
  }

  /**
   * Interactive audio test for settings and diagnostic checks.
   */
  public testAudio(): void {
    this.unlockAudio();
    this.playClick();
    setTimeout(() => this.playLock(), 120);
    setTimeout(() => this.playWin(), 320);
  }
}

export const sound = new SoundEngine();
