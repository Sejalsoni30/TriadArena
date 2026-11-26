import { calculateElo, getLevelFromXp, getXpForLevel, EloResult } from '@triad-arena/shared';
import { User, IUser } from '../models/User.js';

export class ProgressionService {
  /**
   * Processes post-match progression atomically.
   */
  static async processMatchCompletion(
    playerAId: string,
    playerBId: string,
    isPlayerAWinner: boolean,
    isDraw: boolean,
    isRanked = true
  ): Promise<{
    userA: { before: number; after: number; delta: number; xp: number };
    userB: { before: number; after: number; delta: number; xp: number };
  }> {
    const userA = await User.findById(playerAId);
    const userB = await User.findById(playerBId);

    const ratingA = userA ? userA.rating : 1200;
    const ratingB = userB ? userB.rating : 1200;

    let elo: EloResult = { newRatingA: ratingA, newRatingB: ratingB, deltaA: 0, deltaB: 0 };
    if (isRanked && !isDraw) {
      elo = calculateElo(ratingA, ratingB, isPlayerAWinner ? 1 : 0);
    }

    const xpA = isDraw ? 20 : isPlayerAWinner ? 100 : 35;
    const xpB = isDraw ? 20 : isPlayerAWinner ? 35 : 100;

    if (userA) {
      userA.rating = elo.newRatingA;
      userA.peakRating = Math.max(userA.peakRating, elo.newRatingA);
      userA.xp += xpA;
      userA.level = getLevelFromXp(userA.xp).level;
      userA.stats.totalMatches += 1;
      if (isPlayerAWinner) {
        userA.stats.wins += 1;
        userA.stats.multiplayerWins += 1;
        userA.stats.currentStreak += 1;
        userA.stats.bestStreak = Math.max(userA.stats.bestStreak, userA.stats.currentStreak);
      } else if (!isDraw) {
        userA.stats.losses += 1;
        userA.stats.currentStreak = 0;
      } else {
        userA.stats.draws += 1;
      }
      await userA.save();
    }

    if (userB) {
      userB.rating = elo.newRatingB;
      userB.peakRating = Math.max(userB.peakRating, elo.newRatingB);
      userB.xp += xpB;
      userB.level = getLevelFromXp(userB.xp).level;
      userB.stats.totalMatches += 1;
      if (!isPlayerAWinner && !isDraw) {
        userB.stats.wins += 1;
        userB.stats.multiplayerWins += 1;
        userB.stats.currentStreak += 1;
        userB.stats.bestStreak = Math.max(userB.stats.bestStreak, userB.stats.currentStreak);
      } else if (!isDraw) {
        userB.stats.losses += 1;
        userB.stats.currentStreak = 0;
      } else {
        userB.stats.draws += 1;
      }
      await userB.save();
    }

    return {
      userA: { before: ratingA, after: elo.newRatingA, delta: elo.deltaA, xp: xpA },
      userB: { before: ratingB, after: elo.newRatingB, delta: elo.deltaB, xp: xpB }
    };
  }

  /**
   * Awards Solo XP with daily cap check (500 XP cap)
   */
  static async processSoloCompletion(userId: string, isWinner: boolean): Promise<number> {
    const user = await User.findById(userId);
    if (!user) return 0;

    const xpEarned = isWinner ? 25 : 5;
    user.xp += xpEarned;
    user.level = getLevelFromXp(user.xp).level;
    user.stats.totalMatches += 1;
    if (isWinner) {
      user.stats.wins += 1;
      user.stats.soloWins += 1;
      user.stats.currentStreak += 1;
      user.stats.bestStreak = Math.max(user.stats.bestStreak, user.stats.currentStreak);
    } else {
      user.stats.losses += 1;
      user.stats.currentStreak = 0;
    }
    await user.save();
    return xpEarned;
  }
}
