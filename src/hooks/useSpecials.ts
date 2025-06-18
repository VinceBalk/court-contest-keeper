
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SpecialType } from '@/components/SpecialManagement';

export const useSpecials = () => {
  return useQuery({
    queryKey: ['specials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specials')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data.map(special => ({
        id: special.id,
        name: special.name,
        description: special.description || '',
        isActive: special.is_active || false,
      })) as SpecialType[];
    },
  });
};

export const useCreateSpecial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (special: Omit<SpecialType, 'id'>) => {
      const { data, error } = await supabase
        .from('specials')
        .insert({
          name: special.name,
          description: special.description,
          type: 'golden_point', // Default type
          is_active: special.isActive,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specials'] });
    },
  });
};

export const useUpdateSpecial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (special: SpecialType) => {
      const { data, error } = await supabase
        .from('specials')
        .update({
          name: special.name,
          description: special.description,
          is_active: special.isActive,
        })
        .eq('id', special.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specials'] });
    },
  });
};
