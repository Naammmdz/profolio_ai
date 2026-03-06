import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../services/portfolioApi';
import type { ToolboxConfig } from '../types/portfolio';
import toast from 'react-hot-toast';

const TOOLBOX_CONFIG_KEY = ['toolboxConfig'];

export const useToolboxConfig = () => {
    return useQuery({
        queryKey: TOOLBOX_CONFIG_KEY,
        queryFn: portfolioApi.getToolboxConfig,
    });
};

export const useUpdateToolboxConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<ToolboxConfig>) => portfolioApi.updateToolboxConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TOOLBOX_CONFIG_KEY });
            toast.success('Configuration saved.');
        },
        onError: () => {
            toast.error('Failed to save configuration');
        },
    });
};

export const useUploadFile = () => {
    return useMutation({
        mutationFn: (file: File) => portfolioApi.uploadFile(file),
        onSuccess: () => {
            toast.success('File uploaded successfully');
        },
        onError: () => {
            toast.error('Failed to upload file');
        }
    })
}
