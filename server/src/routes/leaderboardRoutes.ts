import { Router, Request, Response } from 'express';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = Math.min(100, parseInt(req.query.limit as string || '25', 10));
    const search = req.query.search as string;

    if (!isDbConnected()) {
      const samplePlayers = [
        { rank: 1, username: 'VortexZero', avatar: '', rating: 2150, level: 42, winRate: 78, matchesPlayed: 182, wins: 142, losses: 40 },
        { rank: 2, username: 'CyberKage', avatar: '', rating: 2085, level: 38, winRate: 75, matchesPlayed: 160, wins: 120, losses: 40 },
        { rank: 3, username: 'NeonPulse', avatar: '', rating: 1990, level: 35, winRate: 71, matchesPlayed: 138, wins: 98, losses: 40 },
        { rank: 4, username: 'QuantumBlade', avatar: '', rating: 1945, level: 33, winRate: 69, matchesPlayed: 133, wins: 92, losses: 41 },
        { rank: 5, username: 'AegisMind', avatar: '', rating: 1890, level: 30, winRate: 66, matchesPlayed: 129, wins: 85, losses: 44 }
      ];
      const filtered = search
        ? samplePlayers.filter((p) => p.username.toLowerCase().includes(search.toLowerCase()))
        : samplePlayers;

      return res.json({
        success: true,
        data: {
          players: filtered,
          pagination: {
            page: 1,
            limit,
            totalPages: 1,
            totalPlayers: filtered.length
          },
          notice: 'Sample data: Database offline'
        }
      });
    }

    const filter: any = {};
    if (search) {
      filter.username = { $regex: search, $options: 'i' };
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('username avatar rating peakRating level stats createdAt');

    const players = users.map((u, idx) => ({
      rank: (page - 1) * limit + idx + 1,
      username: u.username,
      avatar: u.avatar,
      rating: u.rating,
      level: u.level,
      winRate: u.stats.totalMatches > 0 ? Math.round((u.stats.wins / u.stats.totalMatches) * 100) : 0,
      matchesPlayed: u.stats.totalMatches,
      wins: u.stats.wins,
      losses: u.stats.losses
    }));

    res.json({
      success: true,
      data: {
        players,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
          totalPlayers: total
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'LEADERBOARD_ERROR', message: error.message, details: null }
    });
  }
});

export const leaderboardRoutes = router;
