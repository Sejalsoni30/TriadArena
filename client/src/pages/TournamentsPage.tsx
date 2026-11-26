import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, ArrowRight, Plus } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const TournamentsPage: React.FC = () => {
  const { addToast } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(8);

  const tournaments = [
    {
      id: 'tourney_1',
      title: 'Neon Blitz Championship #1',
      status: 'registration_open' as const,
      maxParticipants: 8,
      participantCount: 6,
      prizePool: 5000,
      startsAt: 'Today, 20:00 UTC',
      bestOf: 3
    },
    {
      id: 'tourney_2',
      title: 'Apex Gladiator Masters',
      status: 'in_progress' as const,
      maxParticipants: 16,
      participantCount: 16,
      prizePool: 12500,
      startsAt: 'Live Now',
      bestOf: 3
    },
    {
      id: 'tourney_3',
      title: 'Cyber Genesis Cup',
      status: 'completed' as const,
      maxParticipants: 8,
      participantCount: 8,
      prizePool: 4000,
      startsAt: 'Yesterday',
      winner: 'VortexZero',
      bestOf: 5
    }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setCreateModalOpen(false);
    addToast({ type: 'success', title: 'Tournament Created', message: `${title} is open for registrations` });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Badge variant="magenta" size="md" className="mb-2">Bracket Arenas</Badge>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wide">
              Championship Tournaments
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Single-elimination knockout brackets. Compete for pure virtual credit prizes and glory.
            </p>
          </div>

          <Button variant="accent" size="md" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Host Tournament
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <Card key={t.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant={
                      t.status === 'in_progress' ? 'cyan' :
                      t.status === 'registration_open' ? 'success' : 'neutral'
                    }
                    size="sm"
                  >
                    {t.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-400">{t.startsAt}</span>
                </div>

                <h2 className="text-lg font-display font-bold text-white mb-2">{t.title}</h2>

                <div className="flex flex-col gap-2 text-xs font-mono text-gray-400 mb-6">
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <strong className="text-white">{t.participantCount}/{t.maxParticipants}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <strong className="text-accent-cyan">Single Elimination (Bo{t.bestOf})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Virtual Prize Pool:</span>
                    <strong className="text-amber-400">{t.prizePool} Credits</strong>
                  </div>
                </div>
              </div>

              <Link to={`/tournaments/${t.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Bracket <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Create Tournament Modal */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Host New Tournament"
          description="Initialize a single-elimination bracket."
        >
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input
              label="Tournament Title"
              placeholder="Neon Cup 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="text-xs font-mono uppercase text-gray-400 block mb-1.5">Max Combatants</label>
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full bg-background-deep border border-gray-700 rounded-lg p-2.5 text-sm text-gray-100"
              >
                <option value={4}>4 Players (2 Rounds)</option>
                <option value={8}>8 Players (3 Rounds)</option>
                <option value={16}>16 Players (4 Rounds)</option>
              </select>
            </div>

            <Button type="submit" variant="accent" size="md" className="mt-2">
              Create & Open Registration
            </Button>
          </form>
        </Modal>
      </main>

      <Footer />
    </div>
  );
};
