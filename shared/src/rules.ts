import { Move, Outcome, MOVE_BEATS, BestOf } from './constants.js';

/**
 * Pure evaluation function for Rock-Paper-Scissors.
 * Returns 'win' if moveA beats moveB, 'lose' if moveB beats moveA, 'draw' if identical.
 */
export function evaluateRound(moveA: Move, moveB: Move): Outcome {
  if (moveA === moveB) return 'draw';
  if (MOVE_BEATS[moveA] === moveB) return 'win';
  return 'lose';
}

/**
 * Calculates the target score required to win a match based on bestOf.
 * e.g. Best of 3 requires 2 wins, Best of 5 requires 3 wins.
 */
export function getTargetScore(bestOf: BestOf): number {
  return Math.floor(bestOf / 2) + 1;
}

/**
 * Checks if either player has reached the target score.
 */
export function checkMatchWinner(scores: Record<string, number>, targetScore: number): string | null {
  for (const [playerId, score] of Object.entries(scores)) {
    if (score >= targetScore) {
      return playerId;
    }
  }
  return null;
}
