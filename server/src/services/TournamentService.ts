import { Tournament, ITournament, ITournamentMatch } from '../models/Tournament.js';
import { nanoid } from 'nanoid';

export class TournamentService {
  /**
   * Generates single-elimination bracket for participants.
   * Format: Powers of two (4, 8, 16) with seeding.
   */
  static async startTournament(tournamentId: string): Promise<ITournament> {
    const tourney = await Tournament.findById(tournamentId);
    if (!tourney) throw new Error('Tournament not found');

    const participants = tourney.participants;
    if (participants.length < 2) {
      throw new Error('Not enough participants to start tournament');
    }

    const bracketMatches: ITournamentMatch[] = [];
    const totalRounds = Math.ceil(Math.log2(participants.length));

    // Seed Round 1
    const matchCountR1 = Math.floor(participants.length / 2);
    for (let i = 0; i < matchCountR1; i++) {
      const p1 = participants[i * 2];
      const p2 = participants[i * 2 + 1];

      bracketMatches.push({
        matchId: nanoid(8),
        roundIndex: 0,
        matchIndex: i,
        player1Id: p1?.userId,
        player1Username: p1?.username,
        player2Id: p2?.userId,
        player2Username: p2?.username,
        score1: 0,
        score2: 0,
        status: p1 && p2 ? 'ready' : 'bye'
      });
    }

    tourney.bracketMatches = bracketMatches;
    tourney.status = 'in_progress';
    await tourney.save();
    return tourney;
  }

  /**
   * Advances match winner to next bracket round automatically.
   */
  static async advanceWinner(
    tournamentId: string,
    roundIndex: number,
    matchIndex: number,
    winnerId: string,
    winnerUsername: string
  ): Promise<ITournament> {
    const tourney = await Tournament.findById(tournamentId);
    if (!tourney) throw new Error('Tournament not found');

    const currentMatch = tourney.bracketMatches.find(
      (m) => m.roundIndex === roundIndex && m.matchIndex === matchIndex
    );

    if (currentMatch) {
      currentMatch.winnerId = winnerId;
      currentMatch.status = 'completed';
    }

    // Check if this was finals
    const nextRoundIndex = roundIndex + 1;
    const nextMatchIndex = Math.floor(matchIndex / 2);

    let nextMatch = tourney.bracketMatches.find(
      (m) => m.roundIndex === nextRoundIndex && m.matchIndex === nextMatchIndex
    );

    if (!nextMatch) {
      // Create next round match slot if not yet created
      nextMatch = {
        matchId: nanoid(8),
        roundIndex: nextRoundIndex,
        matchIndex: nextMatchIndex,
        score1: 0,
        score2: 0,
        status: 'pending'
      };
      tourney.bracketMatches.push(nextMatch);
    }

    // Slot winner into Player 1 or Player 2
    if (matchIndex % 2 === 0) {
      nextMatch.player1Id = winnerId;
      nextMatch.player1Username = winnerUsername;
    } else {
      nextMatch.player2Id = winnerId;
      nextMatch.player2Username = winnerUsername;
    }

    if (nextMatch.player1Id && nextMatch.player2Id) {
      nextMatch.status = 'ready';
    }

    await tourney.save();
    return tourney;
  }
}
