import mongoose from 'mongoose';
import { config } from './index.js';

// Disable query buffering so operations fail-fast or use fallback when offline
mongoose.set('bufferCommands', false);

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDatabase(): Promise<boolean> {
  if (isDbConnected()) return true;

  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 1500
    });
    console.log('MongoDB connected successfully to:', config.mongoUri);
    return true;
  } catch (err) {
    console.warn('MongoDB offline. Operating with memory/sample provider.');
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (isDbConnected()) {
    await mongoose.disconnect();
  }
}

