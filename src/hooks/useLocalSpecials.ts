
import { SpecialType } from '@/components/SpecialManagement';

// Mock hook that matches the Supabase hook interface but uses local state
export const useSpecials = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreateSpecial = () => {
  return {
    mutate: async (special: Omit<SpecialType, 'id'>) => {
      console.log('Creating special:', special);
    },
    isLoading: false
  };
};

export const useUpdateSpecial = () => {
  return {
    mutate: async (special: SpecialType) => {
      console.log('Updating special:', special);
    },
    isLoading: false
  };
};
