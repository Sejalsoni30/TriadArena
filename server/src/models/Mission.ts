import mongoose, { Schema, Document } from 'mongoose';

export interface IUserMission extends Document {
  userId: string;
  dateKey: string; // YYYY-MM-DD (UTC reset at 00:00)
  missionId: string;
  title: string;
  description: string;
  currentCount: number;
  targetCount: number;
  xpReward: number;
  coinsReward: number;
  completed: boolean;
  claimed: boolean;
}

const UserMissionSchema = new Schema<IUserMission>(
  {
    userId: { type: String, required: true, index: true },
    dateKey: { type: String, required: true, index: true },
    missionId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    currentCount: { type: Number, default: 0 },
    targetCount: { type: Number, required: true },
    xpReward: { type: Number, required: true },
    coinsReward: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    claimed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

UserMissionSchema.index({ userId: 1, dateKey: 1, missionId: 1 }, { unique: true });

export const UserMission = mongoose.model<IUserMission>('UserMission', UserMissionSchema);
