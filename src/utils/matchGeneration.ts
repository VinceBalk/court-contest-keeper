
import { Player, Match, Tournament } from "@/pages/Index";

const getMatchNumber = (matchIndex: number, round: number) => {
  // Each court gets 3 matches: matches 1-3 for round 1, 4-6 for round 2, etc.
  return (matchIndex % 3) + 1 + ((round - 1) * 3);
};

// Helper function to calculate player points from previous rounds
const calculatePlayerPoints = (playerId: string, matches: Match[]): number => {
  let totalPoints = 0;
  
  matches.forEach(match => {
    if (match.completed && (match.team1.includes(playerId) || match.team2.includes(playerId))) {
      // Base score points
      if (match.team1.includes(playerId)) {
        totalPoints += match.team1Score || 0;
      } else {
        totalPoints += match.team2Score || 0;
      }
      
      // Special points
      const specialPoints = match.specialPoints?.[playerId] || 0;
      totalPoints += typeof specialPoints === 'number' ? specialPoints : 0;
    }
  });
  
  return totalPoints;
};

export const generateFinalRoundMatches = (
  group: 'top' | 'bottom', 
  round: number, 
  players: Player[], 
  activeTournament: Tournament,
  previousMatches: Match[] = []
): Match[] => {
  const groupPlayers = players.filter(p => p.group === group && p.isActive);
  if (groupPlayers.length !== 8) {
    throw new Error(`${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} needs exactly 8 players to generate matches`);
  }

  // Calculate points for each player from previous rounds
  const playersWithPoints = groupPlayers.map(player => ({
    ...player,
    calculatedPoints: calculatePlayerPoints(player.id, previousMatches)
  }));

  // Sort players by calculated points (descending) to rank them
  const rankedPlayers = playersWithPoints.sort((a, b) => b.calculatedPoints - a.calculatedPoints);
  
  const newMatches: Match[] = [];

  if (round === 3) {
    // Round 3: Top 4 vs Top 4, Bottom 4 vs Bottom 4 randomly
    const top4 = rankedPlayers.slice(0, 4);
    const bottom4 = rankedPlayers.slice(4, 8);
    
    // Shuffle each group for random pairings
    const shuffledTop4 = [...top4].sort(() => Math.random() - 0.5);
    const shuffledBottom4 = [...bottom4].sort(() => Math.random() - 0.5);
    
    const pairings = [
      // Court 1 (or 3 for bottom) - 3 matches with top 4 players
      {
        team1: [shuffledTop4[0], shuffledTop4[1]],
        team2: [shuffledTop4[2], shuffledTop4[3]]
      },
      {
        team1: [shuffledTop4[0], shuffledTop4[2]],
        team2: [shuffledTop4[1], shuffledTop4[3]]
      },
      {
        team1: [shuffledTop4[0], shuffledTop4[3]],
        team2: [shuffledTop4[1], shuffledTop4[2]]
      },
      // Court 2 (or 4 for bottom) - 3 matches with bottom 4 players
      {
        team1: [shuffledBottom4[0], shuffledBottom4[1]],
        team2: [shuffledBottom4[2], shuffledBottom4[3]]
      },
      {
        team1: [shuffledBottom4[0], shuffledBottom4[2]],
        team2: [shuffledBottom4[1], shuffledBottom4[3]]
      },
      {
        team1: [shuffledBottom4[0], shuffledBottom4[3]],
        team2: [shuffledBottom4[1], shuffledBottom4[2]]
      }
    ];

    pairings.forEach((pairing, matchIndex) => {
      const baseCourt = Math.floor(matchIndex / 3) + 1;
      const court = group === 'top' ? baseCourt : baseCourt + 2;
      
      newMatches.push({
        id: `match-${group}-${round}-${matchIndex}`,
        tournamentId: activeTournament.id,
        round,
        group,
        court,
        team1: [pairing.team1[0].id, pairing.team1[1].id],
        team2: [pairing.team2[0].id, pairing.team2[1].id],
        team1Score: 0,
        team2Score: 0,
        specialPoints: {},
        completed: false
      });
    });
  } else {
    // Round 2: Create balanced pairings based on round 1 rankings
    const pairings = [
      // Court 1 (or 3 for bottom) - 3 matches
      {
        team1: [rankedPlayers[0], rankedPlayers[7]], // 1st & 8th
        team2: [rankedPlayers[3], rankedPlayers[4]]  // 4th & 5th
      },
      {
        team1: [rankedPlayers[1], rankedPlayers[6]], // 2nd & 7th
        team2: [rankedPlayers[2], rankedPlayers[5]]  // 3rd & 6th
      },
      {
        team1: [rankedPlayers[0], rankedPlayers[5]], // 1st & 6th
        team2: [rankedPlayers[1], rankedPlayers[4]]  // 2nd & 5th
      },
      // Court 2 (or 4 for bottom) - 3 matches
      {
        team1: [rankedPlayers[0], rankedPlayers[6]], // 1st & 7th
        team2: [rankedPlayers[2], rankedPlayers[4]]  // 3rd & 5th
      },
      {
        team1: [rankedPlayers[1], rankedPlayers[7]], // 2nd & 8th
        team2: [rankedPlayers[3], rankedPlayers[5]]  // 4th & 6th
      },
      {
        team1: [rankedPlayers[2], rankedPlayers[7]], // 3rd & 8th
        team2: [rankedPlayers[3], rankedPlayers[6]]  // 4th & 7th
      }
    ];

    pairings.forEach((pairing, matchIndex) => {
      const baseCourt = Math.floor(matchIndex / 3) + 1;
      const court = group === 'top' ? baseCourt : baseCourt + 2;
      
      newMatches.push({
        id: `match-${group}-${round}-${matchIndex}`,
        tournamentId: activeTournament.id,
        round,
        group,
        court,
        team1: [pairing.team1[0].id, pairing.team1[1].id],
        team2: [pairing.team2[0].id, pairing.team2[1].id],
        team1Score: 0,
        team2Score: 0,
        specialPoints: {},
        completed: false
      });
    });
  }

  return newMatches;
};

export const generateRandomMatches = (
  group: 'top' | 'bottom', 
  round: number, 
  players: Player[], 
  activeTournament: Tournament
): Match[] => {
  const groupPlayers = players.filter(p => p.group === group && p.isActive);
  if (groupPlayers.length !== 8) {
    throw new Error(`${group === 'top' ? 'Linker Rijtje' : 'Rechter Rijtje'} needs exactly 8 players to generate matches`);
  }

  // Shuffle players for random pairings
  const shuffled = [...groupPlayers].sort(() => Math.random() - 0.5);
  const newMatches: Match[] = [];

  // Generate 6 matches per group (3 per court)
  for (let matchIndex = 0; matchIndex < 6; matchIndex++) {
    // Determine court: first 3 matches on court 1, next 3 on court 2
    const baseCourt = Math.floor(matchIndex / 3) + 1; // 1 or 2
    // For top group: courts 1-2, for bottom group: courts 3-4
    const court = group === 'top' ? baseCourt : baseCourt + 2;
    const matchNumber = getMatchNumber(matchIndex, round);
    
    // Create teams for this match with better distribution
    const team1Player1 = shuffled[(matchIndex * 2) % shuffled.length];
    const team1Player2 = shuffled[(matchIndex * 2 + 1) % shuffled.length];
    const team2Player1 = shuffled[(matchIndex * 2 + 2) % shuffled.length];
    const team2Player2 = shuffled[(matchIndex * 2 + 3) % shuffled.length];
    
    newMatches.push({
      id: `match-${group}-${round}-${matchIndex}`,
      tournamentId: activeTournament.id,
      round,
      group,
      court,
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

  // Validate that all player IDs are provided
  for (let i = 0; i < manualPairings.length; i++) {
    const pairing = manualPairings[i];
    if (!pairing.team1[0] || !pairing.team1[1] || !pairing.team2[0] || !pairing.team2[1]) {
      throw new Error(`Match ${i + 1} is incomplete. Please select all players.`);
    }
  }

  const newMatches: Match[] = [];

  manualPairings.forEach((pairing, matchIndex) => {
    // Determine court: first 3 matches on court 1, next 3 on court 2
    const baseCourt = Math.floor(matchIndex / 3) + 1; // 1 or 2
    // For top group: courts 1-2, for bottom group: courts 3-4
    const court = group === 'top' ? baseCourt : baseCourt + 2;
    const matchNumber = getMatchNumber(matchIndex, round);
    
    newMatches.push({
      id: `match-${group}-${round}-${matchIndex}`,
      tournamentId: activeTournament.id,
      round,
      group,
      court,
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
