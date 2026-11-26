export type Move = 'rock' | 'paper' | 'scissors';
export type Outcome = 'win' | 'lose' | 'draw';
export type GameMode = 'solo' | 'multiplayer' | 'room' | 'tournament';
export type AiDifficulty = 'easy' | 'medium' | 'hard';
export type BestOf = 1 | 3 | 5 | 7;

export const MOVES: Record<string, Move> = {
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors'
} as const;

export const MOVE_BEATS: Record<Move, Move> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
} as const;

export const TURN_TIMEOUT_SECONDS = 10;
export const RECONNECT_GRACE_PERIOD_MS = 45000;
export const DISCONNECT_WARNING_MS = 15000;

export const RANKS = [
  { name: 'Bronze I', minRating: 0, maxRating: 1099, color: '#CD7F32' },
  { name: 'Bronze II', minRating: 1100, maxRating: 1199, color: '#D48A44' },
  { name: 'Silver I', minRating: 1200, maxRating: 1299, color: '#C0C0C0' },
  { name: 'Silver II', minRating: 1300, maxRating: 1399, color: '#D9D9D9' },
  { name: 'Gold I', minRating: 1400, maxRating: 1499, color: '#FFD700' },
  { name: 'Gold II', minRating: 1500, maxRating: 1599, color: '#FCE043' },
  { name: 'Platinum I', minRating: 1600, maxRating: 1699, color: '#00F0FF' },
  { name: 'Platinum II', minRating: 1700, maxRating: 1799, color: '#38EF7D' },
  { name: 'Diamond', minRating: 1800, maxRating: 1999, color: '#8B5CF6' },
  { name: 'Master', minRating: 2000, maxRating: Infinity, color: '#EC4899' }
] as const;

export const VIRTUAL_CURRENCY_NAME = 'Triad Credits';
