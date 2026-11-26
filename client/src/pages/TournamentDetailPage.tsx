import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Users, ShieldCheck, Play } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);

  // Sample Single Elimination Bracket (8 participants -> Quarter, Semi, Finals)
  const bracket = {
    quarters: [
      { id: 'm1', p1: 'VortexZero', s1: 2, p2: 'EchoRunner', s2: 0, winner: 'VortexZero' },
      { id: 'm2', p1: 'CyberKage', s1: 2, p2: 'BlazeStriker', s2: 1, winner: 'CyberKage' },
      { id: 'm3', p1: 'NeonPulse', s1: 2, p2: 'ApexMind', s2: 0, winner: 'NeonPulse' },
      { id: 'm4', p1: 'QuantumBlade', s1: 1, p2: 'AegisMind', s2: 2, winner: 'AegisMind' }
    ],
    semis: [
      { id: 'm5', p1: 'VortexZero', s1: 2, p2: 'CyberKage', s2: 1, winner: 'VortexZero' },
      { id: 'm6', p1: 'NeonPulse', s1: 2, p2: 'AegisMind', s2: 0, winner: 'NeonPulse' }
    ],
    finals: [
      { id: 'm7', p1: 'VortexZero', s1: 3, p2: 'NeonPulse', s2: 2, winner: 'VortexZero' }
    ]
  };

  const handleRegister = () => {
    setIsRegistered(true);
    addToast({ type: 'success', title: 'Registered!', message: 'You have been seeded into the bracket.' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <Link to="/tournaments" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-cyan font-mono mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Tournaments
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
                Championship Knockout Bracket
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Single-elimination auto-advancement bracket.
              </p>
            </div>
            {!isRegistered ? (
              <Button variant="accent" size="md" onClick={handleRegister}>
                Register for Tournament
              </Button>
            ) : (
              <Badge variant="success" size="md" className="py-2 px-4 text-xs">
                Registration Confirmed
              </Badge>
            )}
          </div>
        </div>

        {/* Visual Bracket */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 overflow-x-auto">
          <div className="min-w-[700px] flex justify-between gap-8">
            {/* Quarter-Finals */}
            <div className="flex-1 flex flex-col justify-around gap-4">
              <h3 className="text-xs font-mono uppercase text-accent-cyan font-semibold mb-2">Quarter-Finals</h3>
              {bracket.quarters.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-background-deep border border-gray-800 text-xs font-mono">
                  <div className={`flex justify-between py-1 ${m.winner === m.p1 ? 'text-white font-bold' : 'text-gray-400'}`}>
                    <span>{m.p1}</span>
                    <span>{m.s1}</span>
                  </div>
                  <div className={`flex justify-between py-1 border-t border-gray-800 ${m.winner === m.p2 ? 'text-white font-bold' : 'text-gray-400'}`}>
                    <span>{m.p2}</span>
                    <span>{m.s2}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Semi-Finals */}
            <div className="flex-1 flex flex-col justify-around gap-6">
              <h3 className="text-xs font-mono uppercase text-secondary-glow font-semibold mb-2">Semi-Finals</h3>
              {bracket.semis.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-background-deep border border-gray-800 text-xs font-mono">
                  <div className={`flex justify-between py-1 ${m.winner === m.p1 ? 'text-white font-bold' : 'text-gray-400'}`}>
                    <span>{m.p1}</span>
                    <span>{m.s1}</span>
                  </div>
                  <div className={`flex justify-between py-1 border-t border-gray-800 ${m.winner === m.p2 ? 'text-white font-bold' : 'text-gray-400'}`}>
                    <span>{m.p2}</span>
                    <span>{m.s2}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Finals & Champion */}
            <div className="flex-1 flex flex-col justify-center gap-6">
              <h3 className="text-xs font-mono uppercase text-amber-400 font-semibold mb-2">Grand Finals</h3>
              {bracket.finals.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-background-deep border-2 border-amber-400/50 shadow-glow-primary text-xs font-mono">
                  <div className={`flex justify-between py-1.5 ${m.winner === m.p1 ? 'text-amber-300 font-bold text-sm' : 'text-gray-400'}`}>
                    <span>{m.p1} 👑</span>
                    <span>{m.s1}</span>
                  </div>
                  <div className={`flex justify-between py-1.5 border-t border-gray-800 ${m.winner === m.p2 ? 'text-amber-300 font-bold text-sm' : 'text-gray-400'}`}>
                    <span>{m.p2}</span>
                    <span>{m.s2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
