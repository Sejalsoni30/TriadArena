import mongoose, { Schema, Document } from 'mongoose';
import { BestOf } from '@triad-arena/shared';

export interface ITournamentMatch {
  matchId: string;
  roundIndex: number;
  matchIndex: number;
  player1Id?: string;
  player1Username?: string;
  player2Id?: string;
  player2Username?: string;
  score1: number;
  score2: number;
  winnerId?: string;
  status: 'pending' | 'ready' | 'in_progress' | 'completed' | 'bye';
}

export interface ITournament extends Document {
  title: string;
  description: string;
  organizerId: string;
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
  maxParticipants: number;
  bestOf: BestOf;
  prizePoolVirtual: number;
  participants: Array<{
    userId: string;
    username: string;
    seed: number;
    eliminated: boolean;
  }>;
  bracketMatches: ITournamentMatch[];
  winnerId?: string;
  winnerUsername?: string;
  startsAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TournamentSchema = new Schema<ITournament>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    organizerId: { type: String, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'registration_open', 'in_progress', 'completed', 'cancelled'],
      default: 'registration_open'
    },
    maxParticipants: { type: Number, required: true, default: 8 },
    bestOf: { type: Number, default: 3 },
    prizePoolVirtual: { type: Number, default: 5000 },
    participants: [
      {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        seed: { type: Number, required: true },
        eliminated: { type: Boolean, default: false }
      }
    ],
    bracketMatches: [
      {
        matchId: { type: String, required: true },
        roundIndex: { type: Number, required: true },
        matchIndex: { type: Number, required: true },
        player1Id: { type: String },
        player1Username: { type: String },
        player2Id: { type: String },
        player2Username: { type: String },
        score1: { type: Number, default: 0 },
        score2: { type: Number, default: 0 },
        winnerId: { type: String },
        status: { type: String, enum: ['pending', 'ready', 'in_progress', 'completed', 'bye'], default: 'pending' }
      }
    ],
    winnerId: { type: String },
    winnerUsername: { type: String },
    startsAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Tournament = mongoose.model<ITournament>('Tournament', TournamentSchema);
