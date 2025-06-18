
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/pages/Index';

interface ScoreData {
  team1_score?: number;
  team2_score?: number;
  special_points?: { [playerId: string]: number };
}

export const useMatches = (tournamentId?: string) => {
  return useQuery({
    queryKey: ['matches', tournamentId],
    queryFn: async () => {
      let query = supabase
        .from('matches')
        .select('*')
        .order('round')
        .order('match_number');
      
      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(match => {
        const scoreData = match.score as ScoreData || {};
        
        return {
          id: match.id,
          court: match.court_number || 1,
          team1: [match.player1_id, match.player1_partner_id].filter(Boolean) as string[],
          team2: [match.player2_id, match.player2_partner_id].filter(Boolean) as string[],
          team1Score: scoreData.team1_score || 0,
          team2Score: scoreData.team2_score || 0,
          completed: match.status === 'completed',
          round: match.round,
          group: 'top' as 'top' | 'bottom', // Default group, should be managed in app logic
          tournamentId: match.tournament_id,
          specialPoints: scoreData.special_points || {},
          winnerId: match.winner_team === 1 ? (match.player1_id || '') : 
                   match.winner_team === 2 ? (match.player2_id || '') : undefined,
        } as Match;
      });
    },
    enabled: !!tournamentId || tournamentId === undefined,
  });
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (match: Omit<Match, 'id'> & { tournamentId: string }) => {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          tournament_id: match.tournamentId,
          round: match.round,
          match_number: parseInt(match.court.toString()) || 1,
          court_number: match.court,
          player1_id: match.team1[0] || null,
          player1_partner_id: match.team1[1] || null,
          player2_id: match.team2[0] || null,
          player2_partner_id: match.team2[1] || null,
          status: match.completed ? 'completed' : 'pending',
          score: {
            team1_score: match.team1Score,
            team2_score: match.team2Score,
            special_points: match.specialPoints,
          },
          winner_team: match.winnerId ? 
            (match.team1.includes(match.winnerId) ? 1 : 2) : null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};

export const useCreateMultipleMatches = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (matches: (Omit<Match, 'id'> & { tournamentId: string })[]) => {
      const matchData = matches.map(match => ({
        tournament_id: match.tournamentId,
        round: match.round,
        match_number: parseInt(match.court.toString()) || 1,
        court_number: match.court,
        player1_id: match.team1[0] || null,
        player1_partner_id: match.team1[1] || null,
        player2_id: match.team2[0] || null,
        player2_partner_id: match.team2[1] || null,
        status: match.completed ? 'completed' : 'pending',
        score: {
          team1_score: match.team1Score,
          team2_score: match.team2Score,
          special_points: match.specialPoints,
        },
        winner_team: match.winnerId ? 
          (match.team1.includes(match.winnerId) ? 1 : 2) : null,
      }));

      const { data, error } = await supabase
        .from('matches')
        .insert(matchData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (match: Match & { tournamentId: string }) => {
      const { data, error } = await supabase
        .from('matches')
        .update({
          court_number: match.court,
          status: match.completed ? 'completed' : 'pending',
          score: {
            team1_score: match.team1Score,
            team2_score: match.team2Score,
            special_points: match.specialPoints,
          },
          winner_team: match.winnerId ? 
            (match.team1.includes(match.winnerId) ? 1 : 2) : null,
        })
        .eq('id', match.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};

export const useDeleteRoundMatches = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ round, tournamentId }: { round: number; tournamentId?: string }) => {
      let query = supabase
        .from('matches')
        .delete()
        .eq('round', round);
      
      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId);
      }
      
      const { error } = await query;
      if (error) throw error;
      
      // Also clear local storage
      const savedMatches = localStorage.getItem('tournament-matches');
      if (savedMatches) {
        const matches = JSON.parse(savedMatches);
        const filteredMatches = matches.filter((match: Match) => 
          match.round !== round || (tournamentId && match.tournamentId !== tournamentId)
        );
        localStorage.setItem('tournament-matches', JSON.stringify(filteredMatches));
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};
