import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { UserAchievement } from '../models/Achievement.js';
import { AchievementService } from '../services/AchievementService.js';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const unlocked = await UserAchievement.find({ userId: req.user!.userId });
    res.json({
      success: true,
      data: {
        unlockedCodes: unlocked.map((u) => u.achievementCode)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'ACHIEVEMENT_ERROR', message: error.message, details: null }
    });
  }
});

export const achievementRoutes = router;
