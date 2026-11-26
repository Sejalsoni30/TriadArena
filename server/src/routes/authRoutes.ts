import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();

router.post('/sync', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { username, avatar } = req.body;
    const authUser = req.user!;

    let user = await User.findOne({ firebaseUid: authUser.firebaseUid });
    if (!user) {
      user = await User.create({
        firebaseUid: authUser.firebaseUid,
        email: authUser.email,
        username: username || authUser.username,
        avatar: avatar || ''
      });
    } else {
      if (username) user.username = username;
      if (avatar !== undefined) user.avatar = avatar;
      await user.save();
    }

    res.json({
      success: true,
      data: user,
      message: 'User synchronized successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SYNC_ERROR', message: error.message, details: null }
    });
  }
});

export const authRoutes = router;
