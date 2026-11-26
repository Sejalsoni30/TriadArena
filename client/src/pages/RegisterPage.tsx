import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swords, Mail, Lock, User, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';
import { UserProfile } from '@triad-arena/shared';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      addToast({ type: 'danger', title: 'Validation Error', message: 'All fields are required' });
      return;
    }
    if (username.length < 3) {
      addToast({ type: 'danger', title: 'Username Error', message: 'Username must be at least 3 characters' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const mockUser: UserProfile = {
        userId: 'usr_' + Math.random().toString(36).substring(2, 8),
        username,
        email,
        avatar: '',
        role: 'player',
        bio: 'New combatant in Triad Arena.',
        rating: 1200,
        peakRating: 1200,
        level: 1,
        xp: 0,
        coins: 100,
        stats: {
          totalMatches: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          currentStreak: 0,
          bestStreak: 0,
          soloWins: 0,
          multiplayerWins: 0,
          tournamentWins: 0
        },
        createdAt: new Date().toISOString()
      };

      login('mock_token_' + Date.now(), mockUser);
      setIsLoading(false);
      addToast({ type: 'success', title: 'Welcome to Triad Arena!', message: 'Account created with 100 bonus credits' });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-background-deep rounded-[10px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-accent-cyan group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="font-display font-black text-2xl tracking-wider text-white">
              TRIAD<span className="text-accent-cyan">ARENA</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white tracking-wide">Claim Your Call-Sign</h1>
          <p className="text-xs text-gray-400 mt-1">Create your profile and start competing</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Gladiator Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="CyberStriker"
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="striker@triad.io"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="accent" size="md" className="w-full mt-2" isLoading={isLoading}>
              <UserPlus className="w-4 h-4 mr-2" /> Register & Play
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
