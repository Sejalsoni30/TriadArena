import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Tournament } from '../models/Tournament.js';
import { TournamentService } from '../services/TournamentService.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: tournaments });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message, details: null }
    });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, maxParticipants = 8, bestOf = 3, prizePoolVirtual = 5000 } = req.body;

    const tourney = await Tournament.create({
      title,
      organizerId: req.user!.userId,
      maxParticipants,
      bestOf,
      prizePoolVirtual,
      participants: [
        {
          userId: req.user!.userId,
          username: req.user!.username,
          seed: 1,
          eliminated: false
        }
      ]
    });

    res.json({ success: true, data: tourney, message: 'Tournament created' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message, details: null }
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tourney = await Tournament.findById(req.params.id);
    if (!tourney) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tournament not found', details: null }
      });
    }

    res.json({ success: true, data: tourney });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message, details: null }
    });
  }
});

router.post('/:id/register', authMiddleware, async (req: Request, res: Response) => {
  try {
    const tourney = await Tournament.findById(req.params.id);
    if (!tourney) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tournament not found', details: null }
      });
    }

    if (tourney.participants.some((p) => p.userId === req.user!.userId)) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_REGISTERED', message: 'You are already registered', details: null }
      });
    }

    if (tourney.participants.length >= tourney.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: { code: 'TOURNAMENT_FULL', message: 'Tournament bracket is at maximum capacity', details: null }
      });
    }

    tourney.participants.push({
      userId: req.user!.userId,
      username: req.user!.username,
      seed: tourney.participants.length + 1,
      eliminated: false
    });

    await tourney.save();

    // Auto start if filled
    if (tourney.participants.length === tourney.maxParticipants) {
      await TournamentService.startTournament(tourney.id);
    }

    res.json({ success: true, data: tourney, message: 'Successfully registered for tournament' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'REGISTER_ERROR', message: error.message, details: null }
    });
  }
});

export const tournamentRoutes = router;
