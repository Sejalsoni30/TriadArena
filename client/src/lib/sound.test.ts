import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage for node test runner
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

(globalThis as any).localStorage = localStorageMock;

import { sound } from './sound';

describe('SoundEngine (Web Audio & Procedural Synth)', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('initializes with expected default audio state', () => {
    const state = sound.getState();
    expect(state).toHaveProperty('sfxEnabled');
    expect(state).toHaveProperty('musicEnabled');
    expect(state).toHaveProperty('sfxVolume');
    expect(state).toHaveProperty('musicVolume');
    expect(typeof state.sfxVolume).toBe('number');
    expect(typeof state.musicVolume).toBe('number');
  });

  it('correctly toggles SFX and updates preferences', () => {
    sound.setSfxEnabled(true);
    expect(sound.isSfxEnabled()).toBe(true);

    sound.toggleSfx();
    expect(sound.isSfxEnabled()).toBe(false);

    sound.toggleSfx();
    expect(sound.isSfxEnabled()).toBe(true);
  });

  it('correctly toggles Music and clamps volume limits', () => {
    sound.setMusicEnabled(true);
    expect(sound.isMusicEnabled()).toBe(true);

    sound.setMusicVolume(1.5); // Should clamp to 1
    expect(sound.getState().musicVolume).toBe(1);

    sound.setMusicVolume(-0.2); // Should clamp to 0
    expect(sound.getState().musicVolume).toBe(0);

    sound.setMusicVolume(0.4);
    expect(sound.getState().musicVolume).toBe(0.4);
  });

  it('notifies subscribers on state mutations', () => {
    const listener = vi.fn();
    const unsub = sound.subscribe(listener);

    // Initial subscription call
    expect(listener).toHaveBeenCalled();

    sound.setSfxVolume(0.85);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ sfxVolume: 0.85 })
    );

    unsub();
  });

  it('executes SFX synthesizer calls without throwing errors in mock environments', () => {
    expect(() => sound.playClick()).not.toThrow();
    expect(() => sound.playHover()).not.toThrow();
    expect(() => sound.playLock()).not.toThrow();
    expect(() => sound.playClash()).not.toThrow();
    expect(() => sound.playWin()).not.toThrow();
    expect(() => sound.playLose()).not.toThrow();
    expect(() => sound.playCountdown(3)).not.toThrow();
    expect(() => sound.playCountdown(0)).not.toThrow();
    expect(() => sound.playLevelUp()).not.toThrow();
    expect(() => sound.testAudio()).not.toThrow();
  });
});
