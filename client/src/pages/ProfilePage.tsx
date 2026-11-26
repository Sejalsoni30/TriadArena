import React, { useState } from 'react';
import { User, Mail, Shield, Save, Check } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();

  const [username, setUsername] = useState(user?.username || 'Gladiator');
  const [bio, setBio] = useState(user?.bio || 'Competitive Triad strategist.');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

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
