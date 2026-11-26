import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { MissionService } from '../services/MissionService.js';
import { UserMission } from '../models/Mission.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/daily', authMiddleware, async (req: Request, res: Response) => {
  try {
    const missions = await MissionService.getDailyMissions(req.user!.userId);
    res.json({ success: true, data: missions });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'MISSIONS_FETCH_ERROR', message: error.message, details: null }
    });
  }
});

router.post('/:id/claim', authMiddleware, async (req: Request, res: Response) => {
  try {
    const mission = await UserMission.findOne({
      _id: req.params.id,
      userId: req.user!.userId
    });

    if (!mission || !mission.completed || mission.claimed) {
      return res.status(400).json({
        success: false,
        error: { code: 'CANNOT_CLAIM', message: 'Mission is not complete or already claimed', details: null }
      });
    }

    mission.claimed = true;
    await mission.save();

    const user = await User.findById(req.user!.userId);
    if (user) {
      user.xp += mission.xpReward;
      user.coins += mission.coinsReward;
      await user.save();
    }

    res.json({
      success: true,
      data: { xpAwarded: mission.xpReward, coinsAwarded: mission.coinsReward },
      message: 'Mission reward claimed'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CLAIM_ERROR', message: error.message, details: null }
    });
  }
});

export const missionRoutes = router;
