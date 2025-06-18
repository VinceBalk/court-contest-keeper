
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tournament } from '@/pages/Index';

export const useTournaments = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(tournament => ({
        id: tournament.id,
        name: tournament.name,
        description: tournament.description || '',
        status: tournament.status as 'draft' | 'active' | 'completed' | 'cancelled',
        startDate: tournament.start_date,
        endDate: tournament.end_date,
        maxPlayers: tournament.max_players || 16,
        currentRound: tournament.current_round || 1,
        totalRounds: tournament.total_rounds || 3,
      })) as Tournament[];
    },
  });
};

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tournament: Omit<Tournament, 'id'>) => {
      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          name: tournament.name,
          description: tournament.description,
          status: tournament.status,
          start_date: tournament.startDate,
          end_date: tournament.endDate,
          max_players: tournament.maxPlayers,
          current_round: tournament.currentRound,
          total_rounds: tournament.totalRounds,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...tournament }: Tournament) => {
      const { data, error } = await supabase
        .from('tournaments')
        .update({
          name: tournament.name,
          description: tournament.description,
          status: tournament.status,
          start_date: tournament.startDate,
          end_date: tournament.endDate,
          max_players: tournament.maxPlayers,
          current_round: tournament.currentRound,
          total_rounds: tournament.totalRounds,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};
