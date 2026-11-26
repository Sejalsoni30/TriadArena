import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, ArrowLeft, ShieldCheck, Zap, Brain, Trophy } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const HowToPlayPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-accent-cyan transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            Rules, Mechanics & <span className="text-accent-cyan">Tactics</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Everything you need to know about the Triad Arena rules, authoritative commit-reveal architecture, Elo calculations, and predictive AI.
          </p>
        </div>

        {/* Section 1: The Triad Rules */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5 text-accent-cyan" /> 1. The Core Triad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 border-primary/30">
              <span className="text-3xl mb-2 block">✊</span>
              <h3 className="font-display font-bold text-lg text-white">Rock</h3>
              <p className="text-xs text-gray-400 mt-1">Crushes Scissors. Loses to Paper. Ties with Rock.</p>
            </Card>
            <Card className="p-5 border-accent-cyan/30">
              <span className="text-3xl mb-2 block">✋</span>
              <h3 className="font-display font-bold text-lg text-white">Paper</h3>
              <p className="text-xs text-gray-400 mt-1">Covers Rock. Loses to Scissors. Ties with Paper.</p>
            </Card>
            <Card className="p-5 border-secondary/30">
              <span className="text-3xl mb-2 block">✌</span>
              <h3 className="font-display font-bold text-lg text-white">Scissors</h3>
              <p className="text-xs text-gray-400 mt-1">Cuts Paper. Loses to Rock. Ties with Scissors.</p>
            </Card>
          </div>
        </section>

        {/* Section 2: Commit-Reveal */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent-cyan" /> 2. Server-Authoritative Commit-Reveal
          </h2>
          <Card className="p-6">
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Traditional web games often leak move states through WebSocket frames. In Triad Arena:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs text-gray-400">
              <li>When you submit a move, only a blind confirmation is stored on the server.</li>
              <li>Your opponent only sees that you have <span className="text-accent-cyan font-bold">LOCKED IN</span>.</li>
              <li>Moves are revealed simultaneously only after both choices are locked or the 10-second turn timer ends.</li>
              <li>If a player fails to lock a move before the timer expires, the round is defaulted according to fair play rules.</li>
            </ul>
          </Card>
        </section>

        {/* Section 3: AI Difficulties */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent-cyan" /> 3. Artificial Intelligence Engine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5">
              <Badge variant="neutral" className="mb-2">Tier 1</Badge>
              <h3 className="font-display font-bold text-white mb-1">Easy AI</h3>
              <p className="text-xs text-gray-400">Pure uniform random distribution. 33.3% chance per move.</p>
            </Card>
            <Card className="p-5">
              <Badge variant="warning" className="mb-2">Tier 2</Badge>
              <h3 className="font-display font-bold text-white mb-1">Medium AI</h3>
              <p className="text-xs text-gray-400">Frequency Counter. 70% chance to counter your most repeated move.</p>
            </Card>
            <Card className="p-5">
              <Badge variant="magenta" className="mb-2">Tier 3</Badge>
              <h3 className="font-display font-bold text-white mb-1">Hard AI</h3>
              <p className="text-xs text-gray-400">Markov Chain Predictor. Anticipates your next move based on your previous selection with 80% counter probability.</p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link to="/play">
            <Button variant="accent" size="lg">
              Ready to Play? Go to Arena
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
