# Entity Models - TypeScript Interfaces

This document defines TypeScript interfaces for all entities matching the database schema.

## Core Entities

### User
```typescript
interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatarUrl?: string;
  provider: 'google' | 'github' | 'email';
  providerId?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Portfolio
```typescript
interface Portfolio {
  id: string;
  userId: string;
  slug: string;
  status: 'draft' | 'published';
  headline?: string;
  welcomeTagline?: string;
  chatPlaceholder: string;
  customDomain?: string;
  showProfolioBadge: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### PortfolioSettings
```typescript
interface PortfolioSettings {
  id: string;
  portfolioId: string;
  theme: 'default' | 'dark' | 'playful';
  cursorAnimation: 'fluid' | 'solid' | 'none';
  avatarShape: 'squared' | 'rounded';
  avatarEnabled: boolean;
  welcomeModalEnabled: boolean;
  welcomeModalTitle: string;
  welcomeModalContent?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AIPersonality
```typescript
interface AIPersonality {
  id: string;
  portfolioId: string;
  communicationVibe: number; // 0-100
  professionalWhatYouDo?: string;
  professionalSuperpowerSkills?: string;
  professionalBiggestFlex?: string;
  personalWhatDrivesYou?: string;
  personalOutsideWork?: string;
  personalUniqueThing?: string;
  communicationStyle?: string;
  communicationTopics?: string;
  personalTouch?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Content Entities

### Project
```typescript
interface Project {
  id: string;
  portfolioId: string;
  title: string;
  category?: string;
  description?: string;
  projectDate?: string;
  previewImageUrl?: string;
  displayOrder: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: ProjectTag[];
  links?: ProjectLink[];
  images?: ProjectImage[];
}
```

### ProjectTag
```typescript
interface ProjectTag {
  id: string;
  projectId: string;
  tagName: string;
  createdAt: Date;
}
```

### ProjectLink
```typescript
interface ProjectLink {
  id: string;
  projectId: string;
  linkName: string;
  url: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### ProjectImage
```typescript
interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  imageOrder: number;
  createdAt: Date;
}
```

### SkillCategory
```typescript
interface SkillCategory {
  id: string;
  portfolioId: string;
  title: string;
  enabled: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  skills?: Skill[];
}
```

### Skill
```typescript
interface Skill {
  id: string;
  skillCategoryId: string;
  skillName: string;
  displayOrder: number;
  createdAt: Date;
}
```

### SuggestedQuestion
```typescript
interface SuggestedQuestion {
  id: string;
  portfolioId: string;
  question: string;
  category: string;
  isDefault: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Tools Entities

### ToolConfig
```typescript
interface ToolConfig {
  id: string;
  portfolioId: string;
  toolName: 'personal' | 'projects' | 'skills' | 'hobbies' | 'contact' | 'resume' | 'video' | 'location';
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### PersonalInfo
```typescript
interface PersonalInfo {
  id: string;
  portfolioId: string;
  name: string;
  age?: number;
  location?: string;
  introduction?: string;
  presentationPhotoUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ContactInfo
```typescript
interface ContactInfo {
  id: string;
  portfolioId: string;
  name?: string;
  email?: string;
  phone?: string;
  handleUsername?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  socialLinks?: SocialLink[];
}
```

### SocialLink
```typescript
interface SocialLink {
  id: string;
  contactInfoId: string;
  platformName: string;
  url: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Resume
```typescript
interface Resume {
  id: string;
  portfolioId: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  fileType: string;
  title?: string;
  description?: string;
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Video
```typescript
interface Video {
  id: string;
  portfolioId: string;
  title: string;
  videoUrl: string;
  description?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Location
```typescript
interface Location {
  id: string;
  portfolioId: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Hobby
```typescript
interface Hobby {
  id: string;
  portfolioId: string;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: HobbyImage[];
}
```

### HobbyImage
```typescript
interface HobbyImage {
  id: string;
  hobbyId: string;
  imageUrl: string;
  imageOrder: number;
  createdAt: Date;
}
```

## Analytics & Interaction

### Message
```typescript
interface Message {
  id: string;
  portfolioId: string;
  visitorIp?: string;
  visitorLocation?: string;
  question: string;
  response?: string;
  createdAt: Date;
}
```

### Analytics
```typescript
interface Analytics {
  id: string;
  portfolioId: string;
  eventType: string;
  eventData?: Record<string, any>;
  visitorIp?: string;
  visitorLocation?: string;
  userAgent?: string;
  createdAt: Date;
}
```

### Subscription
```typescript
interface Subscription {
  id: string;
  userId: string;
  planType: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  monthlyMessageLimit: number;
  messagesUsed: number;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Request/Response DTOs

### CreateProjectRequest
```typescript
interface CreateProjectRequest {
  title: string;
  category?: string;
  description?: string;
  projectDate?: string;
  previewImageUrl?: string;
  tags?: string[];
  links?: { name: string; url: string }[];
  images?: string[];
}
```

### UpdateAIPersonalityRequest
```typescript
interface UpdateAIPersonalityRequest {
  communicationVibe?: number;
  professionalWhatYouDo?: string;
  professionalSuperpowerSkills?: string;
  professionalBiggestFlex?: string;
  personalWhatDrivesYou?: string;
  personalOutsideWork?: string;
  personalUniqueThing?: string;
  communicationStyle?: string;
  communicationTopics?: string;
  personalTouch?: string;
}
```

### CreateSkillCategoryRequest
```typescript
interface CreateSkillCategoryRequest {
  title: string;
  skills: string[];
  enabled?: boolean;
}
```

### CreateQuestionRequest
```typescript
interface CreateQuestionRequest {
  question: string;
  category: string;
}
```

### PortfolioResponse (with relations)
```typescript
interface PortfolioResponse extends Portfolio {
  settings?: PortfolioSettings;
  aiPersonality?: AIPersonality;
  projects?: Project[];
  skillCategories?: SkillCategory[];
  questions?: SuggestedQuestion[];
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  resume?: Resume;
  video?: Video;
  location?: Location;
  hobby?: Hobby;
}
```

