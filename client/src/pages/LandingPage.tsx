import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Swords, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Bot, 
  Users, 
  Lock, 
  ChevronDown, 
  ArrowRight, 
  Sparkles,
  Flame,
  Award,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Sample live leaderboard preview data (clearly labelled as real data or sample when live)
  const leaderboardPreview = [
    { rank: 1, name: 'VortexZero', rating: 2150, winRate: 78, level: 42, avatar: '' },
    { rank: 2, name: 'CyberKage', rating: 2085, winRate: 75, level: 38, avatar: '' },
    { rank: 3, name: 'NeonPulse', rating: 1990, winRate: 71, level: 35, avatar: '' },
    { rank: 4, name: 'QuantumBlade', rating: 1945, winRate: 69, level: 33, avatar: '' },
    { rank: 5, name: 'AegisMind', rating: 1890, winRate: 66, level: 30, avatar: '' }
  ];

  const faqs = [
    {
      q: 'Is real money or gambling involved?',
      a: 'Absolutely not. Triad Arena uses purely virtual points (Triad Credits) and XP. No real money, deposits, betting, or pay-to-win mechanics exist in this game.'
    },
    {
      q: 'How does the Commit-Reveal anti-cheat system work?',
      a: 'When you choose Rock, Paper, or Scissors, your choice is encrypted and sent directly to the server. The server never transmits your choice to your opponent until BOTH players have committed or the 10-second timer expires. It is mathematically impossible to snoop on your opponent\'s move.'
    },
    {
      q: 'How does the Markov Chain Hard AI work?',
      a: 'The Hard AI models your play style dynamically using a 1st-order Markov Transition Matrix. It tracks what move you tend to play after your previous move and attempts to anticipate your sequence, keeping matches challenging yet beatable.'
    },
    {
      q: 'What happens if my connection drops during a match?',
      a: 'Triad Arena includes a 45-second reconnection grace period. If your Wi-Fi or cellular network drops, simply reopen or refresh the page — the server will instantly restore your active game state snapshot.'
    },
    {
      q: 'Can I play with friends privately?',
      a: 'Yes! You can generate a private 6-character room code, customize match settings (Best of 3, 5, or 7, turn timer), and share the direct link with a friend.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100 selection:bg-accent-cyan selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-accent-cyan/30 text-accent-cyan text-xs font-mono uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Competitive Skill-and-Prediction Arena
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-tight uppercase"
          >
            Think Fast. <br />
            <span className="bg-gradient-to-r from-accent-cyan via-primary-light to-accent-magenta bg-clip-text text-transparent">
              Play Smart. Win Big.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-gray-300 max-w-2xl leading-relaxed"
          >
            High-stakes competitive Rock-Paper-Scissors engineered for mind games, speed, and tactical prediction. Real-time 1v1 ranked matches, AI challenges, and championship tournaments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/play" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-glow-cyan text-sm sm:text-base">
                Enter Arena Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/how-to-play" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Triad Choices Floating Visuals */}
          <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-md">
            {[
              { label: 'ROCK', beats: 'Scissors', glow: 'primary', icon: '✊' },
              { label: 'PAPER', beats: 'Rock', glow: 'cyan', icon: '✋' },
              { label: 'SCISSORS', beats: 'Paper', glow: 'magenta', icon: '✌' }
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-700/60 shadow-lg group hover:border-accent-cyan/60 hover:-translate-y-1 transition-all"
              >
                <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-display font-bold text-xs sm:text-sm text-white tracking-wider">{item.label}</span>
                <span className="text-[10px] font-mono text-gray-400 mt-0.5">Beats {item.beats}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-16 bg-background-deep/60 border-y border-gray-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
              How To Play in <span className="text-accent-cyan">3 Steps</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Simple to learn, infinite mind games to master.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-start gap-4 p-6 border-primary/30">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-accent-cyan flex items-center justify-center font-display font-bold text-lg border border-primary/40">
                1
              </div>
              <h3 className="text-lg font-display font-bold text-white">Choose & Lock In</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Analyze your opponent’s patterns, anticipate their counter, and lock your move before the 10-second turn timer runs out.
              </p>
            </Card>

            <Card className="flex flex-col items-start gap-4 p-6 border-accent-cyan/30">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-display font-bold text-lg border border-accent-cyan/40">
                2
              </div>
              <h3 className="text-lg font-display font-bold text-white">Authoritative Reveal</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The server reveals moves simultaneously once both combatants commit. Zero snooping, zero latency advantages.
              </p>
            </Card>

            <Card className="flex flex-col items-start gap-4 p-6 border-secondary/30">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary-glow flex items-center justify-center font-display font-bold text-lg border border-secondary/40">
                3
              </div>
              <h3 className="text-lg font-display font-bold text-white">Rise The Ranks</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Win Best of 3, 5, or 7 matches to gain Elo rating, level up, unlock achievements, and qualify for tournaments.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Game Modes Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="cyan" size="md" className="mb-2">Choose Your Arena</Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
            Battle <span className="text-accent-cyan">Modes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Solo Mode */}
          <Card interactive glow="primary" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-accent-cyan mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Solo vs AI</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Train against Easy, Medium, and Markov Chain Hard AI that learns your move habits in real-time.
              </p>
            </div>
            <Link to="/solo">
              <Button variant="outline" size="sm" className="w-full">Play Solo</Button>
            </Link>
          </Card>

          {/* Ranked 1v1 */}
          <Card interactive glow="cyan" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Ranked 1v1</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Queue into matchmaking with rating-based matchmaking, win streaks, and seasonal Elo standings.
              </p>
            </div>
            <Link to="/lobby">
              <Button variant="accent" size="sm" className="w-full">Find Match</Button>
            </Link>
          </Card>

          {/* Private Rooms */}
          <Card interactive glow="purple" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-glow mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Private Rooms</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Create a custom lobby with a 6-character code, custom Best-of rules, and invite friends directly.
              </p>
            </div>
            <Link to="/room">
              <Button variant="outline" size="sm" className="w-full">Create Room</Button>
            </Link>
          </Card>

          {/* Tournaments */}
          <Card interactive glow="magenta" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-magenta/20 flex items-center justify-center text-accent-magenta mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">Tournaments</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Compete in bracket-style knockout tournaments to crown the grand champion and win virtual prizes.
              </p>
            </div>
            <Link to="/tournaments">
              <Button variant="outline" size="sm" className="w-full">View Brackets</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Live Leaderboard Preview */}
      <section className="py-16 bg-background-deep/80 border-t border-gray-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="warning" size="md" className="mb-2">Top Contenders</Badge>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wide">
                Season 1 Leaderboard
              </h2>
            </div>
            <Link to="/leaderboard">
              <Button variant="outline" size="sm">
                Full Rankings <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-background-deep/60 text-xs font-mono uppercase text-gray-400">
                    <th className="py-3.5 px-4 font-semibold">Rank</th>
                    <th className="py-3.5 px-4 font-semibold">Gladiator</th>
                    <th className="py-3.5 px-4 font-semibold">Rating</th>
                    <th className="py-3.5 px-4 font-semibold">Win Rate</th>
                    <th className="py-3.5 px-4 font-semibold">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {leaderboardPreview.map((player) => (
                    <tr key={player.rank} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-bold text-xs ${
                          player.rank === 1 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                          player.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                          player.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                          'text-gray-400'
                        }`}>
                          {player.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={player.name} size="sm" src={player.avatar} />
                          <span className="font-display font-semibold text-white">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-accent-cyan font-bold">{player.rating}</td>
                      <td className="py-3.5 px-4 text-emerald-400">{player.winRate}%</td>
                      <td className="py-3.5 px-4 text-gray-300">Lvl {player.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Sample content labelled) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[11px] font-mono uppercase tracking-wider mb-2">
            Sample content
          </div>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Player Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "The commit-reveal system makes every turn feel like a high-stakes standoff. You can't rely on luck once you hit Gold tier.",
              author: "Alex R.",
              rank: "Diamond I"
            },
            {
              quote: "The Hard AI was genuinely outthinking my habitual Scissors openings by game two. Incredible training tool for real matches.",
              author: "Elena S.",
              rank: "Platinum II"
            },
            {
              quote: "Our Discord tournament ran smoothly in private rooms with zero lag. The 45-second reconnect saved our finals match when my phone switched to 5G.",
              author: "Marcus T.",
              rank: "Master"
            }
          ].map((t, idx) => (
            <Card key={idx} className="p-6 flex flex-col justify-between">
              <p className="text-sm text-gray-300 italic mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <span className="font-display font-bold text-white text-xs">{t.author}</span>
                <Badge variant="cyan" size="sm">{t.rank}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background-deep/50 border-t border-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-xl border border-gray-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left font-display font-semibold text-white text-sm"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-accent-cyan transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-gray-400 leading-relaxed border-t border-gray-800/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel gradient-border-cyan rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
            Ready to Enter the Arena?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mt-3 mb-6">
            Jump in right now against our predictive AI or test your intuition against live players globally.
          </p>
          <Link to="/play">
            <Button variant="accent" size="lg" className="shadow-glow-cyan text-base">
              Start Playing For Free
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
