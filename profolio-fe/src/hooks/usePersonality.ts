import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../services/portfolioApi';
import type { AIPersonality } from '../types/portfolio';
import toast from 'react-hot-toast';

export const PERSONALITY_KEY = ['personality'] as const;

export function usePersonality() {
    return useQuery({
        queryKey: PERSONALITY_KEY,
        queryFn: portfolioApi.getPersonality,
    });
}

export function useUpdatePersonality() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: Partial<AIPersonality>) => portfolioApi.updatePersonality(dto),
        onSuccess: (data) => {
            queryClient.setQueryData(PERSONALITY_KEY, data);
            toast.success('AI Personality updated successfully');
        },
        onError: () => {
            toast.error('Failed to update personality');
        },
    });
}
