import React from 'react';
import { Trophy, Award, Lock, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const AchievementsPage: React.FC = () => {
  const achievements = [
    { code: 'first_blood', title: 'First Blood', desc: 'Win your very first match', xp: 100, coins: 50, unlocked: true },
    { code: 'triad_apprentice', title: 'Triad Apprentice', desc: 'Reach Level 5 in combat progression', xp: 250, coins: 100, unlocked: false },
    { code: 'triad_master', title: 'Triad Master', desc: 'Reach Level 20 in combat progression', xp: 1000, coins: 500, unlocked: false },
    { code: 'hot_streak', title: 'On Fire', desc: 'Win 3 matches in a row', xp: 150, coins: 75, unlocked: true },
    { code: 'unstoppable', title: 'Unstoppable', desc: 'Achieve a 10-match win streak', xp: 500, coins: 250, unlocked: false },
    { code: 'mind_reader', title: 'Mind Reader', desc: 'Defeat the Hard Markov AI in Best of 5', xp: 300, coins: 150, unlocked: true },
    { code: 'flawless', title: 'Flawless Victory', desc: 'Win a match without conceding a single round', xp: 200, coins: 100, unlocked: false },
    { code: 'comeback_king', title: 'Comeback King', desc: 'Win a match after trailing 0-2 in a Bo5', xp: 350, coins: 200, unlocked: false },
    { code: 'century_club', title: 'Century Club', desc: 'Complete 100 total matches in any mode', xp: 500, coins: 300, unlocked: false },
    { code: 'privateer', title: 'Secret Agent', desc: 'Host and finish a private custom room match', xp: 100, coins: 50, unlocked: true },
    { code: 'tournament_debut', title: 'In The Arena', desc: 'Compete in your first tournament bracket', xp: 150, coins: 75, unlocked: false },
    { code: 'tournament_champ', title: 'Grand Champion', desc: 'Win 1st place in a championship tournament', xp: 1000, coins: 1000, unlocked: false },
    { code: 'rock_solid', title: 'Rock Solid', desc: 'Win 5 rounds using only Rock in a single match', xp: 200, coins: 100, unlocked: false },
    { code: 'paper_cut', title: 'Origami Master', desc: 'Win 5 rounds using only Paper in a single match', xp: 200, coins: 100, unlocked: false },
    { code: 'scissor_sharp', title: 'Razor Blade', desc: 'Win 5 rounds using only Scissors in a single match', xp: 200, coins: 100, unlocked: false },
    { code: 'mission_hunter', title: 'Daily Specialist', desc: 'Complete all 3 daily missions in a single day', xp: 250, coins: 150, unlocked: true }
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Badge variant="magenta" size="md" className="mb-2">Trophy Vault</Badge>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
              Achievements
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Unlock combat milestones to claim bonus XP and Triad Credits.
            </p>
          </div>

          <div className="w-full sm:w-64 glass-panel p-4 rounded-xl border border-gray-800">
            <ProgressBar
              value={(unlockedCount / achievements.length) * 100}
              label="Trophies Unlocked"
              sublabel={`${unlockedCount} / ${achievements.length}`}
              variant="magenta"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a) => (
            <Card
              key={a.code}
              className={`p-5 flex flex-col justify-between ${
                a.unlocked ? 'border-accent-cyan/40 bg-accent-cyan/[0.03]' : 'opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${
                    a.unlocked ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan' : 'bg-gray-800 border-gray-700 text-gray-500'
                  }`}>
                    {a.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <Badge variant={a.unlocked ? 'cyan' : 'neutral'} size="sm">
                    {a.unlocked ? 'Completed' : 'Locked'}
                  </Badge>
                </div>
                <h3 className="font-display font-bold text-white text-base mb-1">{a.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{a.desc}</p>
              </div>

              <div className="border-t border-gray-800/80 pt-3 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Reward</span>
                <span className="text-amber-400 font-bold">+{a.xp} XP • +{a.coins} Credits</span>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
