import { RANKS } from './constants.js';

export interface EloResult {
  newRatingA: number;
  newRatingB: number;
  deltaA: number;
  deltaB: number;
}

/**
 * Calculates new Elo ratings for two players given their current rating and outcome.
 * K-factor is adjusted dynamically:
 * - 32 for provisional players (<30 matches)
 * - 24 for ratings < 1600
 * - 16 for elite players (>= 1600)
 */
export function calculateElo(
  ratingA: number,
  ratingB: number,
  scoreA: 1 | 0.5 | 0, // 1 for A wins, 0 for B wins, 0.5 for draw
  matchesPlayedA = 20,
  matchesPlayedB = 20
): EloResult {
  const getKFactor = (rating: number, matches: number) => {
    if (matches < 30) return 32;
    if (rating < 1600) return 24;
    return 16;
  };

  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;

  const scoreB = 1 - scoreA;

  const kA = getKFactor(ratingA, matchesPlayedA);
  const kB = getKFactor(ratingB, matchesPlayedB);

  const deltaA = Math.round(kA * (scoreA - expectedA));
  const deltaB = Math.round(kB * (scoreB - expectedB));

  const newRatingA = Math.max(100, ratingA + deltaA);
  const newRatingB = Math.max(100, ratingB + deltaB);

  return { newRatingA, newRatingB, deltaA, deltaB };
}

/**
 * Single source of truth for XP required to reach Level L.
 * Formula: Floor(100 * (level ^ 1.5))
 */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

/**
 * Returns the player's level given their total cumulative XP.
 */
export function getLevelFromXp(totalXp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  let level = 1;
  while (getXpForLevel(level + 1) <= totalXp) {
    level++;
  }

  const currentThreshold = getXpForLevel(level);
  const nextThreshold = getXpForLevel(level + 1);
  const xpIntoCurrent = totalXp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const progressPercent = xpNeeded > 0 ? Math.min(100, Math.floor((xpIntoCurrent / xpNeeded) * 100)) : 100;

  return {
    level,
    currentLevelXp: xpIntoCurrent,
    nextLevelXp: xpNeeded,
    progressPercent
  };
}

/**
 * Finds the rank bracket for a given Elo rating.
 */
export function getRankTier(rating: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (rating >= RANKS[i].minRating) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}
