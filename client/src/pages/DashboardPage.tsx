import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Flame, 
  Target, 
  Swords, 
  Award, 
  ChevronRight, 
  TrendingUp, 
  Sparkles,
  Calendar,
  Play
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuthStore } from '../store/authStore';
import { getRankTier, getLevelFromXp } from '@triad-arena/shared';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // Fallback guest user if not yet logged in
  const currentUser = user || {
    userId: 'guest_1',
    username: 'Guest Gladiator',
    avatar: '',
    role: 'player' as const,
    rating: 1200,
    peakRating: 1200,
    level: 1,
    xp: 60,
    coins: 100,
    stats: {
      totalMatches: 8,
      wins: 5,
      losses: 3,
      draws: 0,
      currentStreak: 2,
      bestStreak: 4,
      soloWins: 3,
      multiplayerWins: 2,
      tournamentWins: 0
    }
  };

  const rank = getRankTier(currentUser.rating);
  const xpProg = getLevelFromXp(currentUser.xp);
  const winRate = currentUser.stats.totalMatches > 0
    ? Math.round((currentUser.stats.wins / currentUser.stats.totalMatches) * 100)
    : 0;

  // Sample Daily Missions (resets at 00:00 UTC)
  const dailyMissions = [
    { id: 'm1', title: 'Triad Victor', desc: 'Win 2 matches in any mode', current: 1, target: 2, rewardXp: 150, rewardCoins: 50, claimed: false },
    { id: 'm2', title: 'Rock Tactician', desc: 'Win 3 rounds using Rock', current: 3, target: 3, rewardXp: 100, rewardCoins: 40, claimed: true },
    { id: 'm3', title: 'Arena Endurance', desc: 'Complete 5 total matches today', current: 4, target: 5, rewardXp: 200, rewardCoins: 75, claimed: false }
  ];

  // Sample Recent Match Records
  const recentMatches = [
    { id: 'rec_1', mode: 'Ranked 1v1', opponent: 'ShadowPulse', result: 'win', score: '2 - 1', eloDelta: '+24', time: '12m ago' },
    { id: 'rec_2', mode: 'Solo (Hard)', opponent: 'Markov AI', result: 'win', score: '3 - 2', eloDelta: '0', time: '1h ago' },
    { id: 'rec_3', mode: 'Ranked 1v1', opponent: 'AegisMind', result: 'lose', score: '1 - 2', eloDelta: '-22', time: '3h ago' },
    { id: 'rec_4', mode: 'Private Room', opponent: 'Kage99', result: 'win', score: '3 - 0', eloDelta: '0', time: 'Yesterday' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Profile Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-gray-800 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <Avatar
                name={currentUser.username}
                size="xl"
                src={currentUser.avatar}
                rankBorderColor={rank.color}
              />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-display font-black text-white">{currentUser.username}</h1>
                  <Badge variant="cyan" size="sm">{rank.name}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mt-1">
                  <span>Rating: <strong className="text-accent-cyan">{currentUser.rating}</strong></span>
                  <span>Peak: <strong className="text-gray-300">{currentUser.peakRating}</strong></span>
                  <span>Credits: <strong className="text-amber-400">{currentUser.coins}</strong></span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 flex flex-col gap-2">
              <ProgressBar
                value={xpProg.progressPercent}
                label={`Level ${xpProg.level}`}
                sublabel={`${xpProg.currentLevelXp} / ${xpProg.nextLevelXp} XP`}
                variant="cyan"
              />
              <div className="flex justify-end gap-2 mt-1">
                <Link to="/play">
                  <Button variant="accent" size="sm" className="gap-1.5">
                    <Play className="w-4 h-4 fill-current" /> Play Now
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 flex flex-col">
            <span className="text-xs text-gray-400 font-mono uppercase">Total Matches</span>
            <span className="text-2xl font-display font-black text-white mt-1">
              {currentUser.stats.totalMatches}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">Across all battlefields</span>
          </Card>

          <Card className="p-4 flex flex-col">
            <span className="text-xs text-gray-400 font-mono uppercase">Combat Win Rate</span>
            <span className="text-2xl font-display font-black text-emerald-400 mt-1">
              {winRate}%
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">{currentUser.stats.wins}W - {currentUser.stats.losses}L</span>
          </Card>

          <Card className="p-4 flex flex-col">
            <span className="text-xs text-gray-400 font-mono uppercase">Current Streak</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-display font-black text-accent-cyan">
                {currentUser.stats.currentStreak}
              </span>
              {currentUser.stats.currentStreak >= 3 && <Flame className="w-5 h-5 text-accent-cyan animate-pulse" />}
            </div>
            <span className="text-[10px] text-gray-400 mt-0.5">Best streak: {currentUser.stats.bestStreak}</span>
          </Card>

          <Card className="p-4 flex flex-col">
            <span className="text-xs text-gray-400 font-mono uppercase">Tournaments</span>
            <span className="text-2xl font-display font-black text-accent-magenta mt-1">
              {currentUser.stats.tournamentWins}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">Championship crowns</span>
          </Card>
        </div>

        {/* Dashboard 2-Column Split: Daily Missions & Performance / Recent Matches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Daily Missions */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-cyan" /> Daily Missions
              </h2>
              <span className="text-[10px] font-mono text-gray-400">Resets 00:00 UTC</span>
            </div>

            <div className="flex flex-col gap-3">
              {dailyMissions.map((m) => {
                const isComplete = m.current >= m.target;
                return (
                  <Card key={m.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xs font-display font-bold text-white">{m.title}</h3>
                      <Badge variant={m.claimed ? 'neutral' : isComplete ? 'success' : 'primary'} size="sm">
                        {m.claimed ? 'Claimed' : isComplete ? 'Ready' : `${m.current}/${m.target}`}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-3">{m.desc}</p>
                    <ProgressBar
                      value={(m.current / m.target) * 100}
                      variant={isComplete ? 'gold' : 'cyan'}
                      className="mb-2"
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>+{m.rewardXp} XP • +{m.rewardCoins} Credits</span>
                      {isComplete && !m.claimed && (
                        <Button variant="accent" size="sm" className="h-6 text-[10px] px-2 py-0">
                          Claim
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Performance & Recent Matches */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-accent-cyan" /> Recent Battles
              </h2>
              <Link to="/history" className="text-xs text-accent-cyan hover:underline font-mono">
                View All Matches →
              </Link>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 bg-background-deep/50 font-mono text-gray-400">
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Opponent</th>
                      <th className="py-3 px-4">Result</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Elo Delta</th>
                      <th className="py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-mono">
                    {recentMatches.map((match) => (
                      <tr key={match.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-white font-medium">{match.mode}</td>
                        <td className="py-3 px-4 text-gray-300">{match.opponent}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            match.result === 'win'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {match.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-bold">{match.score}</td>
                        <td className="py-3 px-4 text-accent-cyan">{match.eloDelta}</td>
                        <td className="py-3 px-4 text-gray-400">{match.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Rating Chart Preview */}
            <Card className="p-5 mt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-cyan" />
                  <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                    Rating Trajectory (Last 10 Matches)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-accent-cyan">+42 Rating Gain</span>
              </div>
              <div className="h-16 flex items-end gap-2 pt-2 border-b border-gray-800 pb-1">
                {[1180, 1175, 1195, 1190, 1210, 1205, 1225, 1220, 1215, 1242].map((rating, idx) => {
                  const height = Math.max(15, ((rating - 1150) / 100) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full bg-gradient-to-t from-primary/60 to-accent-cyan rounded-t transition-all group-hover:brightness-125"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2">
                <span>Match -10</span>
                <span>Latest Match</span>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
