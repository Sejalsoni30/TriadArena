import { User } from '../models/User.js';
import { Tournament } from '../models/Tournament.js';
import { connectDatabase, disconnectDatabase, isDbConnected } from '../config/db.js';

async function seed() {
  console.log('--- Triad Arena Database Seeder ---');
  await connectDatabase();

  if (!isDbConnected()) {
    console.log('[Notice] Database offline or unavailable. Seed script requires active MongoDB connection.');
    console.log('[Notice] Sample data is automatically served in-memory when database is offline.');
    return;
  }

  // Clear existing sample data
  await User.deleteMany({ email: { $regex: /@sample\.triad\.io$/ } });
  await Tournament.deleteMany({ title: { $regex: /\[Sample\]/ } });

  console.log('Seeding Sample Gladiators (clearly labelled)...');
  const sampleUsers = [
    {
      firebaseUid: 'sample_uid_1',
      username: 'VortexZero',
      email: 'vortex@sample.triad.io',
      role: 'player',
      rating: 2150,
      peakRating: 2150,
      level: 42,
      xp: 26000,
      coins: 5400,
      stats: { totalMatches: 182, wins: 142, losses: 40, draws: 0, currentStreak: 5, bestStreak: 14, soloWins: 42, multiplayerWins: 100, tournamentWins: 3 }
    },
    {
      firebaseUid: 'sample_uid_2',
      username: 'CyberKage',
      email: 'kage@sample.triad.io',
      role: 'player',
      rating: 2085,
      peakRating: 2100,
      level: 38,
      xp: 22500,
      coins: 4100,
      stats: { totalMatches: 160, wins: 120, losses: 40, draws: 0, currentStreak: 2, bestStreak: 9, soloWins: 30, multiplayerWins: 90, tournamentWins: 2 }
    },
    {
      firebaseUid: 'sample_uid_3',
      username: 'NeonPulse',
      email: 'neon@sample.triad.io',
      role: 'player',
      rating: 1990,
      peakRating: 1990,
      level: 35,
      xp: 19800,
      coins: 3500,
      stats: { totalMatches: 138, wins: 98, losses: 40, draws: 0, currentStreak: 3, bestStreak: 8, soloWins: 25, multiplayerWins: 73, tournamentWins: 1 }
    }
  ];

  await User.insertMany(sampleUsers);
  console.log(`Seeded ${sampleUsers.length} sample users successfully.`);

  console.log('Seeding Sample Tournaments...');
  await Tournament.create({
    title: '[Sample] Neon Blitz Championship',
    description: 'Weekly competitive bracket showcase.',
    organizerId: 'sample_uid_1',
    status: 'registration_open',
    maxParticipants: 8,
    bestOf: 3,
    prizePoolVirtual: 5000,
    participants: [
      { userId: 'sample_uid_1', username: 'VortexZero', seed: 1, eliminated: false },
      { userId: 'sample_uid_2', username: 'CyberKage', seed: 2, eliminated: false }
    ]
  });

  console.log('Seed completed successfully. All test/seed entries clearly labelled with [Sample] or @sample.triad.io');
  await disconnectDatabase();
}

seed().catch(console.error);
