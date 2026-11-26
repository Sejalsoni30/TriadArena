import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Move, 
  AiDifficulty, 
  BestOf, 
  evaluateRound, 
  getTargetScore, 
  checkMatchWinner, 
  AiEngine,
  MOVES,
  TURN_TIMEOUT_SECONDS
} from '@triad-arena/shared';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';

export const SoloPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();

  const [difficulty, setDifficulty] = useState<AiDifficulty>('hard');
  const [bestOf, setBestOf] = useState<BestOf>(3);
  const [gameState, setGameState] = useState<'config' | 'playing' | 'round_reveal' | 'game_over'>('config');
  
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [aiMove, setAiMove] = useState<Move | null>(null);
  const [lastOutcome, setLastOutcome] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [playerHistory, setPlayerHistory] = useState<Move[]>([]);
  const [timeLeft, setTimeLeft] = useState(TURN_TIMEOUT_SECONDS);

  const targetScore = getTargetScore(bestOf);

  // Turn timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev: number) => prev - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      // Auto-assign random move if timeout occurs
      const moves: Move[] = ['rock', 'paper', 'scissors'];
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      handleSelectMove(randomMove);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startMatch = () => {
    setPlayerScore(0);
    setAiScore(0);
    setCurrentRound(1);
    setPlayerMove(null);
    setAiMove(null);
    setLastOutcome(null);
    setPlayerHistory([]);
    setTimeLeft(TURN_TIMEOUT_SECONDS);
    setGameState('playing');
  };

  const handleSelectMove = (move: Move) => {
    if (gameState !== 'playing') return;

    setPlayerMove(move);
    const updatedHistory = [...playerHistory, move];
    setPlayerHistory(updatedHistory);

    // AI selects counter using specified difficulty
    const botMove = AiEngine.getMove(difficulty, playerHistory);
    setAiMove(botMove);

    const outcome = evaluateRound(move, botMove);
    setLastOutcome(outcome);
    setGameState('round_reveal');

    let newPScore = playerScore;
    let newAiScore = aiScore;

    if (outcome === 'win') {
      newPScore += 1;
      setPlayerScore(newPScore);
    } else if (outcome === 'lose') {
      newAiScore += 1;
      setAiScore(newAiScore);
    }

    const winner = checkMatchWinner({ player: newPScore, ai: newAiScore }, targetScore);

    setTimeout(() => {
      if (winner) {
        setGameState('game_over');
        if (winner === 'player') {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
          addToast({ type: 'success', title: 'Victory!', message: `Defeated ${difficulty.toUpperCase()} AI!` });
          if (user) {
            updateUser({
              xp: user.xp + 25,
              stats: {
                ...user.stats,
                totalMatches: user.stats.totalMatches + 1,
                wins: user.stats.wins + 1,
                soloWins: user.stats.soloWins + 1,
                currentStreak: user.stats.currentStreak + 1,
                bestStreak: Math.max(user.stats.bestStreak, user.stats.currentStreak + 1)
              }
            });
          }
        } else {
          addToast({ type: 'warning', title: 'Defeated', message: 'The AI predicted your strategy.' });
          if (user) {
            updateUser({
              xp: user.xp + 5,
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
        // Proceed to next round
        setCurrentRound((prev) => prev + 1);
        setPlayerMove(null);
        setAiMove(null);
        setTimeLeft(TURN_TIMEOUT_SECONDS);
        setGameState('playing');
      }
    }, 2400);
  };

  const moveIcons: Record<Move, { icon: string; name: string; color: string }> = {
    rock: { icon: '✊', name: 'Rock', color: 'from-blue-600 to-primary-light' },
    paper: { icon: '✋', name: 'Paper', color: 'from-cyan-500 to-blue-400' },
    scissors: { icon: '✌', name: 'Scissors', color: 'from-purple-600 to-accent-magenta' }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col items-center">
        {/* Match Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <Link to="/play" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-cyan font-mono">
            <ArrowLeft className="w-4 h-4" /> Exit Arena
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm">Solo Battle</Badge>
            <Badge variant="purple" size="sm">{difficulty.toUpperCase()} AI</Badge>
          </div>
        </div>

        {gameState === 'config' && (
          <Card className="w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center mx-auto mb-4 border border-accent-cyan/30">
                <Bot className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                Configure Solo Simulation
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Train against our predictive AI engine before entering ranked play.
              </p>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="text-xs font-mono uppercase text-gray-400 block mb-2">AI Difficulty</label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['easy', 'medium', 'hard'] as AiDifficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`p-3 rounded-xl border text-xs font-display font-bold uppercase transition-all ${
                      difficulty === d
                        ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-glow-cyan'
                        : 'border-gray-800 bg-background-deep text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {difficulty === 'easy' && 'Uniform random choice. 33% chance per move.'}
                {difficulty === 'medium' && 'Frequency Counter: 70% chance to counter your most frequent move.'}
                {difficulty === 'hard' && 'Markov Chain: Predicts your next move using sequence memory with 80% counter probability.'}
              </p>
            </div>

            {/* Match Format Selection */}
            <div>
              <label className="text-xs font-mono uppercase text-gray-400 block mb-2">Match Format</label>
              <div className="grid grid-cols-3 gap-2.5">
                {([1, 3, 5] as BestOf[]).map((bo) => (
                  <button
                    key={bo}
                    type="button"
                    onClick={() => setBestOf(bo)}
                    className={`p-3 rounded-xl border text-xs font-display font-bold uppercase transition-all ${
                      bestOf === bo
                        ? 'bg-primary/20 border-primary-light text-primary-light shadow-glow-primary'
                        : 'border-gray-800 bg-background-deep text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Best of {bo}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="accent" size="lg" onClick={startMatch} className="w-full mt-2">
              Engage Simulation
            </Button>
          </Card>
        )}

        {(gameState === 'playing' || gameState === 'round_reveal' || gameState === 'game_over') && (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Scoreboard */}
            <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-gray-800 flex items-center justify-between shadow-2xl">
              {/* Player */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center font-display font-bold text-white text-lg">
                  YOU
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm">
                    {user?.username || 'Gladiator'}
                  </h3>
                  <span className="text-2xl font-display font-black text-accent-cyan">
                    {playerScore}
                  </span>
                </div>
              </div>

              {/* Match Status Center */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-mono uppercase text-gray-400">
                  Round {currentRound} • Target: {targetScore}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-lg font-mono font-bold text-amber-400">
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </span>
                </div>
              </div>

              {/* AI */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <h3 className="font-display font-bold text-white text-sm">
                    {difficulty.toUpperCase()} AI
                  </h3>
                  <span className="text-2xl font-display font-black text-accent-magenta">
                    {aiScore}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-accent-magenta flex items-center justify-center text-white">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Combat Arena Center Display */}
            <div className="w-full min-h-[260px] glass-card rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-gray-800">
              <AnimatePresence mode="wait">
                {gameState === 'playing' && (
                  <motion.div
                    key="choosing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="text-xs font-mono uppercase text-accent-cyan tracking-widest mb-2 animate-pulse">
                      Awaiting Your Move
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                      Select Your Element
                    </h2>
                  </motion.div>
                )}

                {gameState === 'round_reveal' && playerMove && aiMove && (
                  <motion.div
                    key="reveal"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <div className="flex items-center justify-around w-full max-w-md">
                      {/* Player Move */}
                      <motion.div
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-5xl sm:text-6xl mb-2">{moveIcons[playerMove].icon}</span>
                        <span className="font-display font-bold text-xs uppercase text-accent-cyan">You</span>
                      </motion.div>

                      {/* VS */}
                      <span className="text-xl font-display font-black text-gray-500">VS</span>

                      {/* AI Move */}
                      <motion.div
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-5xl sm:text-6xl mb-2">{moveIcons[aiMove].icon}</span>
                        <span className="font-display font-bold text-xs uppercase text-accent-magenta">AI</span>
                      </motion.div>
                    </div>

                    {/* Outcome Badge */}
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-2"
                    >
                      {lastOutcome === 'win' && (
                        <Badge variant="success" size="md" className="text-sm px-4 py-1.5 gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Round Won
                        </Badge>
                      )}
                      {lastOutcome === 'lose' && (
                        <Badge variant="danger" size="md" className="text-sm px-4 py-1.5 gap-1.5">
                          <XCircle className="w-4 h-4" /> Round Conceded
                        </Badge>
                      )}
                      {lastOutcome === 'draw' && (
                        <Badge variant="warning" size="md" className="text-sm px-4 py-1.5 gap-1.5">
                          <MinusCircle className="w-4 h-4" /> Stand-Off (Draw)
                        </Badge>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {gameState === 'game_over' && (
                  <motion.div
                    key="game_over"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    {playerScore >= targetScore ? (
                      <>
                        <Trophy className="w-16 h-16 text-amber-400 mb-3 animate-bounce" />
                        <h2 className="text-3xl font-display font-black text-white uppercase tracking-wider">
                          Match Victory!
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 mb-6">
                          You outmaneuvered the {difficulty.toUpperCase()} AI • +25 Solo XP Awarded
                        </p>
                      </>
                    ) : (
                      <>
                        <Bot className="w-16 h-16 text-rose-500 mb-3" />
                        <h2 className="text-3xl font-display font-black text-white uppercase tracking-wider">
                          Simulation Defeat
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 mb-6">
                          The {difficulty.toUpperCase()} AI counter-predicted your moves • +5 Solo XP
                        </p>
                      </>
                    )}

                    <div className="flex items-center gap-3">
                      <Button variant="accent" size="md" onClick={startMatch}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Rematch AI
                      </Button>
                      <Button variant="outline" size="md" onClick={() => setGameState('config')}>
                        Change Settings
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Move Action Triggers */}
            {gameState === 'playing' && (
              <div className="w-full grid grid-cols-3 gap-4 max-w-lg">
                {(['rock', 'paper', 'scissors'] as Move[]).map((move) => {
                  const item = moveIcons[move];
                  return (
                    <button
                      key={move}
                      onClick={() => handleSelectMove(move)}
                      className="group p-5 rounded-2xl glass-panel border border-gray-700/80 hover:border-accent-cyan flex flex-col items-center justify-center transition-all duration-200 active:scale-95 hover:shadow-glow-cyan"
                    >
                      <span className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
