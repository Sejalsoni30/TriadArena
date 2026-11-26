import { Move, Outcome, GameMode, AiDifficulty, BestOf } from './constants.js';

export interface PlayerSummary {
  userId: string;
  username: string;
  avatar: string;
  rating: number;
  level: number;
}

export interface RoundResult {
  roundNumber: number;
  moves: Record<string, Move>;
  winnerId: string | null;
  outcome: Outcome;
  scores: Record<string, number>;
  timestamp: number;
}

export interface MatchState {
  matchId: string;
  mode: GameMode;
  bestOf: BestOf;
  targetScore: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'abandoned' | 'forfeited';
  players: Record<string, PlayerSummary>;
  scores: Record<string, number>;
  currentRound: number;
  roundHistory: RoundResult[];
  winnerId: string | null;
  turnTimeoutSec: number;
  turnEndsAt?: number;
  committedPlayers: string[];
}

export interface UserStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  soloWins: number;
  multiplayerWins: number;
  tournamentWins: number;
}

export interface UserProfile extends PlayerSummary {
  email: string;
  role: 'player' | 'organizer' | 'admin';
  bio: string;
  peakRating: number;
  xp: number;
  coins: number;
  stats: UserStats;
  createdAt: string;
}

export interface AchievementDef {
  code: string;
  title: string;
  description: string;
  category: 'combat' | 'streak' | 'tournament' | 'mastery';
  xpReward: number;
  coinsReward: number;
  icon: string;
}

export interface MissionDef {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  xpReward: number;
  coinsReward: number;
  type: 'win_matches' | 'play_moves' | 'streak' | 'tournaments';
}

export interface TournamentBracketMatch {
  matchId: string;
  roundIndex: number;
  matchIndex: number;
  player1?: PlayerSummary;
  player2?: PlayerSummary;
  winnerId?: string;
  score1: number;
  score2: number;
  status: 'pending' | 'ready' | 'in_progress' | 'completed' | 'bye';
}

export interface TournamentSummary {
  id: string;
  title: string;
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed';
  maxParticipants: number;
  participantCount: number;
  bestOf: BestOf;
  prizePoolVirtual: number;
  startsAt: string;
  winner?: PlayerSummary;
}
