
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PlayerRoundStats {
  id: string;
  player_id: string;
  tournament_id: string;
  round: number;
  games_won: number;
  specials_earned: number;
  matches_played: number;
  created_at: string;
  updated_at: string;
}

export const usePlayerRoundStats = (tournamentId?: string, round?: number) => {
  return useQuery({
    queryKey: ['player_round_stats', tournamentId, round],
    queryFn: async () => {
      let query = supabase
        .from('player_round_stats')
        .select('*')
        .order('games_won', { ascending: false });
      
      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId);
      }
      
      if (round) {
        query = query.eq('round', round);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as PlayerRoundStats[];
    },
    enabled: !!tournamentId,
  });
};

export const useCreateOrUpdatePlayerRoundStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (stats: {
      player_id: string;
      tournament_id: string;
      round: number;
      games_won: number;
      specials_earned: number;
      matches_played: number;
    }) => {
      const { data, error } = await supabase
        .from('player_round_stats')
        .upsert(stats, {
          onConflict: 'player_id,tournament_id,round'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player_round_stats'] });
    },
  });
};

export const useBulkCreateOrUpdatePlayerRoundStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (statsArray: {
      player_id: string;
      tournament_id: string;
      round: number;
      games_won: number;
      specials_earned: number;
      matches_played: number;
    }[]) => {
      const { data, error } = await supabase
        .from('player_round_stats')
        .upsert(statsArray, {
          onConflict: 'player_id,tournament_id,round'
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player_round_stats'] });
    },
  });
};
