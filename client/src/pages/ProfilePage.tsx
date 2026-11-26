import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, Check, Volume2, VolumeX, Music, Bell, Play } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';
import { sound, AudioState } from '../lib/sound';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();

  const [username, setUsername] = useState(user?.username || 'Gladiator');
  const [bio, setBio] = useState(user?.bio || 'Competitive Triad strategist.');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>(sound.getState());
  const [testingAudio, setTestingAudio] = useState(false);

  useEffect(() => {
    const unsub = sound.subscribe((st) => setAudioState({ ...st }));
    return () => unsub();
  }, []);

  const handleTestAudio = () => {
    setTestingAudio(true);
    sound.testAudio();
    setTimeout(() => setTestingAudio(false), 900);
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ username, bio, avatar });
      setIsSaving(false);
      addToast({ type: 'success', title: 'Profile Updated', message: 'Your battle identity has been saved.' });
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide mb-2">
          Gladiator Profile
        </h1>
        <p className="text-xs text-gray-400 mb-8">
          Manage your calls-sign, combat avatar, and arena biography.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="text-base font-display font-bold text-white mb-4">Identity & Call-sign</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <Avatar name={username} src={avatar} size="xl" />
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase block mb-2">Choose Avatar Preset:</span>
                <div className="flex items-center gap-3">
                  {avatarOptions.map((opt, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setAvatar(opt)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                        avatar === opt ? 'border-accent-cyan scale-105' : 'border-gray-700'
                      }`}
                    >
                      <img src={opt} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-display text-xs ${
                      avatar === '' ? 'border-accent-cyan text-accent-cyan' : 'border-gray-700 text-gray-400'
                    }`}
                  >
                    Text
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Arena Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full bg-background-deep/80 border border-gray-700/80 rounded-lg p-3 text-sm text-gray-100 focus:border-accent-cyan focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 text-right">{bio.length}/200 characters</span>
              </div>
            </div>
          </Card>

          {/* Audio & Soundscape Settings Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-glass">
              <div>
                <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-accent-cyan" /> Audio & Soundscape Settings
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Configure procedural synth music and reactive sound design effects.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition-all ${
                  testingAudio
                    ? 'bg-accent-cyan text-background-base shadow-glow-cyan'
                    : 'bg-white/10 text-text-primary hover:bg-white/15'
                }`}
              >
                {testingAudio ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Testing Audio...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Test Audio Now
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Music Setting */}
              <div className="p-4 rounded-xl glass-panel border border-border-glass bg-background-elevated/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${audioState.musicEnabled ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-text-subtle'}`}>
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-display font-semibold text-text-primary block">
                        Procedural Synth Music
                      </span>
                      <span className="text-xs text-text-muted">Cyberpunk ambient background loop</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.unlockAudio();
                      sound.toggleMusic();
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                      audioState.musicEnabled ? 'bg-secondary' : 'bg-gray-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        audioState.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-mono text-text-subtle w-8">
                    {Math.round(audioState.musicVolume * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={!audioState.musicEnabled}
                    value={audioState.musicVolume}
                    onChange={(e) => sound.setMusicVolume(parseFloat(e.target.value))}
                    className="w-full accent-secondary h-1.5 bg-gray-800 rounded-lg cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>

              {/* SFX Setting */}
              <div className="p-4 rounded-xl glass-panel border border-border-glass bg-background-elevated/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${audioState.sfxEnabled ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/5 text-text-subtle'}`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-display font-semibold text-text-primary block">
                        Sound Effects (SFX)
                      </span>
                      <span className="text-xs text-text-muted">Lock-in, clash impact, victory fanfares</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.unlockAudio();
                      sound.toggleSfx();
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                      audioState.sfxEnabled ? 'bg-accent-cyan' : 'bg-gray-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        audioState.sfxEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-mono text-text-subtle w-8">
                    {Math.round(audioState.sfxVolume * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={!audioState.sfxEnabled}
                    value={audioState.sfxVolume}
                    onChange={(e) => sound.setSfxVolume(parseFloat(e.target.value))}
                    className="w-full accent-accent-cyan h-1.5 bg-gray-800 rounded-lg cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="accent" size="md" isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" /> Save Profile Changes
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};
