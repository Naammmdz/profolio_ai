import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../services/portfolioApi';
import type { SkillCategory } from '../types/portfolio';
import toast from 'react-hot-toast';

const SKILLS_KEY = ['skills'];

export const useSkillCategories = () => {
    return useQuery({
        queryKey: SKILLS_KEY,
        queryFn: portfolioApi.getSkillCategories,
    });
};

export const useAddSkillCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newCategory: Omit<SkillCategory, 'id'>) => portfolioApi.addSkillCategory(newCategory),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SKILLS_KEY });
            toast.success('Skill category added successfully');
        },
        onError: () => {
            toast.error('Failed to add skill category');
        },
    });
};

export const useUpdateSkillCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<SkillCategory> }) =>
            portfolioApi.updateSkillCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SKILLS_KEY });
            toast.success('Skill category updated successfully');
        },
        onError: () => {
            toast.error('Failed to update skill category');
        },
    });
};

export const useDeleteSkillCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => portfolioApi.deleteSkillCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SKILLS_KEY });
            toast.success('Skill category deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete skill category');
        },
    });
};
