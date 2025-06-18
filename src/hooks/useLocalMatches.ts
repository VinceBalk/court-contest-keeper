
import { Match } from '@/pages/Index';

// Mock hook that matches the Supabase hook interface but uses local state
export const useMatches = (tournamentId?: string) => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreateMatch = () => {
  return {
    mutate: async (match: Omit<Match, 'id'> & { tournamentId: string }) => {
      console.log('Creating match:', match);
    },
    isLoading: false
  };
};

export const useUpdateMatch = () => {
  return {
    mutate: async (match: Match & { tournamentId: string }) => {
      console.log('Updating match:', match);
    },
    isLoading: false
  };
};
