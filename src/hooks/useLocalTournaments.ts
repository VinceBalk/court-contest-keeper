
import { Tournament } from '@/pages/Index';

// Mock hook that matches the Supabase hook interface but uses local state
export const useTournaments = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreateTournament = () => {
  return {
    mutate: async (tournament: Omit<Tournament, 'id'>) => {
      console.log('Creating tournament:', tournament);
    },
    isLoading: false
  };
};

export const useUpdateTournament = () => {
  return {
    mutate: async (tournament: Tournament) => {
      console.log('Updating tournament:', tournament);
    },
    isLoading: false
  };
};
