import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  username: string;
  email: string;
  role: 'player' | 'organizer' | 'admin';
  avatar: string;
  bio: string;
  rating: number;
  peakRating: number;
  level: number;
  xp: number;
  coins: number;
  stats: {
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    currentStreak: number;
    bestStreak: number;
    soloWins: number;
    multiplayerWins: number;
    tournamentWins: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    role: { type: String, enum: ['player', 'organizer', 'admin'], default: 'player' },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 200, default: '' },
    rating: { type: Number, default: 1200, index: true },
    peakRating: { type: Number, default: 1200 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 100 },
    stats: {
      totalMatches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      bestStreak: { type: Number, default: 0 },
      soloWins: { type: Number, default: 0 },
      multiplayerWins: { type: Number, default: 0 },
      tournamentWins: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
