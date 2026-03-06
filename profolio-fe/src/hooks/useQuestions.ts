import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../services/portfolioApi';
import type { SuggestedQuestion } from '../types/portfolio';
import toast from 'react-hot-toast';

export const QUESTIONS_KEY = ['questions'] as const;

export function useQuestions() {
    return useQuery({
        queryKey: QUESTIONS_KEY,
        queryFn: portfolioApi.getQuestions,
    });
}

export function useAddQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: Omit<SuggestedQuestion, 'id'>) => portfolioApi.addQuestion(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY });
            toast.success('Question added');
        },
        onError: () => {
            toast.error('Failed to add question');
        },
    });
}

export function useUpdateQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...dto }: Partial<SuggestedQuestion> & { id: string }) =>
            portfolioApi.updateQuestion(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY });
            toast.success('Question updated');
        },
        onError: () => {
            toast.error('Failed to update question');
        },
    });
}

export function useDeleteQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => portfolioApi.deleteQuestion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY });
            toast.success('Question deleted');
        },
        onError: () => {
            toast.error('Failed to delete question');
        },
    });
}
