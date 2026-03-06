import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../services/portfolioApi';
import type { Portfolio } from '../types/portfolio';
import toast from 'react-hot-toast';

export const PORTFOLIO_KEY = ['portfolio'] as const;

export function usePortfolio() {
    return useQuery({
        queryKey: PORTFOLIO_KEY,
        queryFn: portfolioApi.getPortfolio,
    });
}

export function useUpdatePortfolio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: Partial<Portfolio>) => portfolioApi.updatePortfolio(dto),
        onSuccess: (data) => {
            queryClient.setQueryData(PORTFOLIO_KEY, data);
            toast.success('Portfolio updated successfully');
        },
        onError: () => {
            toast.error('Failed to update portfolio');
        },
    });
}
