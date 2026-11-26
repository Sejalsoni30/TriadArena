import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Lock, Copy, Check, ArrowLeft, Users, Play, Settings } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';

export const RoomPage: React.FC = () => {
  const { code: urlCode } = useParams<{ code?: string }>();
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const [activeCode, setActiveCode] = useState<string | null>(urlCode || null);
  const [inputCode, setInputCode] = useState('');
  const [bestOf, setBestOf] = useState<3 | 5 | 7>(3);
  const [copied, setCopied] = useState(false);
  const [roomUsers, setRoomUsers] = useState<string[]>([user?.username || 'Host Gladiator']);

  const handleCreateRoom = () => {
    // Generate 6-character room code
    const generated = Math.random().toString(36).substring(2, 8).toUpperCase();
    setActiveCode(generated);
    setRoomUsers([user?.username || 'Host Gladiator']);
    addToast({ type: 'success', title: 'Room Created', message: `Code: ${generated}` });
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode || inputCode.length < 4) {
      addToast({ type: 'danger', title: 'Invalid Code', message: 'Please enter a valid room code' });
      return;
    }
    const clean = inputCode.trim().toUpperCase();
    setActiveCode(clean);
    setRoomUsers(['Room Host', user?.username || 'Guest Gladiator']);
    addToast({ type: 'success', title: 'Joined Room', message: `Entered room ${clean}` });
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/room/${activeCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast({ type: 'info', title: 'Link Copied', message: 'Share link copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-6">
          <Link to="/play" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-cyan font-mono">
            <ArrowLeft className="w-4 h-4" /> Back to Modes
          </Link>
          <Badge variant="purple" size="sm">Private Lobbies</Badge>
        </div>

        {!activeCode ? (
          <div className="w-full max-w-md flex flex-col gap-6">
            {/* Create Room Card */}
            <Card className="p-6">
              <h2 className="text-lg font-display font-bold text-white mb-1">Host a Private Match</h2>
              <p className="text-xs text-gray-400 mb-6">Create a room code and invite an opponent directly.</p>
              
              <div className="mb-6">
                <label className="text-xs font-mono uppercase text-gray-400 block mb-2">Series Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 5, 7] as const).map((bo) => (
                    <button
                      key={bo}
                      type="button"
                      onClick={() => setBestOf(bo)}
                      className={`p-2.5 rounded-xl border text-xs font-display font-bold uppercase ${
                        bestOf === bo ? 'border-secondary-glow bg-secondary/20 text-secondary-glow' : 'border-gray-800 text-gray-400'
                      }`}
                    >
                      Best of {bo}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="secondary" size="md" onClick={handleCreateRoom} className="w-full">
                Generate Private Room
              </Button>
            </Card>

            {/* Join Room Card */}
            <Card className="p-6">
              <h2 className="text-lg font-display font-bold text-white mb-1">Join with Code</h2>
              <p className="text-xs text-gray-400 mb-4">Enter a 6-character invitation code to join a friend.</p>
              
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <Input
                  placeholder="e.g. 7X9K2P"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="font-mono uppercase tracking-widest text-center"
                />
                <Button type="submit" variant="primary" size="md">
                  Join
                </Button>
              </form>
            </Card>
          </div>
        ) : (
          <Card className="w-full max-w-lg p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl">
            <Badge variant="purple" size="md" className="mb-4">Room Active</Badge>
            <h2 className="text-xs font-mono uppercase text-gray-400">Invite Code</h2>
            <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-accent-cyan my-3">
              {activeCode}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={copyShareLink}
              className="gap-2 mb-8 text-xs font-mono"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Copy Shareable Link'}
            </Button>

            {/* Room Roster */}
            <div className="w-full glass-panel p-4 rounded-2xl border border-gray-800 mb-8">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-3 border-b border-gray-800 pb-2">
                <span>Roster ({roomUsers.length}/2)</span>
                <span>Best of {bestOf}</span>
              </div>
              <div className="flex flex-col gap-2">
                {roomUsers.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background-deep">
                    <div className="flex items-center gap-2">
                      <Avatar name={u} size="sm" />
                      <span className="text-xs font-display font-semibold text-white">{u}</span>
                    </div>
                    <Badge variant={i === 0 ? 'cyan' : 'success'} size="sm">
                      {i === 0 ? 'Host' : 'Ready'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex items-center gap-3">
              <Link to="/lobby" className="flex-1">
                <Button variant="accent" size="md" className="w-full">
                  <Play className="w-4 h-4 mr-2" /> Start Match
                </Button>
              </Link>
              <Button variant="outline" size="md" onClick={() => setActiveCode(null)}>
                Leave Room
              </Button>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};
