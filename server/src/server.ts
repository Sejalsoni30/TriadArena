import express, { Express, Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { connectDatabase } from './config/db.js';
import { standardRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route handlers
import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { soloRoutes } from './routes/soloRoutes.js';
import { roomRoutes } from './routes/roomRoutes.js';
import { tournamentRoutes } from './routes/tournamentRoutes.js';
import { leaderboardRoutes } from './routes/leaderboardRoutes.js';
import { missionRoutes } from './routes/missionRoutes.js';
import { achievementRoutes } from './routes/achievementRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';

import { setupSocketHandlers } from './sockets/matchSocket.js';

export function createServer(): { app: Express; server: http.Server; io: SocketIOServer } {
  const app = express();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: config.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Security & standard middleware
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(standardRateLimiter);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Triad Arena Authoritative Game Server',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/solo', soloRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/tournaments', tournamentRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/missions', missionRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Global error handler
  app.use(errorHandler);

  // Socket.IO gateway initialization
  setupSocketHandlers(io);

  return { app, server, io };
}

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(() => {
    const { server } = createServer();
    server.listen(config.port, () => {
      console.log(`Triad Arena Server listening on port ${config.port}`);
    });
  });
}
