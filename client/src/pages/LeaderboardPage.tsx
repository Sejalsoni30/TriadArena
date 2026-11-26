import React, { useState } from 'react';
import { Flame, Search, Trophy, Filter, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';

export const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('season1');
  const [search, setSearch] = useState('');

  const samplePlayers = [
    { rank: 1, name: 'VortexZero', rating: 2150, winRate: 78, wins: 142, losses: 40, level: 42, tier: 'Master' },
    { rank: 2, name: 'CyberKage', rating: 2085, winRate: 75, wins: 120, losses: 40, level: 38, tier: 'Master' },
    { rank: 3, name: 'NeonPulse', rating: 1990, winRate: 71, wins: 98, losses: 40, level: 35, tier: 'Diamond' },
    { rank: 4, name: 'QuantumBlade', rating: 1945, winRate: 69, wins: 92, losses: 41, level: 33, tier: 'Diamond' },
    { rank: 5, name: 'AegisMind', rating: 1890, winRate: 66, wins: 85, losses: 44, level: 30, tier: 'Diamond' },
    { rank: 6, name: 'Striker99', rating: 1780, winRate: 64, wins: 72, losses: 40, level: 28, tier: 'Platinum II' },
    { rank: 7, name: 'EchoZero', rating: 1720, winRate: 62, wins: 68, losses: 42, level: 25, tier: 'Platinum II' },
    { rank: 8, name: 'BlazeRunner', rating: 1650, winRate: 60, wins: 60, losses: 40, level: 22, tier: 'Platinum I' },
    { rank: 9, name: 'ApexGladiator', rating: 1590, winRate: 58, wins: 54, losses: 39, level: 20, tier: 'Gold II' },
    { rank: 10, name: 'HyperNova', rating: 1530, winRate: 57, wins: 50, losses: 38, level: 18, tier: 'Gold II' }
  ];

  const filteredPlayers = samplePlayers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Badge variant="cyan" size="md" className="mb-2">Competitive Roster</Badge>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
              Global Leaderboard
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Top combatants ranked by server-verified Elo rating.
            </p>
          </div>

          <Tabs
            tabs={[
              { id: 'season1', label: 'Season 1: Genesis' },
              { id: 'alltime', label: 'All-Time Ranks' }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search gladiator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs font-mono text-gray-400 sm:ml-auto">
            Showing top {filteredPlayers.length} contenders
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-glass bg-background-elevated font-mono text-xs text-text-muted uppercase">
                  <th className="py-4 px-4">Rank</th>
                  <th className="py-4 px-4">Gladiator</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Tier</th>
                  <th className="py-4 px-4">Win Rate</th>
                  <th className="py-4 px-4">Record</th>
                  <th className="py-4 px-4">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass font-mono">
                {filteredPlayers.map((player) => (
                  <tr key={player.rank} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${
                        player.rank === 1 ? 'bg-semantic-draw/20 text-semantic-draw border border-semantic-draw/40 shadow-glow-primary' :
                        player.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                        player.rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                        'text-text-muted'
                      }`}>
                        {player.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={player.name} size="sm" />
                        <span className="font-display font-semibold text-text-primary">{player.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-accent-cyan font-bold">{player.rating}</td>
                    <td className="py-4 px-4">
                      <Badge variant="purple" size="sm">{player.tier}</Badge>
                    </td>
                    <td className="py-4 px-4 text-semantic-win">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-semantic-win shrink-0" />
                        <span>{player.winRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text-muted">{player.wins}W - {player.losses}L</td>
                    <td className="py-4 px-4 text-text-muted">Lvl {player.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
