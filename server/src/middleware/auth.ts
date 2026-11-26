import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { config } from '../config/index.js';
import { User } from '../models/User.js';

// Initialize Firebase Admin if credentials are provided
if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      })
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (err) {
    console.warn('Firebase Admin initialization error:', err);
  }
}

export interface AuthUser {
  userId: string;
  firebaseUid: string;
  email: string;
  username: string;
  role: 'player' | 'organizer' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or malformed Authorization header', details: null }
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1].trim();

  // Development/Mock auth token support for testing without requiring live Firebase account
  if (token.startsWith('mock_') || token.startsWith('dev_')) {
    const isMock = true;
    req.user = {
      userId: 'usr_mock_123',
      firebaseUid: 'fb_mock_123',
      email: 'warrior@triad.io',
      username: 'TestWarrior',
      role: 'player'
    };
    return next();
  }

  try {
    if (admin.apps.length > 0) {
      const decoded = await admin.auth().verifyIdToken(token);
      let dbUser = await User.findOne({ firebaseUid: decoded.uid });

      if (!dbUser) {
        // Auto-provision if user exists in Firebase but not synced yet
        dbUser = await User.create({
          firebaseUid: decoded.uid,
          email: decoded.email || `${decoded.uid}@triad.io`,
          username: (decoded.name || `Gladiator_${decoded.uid.substring(0, 5)}`).replace(/\s+/g, '_')
        });
      }

      req.user = {
        userId: dbUser.id,
        firebaseUid: dbUser.firebaseUid,
        email: dbUser.email,
        username: dbUser.username,
        role: dbUser.role
      };
      next();
    } else {
      // Fallback in dev when Firebase Admin is not configured
      req.user = {
        userId: 'usr_dev_1',
        firebaseUid: 'fb_dev_1',
        email: 'dev@triad.io',
        username: 'DevGladiator',
        role: 'admin'
      };
      next();
    }
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token verification failed', details: error.message }
    });
  }
}
