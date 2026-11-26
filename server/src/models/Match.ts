import mongoose, { Schema, Document } from 'mongoose';
import { Move, Outcome, BestOf, GameMode } from '@triad-arena/shared';

export interface IRound {
  roundNumber: number;
  moves: Record<string, Move>;
  winnerId: string | null;
  outcome: Outcome;
  scores: Record<string, number>;
  revealedAt: Date;
}

export interface IMatchPlayer {
  userId: string;
  username: string;
  avatar: string;
  ratingBefore: number;
  ratingAfter: number;
  ratingDelta: number;
  score: number;
  xpEarned: number;
  isWinner: boolean;
  disconnected: boolean;
}

export interface IMatch extends Document {
  matchId: string;
  mode: GameMode;
  bestOf: BestOf;
  targetScore: number;
  status: 'in_progress' | 'completed' | 'abandoned' | 'forfeited';
  players: Record<string, IMatchPlayer>;
  rounds: IRound[];
  winnerId: string | null;
  idempotencyKey: string;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
  tournamentId?: string;
  roomId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    matchId: { type: String, required: true, unique: true, index: true },
    mode: { type: String, enum: ['solo', 'multiplayer', 'room', 'tournament'], required: true },
    bestOf: { type: Number, required: true, default: 3 },
    targetScore: { type: Number, required: true, default: 2 },
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned', 'forfeited'], default: 'in_progress' },
    players: { type: Schema.Types.Mixed, required: true },
    rounds: [
      {
        roundNumber: { type: Number, required: true },
        moves: { type: Schema.Types.Mixed, required: true },
        winnerId: { type: String, default: null },
        outcome: { type: String, required: true },
        scores: { type: Schema.Types.Mixed, required: true },
        revealedAt: { type: Date, default: Date.now }
      }
    ],
    winnerId: { type: String, default: null },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
    aiDifficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    tournamentId: { type: String },
    roomId: { type: String }
  },
  { timestamps: true }
);

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
