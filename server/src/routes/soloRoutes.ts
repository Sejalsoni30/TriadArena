import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  Move, 
  AiDifficulty, 
  BestOf, 
  evaluateRound, 
  getTargetScore, 
  checkMatchWinner, 
  AiEngine 
} from '@triad-arena/shared';
import { nanoid } from 'nanoid';
import { ProgressionService } from '../services/ProgressionService.js';

interface SoloSession {
  matchId: string;
  userId: string;
  difficulty: AiDifficulty;
  bestOf: BestOf;
  targetScore: number;
  playerScore: number;
  aiScore: number;
  currentRound: number;
  playerHistory: Move[];
  status: 'active' | 'completed';
}

const activeSoloSessions = new Map<string, SoloSession>();

const router = Router();

router.post('/start', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { difficulty = 'hard', bestOf = 3 } = req.body;
    const matchId = `solo_${nanoid(8)}`;
    const targetScore = getTargetScore(bestOf as BestOf);

    const session: SoloSession = {
      matchId,
      userId: req.user!.userId,
      difficulty: difficulty as AiDifficulty,
      bestOf: bestOf as BestOf,
      targetScore,
      playerScore: 0,
      aiScore: 0,
      currentRound: 1,
      playerHistory: [],
      status: 'active'
    };

    activeSoloSessions.set(matchId, session);

    res.json({
      success: true,
      data: {
        matchId,
        difficulty,
        bestOf,
        targetScore,
        currentRound: 1
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SOLO_START_ERROR', message: error.message, details: null }
    });
  }
});

router.post('/move', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { matchId, move } = req.body;
    const session = activeSoloSessions.get(matchId);

    if (!session || session.status !== 'active') {
      return res.status(404).json({
        success: false,
        error: { code: 'INVALID_SESSION', message: 'Active solo match not found', details: null }
      });
    }

    // AI selects counter
    const aiMove = AiEngine.getMove(session.difficulty, session.playerHistory);
    session.playerHistory.push(move as Move);

    const outcome = evaluateRound(move as Move, aiMove);
    if (outcome === 'win') {
      session.playerScore += 1;
    } else if (outcome === 'lose') {
      session.aiScore += 1;
    }

    const winner = checkMatchWinner(
      { player: session.playerScore, ai: session.aiScore },
      session.targetScore
    );

    let xpAwarded = 0;
    if (winner) {
      session.status = 'completed';
      const isWinner = winner === 'player';
      xpAwarded = await ProgressionService.processSoloCompletion(session.userId, isWinner);
      activeSoloSessions.delete(matchId);
    } else {
      session.currentRound += 1;
    }

    res.json({
      success: true,
      data: {
        roundNumber: session.currentRound,
        playerMove: move,
        aiMove,
        outcome,
        scores: { player: session.playerScore, ai: session.aiScore },
        isMatchOver: !!winner,
        winner: winner || null,
        xpAwarded
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SOLO_MOVE_ERROR', message: error.message, details: null }
    });
  }
});

export const soloRoutes = router;
