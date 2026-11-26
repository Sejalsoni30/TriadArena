import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  ArrowLeft, 
  Clock, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  MinusCircle,
  Trophy, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { 
  Move, 
  BestOf, 
  evaluateRound, 
  getTargetScore, 
  checkMatchWinner, 
  calculateElo,
  TURN_TIMEOUT_SECONDS
} from '@triad-arena/shared';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';
import { sound } from '../lib/sound';

export const LobbyPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [queueState, setQueueState] = useState<'idle' | 'searching' | 'matched' | 'in_match' | 'match_over'>('idle');
  const [queueTime, setQueueTime] = useState(0);
  const [ratingRange, setRatingRange] = useState({ min: 1150, max: 1250 });

  // Match State
  const [opponent, setOpponent] = useState<{ username: string; rating: number; avatar: string } | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [myCommittedMove, setMyCommittedMove] = useState<Move | null>(null);
  const [opponentCommitted, setOpponentCommitted] = useState(false);
  const [revealedMoves, setRevealedMoves] = useState<{ me: Move; opp: Move } | null>(null);
  const [roundWinner, setRoundWinner] = useState<'me' | 'opp' | 'draw' | null>(null);
  const [turnTimer, setTurnTimer] = useState(TURN_TIMEOUT_SECONDS);
  const [matchWinner, setMatchWinner] = useState<'me' | 'opp' | null>(null);
  const [ratingDelta, setRatingDelta] = useState(0);

  const bestOf: BestOf = 3;
  const targetScore = getTargetScore(bestOf);

  // Queue Search Simulation (widens rating range every 4 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (queueState === 'searching') {
      interval = setInterval(() => {
        setQueueTime((t) => t + 1);
        setRatingRange((r) => ({ min: Math.max(100, r.min - 15), max: r.max + 15 }));
      }, 1000);

      // Simulate match finding after 5-7 seconds
      const matchTimeout = setTimeout(() => {
        const sampleOpponents = [
          { username: 'VortexZero', rating: 1245, avatar: '' },
          { username: 'CyberKage', rating: 1190, avatar: '' },
          { username: 'NeonPulse', rating: 1215, avatar: '' }
        ];
        const picked = sampleOpponents[Math.floor(Math.random() * sampleOpponents.length)];
        setOpponent(picked);
        setQueueState('matched');

        setTimeout(() => {
          setPlayerScore(0);
          setOpponentScore(0);
          setCurrentRound(1);
          setMyCommittedMove(null);
          setOpponentCommitted(false);
          setRevealedMoves(null);
          setTurnTimer(TURN_TIMEOUT_SECONDS);
          setQueueState('in_match');
          addToast({ type: 'info', title: 'Match Started', message: `Facing ${picked.username}` });
        }, 1500);
      }, 5500);

      return () => {
        clearInterval(interval);
        clearTimeout(matchTimeout);
      };
    }
  }, [queueState]);

  // Turn Countdown during active match
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (queueState === 'in_match' && turnTimer > 0 && !revealedMoves) {
      timer = setTimeout(() => setTurnTimer((t: number) => t - 1), 1000);
    } else if (queueState === 'in_match' && turnTimer === 0 && !revealedMoves) {
      // Auto-commit on timeout
      if (!myCommittedMove) {
        handleCommitMove('rock');
      }
    }
    return () => clearTimeout(timer);
  }, [queueState, turnTimer, revealedMoves, myCommittedMove]);

  // Commit Move Handler
  const handleCommitMove = (move: Move) => {
    if (myCommittedMove) return;
    sound.playLock();
    setMyCommittedMove(move);

    // Opponent commits randomly within 1-2 seconds
    setTimeout(() => {
      setOpponentCommitted(true);

      // Reveal simultaneously
      setTimeout(() => {
        const moves: Move[] = ['rock', 'paper', 'scissors'];
        const oppMove = moves[Math.floor(Math.random() * moves.length)];
        sound.playClash();
        setRevealedMoves({ me: move, opp: oppMove });

        const outcome = evaluateRound(move, oppMove);
        let newPScore = playerScore;
        let newOScore = opponentScore;

        if (outcome === 'win') {
          setRoundWinner('me');
          newPScore += 1;
          setPlayerScore(newPScore);
        } else if (outcome === 'lose') {
          setRoundWinner('opp');
          newOScore += 1;
          setOpponentScore(newOScore);
        } else {
          setRoundWinner('draw');
        }

        const winner = checkMatchWinner({ me: newPScore, opp: newOScore }, targetScore);

        setTimeout(() => {
          if (winner) {
            const isMe = winner === 'me';
            setMatchWinner(isMe ? 'me' : 'opp');
            setQueueState('match_over');

            // Authoritative Elo calculation
            const currentRating = user?.rating || 1200;
            const oppRating = opponent?.rating || 1200;
            const eloCalc = calculateElo(currentRating, oppRating, isMe ? 1 : 0);
            setRatingDelta(eloCalc.deltaA);

            if (isMe) {
              sound.playWin();
              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              addToast({ type: 'success', title: 'Ranked Victory!', message: `Earned ${eloCalc.deltaA} Elo!` });
              if (user) {
                updateUser({
                  rating: eloCalc.newRatingA,
                  peakRating: Math.max(user.peakRating, eloCalc.newRatingA),
                  xp: user.xp + 100,
                  stats: {
                    ...user.stats,
                    totalMatches: user.stats.totalMatches + 1,
                    wins: user.stats.wins + 1,
                    multiplayerWins: user.stats.multiplayerWins + 1,
                    currentStreak: user.stats.currentStreak + 1,
                    bestStreak: Math.max(user.stats.bestStreak, user.stats.currentStreak + 1)
                  }
                });
              }
            } else {
              sound.playLose();
              addToast({ type: 'warning', title: 'Match Conceded', message: `${eloCalc.deltaA} Elo adjustment.` });
              if (user) {
                updateUser({
                  rating: eloCalc.newRatingA,
                  xp: user.xp + 35,
                  stats: {
                    ...user.stats,
                    totalMatches: user.stats.totalMatches + 1,
                    losses: user.stats.losses + 1,
                    currentStreak: 0
                  }
                });
              }
            }
          } else {
            // Next round
            setCurrentRound((r) => r + 1);
            setMyCommittedMove(null);
            setOpponentCommitted(false);
            setRevealedMoves(null);
            setRoundWinner(null);
            setTurnTimer(TURN_TIMEOUT_SECONDS);
          }
        }, 2200);
      }, 1000);
    }, 1200);
  };

  const moveEmojis: Record<Move, string> = { rock: '✊', paper: '✋', scissors: '✌' };

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col items-center">
        {queueState === 'idle' && (
          <div className="w-full max-w-lg flex flex-col gap-6">
            <Link to="/play" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-cyan font-mono">
              <ArrowLeft className="w-4 h-4" /> Back to Modes
            </Link>

            <Card className="p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-accent-cyan flex items-center justify-center mb-4 border border-primary/40 shadow-glow-primary">
                <Flame className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                Ranked 1v1 Queue
              </h1>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mb-6">
                Enter queue-based matchmaking. Matches are locked with our anti-snoop commit-reveal engine.
              </p>

              <div className="w-full glass-panel p-4 rounded-xl border border-gray-800 mb-6 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Format: Best of 3</span>
                <span className="text-accent-cyan">Turn Timer: 10s</span>
                <span className="text-emerald-400">Rating: {user?.rating || 1200}</span>
              </div>

              <Button
                variant="accent"
                size="lg"
                onClick={() => {
                  setQueueTime(0);
                  setQueueState('searching');
                }}
                className="w-full"
              >
                Find Ranked Match
              </Button>
            </Card>
          </div>
        )}

        {queueState === 'searching' && (
          <Card className="w-full max-w-md p-8 flex flex-col items-center text-center shadow-2xl">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-accent-cyan/30 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-accent-cyan/20 border-2 border-accent-cyan flex items-center justify-center text-accent-cyan">
                <Users className="w-7 h-7 animate-pulse" />
              </div>
            </div>

            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-1">
              Searching For Opponent
            </h2>
            <p className="text-xs font-mono text-gray-400 mb-6">
              Elapsed: 00:{queueTime < 10 ? `0${queueTime}` : queueTime}
            </p>

            <div className="w-full glass-panel p-3.5 rounded-xl border border-gray-800 text-xs font-mono text-gray-300 flex justify-between mb-6">
              <span>Rating Bracket:</span>
              <span className="text-accent-cyan">{ratingRange.min} - {ratingRange.max}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setQueueState('idle')}
              className="w-full"
            >
              Cancel Matchmaking
            </Button>
          </Card>
        )}

        {queueState === 'matched' && opponent && (
          <Card className="w-full max-w-md p-8 flex flex-col items-center text-center shadow-2xl">
            <Badge variant="success" size="md" className="mb-4">Opponent Confirmed</Badge>
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider mb-6">
              Match Commencing
            </h2>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex flex-col items-center">
                <Avatar name={user?.username || 'You'} size="lg" />
                <span className="text-xs font-display font-bold text-white mt-2">{user?.username || 'You'}</span>
                <span className="text-[10px] font-mono text-accent-cyan">{user?.rating || 1200} Elo</span>
              </div>
              <span className="font-display font-black text-xl text-gray-500">VS</span>
              <div className="flex flex-col items-center">
                <Avatar name={opponent.username} size="lg" />
                <span className="text-xs font-display font-bold text-white mt-2">{opponent.username}</span>
                <span className="text-[10px] font-mono text-accent-magenta">{opponent.rating} Elo</span>
              </div>
            </div>
          </Card>
        )}

        {(queueState === 'in_match' || queueState === 'match_over') && opponent && (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Header Scoreboard */}
            <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-gray-800 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-3">
                <Avatar name={user?.username || 'You'} size="md" />
                <div>
                  <h3 className="font-display font-bold text-white text-sm">{user?.username || 'You'}</h3>
                  <span className="text-2xl font-display font-black text-accent-cyan">{playerScore}</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-mono uppercase text-gray-400">
                  Round {currentRound} • Target: {targetScore}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-lg font-mono font-bold text-amber-400">
                    00:{turnTimer < 10 ? `0${turnTimer}` : turnTimer}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <h3 className="font-display font-bold text-white text-sm">{opponent.username}</h3>
                  <span className="text-2xl font-display font-black text-accent-magenta">{opponentScore}</span>
                </div>
                <Avatar name={opponent.username} size="md" />
              </div>
            </div>

            {/* Arena Standoff Area */}
            <div className="w-full min-h-[260px] glass-card rounded-3xl p-8 flex flex-col items-center justify-center relative border border-gray-800">
              <AnimatePresence mode="wait">
                {queueState === 'in_match' && !revealedMoves && (
                  <motion.div
                    key="commit_phase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex items-center gap-8 mb-4">
                      {/* You lock indicator */}
                      <div className="flex flex-col items-center">
                        <span className={`w-4 h-4 rounded-full mb-1 ${myCommittedMove ? 'bg-emerald-400 shadow-glow-cyan' : 'bg-gray-600'}`} />
                        <span className="text-[10px] font-mono uppercase text-gray-400">
                          {myCommittedMove ? 'Locked In' : 'Selecting...'}
                        </span>
                      </div>
                      {/* Opponent lock indicator */}
                      <div className="flex flex-col items-center">
                        <span className={`w-4 h-4 rounded-full mb-1 ${opponentCommitted ? 'bg-emerald-400 shadow-glow-cyan' : 'bg-gray-600'}`} />
                        <span className="text-[10px] font-mono uppercase text-gray-400">
                          {opponentCommitted ? 'Locked In' : 'Selecting...'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono uppercase text-accent-cyan tracking-widest">
                      Commit-Reveal Armed • Zero Snooping
                    </span>
                  </motion.div>
                )}

                {revealedMoves && (
                  <motion.div
                    key="revealed"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4 w-full animate-shake"
                  >
                    <div className="flex items-center justify-around w-full max-w-md">
                      <div className="flex flex-col items-center">
                        <span className="text-6xl mb-2">{moveEmojis[revealedMoves.me]}</span>
                        <span className="font-display font-bold text-xs uppercase text-accent-cyan">You</span>
                      </div>
                      <span className="text-xl font-display font-black text-gray-500">VS</span>
                      <div className="flex flex-col items-center">
                        <span className="text-6xl mb-2">{moveEmojis[revealedMoves.opp]}</span>
                        <span className="font-display font-bold text-xs uppercase text-accent-pink">{opponent.username}</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      {roundWinner === 'me' && (
                        <Badge variant="win" size="md" className="gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-semantic-win" />
                          <span>Round Won</span>
                        </Badge>
                      )}
                      {roundWinner === 'opp' && (
                        <Badge variant="loss" size="md" className="gap-1.5">
                          <XCircle className="w-4 h-4 text-semantic-loss" />
                          <span>Round Lost</span>
                        </Badge>
                      )}
                      {roundWinner === 'draw' && (
                        <Badge variant="draw" size="md" className="gap-1.5">
                          <MinusCircle className="w-4 h-4 text-semantic-draw" />
                          <span>Stand-Off (Draw)</span>
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                )}

                {queueState === 'match_over' && (
                  <motion.div
                    key="match_over"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    {matchWinner === 'me' ? (
                      <>
                        <Trophy className="w-16 h-16 text-amber-400 mb-3 animate-bounce" />
                        <h2 className="text-3xl font-display font-black text-white uppercase tracking-wider">
                          Victory!
                        </h2>
                        <p className="text-xs font-mono text-emerald-400 mt-1 mb-6">
                          +{ratingDelta} Elo • +100 XP
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-3xl font-display font-black text-white uppercase tracking-wider mb-2">
                          Match Defeated
                        </h2>
                        <p className="text-xs font-mono text-rose-400 mb-6">
                          {ratingDelta} Elo • +35 XP
                        </p>
                      </>
                    )}

                    <div className="flex items-center gap-3">
                      <Button
                        variant="accent"
                        size="md"
                        onClick={() => {
                          setQueueTime(0);
                          setQueueState('searching');
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" /> Find Next Match
                      </Button>
                      <Link to="/play">
                        <Button variant="outline" size="md">
                          Exit to Hub
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Move Action Controls */}
            {queueState === 'in_match' && !revealedMoves && (
              <div className="w-full grid grid-cols-3 gap-4 max-w-lg">
                {(['rock', 'paper', 'scissors'] as Move[]).map((m) => (
                  <button
                    key={m}
                    disabled={!!myCommittedMove}
                    onClick={() => handleCommitMove(m)}
                    className={`p-5 rounded-2xl glass-panel border flex flex-col items-center justify-center transition-all ${
                      myCommittedMove === m
                        ? 'border-accent-cyan bg-accent-cyan/15 shadow-glow-cyan'
                        : 'border-gray-800 hover:border-gray-600 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-4xl mb-2">{moveEmojis[m]}</span>
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                      {m}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
