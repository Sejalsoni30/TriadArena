import mongoose, { Schema, Document } from 'mongoose';
import { BestOf } from '@triad-arena/shared';

export interface IRoom extends Document {
  code: string;
  hostId: string;
  hostUsername: string;
  guestId?: string;
  guestUsername?: string;
  bestOf: BestOf;
  turnTimerSec: number;
  status: 'waiting' | 'ready' | 'in_game' | 'finished' | 'expired';
  currentMatchId?: string;
  passwordHash?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    hostId: { type: String, required: true },
    hostUsername: { type: String, required: true },
    guestId: { type: String },
    guestUsername: { type: String },
    bestOf: { type: Number, default: 3 },
    turnTimerSec: { type: Number, default: 10 },
    status: { type: String, enum: ['waiting', 'ready', 'in_game', 'finished', 'expired'], default: 'waiting' },
    currentMatchId: { type: String },
    passwordHash: { type: String },
    expiresAt: { type: Date, index: { expires: '2h' }, default: () => new Date(Date.now() + 2 * 60 * 60 * 1000) }
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
