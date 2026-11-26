import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swords, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';
import { UserProfile } from '@triad-arena/shared';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ type: 'danger', title: 'Validation Error', message: 'Please provide email and password' });
      return;
    }

    setIsLoading(true);
    // Simulate login or call backend
    setTimeout(() => {
      const username = email.split('@')[0] || 'Player';
      const mockUser: UserProfile = {
        userId: 'usr_' + Math.random().toString(36).substring(2, 8),
        username,
        email,
        avatar: '',
        role: 'player',
        bio: 'Ready to conquer the Triad Arena.',
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
      addToast({ type: 'success', title: 'Welcome back!', message: `Logged in as ${username}` });
      navigate('/dashboard');
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUser: UserProfile = {
        userId: 'usr_g_' + Math.random().toString(36).substring(2, 8),
        username: 'GoogleWarrior',
        email: 'warrior@gmail.com',
        avatar: '',
        role: 'player',
        bio: 'Google authenticated gladiator.',
        rating: 1240,
        peakRating: 1240,
        level: 2,
        xp: 150,
        coins: 200,
        stats: {
          totalMatches: 2,
          wins: 2,
          losses: 0,
          draws: 0,
          currentStreak: 2,
          bestStreak: 2,
          soloWins: 1,
          multiplayerWins: 1,
          tournamentWins: 0
        },
        createdAt: new Date().toISOString()
      };
      login('mock_google_token_' + Date.now(), mockUser);
      setIsLoading(false);
      addToast({ type: 'success', title: 'Google Sign-in Successful', message: 'Welcome to Triad Arena!' });
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
          <h1 className="text-2xl font-display font-bold text-white tracking-wide">Enter the Arena</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in to your combat record</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gladiator@triad.io"
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-background-deep border-gray-700 text-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-accent-cyan hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="accent" size="md" className="w-full mt-2" isLoading={isLoading}>
              <LogIn className="w-4 h-4 mr-2" /> Log In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs font-mono uppercase">
              <span className="bg-background-deep px-2 text-gray-400">or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleGoogleLogin}
            className="w-full gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.9.7 5.5 1.9 7.9l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.7 5.6 6.5 10.1 6.5z" />
            </svg>
            Google Sign-In
          </Button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Need an account?{' '}
            <Link to="/register" className="text-accent-cyan font-semibold hover:underline">
              Register now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
