import { describe, it, expect } from 'vitest';
import { evaluateRound, getTargetScore, checkMatchWinner } from './rules.js';
import { calculateElo, getLevelFromXp, getXpForLevel, getRankTier } from './progression.js';
import { AiEngine } from './ai.js';

describe('Shared Game Rules', () => {
  it('correctly evaluates standard Rock Paper Scissors outcomes', () => {
    expect(evaluateRound('rock', 'scissors')).toBe('win');
    expect(evaluateRound('scissors', 'paper')).toBe('win');
    expect(evaluateRound('paper', 'rock')).toBe('win');

    expect(evaluateRound('scissors', 'rock')).toBe('lose');
    expect(evaluateRound('paper', 'scissors')).toBe('lose');
    expect(evaluateRound('rock', 'paper')).toBe('lose');

    expect(evaluateRound('rock', 'rock')).toBe('draw');
    expect(evaluateRound('paper', 'paper')).toBe('draw');
    expect(evaluateRound('scissors', 'scissors')).toBe('draw');
  });

  it('correctly computes target scores for match formats', () => {
    expect(getTargetScore(1)).toBe(1);
    expect(getTargetScore(3)).toBe(2);
    expect(getTargetScore(5)).toBe(3);
    expect(getTargetScore(7)).toBe(4);
  });

  it('correctly detects match winners', () => {
    const scores = { p1: 2, p2: 1 };
    expect(checkMatchWinner(scores, 2)).toBe('p1');
    expect(checkMatchWinner(scores, 3)).toBe(null);
  });
});

describe('Progression & Elo Calculations', () => {
  it('calculates symmetrical rating shifts for equal players', () => {
    const result = calculateElo(1200, 1200, 1, 35, 35);
    expect(result.deltaA).toBeGreaterThan(0);
    expect(result.deltaB).toBeLessThan(0);
    expect(result.deltaA + result.deltaB).toBe(0); // Zero-sum exchange
  });

  it('calculates XP curves and levels deterministically', () => {
    expect(getXpForLevel(1)).toBe(0);
    expect(getXpForLevel(2)).toBe(100);

    const l1 = getLevelFromXp(50);
    expect(l1.level).toBe(1);
    expect(l1.progressPercent).toBe(50);

    const l2 = getLevelFromXp(150);
    expect(l2.level).toBe(2);
  });

  it('maps rating to appropriate rank tiers', () => {
    expect(getRankTier(1000).name).toBe('Bronze I');
    expect(getRankTier(1250).name).toBe('Silver I');
    expect(getRankTier(1850).name).toBe('Diamond');
  });
});

describe('AI Engine Behavior', () => {
  it('predicts counters in medium difficulty when player is repetitive', () => {
    const playerHistory: ('rock')[] = ['rock', 'rock', 'rock', 'rock'];
    let paperCount = 0;
    const trials = 100;
    for (let i = 0; i < trials; i++) {
      if (AiEngine.getMove('medium', playerHistory) === 'paper') {
        paperCount++;
      }
    }
    // Expected ~70% paper counters
    expect(paperCount).toBeGreaterThan(50);
  });

  it('detects Markov sequence transitions in hard difficulty', () => {
    // Sequence alternating rock -> scissors -> rock -> scissors
    const history: ('rock' | 'scissors')[] = ['rock', 'scissors', 'rock', 'scissors', 'rock'];
    // After rock, player always plays scissors. AI counter to scissors is rock!
    let rockCount = 0;
    const trials = 100;
    for (let i = 0; i < trials; i++) {
      if (AiEngine.getMove('hard', history) === 'rock') {
        rockCount++;
      }
    }
    // Hard AI should play rock to counter the predicted scissors with ~80% probability
    expect(rockCount).toBeGreaterThan(60);
  });
});
