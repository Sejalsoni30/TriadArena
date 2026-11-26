import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Flame, Lock, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';

export const PlayPage: React.FC = () => {
  const { user } = useAuthStore();

  const modes = [
    {
      title: 'Solo vs AI',
      subtitle: 'Markov Chain & Pattern Detection',
      description: 'Practice your prediction strategies against adaptive AI across Easy, Medium, and Hard difficulty.',
      badge: 'Reduced XP',
      badgeVariant: 'neutral' as const,
      icon: <Bot className="w-8 h-8 text-accent-cyan" />,
      path: '/solo',
      btnText: 'Launch Solo Battle',
      btnVariant: 'outline' as const,
      glow: 'cyan' as const
    },
    {
      title: 'Ranked 1v1 Matchmaking',
      subtitle: 'Competitive Elo Standoff',
      description: 'Queue into live matchmaking. Symmetrical commit-reveal protocol with ratings, win streaks, and seasonal climb.',
      badge: 'Full Elo & XP',
      badgeVariant: 'warning' as const,
      icon: <Flame className="w-8 h-8 text-primary-light" />,
      path: '/lobby',
      btnText: 'Enter Matchmaking',
      btnVariant: 'accent' as const,
      glow: 'primary' as const
    },
    {
      title: 'Private Custom Room',
      subtitle: 'Direct Invite Matches',
      description: 'Create an unlisted room with a 6-character code. Configure Best of 3, 5, or 7 with host controls and play friends.',
      badge: 'Custom Match',
      badgeVariant: 'purple' as const,
      icon: <Lock className="w-8 h-8 text-secondary-glow" />,
      path: '/room',
      btnText: 'Host or Join Room',
      btnVariant: 'outline' as const,
      glow: 'purple' as const
    },
    {
      title: 'Championship Tournaments',
      subtitle: 'Single-Elimination Knockouts',
      description: 'Register for scheduled or on-demand brackets. Automated advancement and virtual credit prize pools.',
      badge: 'High Stakes',
      badgeVariant: 'magenta' as const,
      icon: <Trophy className="w-8 h-8 text-accent-magenta" />,
      path: '/tournaments',
      btnText: 'View Tournaments',
      btnVariant: 'outline' as const,
      glow: 'magenta' as const
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <Badge variant="cyan" size="md" className="mb-2">Arena Hub</Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
            Select Combat Mode
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Choose your proving ground. All match outcomes are verified authoritatively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modes.map((mode) => (
            <Card
              key={mode.title}
              interactive
              glow={mode.glow}
              className="p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    {mode.icon}
                  </div>
                  <Badge variant={mode.badgeVariant} size="sm">
                    {mode.badge}
                  </Badge>
                </div>
                <h2 className="text-xl font-display font-bold text-white mb-1">{mode.title}</h2>
                <h3 className="text-xs font-mono text-accent-cyan mb-3">{mode.subtitle}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {mode.description}
                </p>
              </div>

              <Link to={mode.path}>
                <Button variant={mode.btnVariant} size="md" className="w-full">
                  {mode.btnText} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
