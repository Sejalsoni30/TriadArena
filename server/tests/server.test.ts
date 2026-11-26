import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';
import { GameEngine } from '../src/services/GameEngine.js';

describe('Server REST API Endpoints', () => {
  const { app } = createServer();

  it('responds with 200 on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Triad Arena');
  });

  it('rejects protected routes without Authorization header', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('allows access with dev mock token', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', 'Bearer dev_token_123');

    // Should return 200 or 404 (user) with JSON structure, not 401
    expect(res.status).not.toBe(401);
  });

  it('allows public leaderboard querying', async () => {
    const res = await request(app).get('/api/leaderboard?limit=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.players)).toBe(true);
  });
});

describe('GameEngine Authoritative Commit-Reveal State Machine', () => {
  it('correctly tracks commits and reveals outcomes only when both players lock', () => {
    const matchId = 'test_match_100';
    GameEngine.initializeMatch(matchId, ['p1', 'p2'], 3);

    // Player 1 commits Rock
    const r1 = GameEngine.commitMove(matchId, 'p1', 1, 'rock');
    expect(r1.bothCommitted).toBe(false);
    expect(r1.roundResult).toBeUndefined();

    // Player 2 commits Scissors
    const r2 = GameEngine.commitMove(matchId, 'p2', 1, 'scissors');
    expect(r2.bothCommitted).toBe(true);
    expect(r2.roundResult).toBeDefined();
    expect(r2.roundResult.winnerId).toBe('p1');
    expect(r2.roundResult.outcome).toBe('win');
    expect(r2.roundResult.scores.p1).toBe(1);
    expect(r2.roundResult.scores.p2).toBe(0);
    expect(r2.roundResult.isMatchOver).toBe(false);
  });
});
