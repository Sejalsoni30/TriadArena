import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Room } from '../models/Room.js';
import { nanoid } from 'nanoid';

const router = Router();

router.post('/create', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { bestOf = 3, turnTimerSec = 10 } = req.body;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const room = await Room.create({
      code,
      hostId: req.user!.userId,
      hostUsername: req.user!.username,
      bestOf,
      turnTimerSec,
      status: 'waiting'
    });

    res.json({
      success: true,
      data: {
        code: room.code,
        hostUsername: room.hostUsername,
        bestOf: room.bestOf,
        turnTimerSec: room.turnTimerSec
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'ROOM_CREATE_ERROR', message: error.message, details: null }
    });
  }
});

router.post('/join', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const room = await Room.findOne({ code: code.toUpperCase() });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: { code: 'ROOM_NOT_FOUND', message: 'Room code does not exist', details: null }
      });
    }

    if (room.status !== 'waiting' && room.guestId !== req.user!.userId) {
      return res.status(400).json({
        success: false,
        error: { code: 'ROOM_FULL', message: 'Room is already full or in progress', details: null }
      });
    }

    room.guestId = req.user!.userId;
    room.guestUsername = req.user!.username;
    room.status = 'ready';
    await room.save();

    res.json({
      success: true,
      data: room,
      message: 'Joined room successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'ROOM_JOIN_ERROR', message: error.message, details: null }
    });
  }
});

router.get('/:code', async (req: Request, res: Response) => {
  try {
    const room = await Room.findOne({ code: req.params.code.toUpperCase() });
    if (!room) {
      return res.status(404).json({
        success: false,
        error: { code: 'ROOM_NOT_FOUND', message: 'Room not found', details: null }
      });
    }

    res.json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message, details: null }
    });
  }
});

export const roomRoutes = router;
