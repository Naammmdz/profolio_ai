import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../services/portfolioApi';
import type { Project } from '../types/portfolio';
import toast from 'react-hot-toast';

const PROJECTS_KEY = ['projects'];

export const useProjects = () => {
    return useQuery({
        queryKey: PROJECTS_KEY,
        queryFn: portfolioApi.getProjects,
    });
};

export const useAddProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newProject: Omit<Project, 'id'>) => portfolioApi.addProject(newProject),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
            toast.success('Project added successfully');
        },
        onError: () => {
            toast.error('Failed to add project');
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
            portfolioApi.updateProject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
            toast.success('Project updated successfully');
        },
        onError: () => {
            toast.error('Failed to update project');
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => portfolioApi.deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
            toast.success('Project deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete project');
        },
    });
};
