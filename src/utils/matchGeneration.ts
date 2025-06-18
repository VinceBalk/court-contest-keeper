
import { Player, Match, Tournament } from "@/pages/Index";

const getMatchNumber = (matchIndex: number, round: number) => {
  // Round 1: matches 1-3 per court, Round 2: matches 4-6 per court, etc.
  return (matchIndex % 3) + 1 + ((round - 1) * 3);
};

export const generateFinalRoundMatches = (
  group: 'top' | 'bottom', 
  round: number, 
  players: Player[], 
  activeTournament: Tournament
): Match[] => {
  const groupPlayers = players.filter(p => p.group === group);
  if (groupPlayers.length !== 8) {
    throw new Error(`${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} needs exactly 8 players to generate matches`);
  }

  // Sort players by total points (descending) to rank them
  const rankedPlayers = [...groupPlayers].sort((a, b) => b.totalPoints - a.totalPoints);
  
  const newMatches: Match[] = [];

  // Create balanced pairings based on rankings
  const pairings = [
    // Court 1 matches
    {
      team1: [rankedPlayers[0], rankedPlayers[7]], // 1st & 8th
      team2: [rankedPlayers[3], rankedPlayers[4]]  // 4th & 5th
    },
    {
      team1: [rankedPlayers[1], rankedPlayers[6]], // 2nd & 7th
      team2: [rankedPlayers[2], rankedPlayers[5]]  // 3rd & 6th
    },
    // Court 2 matches - create different combinations for variety
    {
      team1: [rankedPlayers[0], rankedPlayers[6]], // 1st & 7th
      team2: [rankedPlayers[2], rankedPlayers[4]]  // 3rd & 5th
    },
    {
      team1: [rankedPlayers[1], rankedPlayers[7]], // 2nd & 8th
      team2: [rankedPlayers[3], rankedPlayers[5]]  // 4th & 6th
    },
    // Additional matches to ensure all combinations
    {
      team1: [rankedPlayers[0], rankedPlayers[5]], // 1st & 6th
      team2: [rankedPlayers[1], rankedPlayers[4]]  // 2nd & 5th
    },
    {
      team1: [rankedPlayers[2], rankedPlayers[7]], // 3rd & 8th
      team2: [rankedPlayers[3], rankedPlayers[6]]  // 4th & 7th
    }
  ];

  pairings.forEach((pairing, matchIndex) => {
    const court = Math.floor(matchIndex / 3) + 1;
    const matchNumber = getMatchNumber(matchIndex, round);
    
    newMatches.push({
      id: `match-${group}-${round}-${matchIndex}`,
      tournamentId: activeTournament.id,
      round,
      group, // This was already correct
      court: group === 'top' ? court : court + 2,
      team1: [pairing.team1[0].id, pairing.team1[1].id],
      team2: [pairing.team2[0].id, pairing.team2[1].id],
      team1Score: 0,
      team2Score: 0,
      specialPoints: {},
      completed: false
    });
  });

  return newMatches;
};

export const generateRandomMatches = (
  group: 'top' | 'bottom', 
  round: number, 
  players: Player[], 
  activeTournament: Tournament
): Match[] => {
  const groupPlayers = players.filter(p => p.group === group);
  if (groupPlayers.length !== 8) {
    throw new Error(`${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} needs exactly 8 players to generate matches`);
  }

  // Shuffle players for random pairings
  const shuffled = [...groupPlayers].sort(() => Math.random() - 0.5);
  const newMatches: Match[] = [];

  // Generate 6 matches per group (3 courts x 2 matches per court)
  for (let matchIndex = 0; matchIndex < 6; matchIndex++) {
    const court = Math.floor(matchIndex / 3) + 1; // Court 1 or 2 for each group
    const matchNumber = getMatchNumber(matchIndex, round);
    
    // Create teams for this match
    const team1Player1 = shuffled[matchIndex * 2 % shuffled.length];
    const team1Player2 = shuffled[(matchIndex * 2 + 1) % shuffled.length];
    const team2Player1 = shuffled[(matchIndex * 2 + 2) % shuffled.length];
    const team2Player2 = shuffled[(matchIndex * 2 + 3) % shuffled.length];
    
    newMatches.push({
      id: `match-${group}-${round}-${matchIndex}`,
      tournamentId: activeTournament.id,
      round,
      group, // Fixed: Now properly assigns the group parameter
      court: group === 'top' ? court : court + 2, // Bottom group uses courts 3-4
      team1: [team1Player1.id, team1Player2.id],
      team2: [team2Player1.id, team2Player2.id],
      team1Score: 0,
      team2Score: 0,
      specialPoints: {},
      completed: false
    });
  }

  return newMatches;
};

export const generateManualMatches = (
  group: 'top' | 'bottom', 
  round: number, 
  manualPairings: { team1: [string, string], team2: [string, string] }[], 
  activeTournament: Tournament
): Match[] => {
  if (manualPairings.length !== 6) {
    throw new Error(`Please set up all 6 matches for ${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'}`);
  }

  const newMatches: Match[] = [];

  manualPairings.forEach((pairing, matchIndex) => {
    const court = Math.floor(matchIndex / 3) + 1;
    const matchNumber = getMatchNumber(matchIndex, round);
    
    newMatches.push({
      id: `match-${group}-${round}-${matchIndex}`,
      tournamentId: activeTournament.id,
      round,
      group, // Fixed: Now properly assigns the group parameter
      court: group === 'top' ? court : court + 2,
      team1: pairing.team1,
      team2: pairing.team2,
      team1Score: 0,
      team2Score: 0,
      specialPoints: {},
      completed: false
    });
  });

  return newMatches;
};
