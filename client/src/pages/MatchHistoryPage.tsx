import React from 'react';
import { Swords, ArrowLeft, Calendar, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const MatchHistoryPage: React.FC = () => {
  const matches = [
    { id: 'm1', date: '2026-11-26 15:42', mode: 'Ranked 1v1', opponent: 'ShadowPulse', result: 'win', score: '2 - 1', elo: '+24', rounds: ['rock vs scissors (W)', 'paper vs paper (D)', 'scissors vs paper (W)'] },
    { id: 'm2', date: '2026-11-26 14:10', mode: 'Solo (Hard)', opponent: 'Markov AI', result: 'win', score: '3 - 2', elo: '0', rounds: ['rock vs paper (L)', 'paper vs rock (W)', 'scissors vs rock (L)', 'paper vs rock (W)', 'rock vs scissors (W)'] },
    { id: 'm3', date: '2026-11-26 12:30', mode: 'Ranked 1v1', opponent: 'AegisMind', result: 'lose', score: '1 - 2', elo: '-22', rounds: ['scissors vs rock (L)', 'rock vs scissors (W)', 'paper vs scissors (L)'] },
    { id: 'm4', date: '2026-11-25 19:15', mode: 'Private Room', opponent: 'Kage99', result: 'win', score: '3 - 0', elo: '0', rounds: ['paper vs rock (W)', 'rock vs scissors (W)', 'scissors vs paper (W)'] },
    { id: 'm5', date: '2026-11-25 18:00', mode: 'Tournament Semi-Final', opponent: 'ApexGladiator', result: 'lose', score: '1 - 2', elo: '0', rounds: ['rock vs rock (D)', 'scissors vs paper (W)', 'paper vs scissors (L)', 'rock vs paper (L)'] }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-cyan font-mono mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Match History & Audit Log
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Authoritative, tamper-evident log of your recent match outcomes and round-by-round moves.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {matches.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                    m.result === 'win'
                      ? 'bg-semantic-win/20 text-semantic-win border border-semantic-win/40'
                      : 'bg-semantic-loss/20 text-semantic-loss border border-semantic-loss/40'
                  }`}>
                    {m.result === 'win' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-semantic-win" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-semantic-loss" />
                    )}
                    <span>{m.result}</span>
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm">{m.mode} vs {m.opponent}</h3>
                    <span className="text-[10px] font-mono text-gray-400">{m.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>Score: <strong className="text-white text-sm">{m.score}</strong></span>
                  <span>Rating: <strong className={m.elo.startsWith('+') ? 'text-accent-cyan' : 'text-rose-400'}>{m.elo}</strong></span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1.5">Round Breakdown:</span>
                <div className="flex flex-wrap gap-2">
                  {m.rounds.map((rnd, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-background-deep border border-gray-800 text-gray-300">
                      R{i + 1}: {rnd}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
