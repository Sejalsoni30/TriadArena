import { Server, Socket } from 'socket.io';
import { Move, BestOf, TURN_TIMEOUT_SECONDS, RECONNECT_GRACE_PERIOD_MS } from '@triad-arena/shared';
import { GameEngine } from '../services/GameEngine.js';
import { ProgressionService } from '../services/ProgressionService.js';
import { nanoid } from 'nanoid';

interface QueueUser {
  socketId: string;
  userId: string;
  username: string;
  rating: number;
  bestOf: BestOf;
  joinedAt: number;
}

const matchmakingQueue: QueueUser[] = [];
// Active socket mapping: socketId -> userId
const socketUserMap = new Map<string, { userId: string; username: string }>();
// Disconnect grace tracking: matchId -> { timer: NodeJS.Timeout, disconnectedPlayerId: string }
const disconnectTimers = new Map<string, { timer: NodeJS.Timeout; disconnectedPlayerId: string }>();

export function setupSocketHandlers(io: Server) {
  // Queue interval matching check
  setInterval(() => {
    if (matchmakingQueue.length >= 2) {
      const p1 = matchmakingQueue.shift()!;
      const p2 = matchmakingQueue.shift()!;

      const matchId = `match_${nanoid(10)}`;
      const bestOf = p1.bestOf || 3;

      GameEngine.initializeMatch(matchId, [p1.userId, p2.userId], bestOf);

      // Join sockets to match room
      const s1 = io.sockets.sockets.get(p1.socketId);
      const s2 = io.sockets.sockets.get(p2.socketId);

      if (s1 && s2) {
        s1.join(matchId);
        s2.join(matchId);

        const matchPayload = {
          matchId,
          bestOf,
          turnTimeoutSec: TURN_TIMEOUT_SECONDS,
          players: {
            [p1.userId]: { userId: p1.userId, username: p1.username, rating: p1.rating },
            [p2.userId]: { userId: p2.userId, username: p2.username, rating: p2.rating }
          }
        };

        io.to(matchId).emit('match:start', matchPayload);
      }
    }
  }, 2000);

  io.on('connection', (socket: Socket) => {
    const authHeader = socket.handshake.auth.token || socket.handshake.headers.authorization;
    let userId = socket.handshake.auth.userId || `user_${nanoid(6)}`;
    let username = socket.handshake.auth.username || `Player_${nanoid(4)}`;

    socketUserMap.set(socket.id, { userId, username });

    // Join Matchmaking Queue
    socket.on('queue:join', (data: { bestOf?: BestOf }) => {
      // Remove any prior entry
      const existingIdx = matchmakingQueue.findIndex((q) => q.userId === userId);
      if (existingIdx !== -1) matchmakingQueue.splice(existingIdx, 1);

      matchmakingQueue.push({
        socketId: socket.id,
        userId,
        username,
        rating: 1200,
        bestOf: data.bestOf || 3,
        joinedAt: Date.now()
      });

      socket.emit('queue:joined', { position: matchmakingQueue.length });
    });

    socket.on('queue:leave', () => {
      const idx = matchmakingQueue.findIndex((q) => q.socketId === socket.id);
      if (idx !== -1) matchmakingQueue.splice(idx, 1);
      socket.emit('queue:left');
    });

    // Commit-Reveal Move Submission
    socket.on('match:commit_move', async (data: { matchId: string; roundNumber: number; move: Move }) => {
      try {
        const { matchId, roundNumber, move } = data;
        const result = GameEngine.commitMove(matchId, userId, roundNumber, move);

        // Acknowledge to committing player
        socket.emit('match:commit_ack', { roundNumber });

        // Inform other player in match that this player has committed (NO MOVE REVEALED!)
        socket.to(matchId).emit('match:player_committed', { playerId: userId, roundNumber });

        if (result.bothCommitted && result.roundResult) {
          // Reveal simultaneously
          io.to(matchId).emit('match:round_reveal', result.roundResult);

          if (result.roundResult.isMatchOver) {
            const match = GameEngine.getMatch(matchId);
            const winnerId = result.roundResult.winnerIdFinal;
            const pIds = Object.keys(match?.scores || {});
            const loserId = pIds.find((id) => id !== winnerId);

            if (winnerId && loserId) {
              const progression = await ProgressionService.processMatchCompletion(
                winnerId,
                loserId,
                true,
                false
              );

              io.to(matchId).emit('match:game_over', {
                matchId,
                winnerId,
                finalScores: result.roundResult.scores,
                progression
              });
            }

            GameEngine.finalizeMatch(matchId);
          }
        }
      } catch (err: any) {
        socket.emit('match:error', { message: err.message });
      }
    });

    // Reconnection & State Restore
    socket.on('match:reconnect', (data: { matchId: string }) => {
      const match = GameEngine.getMatch(data.matchId);
      if (match) {
        socket.join(data.matchId);

        // Clear disconnect grace timer if active
        const disconnectRecord = disconnectTimers.get(data.matchId);
        if (disconnectRecord && disconnectRecord.disconnectedPlayerId === userId) {
          clearTimeout(disconnectRecord.timer);
          disconnectTimers.delete(data.matchId);
          socket.to(data.matchId).emit('match:player_reconnected', { playerId: userId });
        }

        // Send full state snapshot
        socket.emit('match:state_restore', {
          matchId: match.matchId,
          roundNumber: match.roundNumber,
          scores: match.scores,
          history: match.history,
          committedPlayers: Object.keys(match.commits)
        });
      }
    });

    // Disconnect Handler with 45s Grace Period
    socket.on('disconnect', () => {
      const user = socketUserMap.get(socket.id);
      socketUserMap.delete(socket.id);

      // Remove from queue
      const qIdx = matchmakingQueue.findIndex((q) => q.socketId === socket.id);
      if (qIdx !== -1) matchmakingQueue.splice(qIdx, 1);

      if (user) {
        // Broadcast disconnect grace period to active matches
        for (const [roomId] of socket.rooms) {
          if (roomId.startsWith('match_')) {
            socket.to(roomId).emit('match:player_disconnected', {
              playerId: user.userId,
              gracePeriodMs: RECONNECT_GRACE_PERIOD_MS
            });

            // Start 45s forfeit timer
            const timer = setTimeout(() => {
              io.to(roomId).emit('match:forfeit_win', {
                reason: 'opponent_timeout',
                disconnectedPlayerId: user.userId
              });
              GameEngine.finalizeMatch(roomId);
              disconnectTimers.delete(roomId);
            }, RECONNECT_GRACE_PERIOD_MS);

            disconnectTimers.set(roomId, { timer, disconnectedPlayerId: user.userId });
          }
        }
      }
    });
  });
}
