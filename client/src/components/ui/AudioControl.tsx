import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Bell, Play, Check, Sparkles, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound, AudioState } from '../../lib/sound';

export const AudioControl: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [audioState, setAudioState] = useState<AudioState>(sound.getState());
  const [isOpen, setIsOpen] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = sound.subscribe((state) => {
      setAudioState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleTestSound = () => {
    setTestActive(true);
    sound.testAudio();
    setTimeout(() => setTestActive(false), 900);
  };

  const isAnyActive = audioState.sfxEnabled || audioState.musicEnabled;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button with Equalizer Indicator */}
      <button
        onClick={() => {
          sound.unlockAudio();
          setIsOpen(!isOpen);
        }}
        aria-label="Audio & Soundscape Settings"
        title="Audio & Music Controls"
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all ${
          isAnyActive
            ? 'border-accent-cyan/50 text-accent-cyan bg-accent-cyan/10 shadow-glow-cyan'
            : 'border-border-glass text-text-subtle hover:text-text-primary hover:border-gray-600'
        }`}
      >
        {isAnyActive ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}

        {/* Mini animated equalizer bars when music is playing */}
        {audioState.musicEnabled && audioState.isMusicPlaying && (
          <div className="flex items-end gap-0.5 h-3 px-0.5">
            <span className="w-0.5 bg-accent-cyan rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-accent-cyan rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-accent-cyan rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {!compact && (
          <span className="text-xs font-mono font-medium hidden lg:inline">
            {isAnyActive ? 'Audio ON' : 'Muted'}
          </span>
        )}
      </button>

      {/* Audio Control Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 sm:w-80 glass-panel bg-background-elevated/95 border border-border-glass rounded-2xl p-4 shadow-glass z-50 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-glass mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent-cyan" />
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-text-primary">
                  Audio & Soundscape
                </h4>
              </div>
              <button
                onClick={() => {
                  sound.toggle();
                  sound.unlockAudio();
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                  isAnyActive
                    ? 'border-semantic-loss/40 text-semantic-loss hover:bg-semantic-loss/10'
                    : 'border-semantic-win/40 text-semantic-win hover:bg-semantic-win/10'
                }`}
              >
                {isAnyActive ? 'Mute All' : 'Enable All'}
              </button>
            </div>

            {/* Background Cyberpunk Music */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${audioState.musicEnabled ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-text-subtle'}`}>
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-display font-semibold text-text-primary block leading-none">
                      Cyber Synth Music
                    </span>
                    <span className="text-[10px] text-text-muted">Procedural synthwave BGM</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.unlockAudio();
                    sound.toggleMusic();
                  }}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    audioState.musicEnabled ? 'bg-secondary' : 'bg-gray-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      audioState.musicEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {audioState.musicEnabled && (
                <div className="flex items-center gap-2 pl-7">
                  <span className="text-[10px] font-mono text-text-subtle w-6">
                    {Math.round(audioState.musicVolume * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.musicVolume}
                    onChange={(e) => sound.setMusicVolume(parseFloat(e.target.value))}
                    className="w-full accent-secondary h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Sound Effects (SFX) */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${audioState.sfxEnabled ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/5 text-text-subtle'}`}>
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-display font-semibold text-text-primary block leading-none">
                      Combat & UI SFX
                    </span>
                    <span className="text-[10px] text-text-muted">Clash, lock, countdown, wins</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.unlockAudio();
                    sound.toggleSfx();
                  }}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    audioState.sfxEnabled ? 'bg-accent-cyan' : 'bg-gray-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      audioState.sfxEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {audioState.sfxEnabled && (
                <div className="flex items-center gap-2 pl-7">
                  <span className="text-[10px] font-mono text-text-subtle w-6">
                    {Math.round(audioState.sfxVolume * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.sfxVolume}
                    onChange={(e) => sound.setSfxVolume(parseFloat(e.target.value))}
                    className="w-full accent-accent-cyan h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Test Audio Button & Status */}
            <div className="pt-2 border-t border-border-glass flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-subtle flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent-cyan" /> Zero-latency Web Audio
              </span>
              <button
                type="button"
                onClick={handleTestSound}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-display font-bold uppercase transition-all ${
                  testActive
                    ? 'bg-accent-cyan text-background-base shadow-glow-cyan'
                    : 'bg-white/10 text-text-primary hover:bg-white/15'
                }`}
              >
                {testActive ? (
                  <>
                    <Check className="w-3 h-3" /> Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> Test Audio
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
