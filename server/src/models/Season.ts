import mongoose, { Schema, Document } from 'mongoose';

export interface ISeason extends Document {
  seasonNumber: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  softResetFactor: number;
}

const SeasonSchema = new Schema<ISeason>(
  {
    seasonNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    softResetFactor: { type: Number, default: 0.5 }
  },
  { timestamps: true }
);

export const Season = mongoose.model<ISeason>('Season', SeasonSchema);
