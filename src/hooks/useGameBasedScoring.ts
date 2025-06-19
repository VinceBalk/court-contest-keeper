
import { useMemo } from 'react';
import { Player, Match } from '@/pages/Index';
import { usePlayerRoundStats, useBulkCreateOrUpdatePlayerRoundStats } from './usePlayerRoundStats';
import { useUpdatePlayer } from './usePlayers';

interface PlayerTournamentStats {
  playerId: string;
  totalGames: number;
  totalSpecials: number;
  totalMatches: number;
  roundStats: { [round: number]: { games: number; specials: number; matches: number } };
}

export const useGameBasedScoring = (
  players: Player[], 
  matches: Match[], 
  activeTournament: { id: string } | null,
  currentRound: number
) => {
  const { data: playerRoundStats = [] } = usePlayerRoundStats(activeTournament?.id);
  const bulkUpdateStats = useBulkCreateOrUpdatePlayerRoundStats();
  const updatePlayer = useUpdatePlayer();

  const calculatePlayerStats = useMemo(() => {
    if (!activeTournament) return {};

    const statsMap: { [playerId: string]: PlayerTournamentStats } = {};
    
    // Initialize stats for active players
    players.filter(p => p.isActive).forEach(player => {
      statsMap[player.id] = {
        playerId: player.id,
        totalGames: 0,
        totalSpecials: 0,
        totalMatches: 0,
        roundStats: {}
      };
    });

    // Calculate stats from matches
    matches
      .filter(match => match.tournamentId === activeTournament.id && match.completed)
      .forEach(match => {
        const round = match.round;
        
        // Process each team
        [match.team1, match.team2].forEach((team, teamIndex) => {
          const teamScore = teamIndex === 0 ? match.team1Score : match.team2Score;
          const teamSpecials = team.reduce((sum, playerId) => {
            const playerSpecials = match.specialPoints?.[playerId] || 0;
            return sum + (typeof playerSpecials === 'number' ? playerSpecials : 0);
          }, 0);

          team.forEach(playerId => {
            if (statsMap[playerId]) {
              // Initialize round stats if not exists
              if (!statsMap[playerId].roundStats[round]) {
                statsMap[playerId].roundStats[round] = { games: 0, specials: 0, matches: 0 };
              }

              // Add games (divided by team size for doubles)
              const gamesForPlayer = (typeof teamScore === 'number' ? teamScore : 0) / team.length;
              statsMap[playerId].roundStats[round].games += gamesForPlayer;
              statsMap[playerId].totalGames += gamesForPlayer;

              // Add specials for this player specifically
              const playerSpecials = match.specialPoints?.[playerId] || 0;
              const specials = typeof playerSpecials === 'number' ? playerSpecials : 0;
              statsMap[playerId].roundStats[round].specials += specials;
              statsMap[playerId].totalSpecials += specials;

              // Add match participation
              statsMap[playerId].roundStats[round].matches += 1;
              statsMap[playerId].totalMatches += 1;
            }
          });
        });
      });

    return statsMap;
  }, [players, matches, activeTournament]);

  const updateStatsToDatabase = async () => {
    if (!activeTournament) return;

    const statsToUpdate = [];
    
    Object.values(calculatePlayerStats).forEach(playerStats => {
      Object.entries(playerStats.roundStats).forEach(([round, stats]) => {
        statsToUpdate.push({
          player_id: playerStats.playerId,
          tournament_id: activeTournament.id,
          round: parseInt(round),
          games_won: Math.round(stats.games),
          specials_earned: stats.specials,
          matches_played: stats.matches
        });
      });
    });

    if (statsToUpdate.length > 0) {
      await bulkUpdateStats.mutateAsync(statsToUpdate);
    }
  };

  const getPlayerRanking = (group: 'top' | 'bottom') => {
    return players
      .filter(p => p.group === group && p.isActive)
      .map(player => {
        const stats = calculatePlayerStats[player.id];
        return {
          ...player,
          totalGames: stats?.totalGames || 0,
          totalSpecials: stats?.totalSpecials || 0,
          matchesPlayed: stats?.totalMatches || 0,
          // Calculate total points with games priority
          totalPoints: Math.round((stats?.totalGames || 0) * 3 + (stats?.totalSpecials || 0))
        };
      })
      .sort((a, b) => {
        // Primary: Games won (weighted 3x)
        const aGamePoints = a.totalGames * 3;
        const bGamePoints = b.totalGames * 3;
        if (aGamePoints !== bGamePoints) return bGamePoints - aGamePoints;
        
        // Secondary: Specials
        if (a.totalSpecials !== b.totalSpecials) return b.totalSpecials - a.totalSpecials;
        
        // Tertiary: Total points
        return b.totalPoints - a.totalPoints;
      });
  };

  const applyPromotionRelegation = async () => {
    const topRanking = getPlayerRanking('top');
    const bottomRanking = getPlayerRanking('bottom');
    
    const updatedPlayers = [...players];
    
    // Promotion: Winner of bottom group
    if (bottomRanking.length > 0) {
      const promotedPlayer = bottomRanking[0];
      const playerIndex = updatedPlayers.findIndex(p => p.id === promotedPlayer.id);
      if (playerIndex !== -1) {
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          group: 'top',
          overallStats: {
            ...updatedPlayers[playerIndex].overallStats,
            totalPoints: updatedPlayers[playerIndex].overallStats.totalPoints + promotedPlayer.totalPoints
          }
        };
        
        // Update career promotions
        await updatePlayer.mutateAsync({
          ...updatedPlayers[playerIndex],
          career_promotions: (updatedPlayers[playerIndex].career_promotions || 0) + 1
        });
      }
    }
    
    // Relegation: Last place in top group
    if (topRanking.length > 0) {
      const relegatedPlayer = topRanking[topRanking.length - 1];
      const playerIndex = updatedPlayers.findIndex(p => p.id === relegatedPlayer.id);
      if (playerIndex !== -1) {
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          group: 'bottom',
          overallStats: {
            ...updatedPlayers[playerIndex].overallStats,
            totalPoints: updatedPlayers[playerIndex].overallStats.totalPoints + relegatedPlayer.totalPoints
          }
        };
        
        // Update career relegations
        await updatePlayer.mutateAsync({
          ...updatedPlayers[playerIndex],
          career_relegations: (updatedPlayers[playerIndex].career_relegations || 0) + 1
        });
      }
    }
    
    return updatedPlayers;
  };

  return {
    calculatePlayerStats,
    updateStatsToDatabase,
    getPlayerRanking,
    applyPromotionRelegation,
    playerRoundStats,
    isUpdating: bulkUpdateStats.isPending
  };
};
