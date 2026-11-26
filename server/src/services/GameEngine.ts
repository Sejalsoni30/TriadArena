import { 
  Move, 
  Outcome, 
  BestOf, 
  evaluateRound, 
  getTargetScore, 
  checkMatchWinner,
  TURN_TIMEOUT_SECONDS
} from '@triad-arena/shared';
import { Match, IMatch } from '../models/Match.js';
import { nanoid } from 'nanoid';

export interface CommitState {
  matchId: string;
  roundNumber: number;
  commits: Record<string, Move>;
  scores: Record<string, number>;
  bestOf: BestOf;
  targetScore: number;
  status: 'active' | 'completed';
  winnerId: string | null;
  history: Array<{
    roundNumber: number;
    moves: Record<string, Move>;
    winnerId: string | null;
    outcome: Outcome;
    scores: Record<string, number>;
  }>;
  disconnectGraceTimers: Record<string, NodeJS.Timeout>;
}

export class GameEngine {
  // In-memory active match commit-reveal states
  private static activeMatches: Map<string, CommitState> = new Map();

  static initializeMatch(matchId: string, playerIds: string[], bestOf: BestOf = 3): CommitState {
    const targetScore = getTargetScore(bestOf);
    const initialScores: Record<string, number> = {};
    for (const pid of playerIds) {
      initialScores[pid] = 0;
    }

    const state: CommitState = {
      matchId,
      roundNumber: 1,
      commits: {},
      scores: initialScores,
      bestOf,
      targetScore,
      status: 'active',
      winnerId: null,
      history: [],
      disconnectGraceTimers: {}
    };

    this.activeMatches.set(matchId, state);
    return state;
  }

  static getMatch(matchId: string): CommitState | undefined {
    return this.activeMatches.get(matchId);
  }

  /**
   * Commit a move. Opponents are NEVER informed of the actual move.
   */
  static commitMove(
    matchId: string,
    playerId: string,
    roundNumber: number,
    move: Move
  ): { bothCommitted: boolean; roundResult?: any } {
    const match = this.activeMatches.get(matchId);
    if (!match || match.status !== 'active') {
      throw new Error('Match not active or does not exist');
    }

    if (match.roundNumber !== roundNumber) {
      throw new Error(`Round mismatch: current round is ${match.roundNumber}`);
    }

    // Save move secretly
    match.commits[playerId] = move;

    const players = Object.keys(match.scores);
    const allLocked = players.every((p) => match.commits[p] !== undefined);

    if (!allLocked) {
      return { bothCommitted: false };
    }

    // Both players committed! Resolve round authoritative outcome
    const p1 = players[0];
    const p2 = players[1];
    const move1 = match.commits[p1];
    const move2 = match.commits[p2];

    const outcome = evaluateRound(move1, move2);
    let roundWinnerId: string | null = null;

    if (outcome === 'win') {
      roundWinnerId = p1;
      match.scores[p1] += 1;
    } else if (outcome === 'lose') {
      roundWinnerId = p2;
      match.scores[p2] += 1;
    }

    const isMatchWon = checkMatchWinner(match.scores, match.targetScore);
    if (isMatchWon) {
      match.status = 'completed';
      match.winnerId = isMatchWon;
    }

    const roundResult = {
      roundNumber: match.roundNumber,
      moves: { [p1]: move1, [p2]: move2 },
      winnerId: roundWinnerId,
      outcome,
      scores: { ...match.scores },
      isMatchOver: !!isMatchWon,
      winnerIdFinal: match.winnerId
    };

    match.history.push({
      roundNumber: match.roundNumber,
      moves: { [p1]: move1, [p2]: move2 },
      winnerId: roundWinnerId,
      outcome,
      scores: { ...match.scores }
    });

    // Advance round if match continues
    if (!isMatchWon) {
      match.roundNumber += 1;
      match.commits = {};
    }

    return { bothCommitted: true, roundResult };
  }

  static finalizeMatch(matchId: string) {
    this.activeMatches.delete(matchId);
  }
}
