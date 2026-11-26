import { UserAchievement } from '../models/Achievement.js';
import { User, IUser } from '../models/User.js';

export class AchievementService {
  /**
   * Checks conditions and awards any newly unlocked achievements.
   */
  static async evaluateAchievements(userId: string): Promise<string[]> {
    const user = await User.findById(userId);
    if (!user) return [];

    const existing = await UserAchievement.find({ userId }).select('achievementCode');
    const unlockedCodes = new Set(existing.map((e) => e.achievementCode));

    const newlyUnlocked: string[] = [];

    const checkAndAward = async (code: string, condition: boolean) => {
      if (condition && !unlockedCodes.has(code)) {
        await UserAchievement.create({ userId, achievementCode: code });
        newlyUnlocked.push(code);
      }
    };

    // First Win
    await checkAndAward('first_blood', user.stats.wins >= 1);

    // Progression Level 5 & 20
    await checkAndAward('triad_apprentice', user.level >= 5);
    await checkAndAward('triad_master', user.level >= 20);

    // Streaks
    await checkAndAward('hot_streak', user.stats.bestStreak >= 3);
    await checkAndAward('unstoppable', user.stats.bestStreak >= 10);

    // Century Club (100 matches)
    await checkAndAward('century_club', user.stats.totalMatches >= 100);

    // Solo Master
    await checkAndAward('mind_reader', user.stats.soloWins >= 5);

    return newlyUnlocked;
  }
}
