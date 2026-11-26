import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user!.firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User profile not found', details: null }
      });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message, details: null }
    });
  }
});

router.patch('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findOne({ firebaseUid: req.user!.firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User profile not found', details: null }
      });
    }

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.json({ success: true, data: user, message: 'Profile updated' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: error.message, details: null }
    });
  }
});

router.get('/:username', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      'username avatar rating peakRating level stats createdAt bio'
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gladiator not found', details: null }
      });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message, details: null }
    });
  }
});

export const userRoutes = router;
