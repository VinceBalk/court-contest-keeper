
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/pages/Index';

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data.map(player => ({
        id: player.id,
        name: player.name,
        email: player.email || '',
        phone: player.phone || '',
        skillLevel: player.skill_level || 5,
        isActive: player.status === 'active',
        group: player.player_group as 'top' | 'bottom',
        totalGames: 0, // Tournament-specific stats, managed in app
        totalSpecials: 0,
        totalPoints: 0,
        matchesPlayed: 0,
        career_promotions: player.career_promotions || 0,
        career_relegations: player.career_relegations || 0,
        overallStats: {
          totalPoints: player.ranking_points || 0,
          totalGames: (player.total_games_won || 0) + (player.total_games_lost || 0),
          totalSpecials: 0, // Will be calculated from match statistics
          matchesPlayed: player.total_matches_played || 0,
          tournamentsPlayed: 0, // Will be calculated from tournament_players
        },
      })) as Player[];
    },
  });
};

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (player: Omit<Player, 'id' | 'overallStats'>) => {
      const { data, error } = await supabase
        .from('players')
        .insert({
          name: player.name,
          email: player.email || null,
          phone: player.phone || null,
          skill_level: player.skillLevel,
          status: player.isActive ? 'active' : 'inactive',
          player_group: player.group,
          career_promotions: 0,
          career_relegations: 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (player: Player) => {
      const { data, error } = await supabase
        .from('players')
        .update({
          name: player.name,
          email: player.email || null,
          phone: player.phone || null,
          skill_level: player.skillLevel,
          status: player.isActive ? 'active' : 'inactive',
          player_group: player.group,
          ranking_points: player.overallStats.totalPoints,
          total_matches_played: player.overallStats.matchesPlayed,
          total_games_won: Math.floor(player.overallStats.totalGames / 2), // Rough estimate
          total_games_lost: Math.floor(player.overallStats.totalGames / 2),
          career_promotions: player.career_promotions || 0,
          career_relegations: player.career_relegations || 0,
        })
        .eq('id', player.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (playerId: string) => {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};
