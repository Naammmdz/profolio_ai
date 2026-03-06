export interface Portfolio {
    id: string;
    slug: string;
    status: 'DRAFT' | 'PUBLISHED';
    theme: string;
    avatarUrl: string | null;
    avatarShape: string;
    cursorAnimation: string;
    headline: string | null;
    tagline: string | null;
    chatPlaceholder: string;
    showModal: boolean;
    modalTitle: string | null;
    modalContent: string | null;
}

export interface AIPersonality {
    id: string;
    professionalBio: string | null;
    skills: string | null;
    biggestFlex: string | null;
    personalDrives: string | null;
    interests: string | null;
    uniqueness: string | null;
    communicationStyle: string | null;
    topicsLoveDiscussing: string | null;
    generalContext: string | null;
    temperature: number;
}

export interface SuggestedQuestion {
    id: string;
    question: string;
    category: string | null;
    isDefault: boolean;
}

export interface Project {
    id?: string;
    title: string;
    category: string | null;
    description: string | null;
    date: string | null;
    tags: string[];
    links: string[];
    displayOrder?: number;
}

export interface SkillCategory {
    id?: string;
    title: string;
    skills: string[];
    displayOrder?: number;
}

export interface MeInfo {
    name?: string;
    age?: string;
    location?: string;
    introduction?: string;
    tags?: string[];
    photoUrl?: string;
}

export interface HobbiesInfo {
    title?: string;
    description?: string;
    photos?: string[];
}

export interface ContactInfo {
    name?: string;
    email?: string;
    phone?: string;
    handle?: string;
    address?: string;
    socialPlatforms?: string[];
    socialUrls?: string[];
}

export interface ResumeInfo {
    title?: string;
    description?: string;
    fileUrl?: string;
    fileName?: string;
}

export interface VideoInfo {
    title?: string;
    url?: string;
    description?: string;
}

export interface LocationInfo {
    city?: string;
    country?: string;
}

export interface ToolboxConfig {
    meInfo?: MeInfo;
    hobbiesInfo?: HobbiesInfo;
    contactInfo?: ContactInfo;
    resumeInfo?: ResumeInfo;
    videoInfo?: VideoInfo;
    locationInfo?: LocationInfo;
}
