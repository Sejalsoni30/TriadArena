import { UserMission, IUserMission } from '../models/Mission.js';

export class MissionService {
  /**
   * Generates or fetches the 3 daily missions for the player for today (UTC reset at 00:00).
   */
  static async getDailyMissions(userId: string): Promise<IUserMission[]> {
    const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC

    let missions = await UserMission.find({ userId, dateKey: todayKey });

    if (missions.length === 0) {
      const templates = [
        {
          missionId: 'win_matches',
          title: 'Triad Champion',
          description: 'Win 2 matches in any mode',
          targetCount: 2,
          xpReward: 150,
          coinsReward: 50
        },
        {
          missionId: 'play_rounds',
          title: 'Battle Hardened',
          description: 'Play 5 rounds of Rock, Paper, or Scissors',
          targetCount: 5,
          xpReward: 100,
          coinsReward: 40
        },
        {
          missionId: 'streak',
          title: 'Unstoppable Momentum',
          description: 'Achieve a 2-game win streak',
          targetCount: 2,
          xpReward: 200,
          coinsReward: 75
        }
      ];

      missions = await UserMission.insertMany(
        templates.map((t) => ({
          userId,
          dateKey: todayKey,
          ...t,
          currentCount: 0,
          completed: false,
          claimed: false
        }))
      );
    }

    return missions;
  }

  static async incrementProgress(userId: string, missionId: string, amount = 1): Promise<void> {
    const todayKey = new Date().toISOString().slice(0, 10);
    const mission = await UserMission.findOne({ userId, dateKey: todayKey, missionId });
    if (!mission || mission.completed) return;

    mission.currentCount += amount;
    if (mission.currentCount >= mission.targetCount) {
      mission.currentCount = mission.targetCount;
      mission.completed = true;
    }
    await mission.save();
  }
}
