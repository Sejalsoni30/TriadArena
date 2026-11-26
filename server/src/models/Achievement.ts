import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: string;
  achievementCode: string;
  unlockedAt: Date;
}

const UserAchievementSchema = new Schema<IUserAchievement>(
  {
    userId: { type: String, required: true, index: true },
    achievementCode: { type: String, required: true, index: true },
    unlockedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

UserAchievementSchema.index({ userId: 1, achievementCode: 1 }, { unique: true });

export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);
