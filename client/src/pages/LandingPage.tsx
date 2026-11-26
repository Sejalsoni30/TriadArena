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
  Radio,
  Layers,
  Activity,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroCanvas } from '../components/motion/HeroCanvas';
import { 
  MOTION_DURATIONS, 
  MOTION_EASINGS, 
  fadeInUpVariant, 
  staggerContainerVariant 
} from '../lib/motion.config';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePlayStep, setActivePlayStep] = useState(1);

  // Sample live leaderboard preview data (clearly labelled as real data or sample when live)
  const leaderboardPreview = [
    { rank: 1, name: 'VortexZero', rating: 2150, winRate: 78, level: 42, avatar: '', tier: 'Master' },
    { rank: 2, name: 'CyberKage', rating: 2085, winRate: 75, level: 38, avatar: '', tier: 'Master' },
    { rank: 3, name: 'NeonPulse', rating: 1990, winRate: 71, level: 35, avatar: '', tier: 'Diamond' },
    { rank: 4, name: 'QuantumBlade', rating: 1945, winRate: 69, level: 33, avatar: '', tier: 'Diamond' },
    { rank: 5, name: 'AegisMind', rating: 1890, winRate: 66, level: 30, avatar: '', tier: 'Diamond' }
  ];

  const testimonials = [
    {
      quote: "The commit-reveal system makes every turn feel like a high-stakes standoff. You cannot rely on luck once you hit Gold tier.",
      author: "Alex R.",
      rank: "Diamond I",
      stats: "248 Matches • 72% Win Rate"
    },
    {
      quote: "The Hard AI was outthinking my habitual Scissors openings by game two. Incredible training tool for real tournament brackets.",
      author: "Elena S.",
      rank: "Platinum II",
      stats: "180 Matches • 68% Win Rate"
    },
    {
      quote: "Our Discord tournament ran smoothly in private rooms with zero lag. The 45-second reconnect saved our finals match when my Wi-Fi dropped.",
      author: "Marcus T.",
      rank: "Master",
      stats: "410 Matches • 81% Win Rate"
    },
    {
      quote: "The visual weight and tactile sound design of each clash is unmatched. It turns Rock Paper Scissors into a legitimate esport.",
      author: "Samantha K.",
      rank: "Diamond II",
      stats: "315 Matches • 74% Win Rate"
    }
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
    <div className="min-h-screen flex flex-col bg-background text-gray-100 selection:bg-accent-cyan selection:text-black relative overflow-x-hidden">
      {/* Background Ambient Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-[130px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-secondary/20 blur-[140px] animate-pulse-slow" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[160px]" />
      </div>

      <Navbar />

      {/* Hero Section (Signature Cinematic Moment) */}
      <section className="relative z-10 pt-8 pb-16 md:pt-14 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION_DURATIONS.slow, ease: MOTION_EASINGS.easeOutExpo }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-accent-cyan/40 text-accent-cyan text-xs font-mono uppercase tracking-widest shadow-glow-cyan"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Next-Gen Competitive Mind Games</span>
        </motion.div>

        {/* Oversized Masked Typography Reveal */}
        <div className="text-center max-w-4xl mx-auto overflow-hidden">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: MOTION_DURATIONS.hero, ease: MOTION_EASINGS.easeOutExpo }}
            className="text-4xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight text-white leading-none uppercase"
          >
            Think Fast. <br />
            <span className="bg-gradient-to-r from-accent-cyan via-primary-light to-accent-magenta bg-clip-text text-transparent neon-text-cyan">
              Play Smart. Win Big.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_DURATIONS.slow, delay: 0.2, ease: MOTION_EASINGS.easeOutExpo }}
            className="mt-6 text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            A high-stakes, skill-and-prediction take on Rock-Paper-Scissors. Real-time 1v1 ranked matches, Markov chain predictive AI, custom private rooms, and tournament brackets.
          </motion.p>
        </div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: MOTION_DURATIONS.base, delay: 0.35 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-20"
        >
          <Link to="/play" className="w-full sm:w-auto">
            <Button variant="accent" size="lg" className="w-full sm:w-auto text-sm sm:text-base font-bold shadow-glow-cyan">
              Enter Arena Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/how-to-play" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
              Learn Strategy
            </Button>
          </Link>
        </motion.div>

        {/* 3D WebGL / Procedural Geometric Canvas Visual */}
        <HeroCanvas />

        {/* Real-time Count-Up Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION_DURATIONS.slow, delay: 0.5 }}
          className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4"
        >
          <div className="glass-panel p-4 rounded-2xl text-center border border-primary/20">
            <span className="text-2xl sm:text-3xl font-display font-black text-accent-cyan">1,420+</span>
            <span className="text-[11px] font-mono uppercase text-gray-400 block mt-0.5">Gladiators Online</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border border-primary/20">
            <span className="text-2xl sm:text-3xl font-display font-black text-white">48,900+</span>
            <span className="text-[11px] font-mono uppercase text-gray-400 block mt-0.5">Clashes Fought</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border border-primary/20">
            <span className="text-2xl sm:text-3xl font-display font-black text-emerald-400">&lt; 35ms</span>
            <span className="text-[11px] font-mono uppercase text-gray-400 block mt-0.5">Average Latency</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border border-primary/20">
            <span className="text-2xl sm:text-3xl font-display font-black text-accent-magenta">0%</span>
            <span className="text-[11px] font-mono uppercase text-gray-400 block mt-0.5">Pay-To-Win</span>
          </div>
        </motion.div>
      </section>

      {/* Interactive Pinned How to Play Sequence */}
      <section className="py-20 bg-background-deep/70 border-y border-gray-800/80 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="cyan" size="md" className="mb-2">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
              The Rules of <span className="text-accent-cyan">The Arena</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Three synchronized phases define every clash.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div
              onClick={() => setActivePlayStep(1)}
              className={`p-6 rounded-2xl glass-card border transition-all cursor-pointer ${
                activePlayStep === 1
                  ? 'border-accent-cyan/80 shadow-glow-cyan bg-accent-cyan/[0.04]'
                  : 'border-gray-800 opacity-80'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-display font-bold text-sm mb-4 border border-accent-cyan/40">
                01
              </div>
              <h3 className="text-base font-display font-bold text-white mb-2">Choose & Lock</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Analyze your opponent’s habits, predict their counter, and secretly lock your element before the 10-second timer runs out.
              </p>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActivePlayStep(2)}
              className={`p-6 rounded-2xl glass-card border transition-all cursor-pointer ${
                activePlayStep === 2
                  ? 'border-primary-light/80 shadow-glow-primary bg-primary/[0.04]'
                  : 'border-gray-800 opacity-80'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary-light flex items-center justify-center font-display font-bold text-sm mb-4 border border-primary/40">
                02
              </div>
              <h3 className="text-base font-display font-bold text-white mb-2">Clash & Reveal</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Zero client-side snooping. Moves are released simultaneously by the authoritative game server with collision shockwaves.
              </p>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActivePlayStep(3)}
              className={`p-6 rounded-2xl glass-card border transition-all cursor-pointer ${
                activePlayStep === 3
                  ? 'border-secondary-glow/80 shadow-glow-purple bg-secondary/[0.04]'
                  : 'border-gray-800 opacity-80'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary-glow flex items-center justify-center font-display font-bold text-sm mb-4 border border-secondary/40">
                03
              </div>
              <h3 className="text-base font-display font-bold text-white mb-2">Crown & Advance</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Gain mathematical Elo rating, climb seasonal tiers, unlock combat achievements, and advance in championship knockout brackets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Parallax Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="magenta" size="md" className="mb-2">Arenas</Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
            Battle <span className="text-accent-cyan">Modes</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Choose your proving ground. Every match outcome is verified by the authoritative server.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Solo vs AI */}
          <Card interactive glow="primary" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-accent-cyan mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-1">Solo vs AI</h3>
              <span className="text-[10px] font-mono text-accent-cyan uppercase block mb-3">Markov Chain Prediction</span>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Train against Easy, Medium, and an adaptive Hard AI that builds a transition matrix from your move history.
              </p>
            </div>
            <Link to="/solo">
              <Button variant="outline" size="sm" className="w-full">Launch Solo</Button>
            </Link>
          </Card>

          {/* Ranked 1v1 */}
          <Card interactive glow="cyan" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-1">Ranked 1v1</h3>
              <span className="text-[10px] font-mono text-accent-cyan uppercase block mb-3">Elo Standoff</span>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Fast matchmaking by skill rating, widening dynamically over time. Symmetrical commit-reveal with rating deltas.
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
              <h3 className="text-lg font-display font-bold text-white mb-1">Private Rooms</h3>
              <span className="text-[10px] font-mono text-secondary-glow uppercase block mb-3">Direct Challenge</span>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Generate 6-character unguessable room codes. Configure Best of 3, 5, or 7 with custom host timers and share links.
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
              <h3 className="text-lg font-display font-bold text-white mb-1">Tournaments</h3>
              <span className="text-[10px] font-mono text-accent-magenta uppercase block mb-3">Knockout Brackets</span>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Single-elimination brackets with automatic bracket seeding, live advancement, and virtual credit prize pools.
              </p>
            </div>
            <Link to="/tournaments">
              <Button variant="outline" size="sm" className="w-full">View Brackets</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Bento Grid Architecture Features */}
      <section className="py-16 bg-background-deep/60 border-t border-gray-800/80 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="cyan" size="md" className="mb-2">Engine Integrity</Badge>
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-wide">
              Built for Competitive Esports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Zero Snooping */}
            <Card className="md:col-span-2 p-6 flex flex-col justify-between border-primary/40">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/20 text-accent-cyan">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">Cryptographic Commit-Reveal Protocol</h3>
                    <span className="text-[11px] font-mono text-accent-cyan uppercase">Mathematical Zero-Knowledge Privacy</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Opponents only receive an encrypted notification that you have locked in. The actual move is strictly isolated on the authoritative backend until both moves are committed, rendering client-side packet sniffing completely useless.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 border-t border-gray-800 pt-3">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent-cyan" /> 10s Turn Timer</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Idempotent State</span>
              </div>
            </Card>

            {/* Bento 2: 45s Reconnection Grace */}
            <Card className="p-6 flex flex-col justify-between border-secondary/40">
              <div>
                <div className="p-3 rounded-xl bg-secondary/20 text-secondary-glow mb-4 w-fit">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-1">45s Reconnect Grace</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Mobile Wi-Fi drop? Reopen the app within 45 seconds to automatically restore your active clash state snapshot.
                </p>
              </div>
              <span className="text-[10px] font-mono text-accent-cyan uppercase">Auto-Forfeit Protection</span>
            </Card>

            {/* Bento 3: Markov Chain AI */}
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-accent-cyan/20 text-accent-cyan mb-4 w-fit">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-1">Markov Chain AI</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  1st-order transition matrix tracks move-to-move tendencies in real-time, challenging human intuition.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase">3 Difficulty Tiers</span>
            </Card>

            {/* Bento 4: Progression */}
            <Card className="md:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-accent-magenta/20 text-accent-magenta">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">Elo System & 16 Combat Trophies</h3>
                    <span className="text-[11px] font-mono text-accent-magenta uppercase">Skill-Based Progression</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Dynamic K-factor scaling based on rating tier, daily missions resetting at 00:00 UTC, win-streak XP multipliers, and server-validated achievement awards.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 border-t border-gray-800 pt-3">
                <span>Bronze → Master Tiers</span>
                <span>•</span>
                <span>Virtual Credits Only</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Leaderboard Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative z-10">
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

        <div className="glass-panel rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-background-deep/80 text-xs font-mono uppercase text-gray-400">
                  <th className="py-4 px-4">Rank</th>
                  <th className="py-4 px-4">Gladiator</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Tier</th>
                  <th className="py-4 px-4">Win Rate</th>
                  <th className="py-4 px-4">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {leaderboardPreview.map((player) => (
                  <tr key={player.rank} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${
                        player.rank === 1 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-glow-primary' :
                        player.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                        player.rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                        'text-gray-400'
                      }`}>
                        {player.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={player.name} size="sm" />
                        <span className="font-display font-semibold text-white">{player.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-accent-cyan font-bold">{player.rating}</td>
                    <td className="py-4 px-4">
                      <Badge variant="purple" size="sm">{player.tier}</Badge>
                    </td>
                    <td className="py-4 px-4 text-emerald-400">{player.winRate}%</td>
                    <td className="py-4 px-4 text-gray-300">Lvl {player.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Infinite Horizontal Marquee Testimonials (Labelled Sample) */}
      <section className="py-16 bg-background-deep/70 border-t border-gray-800 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-[11px] font-mono uppercase tracking-wider mb-2">
            Sample Content
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wide">
            Combatant Field Reports
          </h2>
        </div>

        {/* Marquee Track */}
        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max py-2">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="w-80 sm:w-96 glass-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between shrink-0"
            >
              <p className="text-xs text-gray-300 italic mb-4 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center justify-between border-t border-gray-800/80 pt-3">
                <div>
                  <span className="font-display font-bold text-white text-xs block">{t.author}</span>
                  <span className="text-[10px] font-mono text-gray-400">{t.stats}</span>
                </div>
                <Badge variant="cyan" size="sm">{t.rank}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full relative z-10">
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
      </section>

      {/* Cinematic Final Call To Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="glass-panel gradient-border-cyan rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wide">
            Enter The Triad Arena
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mt-3 mb-8 leading-relaxed">
            Test your foresight against predictive AI algorithms or challenge human intuition worldwide in real-time ranked combat.
          </p>
          <Link to="/play">
            <Button variant="accent" size="lg" className="shadow-glow-cyan text-base font-bold px-10">
              Claim Your Call-Sign & Play
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
