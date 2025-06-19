
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CourtSetting {
  id: string;
  tournament_id: string;
  court_number: number;
  court_name: string;
  created_at: string;
  updated_at: string;
}

export const useCourtSettings = (tournamentId: string) => {
  return useQuery({
    queryKey: ['court-settings', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournament_court_settings')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('court_number');
      
      if (error) throw error;
      return data as CourtSetting[];
    },
    enabled: !!tournamentId,
  });
};

export const useUpdateCourtSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, court_name }: { id: string; court_name: string }) => {
      const { data, error } = await supabase
        .from('tournament_court_settings')
        .update({ court_name })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['court-settings', data.tournament_id] });
    },
  });
};

export const useCreateCourtSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tournamentId: string) => {
      const courtSettings = Array.from({ length: 4 }, (_, i) => ({
        tournament_id: tournamentId,
        court_number: i + 1,
        court_name: `Court ${i + 1}`,
      }));

      const { data, error } = await supabase
        .from('tournament_court_settings')
        .insert(courtSettings)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data && data.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['court-settings', data[0].tournament_id] });
      }
    },
  });
};
