import { Move, AiDifficulty, MOVES, MOVE_BEATS } from './constants.js';

const ALL_MOVES: Move[] = ['rock', 'paper', 'scissors'];

/**
 * AI Engine for Solo Mode.
 * - Easy: Uniform random choice.
 * - Medium: Frequency counter (counters player's most frequent move with 70% probability).
 * - Hard: 1st-Order Markov Chain predictor (predicts next move based on player's prior move, with 80% counter probability).
 */
export class AiEngine {
  /**
   * Generates an AI move.
   * @param difficulty 'easy' | 'medium' | 'hard'
   * @param playerHistory Array of player's historical moves in chronological order.
   */
  static getMove(difficulty: AiDifficulty, playerHistory: Move[]): Move {
    if (difficulty === 'easy' || playerHistory.length === 0) {
      return this.getRandomMove();
    }

    if (difficulty === 'medium') {
      return this.getMediumMove(playerHistory);
    }

    return this.getHardMove(playerHistory);
  }

  private static getRandomMove(): Move {
    const idx = Math.floor(Math.random() * ALL_MOVES.length);
    return ALL_MOVES[idx];
  }

  /**
   * Returns the move that counters the target move.
   * Rock -> Paper, Paper -> Scissors, Scissors -> Rock.
   */
  public static getCounterMove(target: Move): Move {
    if (target === 'rock') return 'paper';
    if (target === 'paper') return 'scissors';
    return 'rock';
  }

  private static getMediumMove(playerHistory: Move[]): Move {
    // 30% chance of random move to keep it organic
    if (Math.random() < 0.3) {
      return this.getRandomMove();
    }

    // Count player frequencies
    const counts: Record<Move, number> = { rock: 0, paper: 0, scissors: 0 };
    for (const move of playerHistory) {
      counts[move]++;
    }

    // Identify most frequent move
    let mostFrequent: Move = 'rock';
    let maxCount = -1;
    for (const move of ALL_MOVES) {
      if (counts[move] > maxCount) {
        maxCount = counts[move];
        mostFrequent = move;
      }
    }

    return this.getCounterMove(mostFrequent);
  }

  private static getHardMove(playerHistory: Move[]): Move {
    // Require at least 2 moves for Markov transition observation
    if (playerHistory.length < 2) {
      return this.getMediumMove(playerHistory);
    }

    // 20% exploration / randomness to stay fair and beatable
    if (Math.random() < 0.2) {
      return this.getRandomMove();
    }

    // Build 1st-order Markov Transition Matrix: M[prevMove][nextMove] = count
    const transitions: Record<Move, Record<Move, number>> = {
      rock: { rock: 0, paper: 0, scissors: 0 },
      paper: { rock: 0, paper: 0, scissors: 0 },
      scissors: { rock: 0, paper: 0, scissors: 0 }
    };

    for (let i = 0; i < playerHistory.length - 1; i++) {
      const from = playerHistory[i];
      const to = playerHistory[i + 1];
      transitions[from][to]++;
    }

    const lastMove = playerHistory[playerHistory.length - 1];
    const nextRow = transitions[lastMove];

    let predictedNextMove: Move = 'rock';
    let maxTransitions = -1;

    for (const candidate of ALL_MOVES) {
      if (nextRow[candidate] > maxTransitions) {
        maxTransitions = nextRow[candidate];
        predictedNextMove = candidate;
      }
    }

    // If no prior transition exists from lastMove, fall back to medium move
    if (maxTransitions === 0) {
      return this.getMediumMove(playerHistory);
    }

    return this.getCounterMove(predictedNextMove);
  }
}
