import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Match } from '../models/Match.js';
import { Tournament } from '../models/Tournament.js';
import { MissionService } from '../services/MissionService.js';
import { isDbConnected } from '../config/db.js';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        data: {
          profile: {
            id: req.user!.userId,
            username: req.user!.username,
            avatar: '',
            bio: 'Triad Arena Competitor',
            rating: 1200,
            peakRating: 1200,
            level: 1,
            xp: 0,
            coins: 100
          },
          stats: {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            currentStreak: 0,
            bestStreak: 0,
            soloWins: 0,
            multiplayerWins: 0,
            tournamentWins: 0,
            winRate: 0
          },
          dailyMissions: [
            {
              id: 'm1',
              title: 'Triad Victor',
              description: 'Win 2 matches in any mode',
              currentCount: 0,
              targetCount: 2,
              xpReward: 150,
              coinsReward: 50,
              completed: false,
              claimed: false
            }
          ],
          recentMatches: [],
          upcomingTournaments: [],
          notice: 'Sample data: Database offline'
        }
      });
    }

    const user = await User.findOne({ firebaseUid: req.user!.firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found', details: null }
      });
    }

    const [dailyMissions, recentMatches, upcomingTournaments] = await Promise.all([
      MissionService.getDailyMissions(user.id),
      Match.find({ 'players.userId': user.id }).sort({ createdAt: -1 }).limit(5),
      Tournament.find({ status: 'registration_open' }).limit(3)
    ]);

    const winRate = user.stats.totalMatches > 0
      ? Math.round((user.stats.wins / user.stats.totalMatches) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        profile: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          rating: user.rating,
          peakRating: user.peakRating,
          level: user.level,
          xp: user.xp,
          coins: user.coins
        },
        stats: {
          ...user.stats,
          winRate
        },
        dailyMissions,
        recentMatches,
        upcomingTournaments
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'DASHBOARD_ERROR', message: error.message, details: null }
    });
  }
});

export const dashboardRoutes = router;
