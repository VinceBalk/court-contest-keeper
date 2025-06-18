
import { Player } from '@/pages/Index';

// Mock hook that matches the Supabase hook interface but uses local state
export const usePlayers = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreatePlayer = () => {
  return {
    mutate: async (player: Omit<Player, 'id' | 'overallStats'>) => {
      console.log('Creating player:', player);
    },
    isLoading: false
  };
};

export const useUpdatePlayer = () => {
  return {
    mutate: async (player: Player) => {
      console.log('Updating player:', player);
    },
    isLoading: false
  };
};

export const useDeletePlayer = () => {
  return {
    mutate: async (playerId: string) => {
      console.log('Deleting player:', playerId);
    },
    isLoading: false
  };
};
