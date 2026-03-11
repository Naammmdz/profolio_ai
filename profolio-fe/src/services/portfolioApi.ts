import apiClient from '../config/api';
import type { Portfolio, AIPersonality, SuggestedQuestion, Project, SkillCategory, ToolboxConfig } from '../types/portfolio';

export const portfolioApi = {
    getPortfolio: async (): Promise<Portfolio> => {
        const { data } = await apiClient.get('/v1/portfolio');
        return data;
    },

    updatePortfolio: async (dto: Partial<Portfolio>): Promise<Portfolio> => {
        const { data } = await apiClient.put('/v1/portfolio', dto);
        return data;
    },

    getPersonality: async (): Promise<AIPersonality> => {
        const { data } = await apiClient.get('/v1/personality');
        return data;
    },

    updatePersonality: async (dto: Partial<AIPersonality>): Promise<AIPersonality> => {
        const { data } = await apiClient.put('/v1/personality', dto);
        return data;
    },

    getQuestions: async (): Promise<SuggestedQuestion[]> => {
        const { data } = await apiClient.get('/v1/questions');
        return data;
    },

    addQuestion: async (dto: Omit<SuggestedQuestion, 'id'>): Promise<SuggestedQuestion> => {
        const { data } = await apiClient.post('/v1/questions', dto);
        return data;
    },

    updateQuestion: async (id: string, dto: Partial<SuggestedQuestion>): Promise<SuggestedQuestion> => {
        const { data } = await apiClient.put(`/v1/questions/${id}`, dto);
        return data;
    },

    deleteQuestion: async (id: string): Promise<void> => {
        await apiClient.delete(`/v1/questions/${id}`);
    },

    // Projects
    getProjects: async (): Promise<Project[]> => {
        const { data } = await apiClient.get('/v1/projects');
        return data;
    },

    addProject: async (dto: Omit<Project, 'id'>): Promise<Project> => {
        const { data } = await apiClient.post('/v1/projects', dto);
        return data;
    },

    updateProject: async (id: string, dto: Partial<Project>): Promise<Project> => {
        const { data } = await apiClient.put(`/v1/projects/${id}`, dto);
        return data;
    },

    deleteProject: async (id: string): Promise<void> => {
        await apiClient.delete(`/v1/projects/${id}`);
    },

    // Skills
    getSkillCategories: async (): Promise<SkillCategory[]> => {
        const { data } = await apiClient.get('/v1/skills');
        return data;
    },

    addSkillCategory: async (dto: Omit<SkillCategory, 'id'>): Promise<SkillCategory> => {
        const { data } = await apiClient.post('/v1/skills', dto);
        return data;
    },

    updateSkillCategory: async (id: string, dto: Partial<SkillCategory>): Promise<SkillCategory> => {
        const { data } = await apiClient.put(`/v1/skills/${id}`, dto);
        return data;
    },

    deleteSkillCategory: async (id: string): Promise<void> => {
        await apiClient.delete(`/v1/skills/${id}`);
    },

    // Toolbox Config
    getToolboxConfig: async (): Promise<ToolboxConfig> => {
        const { data } = await apiClient.get('/v1/tools/config');
        return data;
    },

    updateToolboxConfig: async (dto: Partial<ToolboxConfig>): Promise<ToolboxConfig> => {
        const { data } = await apiClient.put('/v1/tools/config', dto);
        return data;
    },

    // File Upload
    uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await apiClient.post('/v1/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60_000, // file upload to MinIO can be slow — override default 10s
        });
        return data;
    },
};
